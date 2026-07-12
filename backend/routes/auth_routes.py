from flask import Blueprint, request, jsonify, current_app
from extensions import db, bcrypt, limiter
from models import User, FarmerProfile, RefreshToken, AuthOtp
from flask_jwt_extended import create_access_token, jwt_required
from auth_helpers import current_user
import datetime
import hashlib
import secrets
import re
import random

auth_bp = Blueprint('auth', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
PHONE_RE = re.compile(r'^\+?[\d\s-]{8,15}$')


def _hash_otp(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


def _normalize_phone(phone: str) -> str:
    return re.sub(r'[\s-]', '', (phone or '').strip())


def _consume_otp(otp_id, code, purpose, channel, destination):
    """Validate OTP and mark verified. Returns (ok, error_msg)."""
    if not otp_id or not code:
        return False, 'OTP verification required'
    row = AuthOtp.query.get(int(otp_id))
    if not row or row.purpose != purpose:
        return False, 'Invalid or expired OTP'
    if row.verified:
        # Allow reuse within expiry after successful verify (register race)
        if row.expires_at < datetime.datetime.utcnow():
            return False, 'OTP expired — request a new one'
        dest_ok = (
            (channel == 'email' and row.destination == destination.lower())
            or (channel == 'phone' and row.destination == _normalize_phone(destination))
        )
        if not dest_ok or row.channel != channel:
            return False, 'OTP does not match this email/phone'
        return True, None
    if row.expires_at < datetime.datetime.utcnow():
        return False, 'OTP expired — request a new one'
    if row.attempts >= 5:
        return False, 'Too many attempts — request a new OTP'
    dest_ok = (
        (channel == 'email' and row.destination == destination.lower())
        or (channel == 'phone' and row.destination == _normalize_phone(destination))
    )
    if not dest_ok or row.channel != channel:
        return False, 'OTP does not match this email/phone'
    row.attempts += 1
    if row.code_hash != _hash_otp(str(code).strip()):
        db.session.commit()
        return False, 'Incorrect OTP'
    row.verified = True
    db.session.commit()
    return True, None


def _token_for(user):
    return create_access_token(
        identity=str(user.id),
        expires_delta=datetime.timedelta(days=1),
        additional_claims={"role": user.role}
    )


def _issue_refresh_token(user):
    raw = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    row = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30),
    )
    db.session.add(row)
    db.session.commit()
    return raw


def _auth_response(user, linked=False):
    payload = {
        "access_token": _token_for(user),
        "refresh_token": _issue_refresh_token(user),
        "user": _user_payload(user),
    }
    if linked:
        payload["linked"] = True
        payload["msg"] = "Google account linked to your existing FruitBasket account."
    return jsonify(payload), 200


def _user_payload(user):
    payload = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "profile_photo": user.profile_photo,
        "has_password": bool(user.password_hash),
        "google_linked": bool(user.google_id),
    }
    if user.role == 'farmer' and user.farmer_profile:
        payload["farmer_status"] = user.farmer_profile.status
        payload["farm_name"] = user.farmer_profile.farm_name
        payload["farmer_id"] = user.farmer_profile.id
        payload["rejection_reason"] = user.farmer_profile.rejection_reason
        payload["is_new_seller"] = user.farmer_profile.is_new_seller
    return payload


@auth_bp.route('/register', methods=['POST'])
@limiter.limit("10 per minute")
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    phone = _normalize_phone(data.get('phone') or '')
    otp_id = data.get('otp_id')
    otp_code = data.get('otp_code') or ''
    otp_channel = (data.get('otp_channel') or 'email').strip().lower()

    if not name or not email or not password:
        return jsonify({"msg": "Name, email, and password are required"}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"msg": "Invalid email address"}), 400
    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    dest = email if otp_channel == 'email' else phone
    if otp_channel == 'phone' and not phone:
        return jsonify({"msg": "Phone is required when verifying by SMS OTP"}), 400
    ok, err = _consume_otp(otp_id, otp_code, 'register', otp_channel, dest)
    if not ok:
        return jsonify({"msg": err}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password,
        phone=phone or None,
        role='customer'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Registered successfully"}), 201


@auth_bp.route('/register-farmer', methods=['POST'])
@limiter.limit("5 per minute")
def register_farmer():
    """Public Sell on FruitBasket application. Creates pending farmer account."""
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    phone = _normalize_phone(data.get('phone') or '')
    farm_name = (data.get('farm_name') or '').strip()
    location = (data.get('location') or '').strip()
    description = (data.get('description') or '').strip()
    otp_id = data.get('otp_id')
    otp_code = data.get('otp_code') or ''
    otp_channel = (data.get('otp_channel') or 'email').strip().lower()

    if not all([name, email, password, farm_name, location]):
        return jsonify({"msg": "Name, email, password, farm name, and location are required"}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"msg": "Invalid email address"}), 400
    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "An account with this email already exists"}), 400

    dest = email if otp_channel == 'email' else phone
    if otp_channel == 'phone' and not phone:
        return jsonify({"msg": "Phone is required when verifying by SMS OTP"}), 400
    ok, err = _consume_otp(otp_id, otp_code, 'register', otp_channel, dest)
    if not ok:
        return jsonify({"msg": err}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        name=name,
        email=email,
        password_hash=hashed_password,
        phone=phone or None,
        role='farmer'
    )
    db.session.add(user)
    db.session.flush()

    profile = FarmerProfile(
        user_id=user.id,
        farm_name=farm_name,
        location=location,
        description=description,
        status='pending',
        is_new_seller=True,
    )
    db.session.add(profile)
    db.session.commit()

    return jsonify({
        "msg": "Application submitted. We'll review it within a few business days.",
        "status": "pending"
    }), 201


@auth_bp.route('/otp/send', methods=['POST'])
@limiter.limit("8 per minute")
def otp_send():
    """Send a 6-digit OTP to email or phone for registration."""
    data = request.get_json() or {}
    channel = (data.get('channel') or 'email').strip().lower()
    purpose = (data.get('purpose') or 'register').strip().lower()
    if purpose not in ('register', 'login'):
        purpose = 'register'

    if channel == 'email':
        destination = (data.get('email') or data.get('destination') or '').strip().lower()
        if not EMAIL_RE.match(destination):
            return jsonify({"msg": "Valid email required"}), 400
        if purpose == 'register' and User.query.filter_by(email=destination).first():
            return jsonify({"msg": "An account with this email already exists"}), 400
    elif channel == 'phone':
        destination = _normalize_phone(data.get('phone') or data.get('destination') or '')
        if not PHONE_RE.match(destination) or len(re.sub(r'\D', '', destination)) < 8:
            return jsonify({"msg": "Valid phone number required"}), 400
    else:
        return jsonify({"msg": "channel must be email or phone"}), 400

    code = f'{random.randint(0, 999999):06d}'
    row = AuthOtp(
        channel=channel,
        destination=destination,
        code_hash=_hash_otp(code),
        purpose=purpose,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
    )
    db.session.add(row)
    db.session.commit()

    # Delivery: log always; real SMTP/SMS can plug in later.
    current_app.logger.info('OTP %s → %s (%s): %s', purpose, channel, destination, code)
    print(f'[FruitBasket OTP] {channel} {destination}: {code}')

    payload = {
        'otp_id': row.id,
        'channel': channel,
        'destination_masked': (
            destination[:2] + '***' + destination[destination.index('@'):]
            if channel == 'email' and '@' in destination
            else destination[:3] + '****' + destination[-2:]
        ),
        'expires_in': 600,
        'msg': f'OTP sent to your {channel}.',
    }
    # Dev convenience — no SMS/SMTP gateway configured yet
    if current_app.debug:
        payload['dev_otp'] = code
        payload['msg'] = f'OTP ready (dev mode). Code shown below — also logged on server.'
    return jsonify(payload), 200


@auth_bp.route('/otp/verify', methods=['POST'])
@limiter.limit("20 per minute")
def otp_verify():
    data = request.get_json() or {}
    otp_id = data.get('otp_id')
    code = data.get('code') or data.get('otp_code') or ''
    channel = (data.get('channel') or 'email').strip().lower()
    destination = (data.get('destination') or data.get('email') or data.get('phone') or '')
    if channel == 'phone':
        destination = _normalize_phone(destination)
    else:
        destination = destination.strip().lower()
    purpose = (data.get('purpose') or 'register').strip().lower()

    ok, err = _consume_otp(otp_id, code, purpose, channel, destination)
    if not ok:
        return jsonify({"msg": err, "verified": False}), 400
    return jsonify({"verified": True, "otp_id": int(otp_id), "msg": "Verified"}), 200


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("15 per minute")
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash:
        return jsonify({"msg": "Invalid email or password"}), 401
    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401

    return _auth_response(user)


@auth_bp.route('/google', methods=['POST'])
@limiter.limit("20 per minute")
def google_auth():
    """
    Verify Google ID token, then login or register.
    Email collision: if email matches an existing password account and Google
    email is verified, auto-link google_id (no duplicate account).
    """
    client_id = current_app.config.get('GOOGLE_CLIENT_ID') or ''
    if not client_id:
        return jsonify({
            "msg": "Google Sign-In is not configured. Set GOOGLE_CLIENT_ID on the server."
        }), 503

    data = request.get_json() or {}
    credential = data.get('credential') or data.get('id_token') or ''
    if not credential:
        return jsonify({"msg": "Missing Google credential"}), 400

    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            client_id,
        )
    except Exception:
        return jsonify({"msg": "Invalid Google token"}), 401

    google_sub = idinfo.get('sub')
    email = (idinfo.get('email') or '').strip().lower()
    email_verified = idinfo.get('email_verified', False)
    name = (idinfo.get('name') or email.split('@')[0] or 'FruitBasket shopper').strip()
    picture = idinfo.get('picture')

    if not google_sub or not email:
        return jsonify({"msg": "Google account is missing email"}), 400
    if not email_verified:
        return jsonify({"msg": "Google email is not verified"}), 400

    # 1) Prefer stable google_id match
    user = User.query.filter_by(google_id=google_sub).first()
    linked = False

    if not user:
        # 2) Email match → auto-link (Google already verified the email)
        user = User.query.filter_by(email=email).first()
        if user:
            if user.google_id and user.google_id != google_sub:
                return jsonify({"msg": "This email is already linked to a different Google account"}), 409
            user.google_id = google_sub
            if picture and not user.profile_photo:
                user.profile_photo = picture
            db.session.commit()
            linked = True
        else:
            # 3) New customer
            user = User(
                name=name,
                email=email,
                password_hash=None,
                google_id=google_sub,
                profile_photo=picture,
                role='customer',
            )
            db.session.add(user)
            db.session.commit()

    return _auth_response(user, linked=linked)


@auth_bp.route('/google-config', methods=['GET'])
def google_config():
    """Frontend checks whether Google Sign-In is available."""
    client_id = current_app.config.get('GOOGLE_CLIENT_ID') or ''
    return jsonify({
        "enabled": bool(client_id),
        "client_id": client_id or None,
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(_user_payload(user)), 200


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = (data.get('phone') or '').strip()
    if 'profile_photo' in data:
        user.profile_photo = data.get('profile_photo') or None

    db.session.commit()
    return jsonify(_user_payload(user)), 200

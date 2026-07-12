from flask import Blueprint, request, jsonify
from extensions import db
from models import Address
from flask_jwt_extended import jwt_required
from auth_helpers import current_user

address_bp = Blueprint('addresses', __name__)


def _serialize(a):
    return {
        "id": a.id,
        "address_type": a.address_type,
        "details": a.details,
        "pincode": a.pincode,
        "city": a.city,
        "state": a.state,
        "is_default": a.is_default,
    }


@address_bp.route('', methods=['GET'])
@jwt_required()
def list_addresses():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    addresses = Address.query.filter_by(user_id=user.id).order_by(Address.is_default.desc(), Address.id.desc()).all()
    return jsonify([_serialize(a) for a in addresses]), 200


@address_bp.route('', methods=['POST'])
@jwt_required()
def create_address():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json() or {}
    details = (data.get('details') or '').strip()
    pincode = (data.get('pincode') or '').strip()
    city = (data.get('city') or '').strip()
    state = (data.get('state') or '').strip()
    address_type = (data.get('address_type') or 'home').strip()
    is_default = bool(data.get('is_default', False))

    if not all([details, pincode, city, state]):
        return jsonify({"msg": "details, pincode, city, and state are required"}), 400

    if is_default:
        Address.query.filter_by(user_id=user.id, is_default=True).update({"is_default": False})

    # First address becomes default
    existing_count = Address.query.filter_by(user_id=user.id).count()
    if existing_count == 0:
        is_default = True

    addr = Address(
        user_id=user.id,
        address_type=address_type,
        details=details,
        pincode=pincode,
        city=city,
        state=state,
        is_default=is_default,
    )
    db.session.add(addr)
    db.session.commit()
    return jsonify(_serialize(addr)), 201


@address_bp.route('/<int:address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    addr = Address.query.filter_by(id=address_id, user_id=user.id).first()
    if not addr:
        return jsonify({"msg": "Address not found"}), 404

    data = request.get_json() or {}
    for field in ('details', 'pincode', 'city', 'state', 'address_type'):
        if field in data and str(data[field]).strip():
            setattr(addr, field, str(data[field]).strip())

    if data.get('is_default'):
        Address.query.filter_by(user_id=user.id, is_default=True).update({"is_default": False})
        addr.is_default = True

    db.session.commit()
    return jsonify(_serialize(addr)), 200


@address_bp.route('/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    addr = Address.query.filter_by(id=address_id, user_id=user.id).first()
    if not addr:
        return jsonify({"msg": "Address not found"}), 404

    was_default = addr.is_default
    db.session.delete(addr)
    db.session.commit()

    if was_default:
        next_addr = Address.query.filter_by(user_id=user.id).first()
        if next_addr:
            next_addr.is_default = True
            db.session.commit()

    return jsonify({"msg": "Address deleted"}), 200

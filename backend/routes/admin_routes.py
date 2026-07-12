from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from extensions import db
from models import FarmerProfile, Order, Product, User, SellerFlag, Review, ReturnRequest
from flask_jwt_extended import jwt_required
from auth_helpers import admin_required, serialize_farmer, serialize_order

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/farmers', methods=['GET'])
@jwt_required()
@admin_required
def list_farmer_applications():
    status = request.args.get('status')  # pending | approved | rejected | all
    query = FarmerProfile.query
    if status and status != 'all':
        query = query.filter_by(status=status)
    farmers = query.order_by(FarmerProfile.created_at.desc()).all()
    return jsonify([serialize_farmer(f, include_private=True) for f in farmers]), 200


@admin_bp.route('/farmers/<int:farmer_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_farmer(farmer_id):
    profile = FarmerProfile.query.get(farmer_id)
    if not profile:
        return jsonify({"msg": "Farmer application not found"}), 404

    profile.status = 'approved'
    profile.rejection_reason = None
    profile.reviewed_at = datetime.utcnow()
    # Activate drafted products when farm goes live
    Product.query.filter_by(farmer_id=profile.id).update({'is_active': True})
    db.session.commit()

    return jsonify({
        "msg": f"{profile.farm_name} has been approved",
        "farmer": serialize_farmer(profile, include_private=True),
    }), 200


@admin_bp.route('/farmers/<int:farmer_id>/reject', methods=['POST'])
@jwt_required()
@admin_required
def reject_farmer(farmer_id):
    profile = FarmerProfile.query.get(farmer_id)
    if not profile:
        return jsonify({"msg": "Farmer application not found"}), 404

    data = request.get_json() or {}
    reason = (data.get('reason') or '').strip()
    if not reason:
        return jsonify({"msg": "A rejection reason is required"}), 400

    profile.status = 'rejected'
    profile.rejection_reason = reason
    profile.reviewed_at = datetime.utcnow()
    Product.query.filter_by(farmer_id=profile.id).update({'is_active': False})
    db.session.commit()

    return jsonify({
        "msg": f"{profile.farm_name} has been rejected",
        "farmer": serialize_farmer(profile, include_private=True),
        "notification": "in_app",
    }), 200


@admin_bp.route('/farmers/<int:farmer_id>/clear-new-seller', methods=['POST'])
@jwt_required()
@admin_required
def clear_new_seller(farmer_id):
    profile = FarmerProfile.query.get(farmer_id)
    if not profile:
        return jsonify({"msg": "Farmer not found"}), 404
    profile.is_new_seller = False
    db.session.commit()
    return jsonify({"msg": "New Seller badge cleared", "farmer": serialize_farmer(profile, include_private=True)}), 200


@admin_bp.route('/flags', methods=['GET'])
@jwt_required()
@admin_required
def list_flags():
    status = request.args.get('status', 'open')
    q = SellerFlag.query
    if status and status != 'all':
        q = q.filter_by(status=status)
    rows = q.order_by(SellerFlag.created_at.desc()).all()
    out = []
    for fl in rows:
        out.append({
            'id': fl.id,
            'farmer_id': fl.farmer_id,
            'farm_name': fl.farmer.farm_name if fl.farmer else None,
            'reason': fl.reason,
            'status': fl.status,
            'admin_notes': fl.admin_notes,
            'created_at': fl.created_at.isoformat() if fl.created_at else None,
            'resolved_at': fl.resolved_at.isoformat() if fl.resolved_at else None,
        })
    return jsonify(out), 200


@admin_bp.route('/flags', methods=['POST'])
@jwt_required()
@admin_required
def create_flag():
    data = request.get_json() or {}
    farmer_id = data.get('farmer_id')
    reason = (data.get('reason') or '').strip()
    if not farmer_id or not reason:
        return jsonify({"msg": "farmer_id and reason required"}), 400
    if not FarmerProfile.query.get(farmer_id):
        return jsonify({"msg": "Farmer not found"}), 404
    fl = SellerFlag(farmer_id=farmer_id, reason=reason, status='open')
    db.session.add(fl)
    db.session.commit()
    return jsonify({"msg": "Flag created", "id": fl.id}), 201


@admin_bp.route('/flags/<int:flag_id>/resolve', methods=['POST'])
@jwt_required()
@admin_required
def resolve_flag(flag_id):
    fl = SellerFlag.query.get(flag_id)
    if not fl:
        return jsonify({"msg": "Flag not found"}), 404
    data = request.get_json() or {}
    action = (data.get('action') or 'dismissed').strip()  # dismissed | suspended
    if action not in ('dismissed', 'suspended'):
        return jsonify({"msg": "action must be dismissed or suspended"}), 400
    fl.status = action
    fl.admin_notes = (data.get('notes') or '').strip() or fl.admin_notes
    fl.resolved_at = datetime.utcnow()
    if action == 'suspended' and fl.farmer:
        fl.farmer.status = 'rejected'
        fl.farmer.rejection_reason = fl.admin_notes or 'Suspended after trust & safety review'
        Product.query.filter_by(farmer_id=fl.farmer_id).update({'is_active': False})
    db.session.commit()
    return jsonify({"msg": f"Flag {action}", "id": fl.id}), 200


@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
@admin_required
def all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([serialize_order(o) for o in orders]), 200


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def platform_stats():
    revenue = db.session.query(func.coalesce(func.sum(Order.total_price), 0)).scalar() or 0
    return jsonify({
        "customers": User.query.filter_by(role='customer').count(),
        "farmers_pending": FarmerProfile.query.filter_by(status='pending').count(),
        "farmers_approved": FarmerProfile.query.filter_by(status='approved').count(),
        "products": Product.query.filter_by(is_active=True).count(),
        "orders": Order.query.count(),
        "revenue": round(float(revenue), 2),
        "open_flags": SellerFlag.query.filter_by(status='open').count(),
        "pending_reviews": Review.query.filter_by(status='pending').count(),
        "pending_returns": ReturnRequest.query.filter_by(status='requested').count(),
    }), 200

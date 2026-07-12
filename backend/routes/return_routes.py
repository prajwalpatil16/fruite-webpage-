"""Return requests — customer request, farmer/admin approve, stock restore."""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models import ReturnRequest, Order, OrderItem, FarmerOrder, Product
from auth_helpers import current_user, admin_required, farmer_required

return_bp = Blueprint('returns', __name__)


def _serialize_return(r):
    item = r.order_item
    return {
        'id': r.id,
        'order_id': r.order_id,
        'farmer_order_id': r.farmer_order_id,
        'order_item_id': r.order_item_id,
        'farmer_id': r.farmer_id,
        'quantity': r.quantity,
        'reason': r.reason,
        'status': r.status,
        'stock_restored': r.stock_restored,
        'admin_notes': r.admin_notes,
        'created_at': r.created_at.isoformat() if r.created_at else None,
        'resolved_at': r.resolved_at.isoformat() if r.resolved_at else None,
        'product_name': item.product.name if item and item.product else None,
        'farm_name': r.farmer.farm_name if r.farmer else None,
        'customer_name': r.order.user.name if r.order and r.order.user else None,
    }


def _approve_and_restore(ret, notes=None):
    if ret.status == 'approved' and ret.stock_restored:
        return True, 'Already approved'
    item = ret.order_item
    if not item:
        return False, 'Order item missing'
    product = Product.query.get(item.product_id)
    if product:
        product.stock_quantity = (product.stock_quantity or 0) + ret.quantity
    ret.status = 'approved'
    ret.stock_restored = True
    ret.resolved_at = datetime.utcnow()
    if notes:
        ret.admin_notes = notes
    return True, 'Return approved and stock restored'


@return_bp.route('', methods=['POST'])
@jwt_required()
def request_return():
    user = current_user()
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    data = request.get_json() or {}
    order_item_id = data.get('order_item_id')
    quantity = int(data.get('quantity') or 0)
    reason = (data.get('reason') or '').strip()
    if not order_item_id or quantity < 1 or not reason:
        return jsonify({'msg': 'order_item_id, quantity, and reason are required'}), 400

    item = OrderItem.query.get(order_item_id)
    if not item:
        return jsonify({'msg': 'Order item not found'}), 404
    order = Order.query.get(item.order_id)
    if not order or order.user_id != user.id:
        return jsonify({'msg': 'Not your order'}), 403

    fo = FarmerOrder.query.get(item.farmer_order_id)
    if not fo or fo.status not in ('delivered', 'out_for_delivery', 'packed', 'confirmed', 'placed'):
        # Allow returns after placed through delivered
        pass
    if fo and fo.status == 'cancelled':
        return jsonify({'msg': 'Cannot return a cancelled sub-order'}), 400

    existing_qty = sum(
        r.quantity for r in ReturnRequest.query.filter_by(
            order_item_id=item.id
        ).filter(ReturnRequest.status.in_(('requested', 'approved'))).all()
    )
    if existing_qty + quantity > item.quantity:
        return jsonify({'msg': 'Return quantity exceeds purchased amount'}), 400

    ret = ReturnRequest(
        order_id=order.id,
        farmer_order_id=item.farmer_order_id,
        order_item_id=item.id,
        user_id=user.id,
        farmer_id=item.farmer_id,
        quantity=quantity,
        reason=reason,
        status='requested',
    )
    db.session.add(ret)
    db.session.commit()
    return jsonify({'msg': 'Return requested', 'return': _serialize_return(ret)}), 201


@return_bp.route('/mine', methods=['GET'])
@jwt_required()
def my_returns():
    user = current_user()
    rows = ReturnRequest.query.filter_by(user_id=user.id).order_by(ReturnRequest.created_at.desc()).all()
    return jsonify([_serialize_return(r) for r in rows]), 200


@return_bp.route('/farmer', methods=['GET'])
@jwt_required()
@farmer_required
def farmer_returns(profile):
    rows = (
        ReturnRequest.query
        .filter_by(farmer_id=profile.id)
        .order_by(ReturnRequest.created_at.desc())
        .all()
    )
    return jsonify([_serialize_return(r) for r in rows]), 200


@return_bp.route('/<int:return_id>/approve', methods=['POST'])
@jwt_required()
def approve_return(return_id):
    user = current_user()
    ret = ReturnRequest.query.get(return_id)
    if not ret:
        return jsonify({'msg': 'Return not found'}), 404

    is_admin = user and user.role == 'admin'
    is_farmer = (
        user and user.role == 'farmer'
        and user.farmer_profile
        and user.farmer_profile.id == ret.farmer_id
    )
    if not is_admin and not is_farmer:
        return jsonify({'msg': 'Access denied'}), 403
    if ret.status != 'requested':
        return jsonify({'msg': f'Return is already {ret.status}'}), 400

    data = request.get_json() or {}
    ok, msg = _approve_and_restore(ret, notes=data.get('notes'))
    if not ok:
        return jsonify({'msg': msg}), 400
    db.session.commit()
    return jsonify({'msg': msg, 'return': _serialize_return(ret)}), 200


@return_bp.route('/<int:return_id>/reject', methods=['POST'])
@jwt_required()
def reject_return(return_id):
    user = current_user()
    ret = ReturnRequest.query.get(return_id)
    if not ret:
        return jsonify({'msg': 'Return not found'}), 404
    is_admin = user and user.role == 'admin'
    is_farmer = (
        user and user.role == 'farmer'
        and user.farmer_profile
        and user.farmer_profile.id == ret.farmer_id
    )
    if not is_admin and not is_farmer:
        return jsonify({'msg': 'Access denied'}), 403
    if ret.status != 'requested':
        return jsonify({'msg': f'Return is already {ret.status}'}), 400

    data = request.get_json() or {}
    ret.status = 'rejected'
    ret.admin_notes = (data.get('notes') or data.get('reason') or '').strip() or None
    ret.resolved_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'msg': 'Return rejected', 'return': _serialize_return(ret)}), 200


@return_bp.route('/admin', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_returns():
    status = request.args.get('status')
    q = ReturnRequest.query
    if status:
        q = q.filter_by(status=status)
    rows = q.order_by(ReturnRequest.created_at.desc()).all()
    return jsonify([_serialize_return(r) for r in rows]), 200

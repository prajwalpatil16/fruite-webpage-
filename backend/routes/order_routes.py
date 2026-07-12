from collections import defaultdict
from flask import Blueprint, request, jsonify
from extensions import db
from models import Cart, Product, Order, OrderItem, FarmerOrder, Address, FarmerProfile, User
from flask_jwt_extended import jwt_required
from auth_helpers import current_user, admin_required, serialize_order, serialize_product

order_bp = Blueprint('orders', __name__)


def _cart_item_payload(item, product):
    farmer = product.farmer
    return {
        "id": item.id,
        "product_id": item.product_id,
        "name": product.name,
        "price": product.price,
        "quantity": item.quantity,
        "image_url": product.image_url,
        "image": product.image_url,
        "unit": product.unit or 'Kg',
        "farmer_id": product.farmer_id,
        "farmer": farmer.farm_name if farmer else None,
        "farmer_name": farmer.farm_name if farmer else None,
    }


@order_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    cart_items = Cart.query.filter_by(user_id=user.id).all()
    result = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            result.append(_cart_item_payload(item, product))
    return jsonify(result), 200


@order_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    if not product_id or quantity < 1:
        return jsonify({"msg": "product_id and positive quantity required"}), 400

    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({"msg": "Product not available"}), 404
    if not product.farmer or product.farmer.status != 'approved':
        return jsonify({"msg": "Product not available"}), 404

    existing_item = Cart.query.filter_by(user_id=user.id, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        db.session.add(Cart(user_id=user.id, product_id=product_id, quantity=quantity))

    db.session.commit()
    return jsonify({"msg": "Added to cart"}), 201


@order_bp.route('/cart/merge', methods=['POST'])
@jwt_required()
def merge_cart():
    """Merge guest localStorage cart into the authenticated server cart."""
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json() or {}
    items = data.get('items') or []

    for entry in items:
        product_id = entry.get('product_id') or entry.get('id')
        quantity = int(entry.get('quantity', 1))
        if not product_id or quantity < 1:
            continue
        product = Product.query.get(product_id)
        if not product or not product.is_active:
            continue
        if not product.farmer or product.farmer.status != 'approved':
            continue

        existing = Cart.query.filter_by(user_id=user.id, product_id=product_id).first()
        if existing:
            existing.quantity += quantity
        else:
            db.session.add(Cart(user_id=user.id, product_id=product_id, quantity=quantity))

    db.session.commit()

    cart_items = Cart.query.filter_by(user_id=user.id).all()
    result = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            result.append(_cart_item_payload(item, product))
    return jsonify(result), 200


@order_bp.route('/cart/<int:item_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_cart(item_id):
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    cart_item = Cart.query.filter_by(id=item_id, user_id=user.id).first()
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404

    if request.method == 'DELETE':
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"msg": "Removed from cart"}), 200

    data = request.get_json() or {}
    qty = int(data.get('quantity', 1))
    if qty < 1:
        return jsonify({"msg": "Quantity must be at least 1"}), 400
    cart_item.quantity = qty
    db.session.commit()
    return jsonify({"msg": "Cart updated"}), 200


def _recompute_parent_status(order):
    statuses = [fo.status for fo in order.farmer_orders]
    if not statuses:
        order.status = 'placed'
    elif all(s == 'cancelled' for s in statuses):
        order.status = 'cancelled'
    elif all(s == 'delivered' for s in statuses):
        order.status = 'fulfilled'
    elif any(s in ('confirmed', 'packed', 'out_for_delivery', 'delivered') for s in statuses):
        order.status = 'partially_fulfilled'
    else:
        order.status = 'placed'


@order_bp.route('', methods=['POST'])
@jwt_required()
def place_order():
    """
    Split cart into per-farmer FarmerOrder sub-orders under one parent Order.
    Enforces address ownership.
    """
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json() or {}
    address_id = data.get('address_id')
    if not address_id:
        return jsonify({"msg": "address_id is required"}), 400

    address = Address.query.filter_by(id=address_id, user_id=user.id).first()
    if not address:
        return jsonify({"msg": "Address not found or does not belong to you"}), 403

    cart_items = Cart.query.filter_by(user_id=user.id).all()
    if not cart_items:
        return jsonify({"msg": "Cart is empty"}), 400

    by_farmer = defaultdict(list)
    subtotal = 0.0

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if not product or not product.is_active:
            return jsonify({"msg": f"Product unavailable"}), 400
        if not product.farmer or product.farmer.status != 'approved':
            return jsonify({"msg": f"{product.name} is no longer available from this farm"}), 400
        if product.stock_quantity < item.quantity:
            return jsonify({"msg": f"Insufficient stock for {product.name}"}), 400

        line_total = product.price * item.quantity
        subtotal += line_total
        by_farmer[product.farmer_id].append((item, product, line_total))

    delivery_fee = 0.0 if subtotal > 500 else 50.0
    total_price = subtotal + delivery_fee

    new_order = Order(
        user_id=user.id,
        total_price=total_price,
        delivery_fee=delivery_fee,
        address_id=address.id,
        payment_method=data.get('payment_method', 'cod'),
        payment_status='pending',
        status='placed',
    )
    db.session.add(new_order)
    db.session.flush()

    for farmer_id, lines in by_farmer.items():
        fo_subtotal = sum(lt for _, _, lt in lines)
        farmer_order = FarmerOrder(
            order_id=new_order.id,
            farmer_id=farmer_id,
            subtotal=fo_subtotal,
            status='placed',
        )
        db.session.add(farmer_order)
        db.session.flush()

        for item, product, _ in lines:
            db.session.add(OrderItem(
                order_id=new_order.id,
                farmer_order_id=farmer_order.id,
                farmer_id=farmer_id,
                product_id=product.id,
                quantity=item.quantity,
                price_at_purchase=product.price,
            ))
            product.stock_quantity -= item.quantity

    Cart.query.filter_by(user_id=user.id).delete()
    db.session.commit()

    return jsonify({
        "msg": "Order placed successfully",
        "order_id": new_order.id,
        "farmer_order_count": len(by_farmer),
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "total_price": total_price,
    }), 201


@order_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
    return jsonify([serialize_order(o) for o in orders]), 200


@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user = current_user()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    order = Order.query.filter_by(id=order_id, user_id=user.id).first()
    if not order:
        if user.role == 'admin':
            order = Order.query.get(order_id)
        if not order:
            return jsonify({"msg": "Order not found"}), 404

    return jsonify(serialize_order(order)), 200


@order_bp.route('/admin/all', methods=['GET'])
@jwt_required()
@admin_required
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([serialize_order(o) for o in orders]), 200

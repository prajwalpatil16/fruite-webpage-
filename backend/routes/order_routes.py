from flask import Blueprint, request, jsonify
from extensions import db
from models import Cart, Product, Order, OrderItem, Address, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

order_bp = Blueprint('orders', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({"msg": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function

# --- Cart Routes ---

@order_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    
    result = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "image_url": product.image_url
        })
    
    return jsonify(result), 200

@order_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    existing_item = Cart.query.filter_by(user_id=current_user_id, product_id=data['product_id']).first()
    if existing_item:
        existing_item.quantity += data.get('quantity', 1)
    else:
        new_item = Cart(
            user_id=current_user_id,
            product_id=data['product_id'],
            quantity=data.get('quantity', 1)
        )
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"msg": "Added to cart"}), 201

@order_bp.route('/cart/<int:item_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_cart(item_id):
    current_user_id = get_jwt_identity()
    cart_item = Cart.query.filter_by(id=item_id, user_id=current_user_id).first_or_404()
    
    if request.method == 'DELETE':
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"msg": "Removed from cart"}), 200
    
    data = request.get_json()
    cart_item.quantity = data['quantity']
    db.session.commit()
    return jsonify({"msg": "Cart updated"}), 200

# --- Order Routes ---

@order_bp.route('', methods=['POST'])
@jwt_required()
def place_order():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    if not cart_items:
        return jsonify({"msg": "Cart is empty"}), 400
    
    total_price = 0
    order_items = []
    
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product.stock_quantity < item.quantity:
            return jsonify({"msg": f"Insufficient stock for {product.name}"}), 400
        
        total_price += product.price * item.quantity
        order_items.append(OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=product.price
        ))
        # Update stock
        product.stock_quantity -= item.quantity

    new_order = Order(
        user_id=current_user_id,
        total_price=total_price,
        address_id=data['address_id'],
        payment_method=data.get('payment_method', 'cod')
    )
    new_order.items = order_items
    
    # Clear cart
    Cart.query.filter_by(user_id=current_user_id).delete()
    
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({"msg": "Order placed successfully", "order_id": new_order.id}), 201

@order_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify([{
        "id": o.id,
        "total_price": o.total_price,
        "status": o.status,
        "created_at": o.created_at.isoformat(),
        "item_count": len(o.items)
    } for o in orders]), 200

@order_bp.route('/admin/all', methods=['GET'])
@jwt_required()
@admin_required
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([{
        "id": o.id,
        "user_id": o.user_id,
        "total_price": o.total_price,
        "status": o.status,
        "created_at": o.created_at.isoformat()
    } for o in orders]), 200

from flask import Blueprint, request, jsonify
from extensions import db
from models import Product, Category, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

product_bp = Blueprint('products', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({"msg": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function

# --- Product Routes ---

@product_bp.route('', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id', type=int)
    search_query = request.args.get('q', '')
    
    query = Product.query.filter(Product.is_active == True)
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if search_query:
        query = query.filter(Product.name.ilike(f'%{search_query}%'))
    
    products = query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "category_id": p.category_id,
        "stock_quantity": p.stock_quantity,
        "image_url": p.image_url,
        "tags": p.tags
    } for p in products]), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category_id": product.category_id,
        "stock_quantity": product.stock_quantity,
        "image_url": product.image_url,
        "tags": product.tags
    }), 200

@product_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category_id=data['category_id'],
        stock_quantity=data.get('stock_quantity', 0),
        image_url=data.get('image_url', ''),
        tags=data.get('tags', '')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"msg": "Product created successfully", "id": new_product.id}), 201

# --- Category Routes ---

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description
    } for c in categories]), 200

@product_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    new_category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"msg": "Category created successfully", "id": new_category.id}), 201

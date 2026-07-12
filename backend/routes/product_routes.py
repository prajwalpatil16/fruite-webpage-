from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from extensions import db
from models import Product, Category, FarmerProfile
from flask_jwt_extended import jwt_required
from auth_helpers import admin_required, serialize_product

product_bp = Blueprint('products', __name__)


def _approved_farmer_products_query():
    """Marketplace only shows products from approved, active farms."""
    return (
        Product.query
        .join(FarmerProfile, Product.farmer_id == FarmerProfile.id)
        .filter(
            Product.is_active == True,
            FarmerProfile.status == 'approved'
        )
    )


def _apply_search(query, search_query):
    """Match product name, description, tags, or farm name."""
    if not search_query:
        return query
    like = f'%{search_query}%'
    return query.filter(
        or_(
            Product.name.ilike(like),
            Product.description.ilike(like),
            Product.tags.ilike(like),
            FarmerProfile.farm_name.ilike(like),
            FarmerProfile.location.ilike(like),
        )
    )


@product_bp.route('', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id', type=int)
    farmer_id = request.args.get('farmer_id', type=int)
    search_query = (request.args.get('q') or '')[:100]

    query = _approved_farmer_products_query()

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if farmer_id:
        query = query.filter(Product.farmer_id == farmer_id)
    query = _apply_search(query, search_query)

    products = query.order_by(Product.created_at.desc()).all()
    return jsonify([serialize_product(p) for p in products]), 200


@product_bp.route('/search', methods=['GET'])
def universal_search():
    """Live universal search: products + farms for the header typeahead."""
    search_query = (request.args.get('q') or '').strip()[:100]
    if len(search_query) < 2:
        return jsonify({"products": [], "farms": []}), 200

    products = (
        _apply_search(_approved_farmer_products_query(), search_query)
        .order_by(Product.created_at.desc())
        .limit(8)
        .all()
    )
    like = f'%{search_query}%'
    farms = (
        FarmerProfile.query
        .filter(
            FarmerProfile.status == 'approved',
            or_(
                FarmerProfile.farm_name.ilike(like),
                FarmerProfile.location.ilike(like),
                FarmerProfile.description.ilike(like),
            ),
        )
        .order_by(FarmerProfile.farm_name)
        .limit(5)
        .all()
    )
    return jsonify({
        "products": [serialize_product(p) for p in products],
        "farms": [{
            "id": f.id,
            "farm_name": f.farm_name,
            "location": f.location,
            "photo_url": f.photo_url,
        } for f in farms],
    }), 200


@product_bp.route('/featured', methods=['GET'])
def featured_products():
    """Homepage 'Fresh this week' — prefer products with sales, else newest."""
    from models import OrderItem
    from sqlalchemy import func

    sold = (
        db.session.query(
            OrderItem.product_id,
            func.sum(OrderItem.quantity).label('qty'),
        )
        .group_by(OrderItem.product_id)
        .subquery()
    )
    products = (
        _approved_farmer_products_query()
        .outerjoin(sold, Product.id == sold.c.product_id)
        .order_by(func.coalesce(sold.c.qty, 0).desc(), Product.created_at.desc())
        .limit(8)
        .all()
    )
    return jsonify([serialize_product(p) for p in products]), 200


@product_bp.route('/impact-stats', methods=['GET'])
def impact_stats():
    """Live homepage impact numbers — never invent counts."""
    from models import Order, FarmerOrder
    from sqlalchemy import func

    farms = FarmerProfile.query.filter_by(status='approved').count()
    orders = Order.query.count()
    regions = (
        db.session.query(func.count(func.distinct(FarmerProfile.location)))
        .filter(FarmerProfile.status == 'approved')
        .scalar()
    ) or 0

    # Only compute average when we have delivered sub-orders with usable timestamps.
    # FarmerOrder currently has created_at only — without a delivered_at we cannot invent hours.
    delivered = FarmerOrder.query.filter_by(status='delivered').count()
    avg_hours = None
    # Future: when delivered_at exists, compute AVG(TIMESTAMPDIFF(HOUR, order.created_at, fo.delivered_at))

    return jsonify({
        'farms': farms,
        'orders': orders,
        'regions': regions,
        'delivered_suborders': delivered,
        'avg_fulfillment_hours': avg_hours,
    }), 200


@product_bp.route('/reviews/featured', methods=['GET'])
def featured_reviews():
    """Homepage testimonials — approved reviews with text and rating >= 4."""
    from models import Review, User
    rows = (
        Review.query
        .filter(
            Review.status == 'approved',
            Review.rating >= 4,
            Review.body.isnot(None),
            Review.body != '',
        )
        .order_by(Review.created_at.desc())
        .limit(6)
        .all()
    )
    out = []
    for r in rows:
        out.append({
            'id': r.id,
            'rating': r.rating,
            'body': r.body,
            'user_name': r.user.name.split()[0] if r.user else 'Customer',
            'product_name': r.product.name if r.product else None,
        })
    return jsonify(out), 200


@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = (
        _approved_farmer_products_query()
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    from auth_helpers import serialize_farmer
    data = serialize_product(product)
    if product.farmer:
        data['farmer_profile'] = serialize_farmer(product.farmer)
    # Prefer gallery when present
    if hasattr(product, 'images') and product.images:
        data['gallery_urls'] = [img.url for img in sorted(product.images, key=lambda i: i.sort_order)]
    return jsonify(data), 200


@product_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    """Admin can create a product on behalf of a farmer."""
    data = request.get_json() or {}
    farmer_id = data.get('farmer_id')
    if not farmer_id:
        return jsonify({"msg": "farmer_id is required"}), 400

    farmer = FarmerProfile.query.filter_by(id=farmer_id, status='approved').first()
    if not farmer:
        return jsonify({"msg": "Approved farmer not found"}), 404

    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=float(data['price']),
        unit=data.get('unit', 'Kg'),
        category_id=data['category_id'],
        farmer_id=farmer.id,
        stock_quantity=data.get('stock_quantity', 0),
        image_url=data.get('image_url', ''),
        tags=data.get('tags', '')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"msg": "Product created successfully", "id": new_product.id}), 201


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
    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({"msg": "name is required"}), 400
    new_category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"msg": "Category created successfully", "id": new_category.id}), 201


@product_bp.route('/farmers', methods=['GET'])
def list_public_farmers():
    """Approved farms for the public Farmers directory."""
    farmers = FarmerProfile.query.filter_by(status='approved').order_by(FarmerProfile.farm_name).all()
    result = []
    for f in farmers:
        product_count = Product.query.filter_by(farmer_id=f.id, is_active=True).count()
        result.append({
            "id": f.id,
            "farm_name": f.farm_name,
            "description": f.description,
            "location": f.location,
            "photo_url": f.photo_url,
            "name": f.user.name if f.user else None,
            "product_count": product_count,
        })
    return jsonify(result), 200


@product_bp.route('/farmers/<int:farmer_id>', methods=['GET'])
def get_public_farmer(farmer_id):
    farmer = FarmerProfile.query.filter_by(id=farmer_id, status='approved').first()
    if not farmer:
        return jsonify({"msg": "Farmer not found"}), 404
    products = Product.query.filter_by(farmer_id=farmer.id, is_active=True).all()
    return jsonify({
        "id": farmer.id,
        "farm_name": farmer.farm_name,
        "description": farmer.description,
        "location": farmer.location,
        "photo_url": farmer.photo_url,
        "name": farmer.user.name if farmer.user else None,
        "products": [serialize_product(p) for p in products],
    }), 200

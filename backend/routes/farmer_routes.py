from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from extensions import db
from models import Product, ProductImage, FarmerOrder, OrderItem, Category, Order
from flask_jwt_extended import jwt_required
from auth_helpers import farmer_required, serialize_product, serialize_farmer

farmer_bp = Blueprint('farmer', __name__)

ALLOWED_STATUSES = {'placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'}


def _set_gallery(product, urls):
    """Replace product gallery; first URL also becomes image_url."""
    ProductImage.query.filter_by(product_id=product.id).delete()
    clean = [u.strip() for u in (urls or []) if isinstance(u, str) and u.strip()][:8]
    for i, url in enumerate(clean):
        db.session.add(ProductImage(product_id=product.id, url=url, sort_order=i))
    if clean:
        product.image_url = clean[0]
    return clean


@farmer_bp.route('/me', methods=['GET'])
@jwt_required()
@farmer_required
def my_profile(profile):
    return jsonify(serialize_farmer(profile, include_private=True)), 200


@farmer_bp.route('/me', methods=['PUT'])
@jwt_required()
@farmer_required
def update_farm_profile(profile):
    data = request.get_json() or {}
    if 'farm_name' in data and data['farm_name'].strip():
        profile.farm_name = data['farm_name'].strip()
    if 'description' in data:
        profile.description = (data.get('description') or '').strip()
    if 'location' in data and data['location'].strip():
        profile.location = data['location'].strip()
    if 'photo_url' in data:
        profile.photo_url = data.get('photo_url') or None

    db.session.commit()
    return jsonify(serialize_farmer(profile, include_private=True)), 200


@farmer_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@farmer_required
def dashboard(profile):
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    my_orders = FarmerOrder.query.filter_by(farmer_id=profile.id).all()

    def stats_for(since):
        subset = [o for o in my_orders if o.created_at and o.created_at >= since]
        units = 0
        revenue = 0.0
        for o in subset:
            revenue += o.subtotal or 0
            for item in o.items:
                units += item.quantity
        return {
            "order_count": len(subset),
            "units_sold": units,
            "revenue": round(revenue, 2),
        }

    pending = [
        o for o in my_orders
        if o.status in ('placed', 'confirmed', 'packed')
    ]

    return jsonify({
        "farm": serialize_farmer(profile, include_private=True),
        "this_week": stats_for(week_ago),
        "this_month": stats_for(month_ago),
        "pending_fulfillments": len(pending),
        "active_products": Product.query.filter_by(farmer_id=profile.id, is_active=True).count(),
        "total_products": Product.query.filter_by(farmer_id=profile.id).count(),
    }), 200


@farmer_bp.route('/products', methods=['GET'])
@jwt_required()
@farmer_required
def list_my_products(profile):
    products = Product.query.filter_by(farmer_id=profile.id).order_by(Product.created_at.desc()).all()
    return jsonify([serialize_product(p) for p in products]), 200


@farmer_bp.route('/products', methods=['POST'])
@jwt_required()
@farmer_required
def create_product(profile):
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({"msg": "Product name is required"}), 400
    if 'price' not in data or 'category_id' not in data:
        return jsonify({"msg": "price and category_id are required"}), 400

    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    product = Product(
        name=name,
        description=(data.get('description') or '').strip(),
        price=float(data['price']),
        unit=data.get('unit', 'Kg'),
        category_id=category.id,
        farmer_id=profile.id,
        stock_quantity=int(data.get('stock_quantity', 0)),
        image_url=data.get('image_url', ''),
        tags=data.get('tags', ''),
        # Pending farms can draft products; they stay inactive until approved if desired
        is_active=bool(data.get('is_active', profile.status == 'approved')),
    )
    db.session.add(product)
    db.session.flush()

    gallery = data.get('gallery_urls') or data.get('images') or []
    if gallery:
        _set_gallery(product, gallery)
    elif product.image_url:
        _set_gallery(product, [product.image_url])

    db.session.commit()
    return jsonify(serialize_product(product)), 201


@farmer_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@farmer_required
def update_product(profile, product_id):
    product = Product.query.filter_by(id=product_id, farmer_id=profile.id).first()
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        product.name = data['name'].strip()
    if 'description' in data:
        product.description = (data.get('description') or '').strip()
    if 'price' in data:
        product.price = float(data['price'])
    if 'unit' in data:
        product.unit = data['unit']
    if 'category_id' in data:
        if not Category.query.get(data['category_id']):
            return jsonify({"msg": "Category not found"}), 404
        product.category_id = data['category_id']
    if 'stock_quantity' in data:
        product.stock_quantity = int(data['stock_quantity'])
    if 'image_url' in data:
        product.image_url = data.get('image_url') or ''
    if 'gallery_urls' in data or 'images' in data:
        gallery = data.get('gallery_urls') or data.get('images') or []
        _set_gallery(product, gallery)
    if 'tags' in data:
        product.tags = data.get('tags') or ''
    if 'is_active' in data:
        # Pending farms cannot go live on marketplace
        want_active = bool(data['is_active'])
        product.is_active = want_active and profile.status == 'approved'

    db.session.commit()
    return jsonify(serialize_product(product)), 200


@farmer_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@farmer_required
def deactivate_product(profile, product_id):
    """Soft-delete: deactivate rather than hard delete."""
    product = Product.query.filter_by(id=product_id, farmer_id=profile.id).first()
    if not product:
        return jsonify({"msg": "Product not found"}), 404
    product.is_active = False
    db.session.commit()
    return jsonify({"msg": "Product deactivated", "product": serialize_product(product)}), 200


@farmer_bp.route('/orders', methods=['GET'])
@jwt_required()
@farmer_required
def list_my_orders(profile):
    farmer_orders = (
        FarmerOrder.query
        .filter_by(farmer_id=profile.id)
        .order_by(FarmerOrder.created_at.desc())
        .all()
    )
    result = []
    for fo in farmer_orders:
        result.append({
            "id": fo.id,
            "farmer_order_id": fo.id,
            "order_id": fo.order_id,
            "status": fo.status,
            "subtotal": fo.subtotal,
            "created_at": fo.created_at.isoformat() if fo.created_at else None,
            "customer_name": fo.order.user.name if fo.order and fo.order.user else None,
            "items": [{
                "id": item.id,
                "quantity": item.quantity,
                "price_at_purchase": item.price_at_purchase,
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                    "image_url": item.product.image_url,
                } if item.product else None,
            } for item in fo.items],
        })
    return jsonify(result), 200


@farmer_bp.route('/orders/<int:farmer_order_id>/status', methods=['PUT'])
@jwt_required()
@farmer_required
def update_order_status(profile, farmer_order_id):
    fo = FarmerOrder.query.filter_by(id=farmer_order_id, farmer_id=profile.id).first()
    if not fo:
        return jsonify({"msg": "Order not found"}), 404

    data = request.get_json() or {}
    status = (data.get('status') or '').strip()
    if status not in ALLOWED_STATUSES:
        return jsonify({"msg": f"Invalid status. Allowed: {sorted(ALLOWED_STATUSES)}"}), 400

    previous = fo.status
    fo.status = status

    # Cancel → restore stock once (if not already cancelled)
    if status == 'cancelled' and previous != 'cancelled':
        for item in fo.items:
            product = Product.query.get(item.product_id)
            if product:
                product.stock_quantity = (product.stock_quantity or 0) + item.quantity

    # Recompute parent order aggregate status
    parent = fo.order
    if parent:
        statuses = [x.status for x in parent.farmer_orders]
        if all(s == 'cancelled' for s in statuses):
            parent.status = 'cancelled'
        elif all(s == 'delivered' for s in statuses):
            parent.status = 'fulfilled'
        elif any(s in ('confirmed', 'packed', 'out_for_delivery', 'delivered') for s in statuses):
            parent.status = 'partially_fulfilled'
        else:
            parent.status = 'placed'

    db.session.commit()
    return jsonify({
        "msg": "Status updated",
        "farmer_order_id": fo.id,
        "status": fo.status,
        "parent_order_status": parent.status if parent else None,
        "stock_restored": status == 'cancelled' and previous != 'cancelled',
    }), 200

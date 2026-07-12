"""Product reviews — customer submit (pending), admin moderate, featured public."""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from extensions import db
from models import Review, ReviewImage, Product, Order, OrderItem
from auth_helpers import current_user, admin_required, maybe_flag_seller

review_bp = Blueprint('reviews', __name__)


def _serialize_review(r, include_private=False):
    data = {
        'id': r.id,
        'product_id': r.product_id,
        'product_name': r.product.name if r.product else None,
        'order_id': r.order_id,
        'rating': r.rating,
        'body': r.body,
        'status': r.status,
        'user_name': (r.user.name.split()[0] if r.user and r.user.name else 'Customer'),
        'images': [img.url for img in (r.images or [])],
        'created_at': r.created_at.isoformat() if r.created_at else None,
        'farmer_id': r.product.farmer_id if r.product else None,
    }
    if include_private:
        data['user_id'] = r.user_id
        data['user_email'] = r.user.email if r.user else None
    return data


@review_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    user = current_user()
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    data = request.get_json() or {}
    product_id = data.get('product_id')
    order_id = data.get('order_id')
    rating = int(data.get('rating') or 0)
    body = (data.get('body') or '').strip()
    images = data.get('images') or data.get('image_urls') or []

    if not product_id or rating < 1 or rating > 5:
        return jsonify({'msg': 'product_id and rating (1-5) are required'}), 400
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Product not found'}), 404

    # Must have purchased this product (any delivered/fulfilled-ish order)
    purchased = (
        db.session.query(OrderItem)
        .join(Order)
        .filter(
            Order.user_id == user.id,
            OrderItem.product_id == product_id,
        )
    )
    if order_id:
        purchased = purchased.filter(Order.id == order_id)
    if not purchased.first():
        return jsonify({'msg': 'You can only review products you purchased'}), 403

    existing = Review.query.filter_by(user_id=user.id, product_id=product_id).first()
    if existing:
        return jsonify({'msg': 'You already reviewed this product'}), 400

    review = Review(
        user_id=user.id,
        product_id=product_id,
        order_id=order_id,
        rating=rating,
        body=body or None,
        status='pending',
    )
    db.session.add(review)
    db.session.flush()

    for url in images[:5]:
        if isinstance(url, str) and url.strip():
            db.session.add(ReviewImage(review_id=review.id, url=url.strip()))

    # Reactive trust: low rating opens a seller flag
    if rating <= 2 and product.farmer_id:
        maybe_flag_seller(
            product.farmer_id,
            f'Low rating ({rating}/5) on {product.name} — review pending moderation',
        )

    db.session.commit()
    return jsonify({
        'msg': 'Review submitted — it will appear after moderation',
        'review': _serialize_review(review),
    }), 201


@review_bp.route('/product/<int:product_id>', methods=['GET'])
def list_product_reviews(product_id):
    rows = (
        Review.query
        .filter_by(product_id=product_id, status='approved')
        .order_by(Review.created_at.desc())
        .limit(50)
        .all()
    )
    return jsonify([_serialize_review(r) for r in rows]), 200


@review_bp.route('/admin', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_reviews():
    status = request.args.get('status', 'pending')
    q = Review.query
    if status and status != 'all':
        q = q.filter_by(status=status)
    rows = q.order_by(Review.created_at.desc()).limit(100).all()
    return jsonify([_serialize_review(r, include_private=True) for r in rows]), 200


@review_bp.route('/admin/<int:review_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_review(review_id):
    r = Review.query.get(review_id)
    if not r:
        return jsonify({'msg': 'Review not found'}), 404
    r.status = 'approved'
    db.session.commit()
    return jsonify({'msg': 'Review approved', 'review': _serialize_review(r)}), 200


@review_bp.route('/admin/<int:review_id>/reject', methods=['POST'])
@jwt_required()
@admin_required
def reject_review(review_id):
    r = Review.query.get(review_id)
    if not r:
        return jsonify({'msg': 'Review not found'}), 404
    r.status = 'rejected'
    db.session.commit()
    return jsonify({'msg': 'Review rejected', 'review': _serialize_review(r)}), 200

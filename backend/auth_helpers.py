from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models import User, FarmerProfile


def current_user():
    uid = get_jwt_identity()
    if uid is None:
        return None
    return User.query.get(int(uid))


def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user = current_user()
            if not user or user.role not in roles:
                return jsonify({"msg": "Access denied"}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator


def admin_required(f):
    return role_required('admin')(f)


def farmer_required(f):
    """
    Require farmer role + profile.
    Pending/rejected farmers can use the dashboard to prepare listings;
    marketplace visibility still requires approved status.
    """
    @wraps(f)
    def wrapped(*args, **kwargs):
        user = current_user()
        if not user or user.role != 'farmer':
            return jsonify({"msg": "Farmer access required"}), 403
        profile = FarmerProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            return jsonify({"msg": "Farmer profile not found"}), 404
        if profile.status == 'rejected':
            # Still allow read-only dashboard access so they see rejection reason
            pass
        return f(profile, *args, **kwargs)
    return wrapped


def farmer_approved_required(f):
    """Stricter: only approved farms (e.g. going live actions)."""
    @wraps(f)
    def wrapped(*args, **kwargs):
        user = current_user()
        if not user or user.role != 'farmer':
            return jsonify({"msg": "Farmer access required"}), 403
        profile = FarmerProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            return jsonify({"msg": "Farmer profile not found"}), 404
        if profile.status != 'approved':
            return jsonify({
                "msg": "Your farm must be approved before this action",
                "status": profile.status,
            }), 403
        return f(profile, *args, **kwargs)
    return wrapped


def serialize_farmer(profile, include_private=False):
    open_flags = 0
    if profile.seller_flags:
        open_flags = sum(1 for fl in profile.seller_flags if fl.status == 'open')
    data = {
        "id": profile.id,
        "farm_name": profile.farm_name,
        "description": profile.description,
        "location": profile.location,
        "photo_url": profile.photo_url,
        "status": profile.status,
        "is_new_seller": bool(profile.is_new_seller),
        "name": profile.user.name if profile.user else None,
        "open_flag_count": open_flags,
    }
    if include_private:
        data.update({
            "user_id": profile.user_id,
            "rejection_reason": profile.rejection_reason,
            "email": profile.user.email if profile.user else None,
            "phone": profile.user.phone if profile.user else None,
            "created_at": profile.created_at.isoformat() if profile.created_at else None,
            "reviewed_at": profile.reviewed_at.isoformat() if profile.reviewed_at else None,
        })
    return data


def serialize_product(p):
    farmer = p.farmer
    gallery = []
    if hasattr(p, 'images') and p.images:
        gallery = [img.url for img in sorted(p.images, key=lambda i: i.sort_order)]
    primary = p.image_url or (gallery[0] if gallery else None)
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "unit": p.unit or 'Kg',
        "category_id": p.category_id,
        "category_name": p.category.name if p.category else None,
        "stock_quantity": p.stock_quantity,
        "image_url": primary,
        "image": primary,
        "gallery_urls": gallery,
        "tags": p.tags,
        "is_active": p.is_active,
        "farmer_id": p.farmer_id,
        "farmer": farmer.farm_name if farmer else None,
        "farmer_name": farmer.farm_name if farmer else None,
        "farmer_location": farmer.location if farmer else None,
        "is_new_seller": bool(farmer.is_new_seller) if farmer else False,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }


def serialize_order(order, include_items=True):
    farmer_groups = []
    if include_items:
        for fo in order.farmer_orders:
            farmer_groups.append({
                "farmer_order_id": fo.id,
                "farmer_id": fo.farmer_id,
                "farm_name": fo.farmer.farm_name if fo.farmer else None,
                "status": fo.status,
                "subtotal": fo.subtotal,
                "items": [{
                    "id": item.id,
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price_at_purchase": item.price_at_purchase,
                    "product": {
                        "id": item.product.id,
                        "name": item.product.name,
                        "image_url": item.product.image_url,
                    } if item.product else None,
                } for item in fo.items],
            })

    flat_items = []
    for fo in order.farmer_orders:
        for item in fo.items:
            flat_items.append({
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price_at_purchase": item.price_at_purchase,
                "farmer_id": item.farmer_id,
                "farmer_order_id": fo.id,
                "farm_name": fo.farmer.farm_name if fo.farmer else None,
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                    "image_url": item.product.image_url,
                } if item.product else None,
            })

    return {
        "id": order.id,
        "order_id": order.id,
        "total_price": order.total_price,
        "delivery_fee": getattr(order, 'delivery_fee', None) or 0,
        "status": order.status,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "item_count": len(flat_items),
        "items": flat_items,
        "farmer_groups": farmer_groups,
        "address": {
            "id": order.address.id,
            "details": order.address.details,
            "city": order.address.city,
            "state": order.address.state,
            "pincode": order.address.pincode,
        } if order.address else None,
    }


def maybe_flag_seller(farmer_id, reason):
    """Create an open SellerFlag if one with the same reason isn't already open."""
    from extensions import db
    from models import SellerFlag
    existing = SellerFlag.query.filter_by(
        farmer_id=farmer_id, status='open', reason=reason
    ).first()
    if existing:
        return existing
    flag = SellerFlag(farmer_id=farmer_id, reason=reason, status='open')
    db.session.add(flag)
    return flag

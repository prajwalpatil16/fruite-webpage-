import re
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from extensions import db
from models import BlogPost, HelpArticle, NewsletterSubscriber
from auth_helpers import admin_required

content_bp = Blueprint('content', __name__)


def slugify(text):
    text = (text or '').lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text).strip('-')
    return text[:200] or 'untitled'


def unique_slug(model, base, exclude_id=None):
    slug = slugify(base)
    candidate = slug
    i = 2
    while True:
        q = model.query.filter_by(slug=candidate)
        if exclude_id:
            q = q.filter(model.id != exclude_id)
        if not q.first():
            return candidate
        candidate = f'{slug}-{i}'
        i += 1


def serialize_post(p, include_body=True, include_products=True):
    data = {
        'id': p.id,
        'title': p.title,
        'slug': p.slug,
        'category': p.category,
        'excerpt': p.excerpt,
        'author_name': p.author_name,
        'farmer_id': p.farmer_id,
        'related_product_ids': p.related_product_ids,
        'is_published': p.is_published,
        'published_at': p.published_at.isoformat() if p.published_at else None,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None,
        'best_sellers': [],
    }
    if include_body:
        data['body'] = p.body
    if include_products:
        data['best_sellers'] = _best_sellers_for_post(p)
    return data


def _best_sellers_for_post(p):
    """Resolve related products for a journal story — never invent listings."""
    from models import Product, FarmerProfile
    from auth_helpers import serialize_product

    products = []
    ids = []
    if p.related_product_ids:
        for part in str(p.related_product_ids).split(','):
            part = part.strip()
            if part.isdigit():
                ids.append(int(part))
    if ids:
        rows = Product.query.filter(Product.id.in_(ids), Product.is_active.is_(True)).all()
        by_id = {r.id: r for r in rows}
        products = [by_id[i] for i in ids if i in by_id]
    elif p.farmer_id:
        products = (
            Product.query
            .filter_by(farmer_id=p.farmer_id, is_active=True)
            .order_by(Product.id.asc())
            .limit(2)
            .all()
        )
    else:
        # Fallback: two active products from approved farms (stable by id)
        products = (
            Product.query
            .join(FarmerProfile)
            .filter(Product.is_active.is_(True), FarmerProfile.status == 'approved')
            .order_by(Product.id.asc())
            .limit(2)
            .all()
        )
    return [serialize_product(x) for x in products[:2]]


def serialize_article(a, include_body=True):
    data = {
        'id': a.id,
        'title': a.title,
        'slug': a.slug,
        'category': a.category,
        'is_published': a.is_published,
        'sort_order': a.sort_order,
        'created_at': a.created_at.isoformat() if a.created_at else None,
        'updated_at': a.updated_at.isoformat() if a.updated_at else None,
    }
    if include_body:
        data['body'] = a.body
    return data


# --- Public Blog ---

@content_bp.route('/blog', methods=['GET'])
def list_blog():
    category = request.args.get('category')
    q = BlogPost.query.filter_by(is_published=True)
    if category:
        q = q.filter_by(category=category)
    posts = q.order_by(BlogPost.published_at.desc(), BlogPost.id.desc()).all()
    return jsonify([serialize_post(p, include_body=False) for p in posts]), 200


@content_bp.route('/blog/<slug>', methods=['GET'])
def get_blog(slug):
    post = BlogPost.query.filter_by(slug=slug, is_published=True).first()
    if not post:
        return jsonify({'msg': 'Post not found'}), 404
    return jsonify(serialize_post(post)), 200


# --- Public Help ---

@content_bp.route('/help', methods=['GET'])
def list_help():
    category = request.args.get('category')
    search = (request.args.get('q') or '')[:100]
    q = HelpArticle.query.filter_by(is_published=True)
    if category:
        q = q.filter_by(category=category)
    if search:
        like = f'%{search}%'
        q = q.filter(or_(HelpArticle.title.ilike(like), HelpArticle.body.ilike(like)))
    articles = q.order_by(HelpArticle.category, HelpArticle.sort_order, HelpArticle.title).all()
    return jsonify([serialize_article(a, include_body=False) for a in articles]), 200


@content_bp.route('/help/categories', methods=['GET'])
def help_categories():
    rows = (
        db.session.query(HelpArticle.category, db.func.count(HelpArticle.id))
        .filter_by(is_published=True)
        .group_by(HelpArticle.category)
        .all()
    )
    return jsonify([{'category': c, 'count': n} for c, n in rows]), 200


@content_bp.route('/help/<slug>', methods=['GET'])
def get_help(slug):
    article = HelpArticle.query.filter_by(slug=slug, is_published=True).first()
    if not article:
        return jsonify({'msg': 'Article not found'}), 404
    return jsonify(serialize_article(article)), 200


# --- Admin Blog CRUD ---

@content_bp.route('/admin/blog', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_blog():
    posts = BlogPost.query.order_by(BlogPost.updated_at.desc()).all()
    return jsonify([serialize_post(p, include_body=False) for p in posts]), 200


@content_bp.route('/admin/blog/<int:post_id>', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_blog(post_id):
    post = BlogPost.query.get(post_id)
    if not post:
        return jsonify({'msg': 'Post not found'}), 404
    return jsonify(serialize_post(post)), 200


@content_bp.route('/admin/blog', methods=['POST'])
@jwt_required()
@admin_required
def admin_create_blog():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    body = (data.get('body') or '').strip()
    if not title or not body:
        return jsonify({'msg': 'title and body are required'}), 400

    post = BlogPost(
        title=title,
        slug=unique_slug(BlogPost, data.get('slug') or title),
        category=(data.get('category') or 'Our Model').strip(),
        excerpt=(data.get('excerpt') or '').strip(),
        body=body,
        author_name=(data.get('author_name') or 'FruitBasket').strip(),
        farmer_id=data.get('farmer_id'),
        is_published=bool(data.get('is_published', False)),
    )
    if post.is_published:
        post.published_at = datetime.utcnow()
    db.session.add(post)
    db.session.commit()
    return jsonify(serialize_post(post)), 201


@content_bp.route('/admin/blog/<int:post_id>', methods=['PUT'])
@jwt_required()
@admin_required
def admin_update_blog(post_id):
    post = BlogPost.query.get(post_id)
    if not post:
        return jsonify({'msg': 'Post not found'}), 404

    data = request.get_json() or {}
    if 'title' in data and data['title'].strip():
        post.title = data['title'].strip()
    if 'slug' in data and data['slug'].strip():
        post.slug = unique_slug(BlogPost, data['slug'], exclude_id=post.id)
    if 'category' in data:
        post.category = (data.get('category') or post.category).strip()
    if 'excerpt' in data:
        post.excerpt = (data.get('excerpt') or '').strip()
    if 'body' in data and data['body'].strip():
        post.body = data['body'].strip()
    if 'author_name' in data:
        post.author_name = (data.get('author_name') or 'FruitBasket').strip()
    if 'farmer_id' in data:
        post.farmer_id = data.get('farmer_id')
    if 'is_published' in data:
        was = post.is_published
        post.is_published = bool(data['is_published'])
        if post.is_published and not was:
            post.published_at = datetime.utcnow()
        if not post.is_published:
            pass  # keep published_at history

    post.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(serialize_post(post)), 200


@content_bp.route('/admin/blog/<int:post_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def admin_delete_blog(post_id):
    post = BlogPost.query.get(post_id)
    if not post:
        return jsonify({'msg': 'Post not found'}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({'msg': 'Deleted'}), 200


# --- Admin Help CRUD ---

@content_bp.route('/admin/help', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_help():
    articles = HelpArticle.query.order_by(HelpArticle.category, HelpArticle.sort_order).all()
    return jsonify([serialize_article(a, include_body=False) for a in articles]), 200


@content_bp.route('/admin/help/<int:article_id>', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_help(article_id):
    article = HelpArticle.query.get(article_id)
    if not article:
        return jsonify({'msg': 'Article not found'}), 404
    return jsonify(serialize_article(article)), 200


@content_bp.route('/admin/help', methods=['POST'])
@jwt_required()
@admin_required
def admin_create_help():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    body = (data.get('body') or '').strip()
    if not title or not body:
        return jsonify({'msg': 'title and body are required'}), 400

    article = HelpArticle(
        title=title,
        slug=unique_slug(HelpArticle, data.get('slug') or title),
        category=(data.get('category') or 'Ordering & Delivery').strip(),
        body=body,
        is_published=bool(data.get('is_published', False)),
        sort_order=int(data.get('sort_order', 0)),
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(serialize_article(article)), 201


@content_bp.route('/admin/help/<int:article_id>', methods=['PUT'])
@jwt_required()
@admin_required
def admin_update_help(article_id):
    article = HelpArticle.query.get(article_id)
    if not article:
        return jsonify({'msg': 'Article not found'}), 404

    data = request.get_json() or {}
    if 'title' in data and data['title'].strip():
        article.title = data['title'].strip()
    if 'slug' in data and data['slug'].strip():
        article.slug = unique_slug(HelpArticle, data['slug'], exclude_id=article.id)
    if 'category' in data:
        article.category = (data.get('category') or article.category).strip()
    if 'body' in data and data['body'].strip():
        article.body = data['body'].strip()
    if 'is_published' in data:
        article.is_published = bool(data['is_published'])
    if 'sort_order' in data:
        article.sort_order = int(data['sort_order'])

    article.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(serialize_article(article)), 200


@content_bp.route('/admin/help/<int:article_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def admin_delete_help(article_id):
    article = HelpArticle.query.get(article_id)
    if not article:
        return jsonify({'msg': 'Article not found'}), 404
    db.session.delete(article)
    db.session.commit()
    return jsonify({'msg': 'Deleted'}), 200


@content_bp.route('/newsletter', methods=['POST'])
def newsletter_subscribe():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email or '@' not in email:
        return jsonify({'msg': 'Valid email required'}), 400
    existing = NewsletterSubscriber.query.filter_by(email=email).first()
    if existing:
        return jsonify({'msg': 'Already subscribed'}), 200
    db.session.add(NewsletterSubscriber(email=email))
    db.session.commit()
    return jsonify({'msg': 'Subscribed'}), 201

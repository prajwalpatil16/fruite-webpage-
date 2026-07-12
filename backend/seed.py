"""
Seed FruitBasket with admin, two approved farmers + products, and a sample customer.
Run from backend/:  python seed.py

Uses traditional MYSQL_* settings from .env. Safe to re-run (skips existing emails).
"""
from app import create_app
from extensions import db, bcrypt
from models import User, FarmerProfile, Category, Product, BlogPost, HelpArticle, Review
from content_seed import BLOG_POSTS, HELP_ARTICLES
from datetime import datetime


def upsert_user(email, name, password, role, phone=''):
    user = User.query.filter_by(email=email).first()
    if user:
        return user
    user = User(
        name=name,
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode('utf-8'),
        phone=phone,
        role=role,
    )
    db.session.add(user)
    db.session.flush()
    return user


def ensure_categories():
    defaults = [
        (1, 'Fruits', 'Seasonal and everyday fruits, picked ripe'),
        (2, 'Vegetables', 'Farm-fresh vegetables for daily cooking'),
        (3, 'Exotics', 'Specialty and less-common produce'),
        (4, 'Organic', 'Grown with fewer chemicals and clearer practices'),
    ]
    for cid, name, desc in defaults:
        if not Category.query.get(cid):
            existing = Category.query.filter_by(name=name).first()
            if not existing:
                db.session.add(Category(id=cid, name=name, description=desc))
    db.session.flush()


def ensure_farmer(user, farm_name, location, description, photo_url):
    profile = FarmerProfile.query.filter_by(user_id=user.id).first()
    if profile:
        profile.status = 'approved'
        return profile
    profile = FarmerProfile(
        user_id=user.id,
        farm_name=farm_name,
        location=location,
        description=description,
        photo_url=photo_url,
        status='approved',
    )
    db.session.add(profile)
    db.session.flush()
    return profile


def ensure_content():
    for item in BLOG_POSTS:
        existing = BlogPost.query.filter_by(slug=item['slug']).first()
        if existing:
            continue
        post = BlogPost(
            title=item['title'],
            slug=item['slug'],
            category=item['category'],
            excerpt=item.get('excerpt', ''),
            body=item['body'],
            author_name='FruitBasket',
            farmer_id=item.get('farmer_id'),
            is_published=item.get('is_published', True),
            published_at=datetime.utcnow() if item.get('is_published', True) else None,
        )
        db.session.add(post)

    for item in HELP_ARTICLES:
        existing = HelpArticle.query.filter_by(slug=item['slug']).first()
        if existing:
            # Keep fee article unpublished even if re-seeded
            if item['slug'] == 'seller-fees':
                existing.is_published = False
            continue
        article = HelpArticle(
            title=item['title'],
            slug=item['slug'],
            category=item['category'],
            body=item['body'],
            is_published=item.get('is_published', True),
            sort_order=item.get('sort_order', 0),
        )
        db.session.add(article)
    db.session.flush()


def link_story_best_sellers():
    """Attach real product IDs to journal stories (best sellers / pairings)."""
    by_name = {p.name: p for p in Product.query.filter_by(is_active=True).all()}
    # Category-aware pairings using seeded product names
    pairs = {
        'Recipes': ['Fresh Strawberries', 'Organic Broccoli'],
        'Guides': ['Organic Broccoli', 'Avocado'],
        'Our Model': ['Alphonso Mangoes', 'Fresh Strawberries'],
        'Farmer Spotlight': ['Alphonso Mangoes', 'Avocado'],
    }
    farmers = {f.farm_name: f for f in FarmerProfile.query.filter_by(status='approved').all()}
    for post in BlogPost.query.all():
        names = pairs.get(post.category) or ['Alphonso Mangoes', 'Fresh Strawberries']
        ids = [str(by_name[n].id) for n in names if n in by_name]
        if ids:
            post.related_product_ids = ','.join(ids)
        # Tie farmer spotlights to a real farm when possible
        if post.category == 'Farmer Spotlight' and not post.farmer_id:
            farm = farmers.get('Green Valley Farm') or next(iter(farmers.values()), None)
            if farm:
                post.farmer_id = farm.id


def ensure_product(farmer_id, name, **kwargs):
    existing = Product.query.filter_by(farmer_id=farmer_id, name=name).first()
    if existing:
        return existing
    p = Product(farmer_id=farmer_id, name=name, **kwargs)
    db.session.add(p)
    return p


def main():
    import sys
    app = create_app()
    with app.app_context():
        if '--reset' in sys.argv:
            print('Dropping all tables…')
            db.drop_all()
        db.create_all()
        ensure_categories()

        upsert_user('admin@fruitbasket.com', 'FruitBasket Admin', 'admin123', 'admin', '9999999999')
        customer = upsert_user('customer@fruitbasket.com', 'Asha Mehta', 'customer123', 'customer', '9888888888')

        f1_user = upsert_user('ramesh@greenvalley.com', 'Ramesh Patil', 'farmer123', 'farmer', '9777777777')
        f2_user = upsert_user('meera@sunrise.com', 'Meera Bai', 'farmer123', 'farmer', '9666666666')

        f1 = ensure_farmer(
            f1_user,
            'Green Valley Farm',
            'Ratnagiri, Maharashtra',
            'Three generations growing Alphonso mangoes and coastal fruit. We pick to order — never from cold storage.',
            'https://images.unsplash.com/photo-1500937386664-56d7fcb5c3c4?auto=format&fit=crop&q=80&w=800',
        )
        f2 = ensure_farmer(
            f2_user,
            'Sunrise Organics',
            'Mahabaleshwar, Maharashtra',
            'Small hillside plots, open pollination, and strawberries that taste like June. We sell what we grow that week.',
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
        )

        ensure_product(
            f1.id, 'Alphonso Mangoes',
            description='Sweet, creamy Ratnagiri Alphonso. Sold by the dozen, packed the morning they leave the farm.',
            price=600.0, unit='Dozen', category_id=1, stock_quantity=50,
            image_url='https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
            tags='Fresh,Seasonal',
        )
        ensure_product(
            f1.id, 'Avocado',
            description='Buttery Haas avocados grown on our coastal plots. Best eaten in 2–3 days.',
            price=250.0, unit='Piece', category_id=3, stock_quantity=40,
            image_url='https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=800',
            tags='Fresh',
        )
        ensure_product(
            f2.id, 'Fresh Strawberries',
            description='Hand-picked Mahabaleshwar strawberries. Soft, fragrant, and gone fast — order early in the week.',
            price=150.0, unit='Pack', category_id=1, stock_quantity=30,
            image_url='https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
            tags='Fresh,Seasonal',
        )
        ensure_product(
            f2.id, 'Organic Broccoli',
            description='Crisp heads from our organic beds. Rinse and cook the same day for best texture.',
            price=80.0, unit='Kg', category_id=2, stock_quantity=45,
            image_url='https://images.unsplash.com/photo-1459411621453-7b03977f4952?auto=format&fit=crop&q=80&w=800',
            tags='Organic,Fresh',
        )

        ensure_content()
        link_story_best_sellers()

        # Sample approved reviews so homepage testimonials can render real data
        products = Product.query.filter_by(is_active=True).limit(3).all()
        sample_reviews = [
            (5, 'Picked up mangoes that actually smelled like mangoes. Knew the farm name before they arrived — that alone felt different.'),
            (5, 'Broccoli was crisp the evening it showed up. Will order from Sunrise again.'),
            (4, 'Strawberries soft and sweet. Wish the pack were a little bigger, but flavor was honest.'),
        ]
        for i, product in enumerate(products):
            rating, body = sample_reviews[i % len(sample_reviews)]
            exists = Review.query.filter_by(user_id=customer.id, product_id=product.id).first()
            if not exists:
                db.session.add(Review(
                    user_id=customer.id,
                    product_id=product.id,
                    rating=rating,
                    body=body,
                    status='approved',
                ))

        db.session.commit()
        print('Seed complete.')
        print('  admin@fruitbasket.com / admin123')
        print('  customer@fruitbasket.com / customer123')
        print('  ramesh@greenvalley.com / farmer123  (Green Valley Farm)')
        print('  meera@sunrise.com / farmer123       (Sunrise Organics)')
        print(f'  Sample customer id: {customer.id}')
        print(f'  Blog posts: {BlogPost.query.count()} | Help articles: {HelpArticle.query.count()} (fee article unpublished)')
        print(f'  Approved reviews: {Review.query.filter_by(status="approved").count()}')


if __name__ == '__main__':
    main()

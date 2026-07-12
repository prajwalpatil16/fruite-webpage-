import os
# pyrefly: ignore [missing-import]
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt, limiter


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    origins = os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173'
    ).split(',')
    CORS(app, origins=[o.strip() for o in origins if o.strip()], supports_credentials=True)

    with app.app_context():
        import models  # noqa: F401
        db.create_all()

    from routes.auth_routes import auth_bp
    from routes.product_routes import product_bp
    from routes.order_routes import order_bp
    from routes.address_routes import address_bp
    from routes.farmer_routes import farmer_bp
    from routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(address_bp, url_prefix='/api/addresses')
    app.register_blueprint(farmer_bp, url_prefix='/api/farmer')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    from routes.content_routes import content_bp
    app.register_blueprint(content_bp, url_prefix='/api/content')

    from routes.return_routes import return_bp
    app.register_blueprint(return_bp, url_prefix='/api/returns')

    from routes.review_routes import review_bp
    app.register_blueprint(review_bp, url_prefix='/api/reviews')

    @app.route('/health')
    def health():
        return {"status": "healthy"}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=debug, port=port)

from flask import Flask
from routes.api.authentification.authentification import auth_bp
from routes.api.authentification.models import db
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initializes database with app
    db.init_app(app)

    # BLUEPRINTS
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # The whole app will run on the homepage and make API requests to the backend
    # to get information.
    @app.route('/')
    def hello():
        return "Hello World! Flask is running"
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5002, debug=True)
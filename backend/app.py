from flask import Flask
from flask_cors import CORS
from config import Config
from flask_migrate import Migrate

from routes.api.authentification.authentification import auth_bp
from routes.api.songs.songs import songs_bp
from routes.api.admin.admin import admin_bp
from routes.stream.streaming import streaming_bp

from database import db

# Creates the tables in the DB automatically if imported
from models.user import User
from models.song import Song


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app,
         origins=['http://localhost:3000'], # React App Url
         allow_headers=['Content-type', 'Authorization'], # Allow JWT headers
         methods=['GET', 'POST', 'PUT', 'DELETE'], # Allowed HTTP methods
         supports_credentials=True) # Allow cookies later if needed

    # Initializes database with app
    db.init_app(app)

    # Migrations initialized
    migrate = Migrate(app, db)

    # BLUEPRINTS
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(songs_bp, url_prefix='/api/songs')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    app.register_blueprint(streaming_bp, url_prefix='/stream')

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
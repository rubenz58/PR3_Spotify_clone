from flask import Flask, send_file
from flask_cors import CORS
from config import Config
from flask_migrate import Migrate

import os

from routes.api.authentification.authentification import auth_bp
from routes.api.songs.songs import songs_bp
from routes.api.admin.admin import admin_bp
from routes.api.playlists.playlists import playlists_bp
from routes.api.playlists.user_playlists import user_playlists_bp
from routes.api.albums.albums import albums_bp
from routes.api.artists.artists import artists_bp
from routes.api.search.search import search_bp
from routes.stream.streaming import streaming_bp

from database import db

# Creates the tables in the DB automatically if imported
from models.user import User
from models.song import Song
from models.playlist import Playlist
from models.playlist import PlaylistSong
from models.album import Album
from models.artist import Artist


def create_app():
    print("\n########## CREATING APP ##########")

    # TO SWITCH FOR PRODUCTION
    # app = Flask(__name__)
    app = Flask(__name__, static_folder='build', static_url_path='')

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
    app.register_blueprint(playlists_bp, url_prefix='/api/playlists')
    app.register_blueprint(user_playlists_bp, url_prefix='/api/user_playlists')
    app.register_blueprint(albums_bp, url_prefix='/api/albums')
    app.register_blueprint(artists_bp, url_prefix='/api/artists')
    app.register_blueprint(search_bp, url_prefix='/api/search')

    app.register_blueprint(streaming_bp, url_prefix='/stream')

    def serve_react_app():
        try:
            return send_file(os.path.join(app.static_folder, 'index.html'))
        except FileNotFoundError:
            return "<h1>React App Not Built</h1>", 404
        
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api/'):
            return {'error': 'API endpoint not found'}, 404
        return serve_react_app()

    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

#TO SWITCH FOR PRODUCTION
# if __name__ == '__main__':
#     print("Creating Flask app...")
#     app = create_app()
#     print("Flask app created successfully")

#     app.run(host='0.0.0.0', port=5002, debug=True)

app = create_app()

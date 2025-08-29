from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from .playlist import Playlist, PlaylistType

from database import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Can now be null for Google users
    password_hash = db.Column(db.String(128), nullable=True)

    # Google Auth fields (id, authentification)
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    auth_method = db.Column(db.String(20), nullable=False, default="email")

    is_admin = db.Column(db.Boolean, default=False, nullable=True)


    def __repr__(self):
        return f"<User {self.email}>"
    
    def to_dict(self):
        """Convert User to dictionary (no password)"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "auth_method": self.auth_method,
            "created_at": self.created_at,
            "is_admin": self.is_admin,
        }
    
def create_special_playlists_for_user(user_id):
    """Create special playlists for a new user"""
    special_playlists = [
        {
            'name': 'Liked Songs',
            'playlist_type': PlaylistType.LIKED_SONGS,
            'is_editable': False
        },
        {
            'name': 'Queue',
            'playlist_type': PlaylistType.QUEUE,
            'is_editable': False
        },
        {
            'name': 'Recently Played',
            'playlist_type': PlaylistType.RECENTLY_PLAYED,
            'is_editable': False
        }
    ]
    
    for playlist_data in special_playlists:
        playlist = Playlist(
            user_id=user_id,
            name=playlist_data['name'],
            playlist_type=playlist_data['playlist_type'],
            is_editable=playlist_data['is_editable']
        )
        db.session.add(playlist)
    
    db.session.commit()

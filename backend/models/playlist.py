from database import db
from enum import Enum

class PlaylistType(Enum):
    USER_CREATED = "user_created"
    LIKED_SONGS = "liked_songs" 
    QUEUE = "queue"
    RECENTLY_PLAYED = "recently_played"
    ALBUM = "album"
    SPOTIFY_CREATIONS = "spotify_creations"

class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(255))
    song_count = db.Column(db.Integer, default=0)  # Add this field
    playlist_type = db.Column(db.Enum(PlaylistType), default=PlaylistType.USER_CREATED)

    # Prevent modification of special playlists
    is_editable = db.Column(db.Boolean, default=True)
    
    # Many-to-many relationship through junction table
    songs = db.relationship('Song', 
                           secondary='playlist_songs',
                           backref='playlists',
                           lazy='dynamic')

class PlaylistSong(db.Model):
    __tablename__ = 'playlist_songs'
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), primary_key=True)
    position = db.Column(db.Integer)
    added_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_liked = db.Column(db.Boolean, default=False)
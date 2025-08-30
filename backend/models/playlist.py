from database import db
from enum import Enum

class LikedSong(db.Model):
    __tablename__ = 'liked_songs'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), primary_key=True)
    liked_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    __table_args__ = (
        db.Index('idx_user_liked_at', 'user_id', 'liked_at'),
    )

class QueueSong(db.Model):
    __tablename__ = 'queue_songs'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), primary_key=True)
    position = db.Column(db.Integer, primary_key=True)
    added_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Composite index for efficient sorting queries
    __table_args__ = (
        db.Index('idx_user_added_at', 'user_id', 'added_at'),
    )

class RecentlyPlayedSong(db.Model):
    __tablename__ = 'recently_played_songs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    played_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    __table_args__ = (
        db.Index('idx_user_played_at', 'user_id', 'played_at'),
    )

class PlaylistType(Enum):
    USER_CREATED = "user_created"
    CURATED_PLAYLIST = "curated_playlist"

class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(255))
    song_count = db.Column(db.Integer, default=0)  # Add this field
    playlist_type = db.Column(db.Enum(PlaylistType), default=PlaylistType.USER_CREATED)
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
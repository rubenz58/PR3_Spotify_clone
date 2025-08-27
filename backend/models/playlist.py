from database import db

# from models.user import User

class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(255))
    
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
# models/song.py
from database import db

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    album = db.Column(db.String(255))
    duration = db.Column(db.Integer)  # seconds
    track_number = db.Column(db.Integer)  # Add this line
    file_path = db.Column(db.String(500), nullable=False)  # e.g., "1.mp3"
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
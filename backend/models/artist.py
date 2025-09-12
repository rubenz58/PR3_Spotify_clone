# models/artist.py (or add to your existing models file)
from database import db

class Artist(db.Model):
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text)
    image_url = db.Column(db.String(512))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # Relationship to albums
    albums = db.relationship('Album', back_populates='artist_rel')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'bio': self.bio,
            'image_url': self.image_url
        }
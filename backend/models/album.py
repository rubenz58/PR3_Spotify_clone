from database import db

class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    release_date = db.Column(db.Date)
    genre = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # label = db.Column(db.String(255))
    # cover_image_url = db.Column(db.String(512))
    # total_duration = db.Column(db.Integer)  # seconds
    track_count = db.Column(db.Integer, default=0)
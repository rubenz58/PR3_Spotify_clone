from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    song = Song(
        title="A Girl (La La La)",
        artist="Artful Dodger", 
        album="Rave On",
        duration=43,
        file_path="artful_dodger/1.m4a"
    )
    db.session.add(song)
    db.session.commit()
    print("Successfully added one song.")
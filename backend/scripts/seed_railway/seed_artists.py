from database import db
from models.artist import Artist

def seed_artists():
    # Check if already seeded
    if Artist.query.first():
        print("Artists already exist, skipping...")
        return
    
    artists = [
        Artist(name="Iron Maiden", genre="Heavy Metal"),
        Artist(name="Metallica", genre="Thrash Metal"),
        Artist(name="Black Sabbath", genre="Heavy Metal"),
    ]
    
    db.session.add_all(artists)
    db.session.commit()
    print(f"✓ Added {len(artists)} artists")
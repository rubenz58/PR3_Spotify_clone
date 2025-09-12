# migration_script.py
from database import db
from app import create_app

from models.album import Album
from models.artist import Artist

app = create_app()

def migrate_artists():
    with app.app_context():
        # Get all unique artist names from albums
        existing_artists = db.session.query(Album.artist).distinct().all()
        
        for (artist_name,) in existing_artists:
            # Create artist if doesn't exist
            artist = Artist.query.filter_by(name=artist_name).first()
            if not artist:
                artist = Artist(name=artist_name)
                db.session.add(artist)
                db.session.flush()  # Get the ID
            
            # Update albums to reference the artist
            albums = Album.query.filter_by(artist=artist_name).all()
            for album in albums:
                album.artist_id = artist.id
        
        db.session.commit()
        print("Artist migration completed!")

if __name__ == '__main__':
    migrate_artists()
# scripts/seed_iron_maiden_album.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.album import Album
from models.song import Song
from models.artist import Artist

def seed_iron_maiden_album():
    app = create_app()
    with app.app_context():
        
        # Step 1: Create or get the artist FIRST
        artist = Artist.query.filter_by(name="Iron Maiden").first()
        if not artist:
            artist = Artist(
                name="Iron Maiden",
                genre="Heavy Metal"
            )
            db.session.add(artist)
            db.session.flush()  # Get the artist ID
            print(f"Created artist: {artist.name} (ID: {artist.id})")
        else:
            print(f"Artist already exists: {artist.name} (ID: {artist.id})")
        
        # Step 2: Create the album with artist_id
        album = Album.query.filter_by(title="Best Of", artist_id=artist.id).first()
        if album:
            print(f"Album '{album.title}' already exists, skipping...")
            return
        
        album = Album(
            title="Best Of",
            artist="Iron Maiden",  # String field for display
            artist_id=artist.id,   # FK relationship
            genre="Heavy Metal",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()  # Get the album ID
        print(f"Created album: {album.title} (ID: {album.id})")
        
        # Step 3: Create the songs linked to this album
        songs_data = [
            {
                'title': "Wasted Years",
                'duration': 65,
                'track_number': 1,
                'file_path': "iron_maiden/best_of/1_wasted_years.m4a"
            },
            {
                'title': "Hallowed Be Thy Name",
                'duration': 71,
                'track_number': 2,
                'file_path': "iron_maiden/best_of/2_hallowed_be_thy_name.m4a"
            },
            {
                'title': "The Trooper",
                'duration': 34,
                'track_number': 3,
                'file_path': "iron_maiden/best_of/3_the_trooper.m4a"
            },
            {
                'title': "Fear Of The Dark",
                'duration': 58,
                'track_number': 4,
                'file_path': "iron_maiden/best_of/4_fear_of_the_dark.m4a"
            }
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Iron Maiden",  # Artist string for display
                album_id=album.id,     # Link to album
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
            print(f"  Created song: {song.title} (Track {song.track_number})")
        
        db.session.add_all(songs)
        db.session.commit()
        
        print(f"\n✅ Successfully created:")
        print(f"   - Artist: {artist.name}")
        print(f"   - Album: {album.title}")
        print(f"   - {len(songs)} songs")
        
        # Verification
        print(f"\n📀 Album: {album.title} by {album.artist}")
        print(f"🎵 Songs:")
        for song in album.songs:
            print(f"   {song.track_number}. {song.title} ({song.duration}s)")

if __name__ == "__main__":
    seed_iron_maiden_album()
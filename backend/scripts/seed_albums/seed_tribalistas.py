# scripts/seed_tribalistas_album.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.album import Album
from models.song import Song

app = create_app()

with app.app_context():
    # Create the album first
    album = Album(
        title="Tribalistas",
        artist="Tribalistas",
        genre="Brazilian Pop",
        track_count=4
    )
    
    db.session.add(album)
    db.session.flush()  # Get the album ID
    
    print(f"Created album: {album.title} (ID: {album.id})")
    
    # Create the songs linked to this album
    songs_data = [
        {
            'title': "Carnavalia",
            'duration': 49,
            'track_number': 1,
            'file_path': "tribalistas/tribalistas/1_carnavalia.m4a"
        },
        {
            'title': "Um A Um",
            'duration': 39,
            'track_number': 2,
            'file_path': "tribalistas/tribalistas/2_um_a_um.m4a"
        },
        {
            'title': "Velha Infancia",
            'duration': 48,
            'track_number': 3,
            'file_path': "tribalistas/tribalistas/3_velha_infancia.m4a"
        },
        {
            'title': "Passe Em Casa",
            'duration': 58,
            'track_number': 4,
            'file_path': "tribalistas/tribalistas/4_passe_em_casa.m4a"
        }
    ]
    
    songs = []
    for song_data in songs_data:
        song = Song(
            title=song_data['title'],
            artist="Tribalistas",         # Artist stored on song for flexibility
            album_id=album.id,             # Link to album
            duration=song_data['duration'],
            track_number=song_data['track_number'],
            file_path=song_data['file_path']
        )
        songs.append(song)
        print(f"Created song: {song.title} (Track {song.track_number})")
    
    db.session.add_all(songs)
    db.session.commit()
    
    print(f"\nSuccessfully created album '{album.title}' with {len(songs)} songs!")
    
    # Verify the relationships work
    print(f"\nVerification:")
    print(f"Album: {album.title} by {album.artist}")
    print(f"Songs in album:")
    for song in album.songs:
        print(f"  {song.track_number}. {song.title} ({song.duration}s)")
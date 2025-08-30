# scripts/seed_manu_chao_album.py
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
        title="La Radiolina",
        artist="Manu Chao",
        genre="World Music",
        track_count=4
    )
    
    db.session.add(album)
    db.session.flush()  # Get the album ID
    
    print(f"Created album: {album.title} (ID: {album.id})")
    
    # Create the songs linked to this album
    songs_data = [
        {
            'title': "13 Dias",
            'duration': 29,
            'track_number': 1,
            'file_path': "manu_chao/la_radiolina/1_13_dias.m4a"
        },
        {
            'title': "Tristeza Maleza",
            'duration': 24,
            'track_number': 2,
            'file_path': "manu_chao/la_radiolina/2_tristeza_maleza.m4a"
        },
        {
            'title': "Besoin De La Lune",
            'duration': 19,
            'track_number': 3,
            'file_path': "manu_chao/la_radiolina/3_besoin_de_la_lune.m4a"
        },
        {
            'title': "El Kitapena",
            'duration': 17,
            'track_number': 4,
            'file_path': "manu_chao/la_radiolina/4_el_kitapena.m4a"
        }
    ]
    
    songs = []
    for song_data in songs_data:
        song = Song(
            title=song_data['title'],
            artist="Manu Chao",       # Artist stored on song for flexibility
            album_id=album.id,        # Link to album
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
# scripts/seed_mina_album.py
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
        title="Studio Uno 66",
        artist="Mina",
        genre="Italian Pop",
        track_count=4
    )
    
    db.session.add(album)
    db.session.flush()  # Get the album ID
    
    print(f"Created album: {album.title} (ID: {album.id})")
    
    # Create the songs linked to this album
    songs_data = [
        {
            'title': "Se Telefonando",
            'duration': 30,
            'track_number': 1,
            'file_path': "mina/studio_uno_66/1_se_telefonando.m4a"
        },
        {
            'title': "Mi Sei Scoppiato Dentro Al Cuore",
            'duration': 45,
            'track_number': 2,
            'file_path': "mina/studio_uno_66/2_mi_sei_scoppiato_dentro_al_cuore.m4a"
        },
        {
            'title': "Una Casa In Cima Al Mondo",
            'duration': 32,
            'track_number': 3,
            'file_path': "mina/studio_uno_66/3_una_casa_in_cima_al_mondo.m4a"
        },
        {
            'title': "Addio",
            'duration': 17,
            'track_number': 4,  # Fixed: was 31, should be 4
            'file_path': "mina/studio_uno_66/4_addio.m4a"
        }
    ]
    
    songs = []
    for song_data in songs_data:
        song = Song(
            title=song_data['title'],
            artist="Mina",               # Artist stored on song for flexibility
            album_id=album.id,            # Link to album
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
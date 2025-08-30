# scripts/seed_neil_young_album.py
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
        title="Harvest",
        artist="Neil Young",
        genre="Folk Rock",
        track_count=4
    )
    
    db.session.add(album)
    db.session.flush()  # Get the album ID
    
    print(f"Created album: {album.title} (ID: {album.id})")
    
    # Create the songs linked to this album
    songs_data = [
        {
            'title': "Out On The Weekend",
            'duration': 65,
            'track_number': 1,
            'file_path': "neil_young/harvest/1_out_on_the_weekend.m4a"
        },
        {
            'title': "Harvest",
            'duration': 39,
            'track_number': 2,
            'file_path': "neil_young/harvest/2_harvest.m4a"
        },
        {
            'title': "A Man Needs A Maid",
            'duration': 40,
            'track_number': 3,
            'file_path': "neil_young/harvest/3_a_man_needs_a_maid.m4a"
        },
        {
            'title': "Heart Of Gold",
            'duration': 42,
            'track_number': 4,
            'file_path': "neil_young/harvest/4_heart_of_gold.m4a"
        }
    ]
    
    songs = []
    for song_data in songs_data:
        song = Song(
            title=song_data['title'],
            artist="Neil Young",           # Artist stored on song for flexibility
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
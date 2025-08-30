# scripts/create_driving_playlist.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong

app = create_app()
with app.app_context():
    playlist = Playlist(
        user_id=4, # REPLACE WITH TARGET USER ID
        name="Summer"
    )
    
    db.session.add(playlist)
    db.session.flush()  # Get the playlist ID before committing
    
    # Add songs to playlist with positions
    song_ids = [21, 1, 13, 2, 6, 17]  # Replace with actual song IDs
    
    for position, song_id in enumerate(song_ids, 1):
        playlist_song = PlaylistSong(
            playlist_id=playlist.id,
            song_id=song_id,
            position=position
        )
        db.session.add(playlist_song)
    
    db.session.commit()
    print(f"Successfully created 'Summer' playlist with {len(song_ids)} songs")
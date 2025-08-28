# scripts/create_driving_playlist.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong

app = create_app()
with app.app_context():
    # Create the playlist (replace user_id=1 with actual user ID)
    playlist = Playlist(
        user_id=2, 
        name="Party"
    )
    
    db.session.add(playlist)
    db.session.flush()  # Get the playlist ID before committing
    
    # Add songs to playlist with positions
    song_ids = [7, 25, 18, 23, 9, 11, 14, 4, 24]
    
    for position, song_id in enumerate(song_ids, 1):
        playlist_song = PlaylistSong(
            playlist_id=playlist.id,
            song_id=song_id,
            position=position
        )
        db.session.add(playlist_song)
    
    db.session.commit()
    print(f"Successfully created 'Driving' playlist with {len(song_ids)} songs")
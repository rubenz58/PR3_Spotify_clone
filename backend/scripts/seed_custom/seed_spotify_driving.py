# scripts/seed_discover_weekly_playlist.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong, PlaylistType

app = create_app()

with app.app_context():
    # Create the curated playlist
    playlist = Playlist(
        user_id=None,  # System-owned curated playlist
        name="Spotify Driving",
        song_count=10,
        playlist_type=PlaylistType.CURATED_PLAYLIST,  # or SPOTIFY_CREATIONS
        is_editable=False,
        # description="Your weekly mix of fresh finds and deep cuts",
        # creator_name="Spotify",
        # is_public=True
    )
    
    db.session.add(playlist)
    db.session.flush()  # Get the playlist ID before committing
    
    # Add your song IDs here - replace these with actual song IDs from your database
    song_ids = [
        32,
        47,
        37,
        31,
        36,
        28,
        35,
        34,
        42,
        40 
    ]
    
    for position, song_id in enumerate(song_ids, 1):
        playlist_song = PlaylistSong(
            playlist_id=playlist.id,
            song_id=song_id,
            position=position
        )
        db.session.add(playlist_song)
    
    db.session.commit()
    print(f"Successfully created '{playlist.name}' curated playlist with {len(song_ids)} songs")
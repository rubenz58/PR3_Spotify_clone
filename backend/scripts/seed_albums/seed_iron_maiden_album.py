import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong, PlaylistType

app = create_app()
with app.app_context():
    album = Playlist(
        user_id=None,
        name="Born To Die",
        song_count=4,
        playlist_type=PlaylistType.ALBUM,
        is_editable=False,
    )
    db.session.add(album)
    db.session.flush() # Get the playlist ID before committing
    
    # Add songs to playlist with positions
    song_ids = [6, 7, 8, 9]
    for position, song_id in enumerate(song_ids, 1):
        album_song = PlaylistSong(
            playlist_id=album.id,
            song_id=song_id,
            position=position
        )
        db.session.add(album_song)
    
    db.session.commit()
    print(f"Successfully created 'Born To Die' album with {len(song_ids)} songs")  # Fix: Updated print message
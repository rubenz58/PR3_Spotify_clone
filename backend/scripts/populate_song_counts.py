import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong

app = create_app()
with app.app_context():
    playlists = Playlist.query.all()
    
    for playlist in playlists:
        count = PlaylistSong.query.filter_by(playlist_id=playlist.id).count()
        playlist.song_count = count
        print(f"Playlist '{playlist.name}': {count} songs")
    
    db.session.commit()
    print("Song counts updated for all playlists")
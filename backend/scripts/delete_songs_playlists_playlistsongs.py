# scripts/delete_all_entries.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.playlist import Playlist, PlaylistSong
from models.song import Song

app = create_app()

with app.app_context():
    print("Starting deletion of all entries...")
    
    # Get counts before deletion for confirmation
    playlist_songs_count = PlaylistSong.query.count()
    playlists_count = Playlist.query.count()
    songs_count = Song.query.count()
    
    print(f"Found {playlist_songs_count} playlist_songs entries")
    print(f"Found {playlists_count} playlists entries") 
    print(f"Found {songs_count} songs entries")
    
    if playlist_songs_count == 0 and playlists_count == 0 and songs_count == 0:
        print("No entries found to delete.")
    else:
        # Delete in proper order to respect foreign key constraints
        
        # 1. Delete all playlist_songs first (has foreign keys to both playlists and songs)
        print("\nDeleting all playlist_songs entries...")
        db.session.query(PlaylistSong).delete()
        print("✓ All playlist_songs entries deleted")
        
        # 2. Delete all playlists 
        print("Deleting all playlists entries...")
        db.session.query(Playlist).delete()
        print("✓ All playlists entries deleted")
        
        # 3. Delete all songs
        print("Deleting all songs entries...")
        db.session.query(Song).delete() 
        print("✓ All songs entries deleted")
        
        # Commit all deletions
        db.session.commit()
        print("\n🎉 Successfully deleted all entries from songs, playlists, and playlist_songs tables!")
        
        # Verify deletion
        print("\nVerifying deletion...")
        print(f"Remaining playlist_songs: {PlaylistSong.query.count()}")
        print(f"Remaining playlists: {Playlist.query.count()}")
        print(f"Remaining songs: {Song.query.count()}")
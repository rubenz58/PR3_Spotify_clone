# SEEDS ALBUM and SONGS
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
        title="Born To Die",
        artist="Lana Del Rey",
        genre="Alternative",
        track_count=4
    )
    
    db.session.add(album)
    db.session.flush()  # Get the album ID
    
    print(f"Created album: {album.title} (ID: {album.id})")
    
    # Create the songs linked to this album
    songs_data = [
        {
            'title': "Born To Die",
            'duration': 55,
            'track_number': 1,
            'file_path': "lana_del_rey/born_to_die/1_born_to_die.m4a"
        },
        {
            'title': "Off To The Races",
            'duration': 66,
            'track_number': 2,
            'file_path': "lana_del_rey/born_to_die/2_off_to_the_races.m4a"
        },
        {
            'title': "Blue Jeans",
            'duration': 52,
            'track_number': 3,
            'file_path': "lana_del_rey/born_to_die/3_blue_jeans.m4a"
        },
        {
            'title': "Video Games",
            'duration': 62,
            'track_number': 4,
            'file_path': "lana_del_rey/born_to_die/4_video_games.m4a"
        }
    ]
    
    songs = []
    for song_data in songs_data:
        song = Song(
            title=song_data['title'],
            artist="Lana Del Rey",  # Artist stored on song for flexibility
            album_id=album.id,      # Link to album
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
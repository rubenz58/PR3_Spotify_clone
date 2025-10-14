from flask import Blueprint, jsonify

from ..authentification.middleware import jwt_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET'])
# @jwt_required
# @admin_required
def admin_home():
    
    return jsonify({'admin': "true"})
    

@admin_bp.route('/seed-iron-maiden', methods=['POST'])
def seed_iron_maiden_route():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Iron Maiden").first()
        if not artist:
            artist = Artist(
                name="Iron Maiden",
                genre="Heavy Metal"
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Best Of", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Best Of",
            artist="Iron Maiden",
            artist_id=artist.id,
            genre="Heavy Metal",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
            {'title': "Wasted Years", 'duration': 65, 'track_number': 1, 'file_path': "iron_maiden/best_of/1_wasted_years.m4a"},
            {'title': "Hallowed Be Thy Name", 'duration': 71, 'track_number': 2, 'file_path': "iron_maiden/best_of/2_hallowed_be_thy_name.m4a"},
            {'title': "The Trooper", 'duration': 34, 'track_number': 3, 'file_path': "iron_maiden/best_of/3_the_trooper.m4a"},
            {'title': "Fear Of The Dark", 'duration': 58, 'track_number': 4, 'file_path': "iron_maiden/best_of/4_fear_of_the_dark.m4a"}
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Iron Maiden",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Iron Maiden album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
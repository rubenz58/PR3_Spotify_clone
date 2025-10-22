from flask import Blueprint, jsonify, request, g, send_from_directory
from database import db
from models.album import Album
from models.playlist import Playlist, PlaylistSong
from models.song import Song
from ..authentification.middleware import jwt_required
import os

albums_bp = Blueprint('albums', __name__)

@albums_bp.route('/', methods=['GET'])
@jwt_required
def get_all_albums():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/albums/")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Query all albums ordered by most recent first
    albums_query = Album.query.order_by(Album.created_at.desc()).all()
    
    # Format response - return array of albums
    result = []
    for album in albums_query:
        result.append({
            'id': album.id,
            'title': album.title,
            'artist': album.artist,
            'release_date': album.release_date.isoformat() if album.release_date else None,
            'genre': album.genre,
            'cover_image_url': f"{os.environ.get('R2_PUBLIC_URL')}/album_images/{album.cover_image_url}",
            'track_count': album.track_count,
            'created_at': album.created_at.isoformat() if album.created_at else None
        })
    
    return jsonify({
        'albums': result,
        'count': len(result)
    })


@albums_bp.route('/<int:album_id>', methods=['GET'])
@jwt_required
def get_songs_of_album(album_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/albums/{album_id}")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Query the specific album by ID
    album = Album.query.get(album_id)
    
    if not album:
        return jsonify({'error': 'Album not found'}), 404
    
    # Get all songs for this album
    songs = Song.query.filter_by(album_id=album_id).order_by(Song.track_number).all()
    
    # Format songs data
    songs_data = []
    for song in songs:
        songs_data.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': album.title,
            'duration': song.duration,
            'track_number': song.track_number if hasattr(song, 'track_number') else None,
            'file_path': song.file_path,
            'audio_source': f"{os.environ.get('R2_PUBLIC_URL')}/audio_files/{song.file_path}"
        })
    
    # Format album response with songs
    album_data = {
        'id': album.id,
        'title': album.title,
        'artist': album.artist,
        'release_date': album.release_date.isoformat() if album.release_date else None,
        'genre': album.genre,
        'cover_image_url': album.cover_image_url,
        'track_count': album.track_count,
        'created_at': album.created_at.isoformat() if album.created_at else None,
        'songs': songs_data
    }
    
    return jsonify({
        'album': album_data,
        'songs_count': len(songs_data)
    })


@albums_bp.route('/images/<path:filename>')
def serve_album_image(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
    album_images_dir = os.path.join(backend_dir, 'album_images')

    # album_images_dir = os.path.join(os.path.dirname(__file__), 'album_images')

    print(f"Serving album image: {filename}")
    print(f"From directory: {album_images_dir}")
    
    return send_from_directory(album_images_dir, filename)
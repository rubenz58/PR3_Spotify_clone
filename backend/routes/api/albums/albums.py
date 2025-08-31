from flask import Blueprint, jsonify, request, g
from database import db
from models.album import Album
from models.playlist import Playlist, PlaylistSong
from models.song import Song
from ..authentification.middleware import jwt_required

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
            'cover_image_url': album.cover_image_url,
            'track_count': album.track_count,
            'created_at': album.created_at.isoformat() if album.created_at else None
        })
    
    return jsonify({
        'albums': result,
        'count': len(result)
    })
from flask import Blueprint, jsonify, request
from database import db
from models.playlist import Playlist, PlaylistSong
from ..authentification.middleware import jwt_required
from ..authentification.utils import decode_token_from_header

playlists_bp = Blueprint('playlists', __name__)

# Using <user_id> for testing. Will be extracted from JWT directly
# @playlists_bp.route('/', methods=['GET'])
@playlists_bp.route('/<int:user_id>', methods=['GET'])
# @jwt_required
def get_playlists_of_user(user_id):
    # 1. Get user_id from JWT
    # user_id  = decode_token_from_header(request)

    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # 2. Query playlists for matching user_id
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    
    # Format response
    result = []
    for playlist in playlists:
        result.append({
            'id': playlist.id,
            'name': playlist.name,
            'song_count': playlist.song_count,
            # 'created_at': playlist.created_at.isoformat() if playlist.created_at else None
        })
    
    return jsonify({'playlists': result})
    
from flask import Blueprint, jsonify, request
from database import db
from models.playlist import Playlist, PlaylistSong
from models.song import Song
from ..authentification.middleware import jwt_required
from ..authentification.utils import decode_token_from_header

playlists_bp = Blueprint('playlists', __name__)

# Using <user_id> for testing. Will be extracted from JWT directly
# @playlists_bp.route('/', methods=['GET'])
@playlists_bp.route('/<int:user_id>', methods=['GET'])
# @jwt_required
def get_all_playlists_of_user(user_id):
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


@playlists_bp.route('/<int:user_id>/<int:playlist_id>/songs', methods=['GET'])
# @jwt_required
def get_songs_of_playlist(user_id, playlist_id):  # Add playlist_id parameter
    # 1. Get user_id from JWT
    # user_id = decode_token_from_header(request)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # 2. Query playlistsongs to get all the songs from the
    # specific playlist in the order of their 'position'
    songs = db.session.query(Song, PlaylistSong.position)\
        .join(PlaylistSong, Song.id == PlaylistSong.song_id)\
        .filter(PlaylistSong.playlist_id == playlist_id)\
        .order_by(PlaylistSong.position)\
        .all()
    
    # Format response
    result = []
    for song, position in songs:
        result.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'duration': song.duration,
            'track_number': song.track_number,
            'position': position,
            'file_path': song.file_path
        })
    
    return jsonify({'songs': result})
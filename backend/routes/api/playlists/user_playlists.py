from flask import Blueprint, jsonify, request, g
from database import db
from models.playlist import Playlist, PlaylistSong, LikedSong, QueueSong, RecentlyPlayedSong
from models.song import Song
from ..authentification.middleware import jwt_required
from ..authentification.utils import decode_token_from_header

user_playlists_bp = Blueprint('user_playlists', __name__)

@user_playlists_bp.route('/liked_songs', methods=['GET'])
@jwt_required
def get_liked_songs():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/liked_songs")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Query liked songs for the user, joined with song details
    # Order by most recently liked first
    liked_songs_query = db.session.query(
        LikedSong, Song
    ).join(
        Song, LikedSong.song_id == Song.id
    ).filter(
        LikedSong.user_id == user_id
    ).order_by(
        LikedSong.liked_at.desc()
    ).all()
    
    # Format response - return array of songs with liked_at timestamp
    result = []
    for liked_song, song in liked_songs_query:
        result.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'duration': song.duration,
            'file_path': song.file_path,
            'liked_at': liked_song.liked_at.isoformat() if liked_song.liked_at else None
        })
    
    return jsonify({
        'liked_songs': result,
        'count': len(result)
    })
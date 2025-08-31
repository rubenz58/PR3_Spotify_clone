from flask import Blueprint, jsonify, request, g
from database import db
from models.playlist import Playlist, PlaylistSong, LikedSong, QueueSong, RecentlyPlayedSong
from models.song import Song
from ..authentification.middleware import jwt_required
from ..authentification.utils import decode_token_from_header

user_playlists_bp = Blueprint('user_playlists', __name__)

@user_playlists_bp.route('/liked-songs', methods=['GET'])
@jwt_required
def get_liked_songs():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/liked-songs")
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


@user_playlists_bp.route('/queue', methods=['GET'])
@jwt_required
def get_queue_songs():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/queue")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    print("/api/user_playlists/queue: valid token")
    
    # Query queue songs for the user, joined with song details
    # Order by position (queue order), then by added_at
    queue_songs_query = db.session.query(
        QueueSong, Song
    ).join(
        Song, QueueSong.song_id == Song.id
    ).filter(
        QueueSong.user_id == user_id
    ).order_by(
        QueueSong.position.asc(),  # Fixed: Use position for queue ordering
        QueueSong.added_at.asc()   # Fixed: Use added_at, not liked_at
    ).all()
    
    # Format response - return array of songs with queue metadata
    result = []
    for queue_song, song in queue_songs_query:
        result.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'duration': song.duration,
            'file_path': song.file_path,
            'position': queue_song.position,  # Fixed: Use position instead of liked_at
            'added_at': queue_song.added_at.isoformat() if queue_song.added_at else None
        })
    
    return jsonify({
        'queue_songs': result,
        'count': len(result)
    })

@user_playlists_bp.route('/recently-played', methods=['GET'])
@jwt_required
def get_recently_played_songs():  # Fixed function name
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/recently-played")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Query recently played songs for the user, joined with song details
    # Order by most recently played first
    recently_played_songs_query = db.session.query(
        RecentlyPlayedSong, Song
    ).join(
        Song, RecentlyPlayedSong.song_id == Song.id
    ).filter(
        RecentlyPlayedSong.user_id == user_id
    ).order_by(
        RecentlyPlayedSong.played_at.desc()  # Fixed: Use played_at, not liked_at
    ).all()
    
    # Format response - return array of songs with played_at timestamp
    result = []
    for recently_played_song, song in recently_played_songs_query:
        result.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'duration': song.duration,
            'file_path': song.file_path,
            'played_at': recently_played_song.played_at.isoformat() if recently_played_song.played_at else None  # Fixed: Use played_at
        })
    
    return jsonify({
        'recently_played_songs': result,
        'count': len(result)
    })
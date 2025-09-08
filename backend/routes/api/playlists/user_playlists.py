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
            'album': song.album.title,
            'duration': song.duration,
            'file_path': song.file_path,
            'liked_at': liked_song.liked_at.isoformat() if liked_song.liked_at else None
        })
    
    return jsonify({
        'liked_songs': result,
        'count': len(result)
    })

@user_playlists_bp.route('/liked-songs/<int:song_id>', methods=['POST'])
@jwt_required
def add_liked_song(song_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/user_playlists/liked-songs/{song_id} - POST")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Check if song exists
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    # Check if already liked
    existing_like = LikedSong.query.filter_by(
        user_id=user_id, 
        song_id=song_id
    ).first()
    
    if existing_like:
        return jsonify({'error': 'Song already liked'}), 409
    
    # Add to liked songs
    liked_song = LikedSong(user_id=user_id, song_id=song_id)
    db.session.add(liked_song)
    db.session.commit()
    
    # Return the full song data for frontend state management
    song_data = {
        'id': song.id,
        'title': song.title,
        'artist': song.artist,
        'album': song.album.title if song.album else None,
        'duration': song.duration,
        'file_path': song.file_path,
        'liked_at': liked_song.liked_at.isoformat() if liked_song.liked_at else None
    }
    
    return jsonify({
        'message': 'Song added to liked songs',
        'song': song_data
    }), 201

@user_playlists_bp.route('/liked-songs/<int:song_id>', methods=['DELETE'])
@jwt_required
def remove_liked_song(song_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/user_playlists/liked-songs/{song_id} - DELETE")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Find and remove the liked song
    liked_song = LikedSong.query.filter_by(
        user_id=user_id, 
        song_id=song_id
    ).first()
    
    if not liked_song:
        return jsonify({'error': 'Song not found in liked songs'}), 404
    
    db.session.delete(liked_song)
    db.session.commit()
    
    return jsonify({
        'message': 'Song removed from liked songs',
        'song_id': song_id
    }), 200


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
            'album': song.album.title,
            'duration': song.duration,
            'file_path': song.file_path,
            'position': queue_song.position,  # Fixed: Use position instead of liked_at
            'added_at': queue_song.added_at.isoformat() if queue_song.added_at else None
        })
    
    return jsonify({
        'queue_songs': result,
        'count': len(result)
    })

@user_playlists_bp.route('/queue/<int:song_id>', methods=['POST'])
@jwt_required
def add_to_queue(song_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/user_playlists/queue/{song_id} - POST")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Check if song exists
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    # Check if already in queue
    existing_queue_item = QueueSong.query.filter_by(
        user_id=user_id, 
        song_id=song_id
    ).first()
    
    if existing_queue_item:
        return jsonify({'error': 'Song already in queue'}), 409
    
    # Get the next position in queue (last position + 1)
    max_position = db.session.query(db.func.max(QueueSong.position))\
        .filter_by(user_id=user_id).scalar()
    next_position = (max_position or 0) + 1
    
    # Add to queue
    queue_song = QueueSong(
        user_id=user_id, 
        song_id=song_id, 
        position=next_position
    )
    db.session.add(queue_song)
    db.session.commit()
    
    # Return the full song data for frontend state management
    song_data = {
        'id': song.id,
        'title': song.title,
        'artist': song.artist,
        'album': song.album.title if song.album else None,
        'duration': song.duration,
        'file_path': song.file_path,
        'position': queue_song.position,
        'added_at': queue_song.added_at.isoformat() if queue_song.added_at else None
    }
    
    return jsonify({
        'message': 'Song added to queue',
        'song': song_data
    }), 201

@user_playlists_bp.route('/queue/<int:song_id>', methods=['DELETE'])
@jwt_required
def remove_from_queue(song_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/user_playlists/queue/{song_id} - DELETE")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Find and remove the queue song
    queue_song = QueueSong.query.filter_by(
        user_id=user_id, 
        song_id=song_id
    ).first()
    
    if not queue_song:
        return jsonify({'error': 'Song not found in queue'}), 404
    
    removed_position = queue_song.position
    db.session.delete(queue_song)
    
    # Reorder remaining queue items (shift positions down)
    remaining_songs = QueueSong.query.filter(
        QueueSong.user_id == user_id,
        QueueSong.position > removed_position
    ).all()
    
    for song in remaining_songs:
        song.position -= 1
    
    db.session.commit()
    
    return jsonify({
        'message': 'Song removed from queue',
        'song_id': song_id
    }), 200

@user_playlists_bp.route('/queue', methods=['DELETE'])
@jwt_required
def clear_queue():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/queue - DELETE (clear all)")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Delete all queue songs for the user
    deleted_count = QueueSong.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({
        'message': f'Queue cleared - {deleted_count} songs removed',
        'deleted_count': deleted_count
    }), 200

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
            'album': song.album.title,
            'duration': song.duration,
            'file_path': song.file_path,
            'played_at': recently_played_song.played_at.isoformat() if recently_played_song.played_at else None  # Fixed: Use played_at
        })
    
    return jsonify({
        'recently_played_songs': result,
        'count': len(result)
    })


@user_playlists_bp.route('/recently-played/<int:song_id>', methods=['POST'])
@jwt_required
def add_recently_played_song(song_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    print(f"/api/user_playlists/recently-played/{song_id} - POST")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Check if song exists
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    # Check if already in recently played
    existing_entry = RecentlyPlayedSong.query.filter_by(
        user_id=user_id, 
        song_id=song_id
    ).first()
    
    if existing_entry:
        # Update the played_at timestamp to move it to the front
        existing_entry.played_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Recently played song updated',
            'song_id': song_id,
            'action': 'updated'
        }), 200
    else:
        # Add new entry
        recently_played = RecentlyPlayedSong(
            user_id=user_id, 
            song_id=song_id
        )
        db.session.add(recently_played)
        db.session.commit()
        
        return jsonify({
            'message': 'Song added to recently played',
            'song_id': song_id,
            'action': 'added'
        }), 201
    
@user_playlists_bp.route('/recently-played', methods=['DELETE'])
@jwt_required
def clear_recently_played():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("/api/user_playlists/recently-played - DELETE (clear all)")
    user_id = g.current_user_id
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Delete all recently played songs for the user
    deleted_count = RecentlyPlayedSong.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({
        'message': f'Recently played history cleared - {deleted_count} songs removed',
        'deleted_count': deleted_count
    }), 200
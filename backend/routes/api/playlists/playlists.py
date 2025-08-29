from flask import Blueprint, jsonify, request, g
from database import db
from models.playlist import Playlist, PlaylistSong
from models.song import Song
from ..authentification.middleware import jwt_required
from ..authentification.utils import decode_token_from_header

playlists_bp = Blueprint('playlists', __name__)

# Using <user_id> for testing. Will be extracted from JWT directly
@playlists_bp.route('/', methods=['GET'])
# @playlists_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required
def get_all_playlists_of_user():
    if request.method == 'OPTIONS':
        return '', 200
    # 1. Get user_id from JWT
    # user_id  = decode_token_from_header(request)
    # user_id = 2
    print("/api/playlists")
    user_id = g.current_user_id


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

# Create New Playlist
@playlists_bp.route('/', methods=['POST'])
@jwt_required
def create_playlist():
    user_id = g.current_user_id
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Playlist name required'}), 400
    
    new_playlist = Playlist(
        user_id=user_id,
        name=data['name'],
        song_count=0
    )
    
    db.session.add(new_playlist)
    db.session.commit()
    
    return jsonify({
        'playlist': {
            'id': new_playlist.id,
            'name': new_playlist.name,
            'song_count': new_playlist.song_count
        }
    })

# Delete Playlist
@playlists_bp.route('/<int:playlist_id>', methods=['DELETE'])
@jwt_required
def delete_playlist(playlist_id):
    user_id = g.current_user_id
    
    # Find playlist and verify ownership
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({'error': 'Playlist not found or unauthorized'}), 404
    
    # Delete all playlist-song relationships first (foreign key constraint)
    PlaylistSong.query.filter_by(playlist_id=playlist_id).delete()
    
    # Delete the playlist
    db.session.delete(playlist)
    db.session.commit()
    
    return jsonify({'message': 'Playlist deleted successfully'})

# Modify Playlist Name
@playlists_bp.route('/<int:playlist_id>', methods=['PUT'])
@jwt_required
def rename_playlist(playlist_id):
    user_id = g.current_user_id
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Playlist name required'}), 400
    
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({'error': 'Playlist not found or unauthorized'}), 404
    
    playlist.name = data['name']
    db.session.commit()
    
    return jsonify({
        'playlist': {
            'id': playlist.id,
            'name': playlist.name,
            'song_count': playlist.song_count
        }
    })


@playlists_bp.route('/<int:playlist_id>/songs', methods=['GET'])
@jwt_required
def get_songs_of_playlist(playlist_id):
    # 1. Get user_id from JWT saved to global g
    user_id = g.current_user_id

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


@playlists_bp.route('/<int:playlist_id>/songs/<int:song_id>', methods=['DELETE'])
@jwt_required
def remove_song_from_playlist(playlist_id, song_id):
    user_id = g.current_user_id
    
    # Verify playlist ownership
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({'error': 'Playlist not found or unauthorized'}), 404
    
    # Find the playlist-song entry to remove
    playlist_song = PlaylistSong.query.filter_by(
        playlist_id=playlist_id, 
        song_id=song_id
    ).first()
    
    if not playlist_song:
        return jsonify({'error': 'Song not found in playlist'}), 404
    
    removed_position = playlist_song.position
    
    # Remove the song from playlist
    db.session.delete(playlist_song)
    
    # Update positions of all songs that came after the removed song
    PlaylistSong.query.filter(
        PlaylistSong.playlist_id == playlist_id,
        PlaylistSong.position > removed_position
    ).update({
        PlaylistSong.position: PlaylistSong.position - 1
    })
    
    # Update playlist song count
    playlist.song_count -= 1
    
    db.session.commit()
    
    return jsonify({'message': 'Song removed from playlist successfully'})

@playlists_bp.route('/<int:playlist_id>/songs', methods=['POST'])
@jwt_required
def add_song_to_playlist(playlist_id):
    user_id = g.current_user_id
    data = request.get_json()
    
    if not data or not data.get('song_id'):
        return jsonify({'error': 'Song ID required'}), 400
    
    song_id = data['song_id']
    
    # Verify playlist ownership
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({'error': 'Playlist not found or unauthorized'}), 404
    
    # Check if song exists
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    # Check if song is already in playlist
    existing = PlaylistSong.query.filter_by(
        playlist_id=playlist_id, 
        song_id=song_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Song already in playlist'}), 409
    
    # Get the next position (max position + 1)
    max_position = db.session.query(db.func.max(PlaylistSong.position))\
        .filter(PlaylistSong.playlist_id == playlist_id)\
        .scalar()
    
    next_position = (max_position or 0) + 1
    
    # Add song to playlist
    playlist_song = PlaylistSong(
        playlist_id=playlist_id,
        song_id=song_id,
        position=next_position
    )
    
    db.session.add(playlist_song)
    
    # Update playlist song count
    playlist.song_count += 1
    
    db.session.commit()
    
    return jsonify({'message': 'Song added to playlist successfully'})
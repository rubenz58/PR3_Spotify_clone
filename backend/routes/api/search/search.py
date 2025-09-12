from flask import Blueprint, jsonify, request, g
from database import db
from models.song import Song
from models.album import Album
from models.artist import Artist
from ..authentification.middleware import jwt_required
# from ..authentification.utils import decode_token_from_header

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['GET'])
@jwt_required
def search():
    if request.method == 'OPTIONS':
        return '', 200
    
    query = request.args.get('q', '')
    if not query:
        return jsonify({
            'songs': [],
            'albums': [],
            'artists': []
        })
    
    print(f"Searching for: {query}")
    
    try:
        # Search songs by title
        songs = Song.query.filter(Song.title.ilike(f'%{query}%')).all()
        
        # Search albums by title
        albums = Album.query.filter(Album.title.ilike(f'%{query}%')).all()
        
        # Search artists by name
        artists = Artist.query.filter(Artist.name.ilike(f'%{query}%')).all()
        
        # Format response
        songs_data = []
        for song in songs:
            songs_data.append({
                'id': song.id,
                'title': song.title,
                'artist': song.artist,
                'album_id': song.album_id,
                'duration': song.duration
            })
        
        albums_data = []
        for album in albums:
            albums_data.append({
                'id': album.id,
                'title': album.title,
                'artist': album.artist,
                'cover_image_url': album.cover_image_url,
                'track_count': album.track_count
            })
        
        artists_data = []
        for artist in artists:
            artists_data.append({
                'id': artist.id,
                'name': artist.name,
                'bio': artist.bio,
                'image_url': artist.image_url
            })
        
        return jsonify({
            'songs': songs_data,
            'albums': albums_data,
            'artists': artists_data
        })
        
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({'error': 'Search failed'}), 500
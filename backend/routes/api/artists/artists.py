from flask import Blueprint, jsonify, request, g
from database import db
from models.artist import Artist
from ..authentification.middleware import jwt_required

artists_bp = Blueprint('artists', __name__)

@artists_bp.route('/<int:artist_id>')
def get_artist(artist_id):
    print(f"/api/artists/{artist_id}")

    artist = Artist.query.get_or_404(artist_id)

    print(artist)
    
    # Using the relationship we defined
    albums = artist.albums  # This uses the relationship
    
    return jsonify({
        'id': artist.id,
        'name': artist.name,
        'bio': artist.bio,
        'image_url': artist.image_url,
        'created_at': artist.created_at.isoformat() if artist.created_at else None,
        'albums': [
            {
                'id': album.id,
                'title': album.title,
                'release_date': album.release_date.isoformat() if album.release_date else None,
                'genre': album.genre,
                'cover_image_url': album.cover_image_url,
                'track_count': album.track_count
            }
            for album in albums
        ]
    })
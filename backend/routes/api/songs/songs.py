from flask import Blueprint, jsonify
from models.song import Song

songs_bp = Blueprint('songs', __name__)

@songs_bp.route('/', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    songs_list = []
    for song in songs:
        songs_list.append({
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'duration': song.duration
        })
    
    return jsonify({'songs': songs_list})
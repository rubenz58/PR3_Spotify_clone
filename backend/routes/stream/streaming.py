from flask import Blueprint, send_file
from models.song import Song
import os

streaming_bp = Blueprint('streaming', __name__)

@streaming_bp.route('/songs/<int:song_id>')
def stream_song(song_id):
    # Look up song in database
    song = Song.query.get_or_404(song_id)
    
    # Build path to audio file
    file_path = os.path.join('audio_files', song.file_path)
    
    # Check if file exists
    if not os.path.exists(file_path):
        return {"error": "Audio file not found"}, 404
    
    # Serve the file
    # Actually sending the audio bytes.
    return send_file(file_path, mimetype='audio/mpeg')
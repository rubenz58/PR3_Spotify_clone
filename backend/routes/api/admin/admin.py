from flask import Blueprint, jsonify

from ..authentification.middleware import jwt_required, admin_required

from ....scripts.seed_songs.seed_iron_maiden import seed_iron_maiden

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET'])
@jwt_required
@admin_required
def admin_home():
    
    return jsonify({'admin': "true"})


@admin_bp.route('/seed-iron-maiden', methods=['POST'])
def seed_iron_maiden():
    # from models.song import Song
    # from database import db

    seed_iron_maiden()
    
    
    return {'message': 'Successfully seeded Iron Maiden songs'}
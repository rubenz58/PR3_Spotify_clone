from flask import Blueprint, jsonify

from ..authentification.middleware import jwt_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET'])
@jwt_required
@admin_required
def admin_home():
    
    return jsonify({'admin': "true"})
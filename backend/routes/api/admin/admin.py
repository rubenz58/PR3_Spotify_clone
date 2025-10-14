from flask import Blueprint, jsonify

from ..authentification.middleware import jwt_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET'])
# @jwt_required
# @admin_required
def admin_home():
    
    return jsonify({'admin': "true"})


# @admin_bp.route('/seed-iron-maiden', methods=['POST'])
# def seed_iron_maiden():
#     try:
#         from models.song import Song
#         from database import db
        
#         # Check if already seeded
#         existing = Song.query.filter_by(title="Wasted Years").first()
#         if existing:
#             return {'message': 'Iron Maiden songs already exist'}, 400
        
#         iron_1 = Song(
#             title="Wasted Years",
#             artist="Iron Maiden",
#             album="Best Of",
#             duration=65,
#             track_number=1,
#             file_path="iron_maiden/best_of/1_wasted_years.m4a"
#         )
#         iron_2 = Song(
#             title="Hallowed Be Thy Name",
#             artist="Iron Maiden",
#             album="Best Of",
#             duration=71,
#             track_number=2,
#             file_path="iron_maiden/best_of/2_hallowed_be_thy_name.m4a"
#         )
#         iron_3 = Song(
#             title="The Trooper",
#             artist="Iron Maiden",
#             album="Best Of",
#             duration=34,
#             track_number=3,
#             file_path="iron_maiden/best_of/3_the_trooper.m4a"
#         )
#         iron_4 = Song(
#             title="Fear Of The Dark",
#             artist="Iron Maiden",
#             album="Best Of",
#             track_number=4,
#             duration=58,
#             file_path="iron_maiden/best_of/4_fear_of_the_dark.m4a"
#         )
        
#         db.session.add_all([iron_1, iron_2, iron_3, iron_4])
#         db.session.commit()
        
#         return {'message': 'Successfully seeded Iron Maiden songs', 'count': 4}, 200
        
#     except Exception as e:
#         db.session.rollback()
#         return {'error': str(e)}, 500
    

@admin_bp.route('/seed', methods=['POST'])
def seed_database():
    print("Seeding")

    try:
        from ....scripts.seed_railway.seed_albums import seed_albums
        seed_albums()
        return {'message': 'Database seeded successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500
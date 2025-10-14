from flask import Blueprint, jsonify

from ..authentification.middleware import jwt_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET'])
# @jwt_required
# @admin_required
def admin_home():
    
    return jsonify({'admin': "true"})
    

@admin_bp.route('/seed-iron-maiden', methods=['POST'])
def seed_iron_maiden_route():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Iron Maiden").first()
        if not artist:
            artist = Artist(
                name="Iron Maiden",
                # genre="Heavy Metal"
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Best Of", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Best Of",
            artist="Iron Maiden",
            artist_id=artist.id,
            genre="Heavy Metal",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
            {'title': "Wasted Years", 'duration': 65, 'track_number': 1, 'file_path': "iron_maiden/best_of/1_wasted_years.m4a"},
            {'title': "Hallowed Be Thy Name", 'duration': 71, 'track_number': 2, 'file_path': "iron_maiden/best_of/2_hallowed_be_thy_name.m4a"},
            {'title': "The Trooper", 'duration': 34, 'track_number': 3, 'file_path': "iron_maiden/best_of/3_the_trooper.m4a"},
            {'title': "Fear Of The Dark", 'duration': 58, 'track_number': 4, 'file_path': "iron_maiden/best_of/4_fear_of_the_dark.m4a"}
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Iron Maiden",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Iron Maiden album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    

@admin_bp.route('/seed-lana', methods=['POST'])
def seed_lana():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Lana Del Rey").first()
        if not artist:
            artist = Artist(
                name="Lana Del Rey",
                # genre="Heavy Metal"
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Born To Die", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Born To Die",
            artist="Lana Del Rey",
            artist_id=artist.id,
            genre="Pop",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
                {
                'title': "Born To Die",
                'duration': 55,
                'track_number': 1,
                'file_path': "lana_del_rey/born_to_die/1_born_to_die.m4a"
            },
            {
                'title': "Off To The Races",
                'duration': 66,
                'track_number': 2,
                'file_path': "lana_del_rey/born_to_die/2_off_to_the_races.m4a"
            },
            {
                'title': "Blue Jeans",
                'duration': 52,
                'track_number': 3,
                'file_path': "lana_del_rey/born_to_die/3_blue_jeans.m4a"
            },
            {
                'title': "Video Games",
                'duration': 62,
                'track_number': 4,
                'file_path': "lana_del_rey/born_to_die/4_video_games.m4a"
            }
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Lana Del Rey",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Iron Maiden album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    

@admin_bp.route('/seed-tribalistas', methods=['POST'])
def seed_tribalistas():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Tribalistas").first()
        if not artist:
            artist = Artist(
                name="Tribalistas",
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Tribalistas", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Tribalistas",
            artist="Tribalistas",
            artist_id=artist.id,
            genre="Brazilian",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
                    {
                'title': "Carnavalia",
                'duration': 49,
                'track_number': 1,
                'file_path': "tribalistas/tribalistas/1_carnavalia.m4a"
            },
            {
                'title': "Um A Um",
                'duration': 39,
                'track_number': 2,
                'file_path': "tribalistas/tribalistas/2_um_a_um.m4a"
            },
            {
                'title': "Velha Infancia",
                'duration': 48,
                'track_number': 3,
                'file_path': "tribalistas/tribalistas/3_velha_infancia.m4a"
            },
            {
                'title': "Passe Em Casa",
                'duration': 58,
                'track_number': 4,
                'file_path': "tribalistas/tribalistas/4_passe_em_casa.m4a"
            }
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Tribalistas",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Tribalistas album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    

@admin_bp.route('/seed-manu', methods=['POST'])
def seed_manu():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Manu Chao").first()
        if not artist:
            artist = Artist(
                name="Manu Chao",
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="La Radiolina", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="La Radiolina",
            artist="Manu Chao",
            artist_id=artist.id,
            genre="Argentinian",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
                        {
                'title': "13 Dias",
                'duration': 29,
                'track_number': 1,
                'file_path': "manu_chao/la_radiolina/1_13_dias.m4a"
            },
            {
                'title': "Tristeza Maleza",
                'duration': 24,
                'track_number': 2,
                'file_path': "manu_chao/la_radiolina/2_tristeza_maleza.m4a"
            },
            {
                'title': "Besoin De La Lune",
                'duration': 19,
                'track_number': 3,
                'file_path': "manu_chao/la_radiolina/3_besoin_de_la_lune.m4a"
            },
            {
                'title': "El Kitapena",
                'duration': 17,
                'track_number': 4,
                'file_path': "manu_chao/la_radiolina/4_el_kitapena.m4a"
            }
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Manu Chao",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Tribalistas album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    
@admin_bp.route('/seed-mina', methods=['POST'])
def seed_mina():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Mina").first()
        if not artist:
            artist = Artist(
                name="Mina",
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Studio Uno 66", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Studio Uno 66",
            artist="Mina",
            artist_id=artist.id,
            genre="Italian",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
            {
                'title': "Se Telefonando",
                'duration': 30,
                'track_number': 1,
                'file_path': "mina/studio_uno_66/1_se_telefonando.m4a"
            },
            {
                'title': "Mi Sei Scoppiato Dentro Al Cuore",
                'duration': 45,
                'track_number': 2,
                'file_path': "mina/studio_uno_66/2_mi_sei_scoppiato_dentro_al_cuore.m4a"
            },
            {
                'title': "Una Casa In Cima Al Mondo",
                'duration': 32,
                'track_number': 3,
                'file_path': "mina/studio_uno_66/3_una_casa_in_cima_al_mondo.m4a"
            },
            {
                'title': "Addio",
                'duration': 17,
                'track_number': 4,  # Fixed: was 31, should be 4
                'file_path': "mina/studio_uno_66/4_addio.m4a"
            }
                        
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Mina",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Mina album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    

@admin_bp.route('/seed-neil', methods=['POST'])
def seed_neil():
    try:
        from models.artist import Artist
        from models.album import Album
        from models.song import Song
        from database import db
        
        # Step 1: Create or get the artist
        artist = Artist.query.filter_by(name="Neil Young").first()
        if not artist:
            artist = Artist(
                name="Neil Young",
            )
            db.session.add(artist)
            db.session.flush()
        
        # Step 2: Check if album already exists
        album = Album.query.filter_by(title="Harvest", artist_id=artist.id).first()
        if album:
            return {'message': 'Album already exists', 'album_id': album.id}, 400
        
        # Step 3: Create the album
        album = Album(
            title="Harvest",
            artist="Neil Young",
            artist_id=artist.id,
            genre="Country",
            track_count=4
        )
        db.session.add(album)
        db.session.flush()
        
        # Step 4: Create songs
        songs_data = [
            {
                'title': "Out On The Weekend",
                'duration': 65,
                'track_number': 1,
                'file_path': "neil_young/harvest/1_out_on_the_weekend.m4a"
            },
            {
                'title': "Harvest",
                'duration': 39,
                'track_number': 2,
                'file_path': "neil_young/harvest/2_harvest.m4a"
            },
            {
                'title': "A Man Needs A Maid",
                'duration': 40,
                'track_number': 3,
                'file_path': "neil_young/harvest/3_a_man_needs_a_maid.m4a"
            },
            {
                'title': "Heart Of Gold",
                'duration': 42,
                'track_number': 4,
                'file_path': "neil_young/harvest/4_heart_of_gold.m4a"
            }
        ]
        
        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data['title'],
                artist="Neil Young",
                album_id=album.id,
                duration=song_data['duration'],
                track_number=song_data['track_number'],
                file_path=song_data['file_path']
            )
            songs.append(song)
        
        db.session.add_all(songs)
        db.session.commit()
        
        return {
            'message': 'Successfully seeded Neil Young album',
            'artist_id': artist.id,
            'album_id': album.id,
            'songs_count': len(songs)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
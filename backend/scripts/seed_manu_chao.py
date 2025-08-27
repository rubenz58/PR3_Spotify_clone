from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    song_1 = Song(
        title="13 Dias",
        artist="Manu Chao", 
        album="La Radiolina",
        duration=29,
        track_number=1,
        file_path="manu_chao/la_radiolina/1_13_dias.m4a"
    )
    song_2 = Song(
        title="Tristeza Maleza",
        artist="Manu Chao", 
        album="La Radiolina",
        duration=24,
        track_number=2,
        file_path="manu_chao/la_radiolina/2_tristeza_maleza.m4a"
    )
    song_3 = Song(
        title="Besoin De La Lune",
        artist="Manu Chao", 
        album="La Radiolina",
        duration=19,
        track_number=3,
        file_path="manu_chao/la_radiolina/3_besoin_de_la_lune.m4a"
    )
    song_4 = Song(
        title="El Kitapena",
        artist="Manu Chao", 
        album="La Radiolina",
        track_number=4,
        duration=17,
        file_path="manu_chao/la_radiolina/4_el_kitapena.m4a"
    )

    db.session.add_all([song_1, song_2, song_3, song_4])
    db.session.commit()
    print("Successfully added all songs.")
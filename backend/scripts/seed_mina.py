from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    song_1 = Song(
        title="Se Telefonando",
        artist="Mina", 
        album="Studio Uno 66",
        duration=30,
        track_number=1,
        file_path="mina/studio_uno_66/1_se_telefonando.m4a"
    )
    song_2 = Song(
        title="Mi Sei Scoppiato Dentro Al Cuore",
        artist="Mina", 
        album="Studio Uno 66",
        duration=45,
        track_number=2,
        file_path="mina/studio_uno_66/2_mi_sei_scoppiato_dentro_al_cuore.m4a"
    )
    song_3 = Song(
        title="Una Casa In Cima Al Mondo",
        artist="Mina", 
        album="Studio Uno 66",
        duration=32,
        track_number=3,
        file_path="mina/studio_uno_66/3_una_casa_in_cima_al_mondo.m4a"
    )
    song_4 = Song(
        title="Addio",
        artist="Mina", 
        album="Studio Uno 66",
        track_number=31,
        duration=17,
        file_path="mina/studio_uno_66/4_addio.m4a"
    )

    db.session.add_all([song_1, song_2, song_3, song_4])
    db.session.commit()
    print("Successfully added all songs.")
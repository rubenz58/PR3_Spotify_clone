from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    song_1 = Song(
        title="Carnavalia",
        artist="Tribalistas", 
        album="Tribalistas",
        duration=49,
        track_number=1,
        file_path="tribalistas/tribalistas/1_carnavalia.m4a"
    )
    song_2 = Song(
        title="Um A Um",
        artist="Tribalistas", 
        album="Tribalistas",
        duration=39,
        track_number=2,
        file_path="tribalistas/tribalistas/2_um_a_um.m4a"
    )
    song_3 = Song(
        title="Velha Infancia",
        artist="Tribalistas", 
        album="Tribalistas",
        duration=48,
        track_number=3,
        file_path="tribalistas/tribalistas/3_velha_infancia.m4a"
    )
    song_4 = Song(
        title="Passe Em Casa",
        artist="Tribalistas", 
        album="Tribalistas",
        duration=58,
        track_number=4,
        file_path="tribalistas/tribalistas/4_passe_em_casa.m4a"
    )

    db.session.add_all([song_1, song_2, song_3, song_4])
    db.session.commit()
    print("Successfully added all songs.")
from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    lana_1 = Song(
        title="Born To Die",
        artist="Lana Del Rey", 
        album="Born To Die",
        duration=55,
        track_number=1,
        file_path="lana_del_rey/born_to_die/1_born_to_die.m4a"
    )
    lana_2 = Song(
        title="Off To The Races",
        artist="Lana Del Rey", 
        album="Born To Die",
        duration=66,
        track_number=2,
        file_path="lana_del_rey/born_to_die/2_off_to_the_races.m4a"
    )
    lana_3 = Song(
        title="Blue Jeans",
        artist="Lana Del Rey", 
        album="Born To Die",
        duration=52,
        track_number=3,
        file_path="lana_del_rey/born_to_die/3_blue_jeans.m4a"
    )
    lana_4 = Song(
        title="Video Games",
        artist="Lana Del Rey", 
        album="Born To Die",
        track_number=4,
        duration=62,
        file_path="lana_del_rey/born_to_die/4_video_games.m4a"
    )

    db.session.add_all([lana_1, lana_2, lana_3, lana_4])
    db.session.commit()
    print("Successfully added all songs.")
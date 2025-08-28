from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    song_1 = Song(
        title="Out On The Weekend",
        artist="Neil Young", 
        album="Harvest",
        duration=65,
        track_number=1,
        file_path="neil_young/harvest/1_out_on_the_weekend.m4a"
    )
    song_2 = Song(
        title="Harvest",
        artist="Neil Young", 
        album="Harvest",
        duration=39,
        track_number=2,
        file_path="neil_young/harvest/2_harvest.m4a"
    )
    song_3 = Song(
        title="A Man Needs A Maid",
        artist="Neil Young", 
        album="Harvest",
        duration=40,
        track_number=3,
        file_path="neil_young/harvest/3_a_man_needs_a_maid.m4a"
    )
    song_4 = Song(
        title="Heart Of Gold",
        artist="Neil Young", 
        album="Harvest",
        duration=42,
        track_number=4,
        file_path="neil_young/harvest/4_heart_of_gold.m4a"
    )

    db.session.add_all([song_1, song_2, song_3, song_4])
    db.session.commit()
    print("Successfully added all songs.")
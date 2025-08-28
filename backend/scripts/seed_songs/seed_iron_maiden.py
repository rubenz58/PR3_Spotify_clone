from app import create_app
from database import db
from models.song import Song

# Create the Flask app and push application context
app = create_app()

with app.app_context():
    
    iron_1 = Song(
        title="Wasted Years",
        artist="Iron Maiden", 
        album="Best Of",
        duration=65,
        track_number=1,
        file_path="iron_maiden/best_of/1_wasted_years.m4a"
    )
    iron_2 = Song(
        title="Hallowed Be Thy Name",
        artist="Iron Maiden", 
        album="Best Of",
        duration=71,
        track_number=2,
        file_path="iron_maiden/best_of/2_hallowed_be_thy_name.m4a"
    )
    iron_3 = Song(
        title="The Trooper",
        artist="Iron Maiden", 
        album="Best Of",
        duration=34,
        track_number=3,
        file_path="iron_maiden/best_of/3_the_trooper.m4a"
    )
    iron_4 = Song(
        title="Fear Of The Dark",
        artist="Iron Maiden", 
        album="Best Of",
        track_number=4,
        duration=58,
        file_path="iron_maiden/best_of/4_fear_of_the_dark.m4a"
    )

    db.session.add_all([iron_1, iron_2, iron_3, iron_4])
    db.session.commit()
    print("Successfully added all songs.")
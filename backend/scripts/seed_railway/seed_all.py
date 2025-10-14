import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from database import db

# Import all seed functions
from scripts.seed_artists import seed_artists
from scripts.seed_albums import seed_albums
from scripts.seed_songs import seed_songs

def seed_all():
    app = create_app()
    with app.app_context():
        print("🌱 Starting database seed...")
        
        # Run in dependency order
        print("\n📍 Seeding artists...")
        seed_artists()
        
        print("\n📀 Seeding albums...")
        seed_albums()
        
        print("\n🎵 Seeding songs...")
        seed_songs()
        
        print("\n✅ Database seeded successfully!")

if __name__ == "__main__":
    seed_all()
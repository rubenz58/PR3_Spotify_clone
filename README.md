PR3 – Spotify Clone - v.1.0

NOW: FR loading states for components while not logged in
NEXT: Playlists

Core Music Features (Must-Have)

✅ Play/pause functionality
✅ Song library with artist/title display
Skip next/previous (queue management)
Seek bar (scrub through song timeline)
Volume control
Shuffle and repeat modes

Search & Discovery

✅ Search bar (songs, artists, albums)
Filter by artist or album
Recently played section
Featured/recommended songs (even if just hardcoded)

User Library Management

✅ "Like" songs (favorites)
✅ Create custom playlists
Add/remove songs from playlists
Delete playlists
✅ Add to queue functionality

User Experience

Responsive design (mobile-friendly)
Persistent player bar (stays while navigating)
Loading states for all async operations
Current song highlighting in lists

Nice-to-Have Portfolio Enhancers

Dark/light mode toggle
Playlist sharing (even just copy link)
Audio visualization (simple waveform)
Keyboard shortcuts (spacebar for play/pause)
Progress persistence (remember where you left off)

Backend Features to Showcase Skills

User authentication (you have this)
RESTful API design
Database relationships (users, songs, playlists)
File upload (for adding new songs)

Steps:
> // Implement Authentication using Zustand. Change code.
> // Implement One song streaming.
    > // Display Song component
    > // Create Song Model
    > // Add one song for testing.
    > // +BKND route. /api/songs (get all songs/)
    > // +BKND route. /stream/songs/song_id

> Make plan forward.
> Add: 3-5 songs/artist. 6-8 different artists. Just use 30 second snippets.


from models.song import Song
from database import db

# Update all Iron Maiden songs with that album
songs = Song.query.filter_by(artist='Iron Maiden').all()
for song in songs:
    song.album = 'Best Of Iron Maiden'
print(f"Updated {len(songs)} songs")

from models.song import Song
from database import db
song = Song.query.filter_by(title='Addio').first()
song.track_number=4

db.session.commit()


> python -m scripts.seed_iron_maiden
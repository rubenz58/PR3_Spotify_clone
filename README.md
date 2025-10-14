PR3 – Spotify Clone - v.1.0

Core Music Features (Must-Have)

✅ Play/pause functionality
✅ Song library with artist/title display
✅ Skip next/previous (queue management)
✅ Seek bar (scrub through song timeline)
✅ Volume control
✅ Shuffle and repeat modes

Search & Discovery

✅ Search bar (songs, artists, albums)
✅ Filter by artist or album
✅ Recently played section
✅ Featured/recommended songs (even if just hardcoded)

User Library Management

✅ "Like" songs (favorites)
✅ Create custom playlists
✅ Add/remove songs from playlists
✅ Delete playlists
✅ Add to queue functionality

User Experience

✅ Responsive design (mobile-friendly)
✅ Persistent player bar (stays while navigating)
✅ Loading states for all async operations
✅ Current song highlighting in lists

Nice-to-Have Portfolio Enhancers

Dark/light mode toggle
Playlist sharing (even just copy link)
Audio visualization (simple waveform)
Keyboard shortcuts (spacebar for play/pause)
Progress persistence (remember where you left off)

Backend Features to Showcase Skills

✅ User authentication (you have this)
✅ RESTful API design
✅ Database relationships (users, songs, playlists)
File upload (for adding new songs)



from models.song import Song
from database import db

# Update all Iron Maiden songs with that album
songs = Song.query.filter_by(artist='Iron Maiden').all()
for song in songs:
    song.album = 'Best Of Iron Maiden'
print(f"Updated {len(songs)} songs")

from models.playlist import PlaylistSong
from database import db
playlist_song = PlaylistSong.query.filter_by(song_id=1).first()
playlist_song.song_id=11

db.session.commit()


> python -m scripts.seed_iron_maiden

Redeploy 3
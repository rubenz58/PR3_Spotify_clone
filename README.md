PR3 – Spotify Clone

Spotify Clone - Full-Stack Music Streaming Application
A feature-rich music streaming platform with complete playback controls, playlist management, and personalized music discovery. Users can create custom playlists, like songs, search across the music library, and enjoy seamless playback with shuffle and repeat modes.

Frontend: React with Zustand Store for global state management and persistent audio player

Backend: Flask REST API with PostgreSQL database

Data Management: SQLAlchemy ORM with Alembic migrations

Media Storage: Cloudflare R2 for file hosting

Infrastructure: Docker containerization deployed on Railway

User Features: Authentication system, custom playlists, liked songs library, search/filter functionality, and queue management

Production Features: Responsive design for mobile/desktop, loading states, persistent player across navigation, and optimized media delivery


![alt text](https://github.com/rubenz58/PR3_Spotify_clone/blob/main/PR3_1.png?raw=true)


![alt text](https://github.com/rubenz58/PR3_Spotify_clone/blob/main/PR3_2.png?raw=true)


![alt text](https://github.com/rubenz58/PR3_Spotify_clone/blob/main/PR3_3.png?raw=true)


Core Music Features

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


Backend Features

✅ User authentication (you have this)
✅ RESTful API design
✅ Database relationships (users, songs, playlists)

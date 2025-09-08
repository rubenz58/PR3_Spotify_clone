import { create } from 'zustand'

const useStore = create((set, get) => ({

    getUrlBase: () => process.env.REACT_APP_BASE_URL,

    /////// AUTHENTICATION STATE ///////
    authLoading: true,        // Login/signup/token verification
    playlistLoading: false,   // Playlist data
    searchLoading: false,     // Search operations
    uploadLoading: false,     // File uploads (if you add that feature)
    oAuthLoading: false,      // Google login
    user: null,
    token: null,

    // Setters (for direct state updates if needed)
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setAuthLoading: (authLoading) => set({ authLoading }),
    setOAuthLoading: (oAuthLoading) => set({ oAuthLoading }),

    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Same function for user and admin. Just attaches whatever token is availabl for requests.
    makeAuthenticatedRequest: async (url, options = {}) => {
        const { token, getUrlBase, logout } = get();
        const BASE_URL = getUrlBase();

        // console.log('Making request to:', `${BASE_URL}${url}`);
        // console.log('Token exists:', !!token);
        // console.log('Full token:', token);
        // console.log('Request headers:', {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //     ...options.headers,
        // });

        if (!token) {
            throw new Error('No authentication token available');
        }

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const response = await fetch(`${BASE_URL}${url}`, {
            ...defaultOptions,
            ...options,
        });

        // console.log('Response status:', response.status); // Add this line

        if (!response.ok) {
            // console.log('Response not ok, status:', response.status, response.statusText); // Add this line
            if (response.status === 401) {
                logout();
                throw new Error('Authentication expired. Please log in again.');
            }
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return response.json();
    },

    // CHECK FOR EXISTING LOGIN ON APP START
    checkExistingAuth: async () => {
        // console.log("checkExistingAuth: Running")
        const { user } = get()
        
        if (user) return // Skip if user already exists

        const stored_token = localStorage.getItem('token')

        if (stored_token) {
            try {
                const { getUrlBase } = get();
                const BASE_URL = getUrlBase();

                // Verify token is still valid by calling /me endpoint
                const response = await fetch(`${BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${stored_token}`,
                        'Content-Type': 'application/json'
                    }
                })

                // Token is valid -> User gets logged in
                if (response.ok) {
                    const data = await response.json()
                    set({ user: data.user, token: stored_token })
                } else {
                    // Token is invalid, remove it
                    localStorage.removeItem('token')
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                localStorage.removeItem('token')
            }
        }

        set({ authLoading: false })
    },

    // Fetches Google Auth Url from BKND
    loginWithGoogle: async () => {
        console.log("google login attempt")

        const { getUrlBase } = get();
        const BASE_URL = getUrlBase();

        try {
            const response = await fetch(`${BASE_URL}/api/auth/google/login`)
            const { auth_url } = await response.json()
            window.location.href = auth_url
        } catch (error) {
            return { success: false, error: "Network error occurred" }
        }
    },

    signupWithGoogle: async () => {
        console.log("google signup attempt")
    },

    // LOGIN FUNCTION
    login: async (credentials) => {
        set({ authLoading: true })

        // const { delay } = get();
        // await delay(3000);

        const { getUrlBase } = get();
        const BASE_URL = getUrlBase();

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()

            if (response.ok) {
                // Login successful - User State updated
                set({ user: data.user, token: data.token })
                localStorage.setItem('token', data.token)
                return { success: true, data }
            } else {
                // Login failed
                return { success: false, error: data.error }
            }
        } catch (error) {
            // Network error
            return { success: false, error: "Network error occurred" }
        } finally {
            set({ authLoading: false }) // Hide loading state
        }
    },

    signup: async (userData) => {
        set({ authLoading: true })

        const { getUrlBase } = get();
        const BASE_URL = getUrlBase();

        try {
            console.log("Signup Attempt");
            console.log("BASE_URL: " + BASE_URL);
            const response = await fetch(`${BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const data = await response.json()

            if (response.ok) {
                // Signup successful - User State updated
                set({ user: data.user, token: data.token })
                localStorage.setItem('token', data.token)
                return { success: true, data }
            } else {
                // Signup failed
                return { success: false, error: data.error }
            }
        } catch (error) {
            // Network error
            return { success: false, error: "Network error occurred" }
        } finally {
            set({ authLoading: false }) // Hide loading state
        }
    },

    logout: async () => {
        set({ user: null, token: null })
        localStorage.removeItem('token')
    },


    /////// MUSIC PLAYER STATE ///////

    // DETERMINE WHAT IS CURRENTLY PLAYING
    currentSong: null, // { id: 1, title: "Song Name", artist: "Artist", file_path: "..." }
    isPlaying: false,

    userPlaylists: [],
    songLoading: false,
    likedSongs: [],
    recentlyPlayedSongs: [],
    playlistRefresh: false,
    
    currentPlaylistSongs: [],
    currentPlaylistId: null, // DEFINE

    queueSongs: [],
    queuePlaying: false,
    currentQueueSongId: null,

    currentContext: null, // "playlist", "album", "liked", etc.
    contextSongs: [], // Determines prev/next
    currentContextSong: null,

    setCurrentPlaylistId: (id) => set({ currentPlaylistId: id }),
    setCurrentContext: (context) => set({ currentContext: context }),
    setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
    setCurrentPlaylistSongs: (currentPlaylistSongs) => set({ currentPlaylistSongs }),
    setCurrentQueueSongId: (songId) => set({ currentQueueSongId: songId }),


    // Function adds songs to the playback context.
    setPlaybackContext: (songs, song) => {
        set({
            contextSongs: songs,
            currentContextSong: song
        });
    },

    fetchLikedSongs: async () => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user) return [];

        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/liked-songs`);
            const songs = data.liked_songs || [];

            set({
                likedSongs: songs,
                currentPlaylistId: "liked_songs"
            });

            return songs; // ✅ return array
        } catch (error) {
            console.error("Failed to fetch liked songs:", error);
            return [];
        }
    },

    addLikedSong: async (song_id) => {
        console.log("addLikedSong: ", song_id);
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/liked-songs/${song_id}`, {
                method: 'POST'
            });
            
            // Get the full song data that was added (assuming backend returns it)
            const newLikedSong = data.song;
            
            // Update local state after successful API call
            set((state) => ({
                // Add to beginning of liked songs array (most recently liked first)
                likedSongs: [newLikedSong, ...state.likedSongs],
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to add liked song:', error);
            return { success: false, error: error.message };
        }
    },

    removeLikedSong: async (song_id) => {
        console.log("removeLikedSongs: ", song_id);
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            await makeAuthenticatedRequest(`/api/user_playlists/liked-songs/${song_id}`, {
                method: 'DELETE'
            });
            
            // Update local state after successful API call
            set((state) => ({
                likedSongs: state.likedSongs.filter(song => song.id !== song_id),
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to remove liked song:', error);
            return { success: false, error: error.message };
        }
    },

    fetchQueueSongs: async () => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user) return [];

        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/queue`);
            const songs = data.queue_songs || [];

            set({
                queueSongs: songs,
                currentPlaylistId: "queue"
            });

            return songs; // ✅ return array
        } catch (error) {
            console.error("Failed to fetch queue songs:", error);
            return [];
        }
    },

    addToQueue: async (song_id) => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/queue/${song_id}`, {
                method: 'POST'
            });
            
            // Get the full song data that was added (assuming backend returns it)
            const newQueueSong = data.song;
            
            // Update local state after successful API call
            set((state) => ({
                // Add to end of queue array (last in queue)
                queueSongs: [...state.queueSongs, newQueueSong],
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to add song to queue:', error);
            return { success: false, error: error.message };
        }
    },

    removeFromQueue: async (song_id) => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            await makeAuthenticatedRequest(`/api/user_playlists/queue/${song_id}`, {
                method: 'DELETE'
            });
            
            // Update local state after successful API call
            set((state) => ({
                queueSongs: state.queueSongs.filter(song => song.id !== song_id),
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to remove song from queue:', error);
            return { success: false, error: error.message };
        }
    },

    clearQueue: async () => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            await makeAuthenticatedRequest('/api/user_playlists/queue', {
                method: 'DELETE'
            });
            
            // Clear local state after successful API call
            set((state) => ({
                queueSongs: [],
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to clear queue:', error);
            return { success: false, error: error.message };
        }
    },

    fetchRecentlyPlayedSongs: async () => {

        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/recently-played`);
            set({
                recentlyPlayedSongs: data.recently_played_songs,
                currentPlaylistId: "recently_played"
            });

        } catch (error) {
            console.error('Failed to fetch recently played songs:', error);
        }

    },

    // Fetch all playlists for a specific user
    fetchUserPlaylists: async () => {
        // console.log("Fetching Playlists");
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) {
            console.error('No user logged in');
            return;
        }
        
        try {
            set({ playlistLoading: true });

            const data = await makeAuthenticatedRequest(`/api/playlists/`);
            
            set({ userPlaylists: data.playlists });
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        } finally {
            set({ playlistLoading: false });
        }
    },

    fetchPlaylistSongs: async (playlistId) => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user) return [];

        try {
            set({ playlistLoading: true });
            const data = await makeAuthenticatedRequest(`/api/playlists/${playlistId}/songs`);
            const songs = data.songs || [];

            set({
                currentPlaylistSongs: songs,
                currentPlaylistId: playlistId
            });

            return songs; // ✅ return array
        } catch (error) {
            console.error("Failed to fetch playlist songs:", error);
            return [];
        } finally {
            set({ playlistLoading: false });
        }
    },

    createNewPlaylist: async (newPlaylistName) => {
        const { user, makeAuthenticatedRequest } = get();
    
        if (!user) return;

        try {
            set({ playlistLoading: true });

            // const { delay } = get();
            // await delay(3000);
            
            // Make POST request to create playlist
            const data = await makeAuthenticatedRequest('/api/playlists/', {
                method: 'POST',
                body: JSON.stringify({ name: newPlaylistName })
            });
            
            // Add new playlist to existing playlists array
            set((state) => ({ 
                userPlaylists: [...state.userPlaylists, data.playlist] 
            }));
            
            return { success: true, userPlaylists: data.playlist };
            
        } catch (error) {
            console.error('Failed to create playlist:', error);
            return { success: false, error: error.message };
        } finally {
            set({ playlistLoading: false });
        }
    },

    deletePlaylist: async (playlistId) => {
        const { makeAuthenticatedRequest } = get();

        try {
            set({ playlistLoading: true });
            
            await makeAuthenticatedRequest(`/api/playlists/${playlistId}`, {
                method: 'DELETE'
            });
            
            // Remove from local state only if API call succeeds
            set((state) => ({
                userPlaylists: state.userPlaylists.filter(p => p.id !== playlistId)
            }));
            
            return { success: true };
            
        } catch (error) {
            console.error('Failed to delete playlist:', error);
            return { success: false, error: error.message };
        } finally {
            set({ playlistLoading: false });
        }
    },

    renamePlaylist: async (playlistId, newName) => {
        const { makeAuthenticatedRequest } = get();

        try {
            set({ playlistLoading: true });
            
            const data = await makeAuthenticatedRequest(`/api/playlists/${playlistId}`, {
                method: 'PUT',
                body: JSON.stringify({ name: newName })
            });
            
            // Update playlist name in local state only after successful API response
            set((state) => ({
                userPlaylists: state.userPlaylists.map(playlist => 
                    playlist.id === playlistId 
                        ? { ...playlist, name: data.playlist.name }
                        : playlist
                )
            }));
            
            return { success: true, userPlaylists: data.playlist };
            
        } catch (error) {
            console.error('Failed to rename playlist:', error);
            return { success: false, error: error.message };
        } finally {
            set({ playlistLoading: false });
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {

        const { makeAuthenticatedRequest } = get();

        try {
            await makeAuthenticatedRequest(`/api/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE'
            });
            
            // Update local state after successful API call
            set((state) => ({
                currentPlaylistSongs: state.currentPlaylistSongs.filter(s => s.id !== songId),
                userPlaylists: state.userPlaylists.map(p => 
                    p.id === parseInt(playlistId) 
                    ? { ...p, song_count: p.song_count - 1 }
                    : p
                )
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to remove song from playlist:', error);
            return { success: false, error: error.message };
        }
    },

    addSongToPlaylist: async (playlist_id, song_id) => {
        const { makeAuthenticatedRequest } = get();
        
        try {
            set({ playlistLoading: true });
            
            await makeAuthenticatedRequest(`/api/playlists/${playlist_id}/songs`, {
                method: 'POST',
                body: JSON.stringify({ song_id })
            });
            
            // Update local state - increment song count for the playlist
            set((state) => ({
                userPlaylists: state.userPlaylists.map(p => 
                    p.id === playlist_id 
                        ? { ...p, song_count: p.song_count + 1 }
                        : p
                ),
                playlistRefresh: !state.playlistRefresh // Toggle refresh
            }));
            
            return { success: true };
            
        } catch (error) {
            console.error('Failed to add song to playlist:', error);
            return { success: false, error: error.message };
        } finally {
            set({ playlistLoading: false });
        }
    },

    ///// ALBUM LOGIC //////
    all_albums: [],
    albumLoading: false,
    currentAlbum: null,
    currentAlbumSongs: [],

    fetchAllAlbums: async () => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            set({ albumLoading: true });

            const data = await makeAuthenticatedRequest(`/api/albums/`);
            set({ all_albums: data.albums });

        } catch (error) {
            console.error('Failed to fetch albums:', error);
        } finally {
            set({ albumLoading: false });
        }
    },

    fetchAlbumSongs: async (albumId) => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user) return [];

        try {
            set({ albumLoading: true });
            const data = await makeAuthenticatedRequest(`/api/albums/${parseInt(albumId)}`);

            const songs = data.album.songs || [];
            set({ 
                currentAlbum: data.album,
                currentAlbumSongs: songs,
                // currentPlaylistSongs: songs,
                currentPlaylistId: "album"
            });

            return songs; // ✅ return array for player
        } catch (error) {
            console.error("Failed to fetch album songs:", error);
            return [];
        } finally {
            set({ albumLoading: false });
        }
    },

    playNextSong: async () => {
        console.log("playNextSong");
        const { 
            queueSongs, 
            removeFromQueue,
            currentSong, 
            contextSongs, 
            currentContextSong,
            currentQueueSongId,
            setCurrentQueueSongId,
        } = get();

        // Special case.
        // queueSongs.length === 1 && currentSong = the only song in the queue
        // nextSong should be the song in contextSongs AFTER currentContextSong.
        if (queueSongs.length === 1 && currentQueueSongId && 
            currentSong && queueSongs[0].id === currentSong.id) {
            
            console.log("Special case: Last song in queue, moving to context");
            
            // Remove the current song from queue
            await removeFromQueue(currentSong.id);
            
            // Clear queue tracking
            setCurrentQueueSongId(null);
            
            // Find next song in context after currentContextSong
            if (contextSongs && contextSongs.length > 0 && currentContextSong) {
                const currentIndex = contextSongs.findIndex(s => s.id === currentContextSong.id);
                if (currentIndex !== -1) {
                    const nextIndex = (currentIndex + 1) % contextSongs.length; // wrap around
                    const nextSong = contextSongs[nextIndex];

                    set({
                        queuePlaying: false,
                        currentSong: nextSong,
                        currentContextSong: nextSong, // advance contextSong
                        isPlaying: true
                    });
                    return;
                }
            }
            
            // If no context available, just stop playing
            set({ isPlaying: false });
            return;
        }

        // 1️⃣ Queue priority
        if (queueSongs.length > 0) {

            console.log("Queue has priority");

            let nextSong;

            // If we have a currentQueueSongId, find the next song in queue
            if (currentQueueSongId) {
                const currentQueueIndex = queueSongs.findIndex(s => s.id === currentQueueSongId);
                
                if (currentQueueIndex !== -1 && currentQueueIndex < queueSongs.length - 1) {
                    // Get the next song in the queue
                    nextSong = queueSongs[currentQueueIndex + 1];
                } else {
                    // Current song is last in queue or not found, take first song
                    nextSong = queueSongs[0];
                }
            } else {
                // No currentQueueSongId set, take first song in queue
                nextSong = queueSongs[0];
            }

            setCurrentQueueSongId(nextSong.id);

            if (currentQueueSongId) {
                const currentSongStillInQueue = queueSongs.find(s => s.id === currentQueueSongId);
                if (currentSongStillInQueue) {
                    await removeFromQueue(currentQueueSongId);
                }
            }

            // Play the next song, but DO NOT touch contextSongs
            set({
                queuePlaying: true,
                currentSong: nextSong,
                isPlaying: true
            });
            return;
        }

        // 2️⃣ No queue → continue in the context
        if (contextSongs && contextSongs.length > 0) {
            const currentIndex = contextSongs.findIndex(s => s.id === currentContextSong.id);
            if (currentIndex === -1) return;

            const nextIndex = (currentIndex + 1) % contextSongs.length; // wrap around
            const nextSong = contextSongs[nextIndex];

            set({
                queuePlaying: false,
                currentSong: nextSong,
                currentContextSong: nextSong, // advance contextSong
                isPlaying: true,
                currentQueueSongId: null,
            });
        }
    },

    playPrevSong: () => {
        const {
            currentSong,
            contextSongs,
            currentContextSong,
            queueSongs,
            currentQueueSongId,
            setCurrentQueueSongId,
        } = get();

        if (!currentSong) return;

        // 1️⃣ If we're currently playing from queue, try to go to previous song in queue
        if (currentQueueSongId && queueSongs.length > 0) {
            console.log("Currently playing from queue, looking for prev in queue");
            
            const currentQueueIndex = queueSongs.findIndex(s => s.id === currentQueueSongId);
        
            if (currentQueueIndex !== -1) {
                // Get previous song in queue (wrap around to end if at beginning)
                const prevIndex = currentQueueIndex > 0 
                    ? currentQueueIndex - 1 
                    : queueSongs.length - 1;
                const prevSong = queueSongs[prevIndex];
                setCurrentQueueSongId(prevSong.id);
                
                set({
                    currentSong: prevSong,
                    isPlaying: true,
                    queuePlaying: true,
                });
                return;
            }
            
            // No previous song in queue, fall back to context if available
            if (contextSongs.length > 0 && currentContextSong) {
                console.log("No prev in queue, falling back to context");
                
                const currentIndex = contextSongs.findIndex(s => s.id === currentContextSong.id);
                if (currentIndex !== -1) {
                    const prevIndex = (currentIndex - 1 + contextSongs.length) % contextSongs.length;
                    const prevSong = contextSongs[prevIndex];
                    
                    // Clear queue tracking since we're going back to context
                    setCurrentQueueSongId(null);
                    
                    set({
                        currentSong: prevSong,
                        isPlaying: true,
                        currentContextSong: prevSong,
                        queuePlaying: false,
                    });
                }
            }
            return;
        }

        // 2️⃣ Normal case: we're playing from context, go to previous in context
        if (contextSongs.length > 0) {
            const currentIndex = contextSongs.findIndex(s => s.id === currentSong.id);
            if (currentIndex === -1) return;

            const prevIndex = (currentIndex - 1 + contextSongs.length) % contextSongs.length;
            const prevSong = contextSongs[prevIndex];
            
            set({
                currentSong: prevSong,
                isPlaying: true,
                currentContextSong: prevSong,
                queuePlaying: false,
            });
        }
    },

    // playPrevSong: () => {
    //     const {
    //         currentSong,
    //         contextSongs,
    //     } = get();

    //     if (!currentSong || contextSongs.length === 0) return;

    //     const currentIndex = contextSongs.findIndex(
    //         (s) => s.id === currentSong.id
    //     );
    //     if (currentIndex === -1) return;

    //     const prevIndex =
    //     (currentIndex - 1 + contextSongs.length) %
    //     contextSongs.length; // wrap around
    //     const prevSong = contextSongs[prevIndex];
    //     set({
    //         currentSong: prevSong,
    //         isPlaying: true,
    //         currentContextSong: prevSong,
    //         queuePlaying: false,
    //     });
    // },

    // Music Player Actions
    volume: 0.5, // Default 50%
    setVolume: (volume) => set({ volume }),

    // Play a specific song
    playSong: (song) => {
        set({
            currentSong: song,
            isPlaying: true,
            pendingSong: null // ??? 
        });
    },

    pendingSong: null, // temporarily holds the song while fetching context
    setPendingSong: (song) => set({ pendingSong: song }),

    // Toggle play/pause for current song
    togglePlay: () => {
        console.log("toggle play");
        set((state) => ({ isPlaying: !state.isPlaying }))
    },
}))

export default useStore
import { create } from 'zustand'

const useStore = create((set, get) => ({

    getUrlBase: () => process.env.REACT_APP_BASE_URL,

    /////// AUTHENTICATION STATE ///////
    authLoading: true,        // Login/signup/token verification
    playlistLoading: false,   // Playlist data
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
    setQueuePlaying: (bool) => set({ queuePlaying: bool }),

    setCurrentContextAndPlaylist: (contextType, playlistId) => {
        set({ 
            currentContext: contextType, 
            currentPlaylistId: playlistId 
        });
    },

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
            set((state) => {
                const updatedState = {
                    likedSongs: state.likedSongs.filter(song => song.id !== song_id)
                };
                
                // If the currently playing song is being removed from its current context, stop playback
                if (state.currentSong?.id === song_id && state.currentContext === "liked_songs") {
                    updatedState.currentSong = null;
                    updatedState.isPlaying = false;
                    updatedState.currentContextSong = null;
                    updatedState.contextSongs = [];
                }
                
                return updatedState;
            });
            
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

    addToRecentlyPlayed: async (song_id) => {
        const {
            user,
            makeAuthenticatedRequest
        } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/recently-played/${song_id}`, {
                method: 'POST'
            });
            
            // Optionally refresh the recently played list if it's currently loaded
            // This ensures the UI updates immediately
            const { recentlyPlayedSongs } = get();
            if (recentlyPlayedSongs.length > 0) {
                // Re-fetch to get the updated order
                get().fetchRecentlyPlayedSongs();
            }
            
            return { success: true, action: data.action };
        } catch (error) {
            console.error('Failed to add to recently played:', error);
            return { success: false, error: error.message };
        }
    },

    clearRecentlyPlayed: async () => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest('/api/user_playlists/recently-played', {
                method: 'DELETE'
            });
            
            // Clear local state after successful API call
            set({
                recentlyPlayedSongs: []
            });
            
            return { success: true, deletedCount: data.deleted_count };
        } catch (error) {
            console.error('Failed to clear recently played:', error);
            return { success: false, error: error.message };
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

    hardcodedPlaylists: [],
    hardcodedPlaylistsLoading: false,

    fetchHardcodedPlaylists: async () => {
        const {
            user,
            makeAuthenticatedRequest
        } = get();

        if (!user) {
            console.error('No user logged in');
            return;
        }
        
        try {
            set({ hardcodedPlaylistsLoading: true });
            const data = await makeAuthenticatedRequest(`/api/playlists/hardcoded`);
            set({ hardcodedPlaylists: data.playlists });
            return data.playlists; // Return the playlists for immediate use
        } catch (error) {
            console.error('Failed to fetch hardcoded playlists:', error);
        } finally {
            set({ hardcodedPlaylistsLoading: false });
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
                // currentPlaylistId: playlistId
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
            set((state) => {
                console.log("=== REMOVE DEBUG ===");
                console.log("songId parameter:", songId, typeof songId);
                console.log("playlistId parameter:", playlistId, typeof playlistId);
                console.log("state.currentSong?.id:", state.currentSong?.id, typeof state.currentSong?.id);
                console.log("state.currentPlaylistId:", state.currentPlaylistId, typeof state.currentPlaylistId);
                
                const updatedState = {
                    currentPlaylistSongs: state.currentPlaylistSongs.filter(s => s.id !== songId),
                    userPlaylists: state.userPlaylists.map(p =>
                        p.id === parseInt(playlistId)
                            ? { ...p, song_count: p.song_count - 1 }
                            : p
                    )
                };
                
                // If the currently playing song is being removed from its current playlist context, stop playback
                if (state.currentSong?.id === songId &&
                    state.currentContext === "playlist" &&
                    state.currentPlaylistId === playlistId) {
                    console.log("🎵 STOPPING PLAYBACK");
                    updatedState.currentSong = null;
                    updatedState.isPlaying = false;
                    updatedState.currentContextSong = null;
                    updatedState.contextSongs = [];
                    updatedState.shuffledContextSongs = []; // Clear shuffle when stopping
                } else {
                    // Update contextSongs if we're in the current playlist context
                    if (state.currentContext === "playlist" && state.currentPlaylistId === playlistId) {
                        updatedState.contextSongs = state.currentPlaylistSongs.filter(s => s.id !== songId);
                    }
                }
                
                return updatedState;
            });
            
            // After state update, regenerate shuffle if needed
            const { shuffleMode, contextSongs, currentContextSong, shuffledContextSongs, currentContext, currentPlaylistId } = get();
            
            if (shuffleMode && currentContext === "playlist" && currentPlaylistId === playlistId && 
                contextSongs.length > 0 && currentContextSong) {
                
                // Check if the removed song was in the shuffled playlist
                const removedFromShuffle = shuffledContextSongs.some(s => s.id === songId);
                
                if (removedFromShuffle) {
                    console.log("Regenerating shuffle after song removal");
                    
                    // Regenerate shuffled playlist with current song first (if it still exists)
                    const currentSongStillExists = contextSongs.some(s => s.id === currentContextSong.id);
                    
                    if (currentSongStillExists) {
                        const otherSongs = contextSongs.filter(s => s.id !== currentContextSong.id);
                        const shuffledOthers = [...otherSongs].sort(() => Math.random() - 0.5);
                        const newShuffledPlaylist = [currentContextSong, ...shuffledOthers];
                        
                        set({ shuffledContextSongs: newShuffledPlaylist });
                    } else {
                        // Current song was removed, clear shuffle
                        set({ shuffleMode: false, shuffledContextSongs: [] });
                    }
                }
            }
            
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

    currentArtist: null,
    currentArtistAlbums: [],
    artistLoading: false,

    fetchArtistInfo: async (artistId) => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user) return null;
        
        try {
            set({ artistLoading: true });
            const data = await makeAuthenticatedRequest(`/api/artists/${parseInt(artistId)}`);
            
            set({
            currentArtist: data,
            currentArtistAlbums: data.albums || []
            });
            
            return data; // ✅ return artist data
        } catch (error) {
            console.error("Failed to fetch artist info:", error);
            return null;
        } finally {
            set({ artistLoading: false });
        }
    },

    playNextSong: async () => {
        console.log("playNextSong");
        const { 
            queueSongs, 
            removeFromQueue, 
            contextSongs, 
            currentContextSong,
            currentQueueSongId,
            setCurrentQueueSongId,
            currentSong,
            repeatMode,
            queuePlaying,
            restartCurrentSong,
            shuffleMode,
            shuffledContextSongs,
            addToRecentlyPlayed, // Add this
            currentContext // Add this
        } = get();

        // If repeat is on and we're NOT playing from queue, repeat current song
        if (repeatMode && !queuePlaying && currentSong) {
            console.log("Repeating current song");
            restartCurrentSong();
            // Add to recently played for repeated songs too (optional)
            if (currentContext !== "recently_played") {
                addToRecentlyPlayed(currentSong.id).catch(console.error);
            }
            return;
        }

        // Special case: queueSongs.length === 1 && currentSong = the only song in the queue
        if (queueSongs.length === 1 && currentQueueSongId && 
            currentSong && queueSongs[0].id === currentSong.id) {
            
            console.log("Special case: Last song in queue, moving to context");
            
            await removeFromQueue(currentSong.id);
            setCurrentQueueSongId(null);
            
            const songsToUse = shuffleMode ? shuffledContextSongs : contextSongs;
            
            if (songsToUse && songsToUse.length > 0 && currentContextSong) {
                const currentIndex = songsToUse.findIndex(s => s.id === currentContextSong.id);
                if (currentIndex !== -1) {
                    const nextIndex = (currentIndex + 1) % songsToUse.length;
                    const nextSong = songsToUse[nextIndex];

                    set({
                        queuePlaying: false,
                        currentSong: nextSong,
                        currentContextSong: nextSong,
                        isPlaying: true
                    });

                    // Add to recently played
                    if (currentContext !== "recently_played") {
                        addToRecentlyPlayed(nextSong.id).catch(console.error);
                    }
                    return;
                }
            }
            
            set({ isPlaying: false });
            return;
        }

        // 1️⃣ Queue priority (normal case with multiple songs)
        if (queueSongs.length > 0) {
            console.log("Queue has priority");

            let nextSong;

            if (currentQueueSongId) {
                const currentQueueIndex = queueSongs.findIndex(s => s.id === currentQueueSongId);
                
                if (currentQueueIndex !== -1 && currentQueueIndex < queueSongs.length - 1) {
                    nextSong = queueSongs[currentQueueIndex + 1];
                } else {
                    nextSong = queueSongs[0];
                }
            } else {
                nextSong = queueSongs[0];
            }

            setCurrentQueueSongId(nextSong.id);

            if (currentQueueSongId) {
                const currentSongStillInQueue = queueSongs.find(s => s.id === currentQueueSongId);
                if (currentSongStillInQueue) {
                    await removeFromQueue(currentQueueSongId);
                }
            }

            set({
                queuePlaying: true,
                currentSong: nextSong,
                isPlaying: true
            });

            // Add to recently played
            if (currentContext !== "recently_played") {
                addToRecentlyPlayed(nextSong.id).catch(console.error);
            }
            return;
        }

        // 2️⃣ No queue → continue in the context
        if (contextSongs && contextSongs.length > 0) {
            const songsToUse = shuffleMode ? shuffledContextSongs : contextSongs;
            
            console.log(`Playing from context - ${shuffleMode ? 'shuffled' : 'normal'} order`);
            
            const currentIndex = songsToUse.findIndex(s => s.id === currentContextSong.id);
            if (currentIndex === -1) return;

            const nextIndex = (currentIndex + 1) % songsToUse.length;
            const nextSong = songsToUse[nextIndex];

            set({
                queuePlaying: false,
                currentSong: nextSong,
                currentContextSong: nextSong,
                isPlaying: true,
                currentQueueSongId: null,
            });

            // Add to recently played
            if (currentContext !== "recently_played") {
                addToRecentlyPlayed(nextSong.id).catch(console.error);
            }
        }
    },

    playPrevSong: () => {
        const {
            currentSong,
            contextSongs,
            queueSongs,
            currentQueueSongId,
            setCurrentQueueSongId,
            shuffleMode,
            shuffledContextSongs,
            currentContextSong,
            addToRecentlyPlayed, // Add this
            currentContext // Add this
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

                // Add to recently played
                if (currentContext !== "recently_played") {
                    addToRecentlyPlayed(prevSong.id).catch(console.error);
                }
                return;
            }
            
            // No previous song in queue, fall back to context if available
            const songsToUse = shuffleMode ? shuffledContextSongs : contextSongs;
            if (songsToUse.length > 0 && currentContextSong) {
                console.log("No prev in queue, falling back to context");
                
                const currentIndex = songsToUse.findIndex(s => s.id === currentContextSong.id);
                if (currentIndex !== -1) {
                    const prevIndex = (currentIndex - 1 + songsToUse.length) % songsToUse.length;
                    const prevSong = songsToUse[prevIndex];
                    
                    // Clear queue tracking since we're going back to context
                    setCurrentQueueSongId(null);
                    
                    set({
                        currentSong: prevSong,
                        isPlaying: true,
                        currentContextSong: prevSong,
                        queuePlaying: false,
                    });

                    // Add to recently played
                    if (currentContext !== "recently_played") {
                        addToRecentlyPlayed(prevSong.id).catch(console.error);
                    }
                }
            }
            return;
        }

        // 2️⃣ Normal case: we're playing from context, go to previous in context (with shuffle support)
        if (contextSongs.length > 0) {
            // Use shuffled order if shuffle is on, otherwise use normal order
            const songsToUse = shuffleMode ? shuffledContextSongs : contextSongs;
            
            const currentIndex = songsToUse.findIndex(s => s.id === currentSong.id);
            if (currentIndex === -1) return;

            const prevIndex = (currentIndex - 1 + songsToUse.length) % songsToUse.length;
            const prevSong = songsToUse[prevIndex];
            
            set({
                currentSong: prevSong,
                isPlaying: true,
                currentContextSong: prevSong,
                queuePlaying: false,
            });

            // Add to recently played
            if (currentContext !== "recently_played") {
                addToRecentlyPlayed(prevSong.id).catch(console.error);
            }
        }
    },

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

        const {
            addToRecentlyPlayed,
            currentContext
        } = get();
    
        console.log("playSong: ");
        if (currentContext !== "recently_played") {
            console.log("currentContext: ", currentContext);
            addToRecentlyPlayed(song.id).catch(error => {
                console.error('Failed to track recently played:', error);
                // Don't stop playback if recently played tracking fails
            });
        }
    },

    repeatMode: false, // true = repeat current song
    setRepeatMode: (mode) => set({ repeatMode: mode }),

    restartTrigger: 0,
    restartCurrentSong: () => set((state) => ({ restartTrigger: state.restartTrigger + 1 })),

    pendingSong: null, // temporarily holds the song while fetching context
    setPendingSong: (song) => set({ pendingSong: song }),

    shuffleMode: false,
    shuffledContextSongs: [],

    toggleShuffle: () => {
        const {
            shuffleMode,
            contextSongs,
            currentContextSong
        } = get();
        
        if (!shuffleMode && contextSongs.length > 0 && currentContextSong) {
            // Turning shuffle ON - create shuffled playlist with current song first
            const otherSongs = contextSongs.filter(s => s.id !== currentContextSong.id);
            const shuffledOthers = [...otherSongs].sort(() => Math.random() - 0.5);
            const shuffledPlaylist = [currentContextSong, ...shuffledOthers];
            
            console.log("Shuffle ON: Created shuffled playlist with", shuffledPlaylist.length, "songs");
            
            set({ 
                shuffleMode: true, 
                shuffledContextSongs: shuffledPlaylist 
            });
        } else {
            // Turning shuffle OFF
            console.log("Shuffle OFF: Returning to normal order");
            
            set({ 
                shuffleMode: false, 
                shuffledContextSongs: [] 
            });
        }
    },

    // Toggle play/pause for current song
    togglePlay: () => {
        // console.log("toggle play");
        set((state) => ({ isPlaying: !state.isPlaying }))
    },

    updateShuffleForContextChange: () => {
        const {
            shuffleMode,
            contextSongs,
            currentContextSong,
            shuffledContextSongs
        } = get();
        
        if (shuffleMode && contextSongs.length > 0 && currentContextSong) {
            // Check if the current shuffled playlist is still valid
            const shuffledIds = shuffledContextSongs.map(s => s.id);
            const contextIds = contextSongs.map(s => s.id);
            
            // If songs don't match, regenerate shuffle
            const songsMatch = shuffledIds.every(id => contextIds.includes(id)) && 
                            contextIds.every(id => shuffledIds.includes(id));
            
            if (!songsMatch) {
                console.log("Context changed, regenerating shuffle");
                
                // Regenerate shuffled playlist with current song first
                const otherSongs = contextSongs.filter(s => s.id !== currentContextSong.id);
                const shuffledOthers = [...otherSongs].sort(() => Math.random() - 0.5);
                const newShuffledPlaylist = [currentContextSong, ...shuffledOthers];
                
                set({ shuffledContextSongs: newShuffledPlaylist });
            }
        }
    },

    searchResults: { songs: [], albums: [], artists: [] },
    searchLoading: false,
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    clearSearchResults: () => set({ 
        searchResults: { songs: [], albums: [], artists: [] },
        searchQuery: '' 
    }),

    performSearch: async (query) => {
        const { user, makeAuthenticatedRequest } = get();
        if (!user || !query.trim()) {
            set({ searchResults: { songs: [], albums: [], artists: [] } });
            return;
        }

        try {
            set({ searchLoading: true });
            const data = await makeAuthenticatedRequest(`/api/search/?q=${encodeURIComponent(query)}`);
            
            set({ 
            searchResults: {
                songs: data.songs || [],
                albums: data.albums || [],
                artists: data.artists || []
            }
            });
        } catch (error) {
            console.error('Search failed:', error);
            set({ searchResults: { songs: [], albums: [], artists: [] } });
        } finally {
            set({ searchLoading: false });
        }
    },

    // Is Mobile.
    isMobile: false,
    setIsMobile: (bool) => set({ isMobile: bool }),


    mobileActiveTab: "playlist",
    setMobileActiveTab: (newTab) => set({ mobileActiveTab: newTab }),
}))

export default useStore
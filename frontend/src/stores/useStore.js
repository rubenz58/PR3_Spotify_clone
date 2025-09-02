import { create } from 'zustand'

const useStore = create((set, get) => ({

    getUrlBase: () => process.env.REACT_APP_BASE_URL,

    /////// AUTHENTICATION STATE ///////
    authLoading: true,        // Login/signup/token verification
    playlistLoading: false,   // Playlist data
    searchLoading: false,     // Search operations
    playerLoading: false,     // Audio file loading/buffering
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

        console.log('Making request to:', `${BASE_URL}${url}`);
        console.log('Token exists:', !!token);
        console.log('Full token:', token);
        console.log('Request headers:', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        });

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

        console.log('Response status:', response.status); // Add this line

        if (!response.ok) {
            console.log('Response not ok, status:', response.status, response.statusText); // Add this line
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
        console.log("checkExistingAuth: Running")
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

    currentSong: null, // { id: 1, title: "Song Name", artist: "Artist", file_path: "..." }
    isPlaying: false,
    volume: 50,
    songs: [],
    userPlaylists: [],
    songLoading: false,
    currentPlaylistSongs: [],
    currentPlaylistId: null,
    likedSongs: [],
    recentlyPlayedSongs: [],
    queueSongs: [],

    fetchLikedSongs: async () => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/liked-songs`);
            set({ likedSongs: data.liked_songs });
            set({ currentPlaylistSongs: data.liked_songs, currentPlaylistId: "liked_songs" });

        } catch (error) {
            console.error('Failed to fetch liked songs:', error);
        }
    },

    addLikedSong: async (song_id) => {
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
                // Also update currentPlaylistSongs if we're in the liked songs view  
                currentPlaylistSongs: state.currentPlaylistId === "liked_songs"
                    ? [newLikedSong, ...state.currentPlaylistSongs]
                    : state.currentPlaylistSongs
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to add liked song:', error);
            return { success: false, error: error.message };
        }
    },

    removeLikedSong: async (song_id) => {
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            await makeAuthenticatedRequest(`/api/user_playlists/liked-songs/${song_id}`, {
                method: 'DELETE'
            });
            
            // Update local state after successful API call
            set((state) => ({
                likedSongs: state.likedSongs.filter(song => song.id !== song_id),
                // Also update currentPlaylistSongs if we're in the liked songs view
                currentPlaylistSongs: state.currentPlaylistId === "liked_songs" 
                    ? state.currentPlaylistSongs.filter(song => song.id !== song_id)
                    : state.currentPlaylistSongs
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to remove liked song:', error);
            return { success: false, error: error.message };
        }
    },

    fetchQueueSongs: async () => {

        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/queue`);
            set({ queueSongs: data.queue_songs });
            set({ currentPlaylistSongs: data.queue_songs, currentPlaylistId: "queue" });

        } catch (error) {
            console.error('Failed to fetch queue songs:', error);
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
                // Also update currentPlaylistSongs if we're in the queue view
                currentPlaylistSongs: state.currentPlaylistId === "queue"
                    ? [...state.currentPlaylistSongs, newQueueSong]
                    : state.currentPlaylistSongs
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
                // Also update currentPlaylistSongs if we're in the queue view
                currentPlaylistSongs: state.currentPlaylistId === "queue"
                    ? state.currentPlaylistSongs.filter(song => song.id !== song_id)
                    : state.currentPlaylistSongs
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to remove song from queue:', error);
            return { success: false, error: error.message };
        }
    },

    fetchRecentlyPlayedSongs: async () => {

        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) return;
        
        try {
            const data = await makeAuthenticatedRequest(`/api/user_playlists/recently-played`);
            set({ recentlyPlayedSongs: data.recently_played_songs });
            set({ currentPlaylistSongs: data.recently_played_songs, currentPlaylistId: "recently_played" });

        } catch (error) {
            console.error('Failed to fetch recently played songs:', error);
        }

    },

    setCurrentPlaylistSongs: (currentPlaylistSongs) => set({ currentPlaylistSongs }),
    setCurrentPlaylistId: (currentPlaylistId) => set({ currentPlaylistId }),

    // Fetch all playlists for a specific user
    fetchUserPlaylists: async () => {
        console.log("Fetching Playlists");
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
        const {
            user,
            makeAuthenticatedRequest,
        } = get();
    
        if (!user) return;

        try {
            set({ playlistLoading: true });
            const data = await makeAuthenticatedRequest(`/api/playlists/${playlistId}/songs`);
            set({ currentPlaylistSongs: data.songs, currentPlaylistId: playlistId });
        } catch (error) {
            console.error('Failed to fetch playlist songs:', error);
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
                )
            }));
            
            return { success: true };
            
        } catch (error) {
            console.error('Failed to add song to playlist:', error);
            return { success: false, error: error.message };
        } finally {
            set({ playlistLoading: false });
        }
    },


    // JUST USED FOR TESTING INITIALLY
    // Fetch all songs from backend
    fetchSongs: async () => {
        const { getUrlBase } = get();
        const BASE_URL = getUrlBase();
        
        try {
            set({ songLoading: true })
            const response = await fetch(`${BASE_URL}/api/songs`)
            const data = await response.json()
            set({ songs: data.songs })
        } catch (error) {
            console.error('Failed to fetch songs:', error)
        } finally {
            set({ songLoading: false })
        }
    },

    // Play a specific song
    playSong: (song) => {
        set({ currentSong: song, isPlaying: true });
    },

    // Toggle play/pause for current song
    togglePlay: () => {
        console.log("toggle play");
        set((state) => ({ isPlaying: !state.isPlaying }))
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
        
        if (!user) return;

        try {
            set({ albumLoading: true });
            const data = await makeAuthenticatedRequest(`/api/albums/${parseInt(albumId)}`);

            // console.log("Setting currentAlbumSongs:", data.album.songs);

            // Store the album data and its songs
            set({ 
                currentAlbum: data.album,
                currentAlbumSongs: data.album.songs 
            });
            
            return { success: true, album: data.album };
            
        } catch (error) {
            console.error('Failed to fetch album songs:', error);
            return { success: false, error: error.message };
        } finally {
            set({ albumLoading: false });
        }
    },
    



    // // Future: Music Player Actions
    // setVolume: (volume) => set({ volume }),
    // addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
}))

export default useStore
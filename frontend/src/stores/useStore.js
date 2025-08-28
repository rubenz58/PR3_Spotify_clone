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
        console.log('Full token:', token); // Add this line
        console.log('Request headers:', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        }); // Add this line

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
    playlist: [],
    queue: [],
    songLoading: false,
    currentPlaylistSongs: [],
    currentPlaylistId: null,

    setCurrentPlaylistSongs: (currentPlaylistSongs) => set({ currentPlaylistSongs }),
    setCurrentPlaylistId: (currentPlaylistId) => set({ currentPlaylistId }),

    // Fetch all playlists for a specific user
    fetchPlaylists: async () => {
        console.log("Fetching Playlists");
        const { user, makeAuthenticatedRequest } = get();
        
        if (!user) {
            console.error('No user logged in');
            return;
        }
        
        try {
            set({ playlistLoading: true });

            const data = await makeAuthenticatedRequest(`/api/playlists/`);
            
            set({ playlists: data.playlists });
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        } finally {
            set({ playlistLoading: false });
        }
    },

    fetchPlaylistSongs: async (playlistId) => {
        const { user, makeAuthenticatedRequest } = get();
    
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
        set({ currentSong: song, isPlaying: true })
    },

    // Toggle play/pause for current song
    togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }))
    },

    // // Future: Music Player Actions
    // setVolume: (volume) => set({ volume }),
    // addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
}))

export default useStore
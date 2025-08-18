import { create } from 'zustand'

const useStore = create((set, get) => ({

    getApiBase: () => process.env.REACT_APP_API_BASE_URL,

    /////// AUTHENTICATION STATE ///////
    user: null,
    token: null,
    loading: true,
    oAuthLoading: false,

    // Setters (for direct state updates if needed)
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setLoading: (loading) => set({ loading }),
    setOAuthLoading: (oAuthLoading) => set({ oAuthLoading }),

    // CHECK FOR EXISTING LOGIN ON APP START
    checkExistingAuth: async () => {
        const { user } = get()
        
        if (user) return // Skip if user already exists

        const stored_token = localStorage.getItem('token')

        if (stored_token) {
            try {
                // Verify token is still valid by calling /me endpoint
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, {
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

        set({ loading: false })
    },

    // Fetches Google Auth Url from BKND
    loginWithGoogle: async () => {
        console.log("google login attempt")

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/google/login`)
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
        set({ loading: true })

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
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
            set({ loading: false }) // Hide loading state
        }
    },

    signup: async (userData) => {
        set({ loading: true })

        try {
            console.log("Signup Attempt");
            console.log("API_BASE: " + process.env.REACT_APP_API_BASE_URL);
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, {
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
            set({ loading: false }) // Hide loading state
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

    // Fetch all songs from backend
    fetchSongs: async () => {
    const { getApiBase } = get()
    const API_BASE = getApiBase()
    
    try {
        set({ songLoading: true })
        const response = await fetch(`${API_BASE}/api/songs`)
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
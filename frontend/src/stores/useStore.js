import { create } from 'zustand'

const useStore = create((set, get) => ({
    // Auth State
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

    // Future: Music Player State (add these as you build features)
    // currentSong: null,
    // isPlaying: false,
    // volume: 50,
    // playlist: [],
    // queue: [],

    // // Future: Music Player Actions
    // playSong: (song) => set({ currentSong: song, isPlaying: true }),
    // togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    // setVolume: (volume) => set({ volume }),
    // addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
}))

export default useStore
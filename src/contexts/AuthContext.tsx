import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect
} from 'firebase/auth'
import type { User, UserCredential } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { ensureBackendUser } from '../services/userService'

interface AuthContextType {
    currentUser: User | null
    login: (email: string, password: string) => Promise<UserCredential>
    register: (email: string, password: string) => Promise<UserCredential>
    logout: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    signInWithGoogle: () => Promise<UserCredential>
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)

    const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)

    const logout = () => signOut(auth)

    const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
            return await signInWithPopup(auth, provider)
        } catch (error: any) {
            // Fallback ke redirect jika popup gagal karena COOP atau kebijakan browser
            const coopBlocked =
                error?.message?.includes('Cross-Origin-Opener-Policy') ||
                error?.code === 'auth/popup-blocked' ||
                error?.code === 'auth/web-storage-unsupported'

            if (coopBlocked) {
                console.warn('Popup login diblokir, menggunakan redirect sign in')
                return signInWithRedirect(auth, provider)
            }

            throw error
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            setCurrentUser(user)
            if (user?.email) {
                try {
                    const backend = await ensureBackendUser(user.email, user.displayName || 'User')
                    localStorage.setItem('backendUserId', backend._id)
                    localStorage.setItem('userToken', backend.token)
                } catch (e) {
                    console.error('Sync backend user gagal:', e)
                }
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value: AuthContextType = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        signInWithGoogle,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
} 
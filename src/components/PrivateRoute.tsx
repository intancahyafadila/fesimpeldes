import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface PrivateRouteProps {
    children: ReactElement
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { currentUser, loading } = useAuth()

    // Sambil menunggu status autentikasi, jangan render apa-apa (bisa diganti spinner)
    if (loading) {
        return null
    }

    return currentUser ? children : <Navigate to="/login" replace />
} 
import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

interface AdminPrivateRouteProps {
    children: ReactElement
}

export default function AdminPrivateRoute({ children }: AdminPrivateRouteProps) {
    const storedAdminData = localStorage.getItem('adminData')
    const storedToken = localStorage.getItem('adminToken')

    if (storedAdminData && storedToken) {
        try {
            const adminData = JSON.parse(storedAdminData)
            if (adminData.role === 'admin') {
                return children
            }
        } catch (error) {
            console.error('Error parsing admin data:', error)
        }
    }

    // Jika tidak memenuhi syarat, redirect ke halaman login admin
    return <Navigate to="/admin" replace />
} 
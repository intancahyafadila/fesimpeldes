import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function Dashboard() {
    const { currentUser } = useAuth()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-4 space-y-6">
                <h1 className="text-3xl font-bold">Selamat Datang</h1>
                <p className="text-lg">
                    Anda masuk sebagai <span className="font-semibold">{currentUser?.email}</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/pengaduan">
                        <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                            📋 Kelola Pengaduan
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    )
} 
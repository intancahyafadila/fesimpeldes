import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { useState, useEffect } from 'react'
import { useModal } from '../components/ui/modal'
import PengaduanList from '../components/PengaduanList'
import { PengaduanService } from '../services/pengaduanService'
import type { Complaint } from '../types/complaint'

interface AdminData {
    _id: string
    name: string
    email: string
    role: string
    token: string
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [adminData, setAdminData] = useState<AdminData | null>(null)
    const [pengaduan, setPengaduan] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(false)
    const [showPengaduan, setShowPengaduan] = useState(false)

    const { showError, ModalComponent } = useModal()

    useEffect(() => {
        const storedAdminData = localStorage.getItem('adminData')
        const storedToken = localStorage.getItem('adminToken')
        if (!storedAdminData || !storedToken) {
            navigate('/admin')
            return
        }
        try {
            const parsed = JSON.parse(storedAdminData)
            if (parsed.role !== 'admin') {
                handleLogout()
                return
            }
            setAdminData(parsed)
        } catch (e) {
            handleLogout()
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        navigate('/admin')
    }

    const loadAllPengaduan = async () => {
        setLoading(true)
        try {
            const data = await PengaduanService.getAllPengaduan()
            setPengaduan(data)
        } catch (error: any) {
            console.error('Error loading pengaduan:', error)
            showError('Gagal Memuat Data', error.message || 'Gagal memuat daftar pengaduan')
        } finally {
            setLoading(false)
        }
    }

    const handleShowPengaduan = () => {
        setShowPengaduan(true)
        loadAllPengaduan()
    }

    if (!adminData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
                <p>Memuat dashboard...</p>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/admin/dashboard" className="text-xl font-bold text-gray-900">
                                    SiPelMasD Admin
                                </Link>
                            </div>
                            <nav className="hidden md:flex items-center space-x-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">{adminData.name}</span>
                                    <span className="text-xs text-gray-500">{adminData.email}</span>
                                </div>
                                <Button variant="outline" onClick={handleLogout} className="ml-4">
                                    Keluar
                                </Button>
                            </nav>
                            <div className="md:hidden">
                                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        {isMobileMenuOpen && (
                            <div className="md:hidden border-t border-gray-200 py-4">
                                <div className="space-y-3">
                                    <div className="px-2">
                                        <div className="text-sm font-medium text-gray-900">{adminData.name}</div>
                                        <div className="text-xs text-gray-500">{adminData.email}</div>
                                    </div>
                                    <Button variant="outline" onClick={handleLogout} className="w-full">
                                        Keluar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="py-8 sm:py-12 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 lg:mb-12">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Dashboard Admin</h1>
                            <p className="text-base sm:text-lg text-gray-700 mb-2">Selamat datang, {adminData.name}!</p>
                            <p className="text-sm sm:text-base text-gray-600">Panel administrasi untuk mengelola sistem SiPelMasD</p>
                        </div>

                        {!showPengaduan ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleShowPengaduan}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            📋 Kelola Pengaduan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            Lihat, edit, dan kelola semua pengaduan masyarakat.
                                            Anda dapat mengubah status dan menghapus pengaduan sebagai admin.
                                        </p>
                                        <Button className="w-full">
                                            Kelola Pengaduan
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            👥 Manajemen User
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            Kelola akun pengguna dan hak akses sistem.
                                        </p>
                                        <Button variant="outline" className="w-full" disabled>
                                            Segera Hadir
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Kelola Semua Pengaduan</h2>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPengaduan(false)}
                                        className="flex items-center gap-2"
                                    >
                                        ← Kembali ke Dashboard
                                    </Button>
                                </div>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-blue-800 font-medium">Mode Admin</span>
                                        </div>
                                        <p className="text-blue-700 mt-2">
                                            Anda dapat mengedit dan menghapus semua pengaduan sebagai administrator.
                                        </p>
                                    </CardContent>
                                </Card>

                                <PengaduanList
                                    pengaduan={pengaduan}
                                    onUpdate={loadAllPengaduan}
                                    loading={loading}
                                    canEdit={true}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <ModalComponent />
        </>
    )
} 
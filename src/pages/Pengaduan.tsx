import { useState, useEffect, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useModal } from '../components/ui/modal'
import { useAuth } from '../contexts/AuthContext'
import { PengaduanService } from '../services/pengaduanService'
import type { Complaint } from '../types/complaint'

// Lazy load components
const PengaduanList = lazy(() => import('../components/PengaduanList'))

export default function PengaduanPage() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [pengaduan, setPengaduan] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { showSuccess, showError, ModalComponent } = useModal()

    // Form state
    const [formData, setFormData] = useState<{ title: string; description: string }>({
        title: '',
        description: ''
    })

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const backendUserId = localStorage.getItem('backendUserId')
        if (!backendUserId) {
            setError('User belum sinkron dengan server')
            return
        }

        try {
            setError('')
            setLoading(true)

            await PengaduanService.createPengaduan(backendUserId, formData)

            // Reset form
            setFormData({ title: '', description: '' })
            setShowForm(false)

            // Refresh list
            loadPengaduan()

            showSuccess('Berhasil!', 'Pengaduan berhasil dibuat dan akan segera ditindaklanjuti')

        } catch (error: any) {
            console.error('Error creating pengaduan:', error)
            showError('Gagal Membuat Pengaduan', error.message || 'Gagal membuat pengaduan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    const loadPengaduan = async () => {
        const backendUserId = localStorage.getItem('backendUserId')
        if (!backendUserId) return

        try {
            setLoading(true)
            const response = await PengaduanService.getPengaduan({
                userId: backendUserId
            })
            setPengaduan(response.data)
        } catch (error: any) {
            console.error('Error loading pengaduan:', error)
            showError('Gagal Memuat Data', error.message || 'Gagal memuat daftar pengaduan')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPengaduan()
    }, [currentUser])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header - Responsive */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                                SiPelMasD
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-4">
                            <Link to="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" className="bg-blue-50 text-blue-600">
                                Pengaduan
                            </Button>
                            <span className="text-sm text-gray-700 truncate max-w-48">
                                Halo, {currentUser?.email}
                            </span>
                            <Button variant="outline" onClick={handleLogout}>
                                Keluar
                            </Button>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4">
                            <div className="space-y-3">
                                <Link to="/dashboard" className="block">
                                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                                </Link>
                                <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600">
                                    Pengaduan
                                </Button>
                                <div className="text-sm text-gray-700 px-2">
                                    Halo, {currentUser?.email}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    Keluar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content - Responsive */}
            <main className="py-8 sm:py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Pengaduan Masyarakat
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 mb-6">
                            Sampaikan keluhan, saran, atau laporan Anda kepada kami
                        </p>

                        {/* Action Button */}
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="mb-6"
                            size="lg"
                        >
                            {showForm ? 'Tutup Form' : 'Buat Pengaduan Baru'}
                        </Button>
                    </div>

                    {/* Create Form - Responsive */}
                    {showForm && (
                        <Card className="mb-8 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl sm:text-2xl">Buat Pengaduan Baru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-md text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm sm:text-base">Judul Pengaduan</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            type="text"
                                            placeholder="Masukkan judul pengaduan"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            className="text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm sm:text-base">Deskripsi</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            placeholder="Jelaskan detail pengaduan Anda"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button type="submit" disabled={loading} className="flex-1">
                                            {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1"
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pengaduan List - Lazy Loaded */}
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardHeader>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded"></div>
                                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        }
                    >
                        <PengaduanList
                            pengaduan={pengaduan}
                            onUpdate={loadPengaduan}
                            loading={loading}
                        />
                    </Suspense>
                </div>
            </main>

            <ModalComponent />
        </div>
    )
} 
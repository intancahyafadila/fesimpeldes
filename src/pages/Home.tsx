import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { useState, useEffect } from 'react'

export default function Home() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        // Trigger animations on mount
        setIsVisible(true)

        // Parallax scroll effect
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
                <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
            </div>

            {/* Header - Responsive with slide-down animation */}
            <header className={`bg-white shadow-sm border-b relative z-10 transform transition-transform duration-1000 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
                                SiPelMasD
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-4">
                            <Link to="/">
                                <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Beranda</Button>
                            </Link>
                            <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Layanan</Button>
                            <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Tentang</Button>
                            <Link to="/login">
                                <Button variant="outline" className="hover:scale-105 transition-all duration-200 hover:shadow-lg">Masuk</Button>
                            </Link>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="hover:scale-110 transition-transform duration-200"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation with slide animation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4 animate-slideDown">
                            <div className="space-y-2">
                                <Link to="/" className="block">
                                    <Button variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">Beranda</Button>
                                </Link>
                                <Button variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">Layanan</Button>
                                <Button variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">Tentang</Button>
                                <Link to="/login" className="block">
                                    <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-200">Masuk</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section - Responsive with parallax and fade-in */}
            <section className="py-12 sm:py-16 lg:py-20 relative z-10" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Sistem Informasi
                        <br />
                        <span className="text-blue-600 inline-block animate-pulse">Pelayanan Masyarakat Digital</span>
                    </h1>
                    <p className={`text-base sm:text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto px-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Platform digital yang memudahkan masyarakat dalam mengakses berbagai
                        layanan pemerintahan secara online, cepat, dan transparan.
                    </p>
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Link to="/login">
                            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto hover:scale-110 transition-all duration-300 hover:shadow-xl animate-bounce-subtle">
                                Mulai Layanan
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto hover:scale-110 transition-all duration-300 hover:shadow-xl">
                            Pelajari Lebih Lanjut
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section - Responsive with staggered animation */}
            <section className="py-12 sm:py-16 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-8 sm:mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Fitur Unggulan
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Kemudahan akses layanan pemerintahan dalam genggaman Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <Card className={`hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-300`}>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <span className="text-2xl animate-bounce">🏛️</span>
                                    Administrasi Kependudukan
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Layanan pembuatan KTP, KK, Akta Kelahiran dan dokumen kependudukan lainnya
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Permohonan KTP Elektronik</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Perubahan Data Penduduk</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Surat Keterangan Domisili</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className={`hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500`}>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <span className="text-2xl animate-bounce delay-100">🏢</span>
                                    Perizinan Usaha
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Pengurusan izin usaha dan investasi untuk mendukung perekonomian daerah
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Izin Mendirikan Bangunan</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Surat Izin Usaha Perdagangan</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Izin Usaha Mikro Kecil</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className={`hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform md:col-span-2 lg:col-span-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-700`}>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <span className="text-2xl animate-bounce delay-200">📋</span>
                                    Layanan Publik
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Berbagai layanan publik lainnya untuk memenuhi kebutuhan masyarakat
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Surat Keterangan Tidak Mampu</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Pengaduan Masyarakat</li>
                                    <li className="hover:text-blue-600 transition-colors duration-200">• Informasi Pembangunan Desa</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section - Responsive with gradient animation */}
            <section className={`py-12 sm:py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-size-200 animate-gradient relative z-10 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 animate-pulse">
                        Mulai Gunakan SiPelMasD Sekarang
                    </h2>
                    <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
                        Daftar sekarang dan nikmati kemudahan layanan pemerintahan digital
                    </p>
                    <Link to="/login">
                        <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-pulse">
                            Daftar Sekarang
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer - Responsive with fade-in */}
            <footer className={`bg-gray-900 text-white py-6 sm:py-8 relative z-10 transform transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 hover:text-blue-400 transition-colors duration-300">SiPelMasD</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            Sistem Informasi Pelayanan Masyarakat Digital
                        </p>
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-400 text-xs sm:text-sm">
                                © 2025 Intan Cahya Fadila. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Developed with ❤️ by{' '}
                                <a
                                    href="https://github.com/intancahyafadila"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline"
                                >
                                    Intan Cahya Fadila
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    )
} 
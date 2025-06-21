import { useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { useModal } from '../components/ui/modal'
import { useAuth } from '../contexts/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'

// Lazy load components that are not immediately visible
const FirebaseInstructions = lazy(() => import('../components/FirebaseInstructions'))

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login, signInWithGoogle } = useAuth()

    const { showSuccess, showError, showWarning, ModalComponent } = useModal()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Jika Firebase belum dikonfigurasi, gunakan demo mode
        if (!isFirebaseConfigured) {
            showWarning(
                'Mode Demo',
                'Login berhasil! Untuk menggunakan Firebase Authentication, ikuti instruksi setup di bawah.'
            )
            navigate('/dashboard')
            return
        }

        try {
            setError('')
            setLoading(true)

            // Firebase authentication
            await login(email, password)

            // Redirect ke dashboard setelah login berhasil
            showSuccess('Login Berhasil!', 'Selamat datang di SiPelMasD')
            navigate('/dashboard')

        } catch (error: any) {
            console.error('Login error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            let errorMessage = 'Terjadi kesalahan saat login'

            // Handle Firebase auth errors
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Email tidak terdaftar. Silakan daftar terlebih dahulu.'
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Password salah'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format email tidak valid'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Terlalu banyak percobaan. Coba lagi nanti'
            } else if (error.code === 'auth/api-key-not-valid') {
                errorMessage = 'Konfigurasi Firebase tidak valid. Periksa setup Firebase Anda.'
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Email atau password salah. Pastikan Anda sudah terdaftar.'
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'Akun telah dinonaktifkan'
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Login dengan email/password belum diaktifkan. Hubungi administrator.'
            } else {
                errorMessage = `Error: ${error.message || 'Terjadi kesalahan tidak terduga'}`
            }

            setError(errorMessage)
        }

        setLoading(false)
    }

    const handleGoogleSignIn = async () => {
        if (!isFirebaseConfigured) {
            showWarning(
                'Mode Demo',
                'Google Sign In akan tersedia setelah Firebase dikonfigurasi.'
            )
            return
        }

        try {
            setError('')
            setLoading(true)
            await signInWithGoogle()
            showSuccess('Login Berhasil!', 'Berhasil masuk dengan akun Google')
            navigate('/dashboard')
        } catch (error: any) {
            console.error('Google Sign In error:', error)
            let errorMessage = 'Terjadi kesalahan saat login dengan Google'

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login dibatalkan'
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up diblokir oleh browser'
            } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
                errorMessage = 'Pop-up diblokir karena kebijakan keamanan browser, kami alihkan ke metode redirect. Silakan coba lagi jika tidak otomatis.'
            }

            showError('Gagal Login dengan Google', errorMessage)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header - Responsive */}
                <div className="text-center mb-6 sm:mb-8">
                    <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        SiPelMasD
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">Sistem Informasi Pelayanan Masyarakat Digital</p>
                </div>

                {/* Firebase Status Warning */}
                {!isFirebaseConfigured && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Mode Demo</h3>
                        <p className="text-xs text-yellow-700">
                            Firebase belum dikonfigurasi. Lihat instruksi setup di bawah untuk mengaktifkan authentication.
                        </p>
                    </div>
                )}

                {/* Login Card - Responsive */}
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-xl sm:text-2xl">Masuk ke Akun</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            {isFirebaseConfigured
                                ? "Masukkan email dan kata sandi untuk mengakses layanan"
                                : "Mode demo - masukkan email dan password apa saja"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-md text-sm">
                                    {error}
                                    {error.includes('tidak terdaftar') && (
                                        <div className="mt-2 pt-2 border-t border-red-200">
                                            <p className="text-xs">
                                                💡 <strong>Saran:</strong> Klik "Daftar di sini" di bawah untuk membuat akun baru terlebih dahulu.
                                            </p>
                                        </div>
                                    )}
                                    {error.includes('operation-not-allowed') && (
                                        <div className="mt-2 pt-2 border-t border-red-200">
                                            <p className="text-xs">
                                                💡 <strong>Solusi:</strong> Email/Password authentication belum diaktifkan di Firebase Console.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={isFirebaseConfigured ? "contoh@email.com" : "demo@email.com (contoh)"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm sm:text-base">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={isFirebaseConfigured ? "Masukkan kata sandi" : "123456 (contoh)"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>

                        {/* Google Sign In - Lazy Loaded */}
                        {isFirebaseConfigured && (
                            <div className="mt-4 sm:mt-6 space-y-3">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground">Atau masuk dengan</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full text-sm sm:text-base"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EB4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Masuk dengan Google
                                </Button>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 sm:space-y-4">
                        <div className="text-xs sm:text-sm text-center text-gray-600">
                            <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                Lupa kata sandi?
                            </Link>
                        </div>

                        <div className="text-xs sm:text-sm text-center text-gray-600">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Daftar di sini
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Atau</span>
                            </div>
                        </div>

                        <Link to="/admin" className="w-full">
                            <Button variant="outline" className="w-full text-sm sm:text-base">
                                Masuk sebagai Admin
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-4 sm:mt-6">
                    <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        ← Kembali ke Beranda
                    </Link>
                </div>

                {/* Firebase Setup Instructions - Lazy Loaded */}
                <Suspense fallback={<div className="mt-4 text-center text-xs text-gray-500">Memuat instruksi...</div>}>
                    <FirebaseInstructions />
                </Suspense>
            </div>

            <ModalComponent />
        </div>
    )
} 
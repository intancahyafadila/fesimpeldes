import { useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { useModal } from '../components/ui/modal'
import { useAuth } from '../contexts/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'

// Lazy load components
const FirebaseInstructions = lazy(() => import('../components/FirebaseInstructions'))

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nik: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { register, signInWithGoogle } = useAuth()

    const { showSuccess, showError, showWarning, ModalComponent } = useModal()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError('Kata sandi tidak cocok')
            return
        }

        if (formData.password.length < 6) {
            setError('Kata sandi harus minimal 6 karakter')
            return
        }

        // Jika Firebase belum dikonfigurasi, gunakan demo mode
        if (!isFirebaseConfigured) {
            showSuccess(
                'Pendaftaran Berhasil!',
                'Akun berhasil dibuat. Silakan login dengan akun yang baru dibuat.'
            )
            navigate('/login')
            return
        }

        try {
            setError('')
            setLoading(true)
            await register(formData.email, formData.password)
            showSuccess(
                'Pendaftaran Berhasil!',
                'Akun berhasil dibuat. Silakan login dengan akun yang baru dibuat.'
            )
            navigate('/login')
        } catch (error: any) {
            console.error('Registration error:', error)
            let errorMessage = 'Terjadi kesalahan saat mendaftar'

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format email tidak valid'
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.'
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Pendaftaran dengan email/password belum diaktifkan. Hubungi administrator.'
            } else {
                errorMessage = error.message || 'Terjadi kesalahan tidak terduga'
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
            showSuccess(
                'Pendaftaran Berhasil!',
                'Berhasil mendaftar dengan akun Google'
            )
            navigate('/dashboard')
        } catch (error: any) {
            console.error('Google Sign In error:', error)
            let errorMessage = 'Terjadi kesalahan saat mendaftar dengan Google'

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Pendaftaran dibatalkan'
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up diblokir oleh browser'
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'Email sudah terdaftar dengan metode login lain'
            } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
                errorMessage = 'Pop-up diblokir karena kebijakan keamanan browser, kami alihkan ke metode redirect. Silakan coba lagi jika tidak otomatis.'
            }

            showError('Gagal Mendaftar dengan Google', errorMessage)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        SiPelMasD
                    </Link>
                    <p className="text-gray-600 mt-2">Sistem Informasi Pelayanan Masyarakat Digital</p>
                </div>

                {/* Firebase Status Warning */}
                {!isFirebaseConfigured && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Mode Demo</h3>
                        <p className="text-xs text-yellow-700">
                            Firebase belum dikonfigurasi. Lihat instruksi setup di bawah untuk mengaktifkan authentication.
                        </p>
                    </div>
                )}

                {/* Register Card */}
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Daftar Akun</CardTitle>
                        <CardDescription className="text-center">
                            Lengkapi data diri Anda untuk mendaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Google Sign In Button */}
                        {isFirebaseConfigured && (
                            <div className="mb-6 space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Daftar dengan Google
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground">Atau daftar dengan email</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    name="nik"
                                    type="text"
                                    placeholder="Nomor Induk Kependudukan"
                                    value={formData.nik}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor HP</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Masukkan ulang kata sandi"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Memproses...' : 'Daftar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <span className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                            Masuk di sini
                        </Link>
                    </span>
                </div>
            </div>

            <ModalComponent />
        </div>
    )
} 
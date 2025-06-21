import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('https://api-test-production-ccbf.up.railway.app/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            // Parse response body (could be success or error)
            const data = await response.json()

            if (!response.ok) {
                // Jika back-end mengembalikan status error (mis. 401), tampilkan pesan dari server
                setError(data.message || 'Gagal melakukan login')
                return
            }

            if (data.success) {
                if (data.data.role !== 'admin') {
                    setError('Akun ini tidak memiliki hak akses admin')
                    return
                }

                // Simpan token dan data user ke localStorage
                localStorage.setItem('adminToken', data.data.token)
                localStorage.setItem('adminData', JSON.stringify(data.data))

                // Redirect ke dashboard admin
                navigate('/admin/dashboard')
            } else {
                setError(data.message || 'Gagal melakukan login')
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Terjadi kesalahan pada server. Silakan coba lagi.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-red-600 transition-colors">
                        SiPelMasD
                    </Link>
                    <p className="text-gray-600 mt-2">Panel Administrasi</p>
                </div>

                {/* Admin Login Card */}
                <Card className="border-red-200">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-red-700">
                            🔐 Login Administrator
                        </CardTitle>
                        <CardDescription className="text-center">
                            Akses khusus untuk administrator sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Admin</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email administrator"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi Admin</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Kata sandi administrator"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sedang Masuk...' : 'Masuk sebagai Admin'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="bg-red-50 p-3 rounded-md w-full">
                            <p className="text-xs text-red-700 text-center">
                                ⚠️ Area ini khusus untuk administrator sistem.
                                Akses tidak sah akan dicatat dan dilaporkan.
                            </p>
                        </div>
                        <div className="text-sm text-center text-gray-600">
                            <Link to="/admin/forgot-password" className="text-red-600 hover:underline">
                                Lupa kata sandi admin?
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
                        <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full">
                                Login sebagai Masyarakat
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
} 
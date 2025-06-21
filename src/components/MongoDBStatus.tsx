import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export default function MongoDBStatus() {
    const [mongoStatus, setMongoStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [lastPing, setLastPing] = useState<Date | null>(null)

    // MongoDB Connection String
    const MONGO_URI = 'mongodb+srv://intancahyafadila59:ebDIcFvBg532mFxX@cluster0.mve4tmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

    const pingMongoDB = async () => {
        try {
            setMongoStatus('checking')

            // Ping ke backend server yang menangani koneksi MongoDB
            const response = await fetch('http://localhost:3001/api/ping-mongo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uri: MONGO_URI })
            })

            if (response.ok) {
                const data = await response.json()
                setMongoStatus('connected')
                setLastPing(new Date())
                console.log('MongoDB ping successful:', data)
            } else {
                const errorData = await response.json()
                console.error('MongoDB ping failed:', errorData)
                setMongoStatus('error')
            }
        } catch (error) {
            console.error('MongoDB ping error:', error)
            // Jika server backend tidak berjalan, berikan pesan yang sesuai
            setMongoStatus('error')
        }
    }

    // Auto ping saat component mount
    useEffect(() => {
        pingMongoDB()

        // Auto ping setiap 30 detik
        const interval = setInterval(pingMongoDB, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl">🗄️ Status Database MongoDB</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={pingMongoDB}
                        disabled={mongoStatus === 'checking'}
                        className="w-full sm:w-auto"
                    >
                        {mongoStatus === 'checking' ? 'Mengecek...' : 'Ping Ulang'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${mongoStatus === 'connected' ? 'bg-green-500' :
                                mongoStatus === 'error' ? 'bg-red-500' :
                                    'bg-yellow-500 animate-pulse'
                            }`} />
                        <span className="font-medium text-sm sm:text-base">
                            {mongoStatus === 'connected' ? 'Terhubung' :
                                mongoStatus === 'error' ? 'Tidak Terhubung' :
                                    'Memeriksa Koneksi...'}
                        </span>
                    </div>

                    {/* Connection Info - Responsive */}
                    <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                        <div className="break-words">
                            <strong>Database:</strong> Cluster0 (MongoDB Atlas)
                        </div>
                        <div className="break-words">
                            <strong>Endpoint:</strong> cluster0.mve4tmi.mongodb.net
                        </div>
                        {lastPing && (
                            <div className="break-words">
                                <strong>Ping Terakhir:</strong> {lastPing.toLocaleString('id-ID')}
                            </div>
                        )}
                    </div>

                    {/* Status Messages - Responsive */}
                    {mongoStatus === 'connected' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-xs sm:text-sm text-green-700">
                                ✅ Database MongoDB terhubung dengan baik. Sistem siap digunakan.
                            </p>
                        </div>
                    )}

                    {mongoStatus === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs sm:text-sm text-red-700">
                                ❌ Tidak dapat terhubung ke database. Periksa koneksi internet atau hubungi administrator.
                            </p>
                        </div>
                    )}

                    {mongoStatus === 'checking' && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-xs sm:text-sm text-yellow-700">
                                ⏳ Sedang memeriksa koneksi ke database MongoDB...
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 
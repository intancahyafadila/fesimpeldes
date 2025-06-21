import { isFirebaseConfigured } from '../lib/firebase'

export default function FirebaseInstructions() {
    if (isFirebaseConfigured) {
        return (
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-sm font-medium text-green-800 mb-2">✅ Firebase Ready:</h3>
                <p className="text-xs text-green-700">
                    Authentication sudah terhubung dan siap digunakan!
                </p>
            </div>
        )
    }

    return (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">🔧 Setup Firebase Authentication:</h3>
            <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Buka <a href="https://console.firebase.google.com" className="underline" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
                <li>2. Buat project baru dan enable Email/Password auth</li>
                <li>3. Copy konfigurasi ke file .env.local</li>
                <li>4. Restart server: npm run dev</li>
            </ol>
            <p className="text-xs text-blue-600 mt-2">
                Lihat file FIREBASE_SETUP.md untuk panduan lengkap.
            </p>
        </div>
    )
} 
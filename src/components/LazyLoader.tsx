import { Suspense } from 'react'

interface LazyLoaderProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

const DefaultFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat halaman...</p>
        </div>
    </div>
)

export default function LazyLoader({ children, fallback }: LazyLoaderProps) {
    return (
        <Suspense fallback={fallback || <DefaultFallback />}>
            {children}
        </Suspense>
    )
} 
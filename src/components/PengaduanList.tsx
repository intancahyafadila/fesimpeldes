import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useModal } from './ui/modal'
import { PengaduanService } from '../services/pengaduanService'
import type { Complaint, ComplaintUpdateRequest } from '../types/complaint'

interface PengaduanListProps {
    pengaduan: Complaint[]
    onUpdate: () => void
    loading: boolean
    canEdit?: boolean
    title?: string
}

export default function PengaduanList({ pengaduan, onUpdate, loading, canEdit = false, title }: PengaduanListProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState<ComplaintUpdateRequest>({})
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const {
        showSuccess,
        showError,
        showConfirm,
        ModalComponent
    } = useModal()

    const formatDate = (date?: any) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-blue-100 text-blue-800'
            case 'IN-PROGRESS':
                return 'bg-yellow-100 text-yellow-800'
            case 'CLOSED':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'Terbuka'
            case 'IN-PROGRESS':
                return 'Diproses'
            case 'CLOSED':
                return 'Selesai'
            default:
                return status
        }
    }

    const handleEdit = (pengaduan: Complaint) => {
        if (!canEdit || !pengaduan._id) return
        setEditingId(pengaduan._id)
        setEditData({
            title: pengaduan.title,
            description: pengaduan.description,
            status: pengaduan.status
        })
    }

    const handleSave = async (id: string) => {
        try {
            await PengaduanService.updatePengaduan(id, editData)
            setEditingId(null)
            setEditData({})
            onUpdate()
            showSuccess('Berhasil!', 'Pengaduan berhasil diupdate')
        } catch (error: any) {
            console.error('Error updating pengaduan:', error)
            showError('Gagal Update', error.message || 'Gagal mengupdate pengaduan')
        }
    }

    const handleDelete = async (id: string) => {
        if (!canEdit) return
        try {
            await PengaduanService.deletePengaduan(id)
            setDeleteConfirm(null)
            onUpdate()
            showSuccess('Berhasil!', 'Pengaduan berhasil dihapus')
        } catch (error: any) {
            console.error('Error deleting pengaduan:', error)
            showError('Gagal Hapus', error.message || 'Gagal menghapus pengaduan')
        }
    }

    const handleDeleteConfirm = (id: string) => {
        showConfirm(
            'Hapus Pengaduan',
            'Apakah Anda yakin ingin menghapus pengaduan ini? Tindakan ini tidak dapat dibatalkan.',
            () => handleDelete(id)
        )
    }

    const handleCancel = () => {
        if (!canEdit) return
        setEditingId(null)
        setEditData({})
    }

    if (loading && pengaduan.length === 0) {
        return (
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
        )
    }

    if (pengaduan.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <div className="text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pengaduan</h3>
                    <p className="text-gray-500">Klik "Buat Pengaduan Baru" untuk membuat pengaduan pertama Anda.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {title && <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pengaduan.filter(item => item._id).map((item) => (
                        <Card key={item._id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                {editingId === item._id ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-title" className="text-sm">Judul</Label>
                                        <Input
                                            id="edit-title"
                                            value={editData.title || ''}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="text-sm"
                                        />
                                    </div>
                                ) : (
                                    <CardTitle className="text-lg sm:text-xl line-clamp-2">{item.title}</CardTitle>
                                )}

                                <div className="flex flex-wrap items-center gap-2">
                                    {editingId === item._id ? (
                                        <select
                                            value={editData.status ?? item.status ?? 'OPEN'}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                                            className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="OPEN">Terbuka</option>
                                            <option value="IN-PROGRESS">Diproses</option>
                                            <option value="CLOSED">Selesai</option>
                                        </select>
                                    ) : (
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                                            {getStatusText(item.status)}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                {editingId === item._id ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-description" className="text-sm">Deskripsi</Label>
                                        <textarea
                                            id="edit-description"
                                            value={editData.description || ''}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4">
                                        {item.description}
                                    </p>
                                )}

                                <div className="text-xs text-gray-500 space-y-1">
                                    <div>Dibuat: {formatDate(item.createdAt)}</div>
                                    {item.updatedAt !== item.createdAt && (
                                        <div>Diupdate: {formatDate(item.updatedAt)}</div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row gap-2">
                                {editingId === item._id ? (
                                    <>
                                        <Button
                                            onClick={() => handleSave(item._id!)}
                                            size="sm"
                                            className="w-full sm:w-auto"
                                        >
                                            Simpan
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            size="sm"
                                            className="w-full sm:w-auto"
                                        >
                                            Batal
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEdit(item)}
                                            size="sm"
                                            className="w-full sm:w-auto"
                                        >
                                            Edit
                                        </Button>
                                        {canEdit && (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDeleteConfirm(item._id!)}
                                                size="sm"
                                                className="w-full sm:w-auto"
                                            >
                                                Hapus
                                            </Button>
                                        )}
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <ModalComponent />
        </>
    )
} 
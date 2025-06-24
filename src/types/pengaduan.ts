export interface Pengaduan {
  _id?: string
  userId: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
}

export interface CreatePengaduanRequest {
  title: string
  description: string
}

export interface UpdatePengaduanRequest {
  title?: string
  description?: string
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED' | 'REJECTED'
} 
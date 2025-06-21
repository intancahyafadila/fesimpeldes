export interface Pengaduan {
  _id?: string
  userId: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'closed'
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
  status?: 'open' | 'in-progress' | 'closed'
} 
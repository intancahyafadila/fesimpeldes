import type { Complaint, ComplaintCreateRequest, ComplaintUpdateRequest } from '../types/complaint'

const API_BASE_URL = 'https://api-test-production-ccbf.up.railway.app/api'



export class PengaduanService {
  // CREATE
  static async createPengaduan(userId: string, data: { title: string; description: string }): Promise<Complaint> {
    const payload: ComplaintCreateRequest = {
      title: data.title,
      description: data.description,
      category: 'OTHER',
      priority: 'MEDIUM',
      userId,
      reporter: userId,
      location: {
        latitude: -6.21462, // default Jakarta pusat
        longitude: 106.84513,
        address: 'Indonesia',
      },
      images: [],
    } as any

    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken')
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal membuat pengaduan')
    }
    return json.data as Complaint
  }

  // READ list by reporter
  static async getPengaduan(params: { userId: string; page?: number; limit?: number }): Promise<{ data: Complaint[] }> {
    const qp = new URLSearchParams()
    qp.append('reporter', params.userId)
    if (params.page) qp.append('page', params.page.toString())
    if (params.limit) qp.append('limit', params.limit.toString())

    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken')
    const res = await fetch(`${API_BASE_URL}/complaints?${qp.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal memuat pengaduan')
    }
    return { data: json.data.complaints as Complaint[] }
  }

  // READ all pengaduan for admin
  static async getAllPengaduan(params?: { page?: number; limit?: number }): Promise<Complaint[]> {
    const qp = new URLSearchParams()
    if (params?.page) qp.append('page', params.page.toString())
    if (params?.limit) qp.append('limit', params.limit.toString())

    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken')
    const res = await fetch(`${API_BASE_URL}/complaints?${qp.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal memuat pengaduan')
    }
    return json.data.complaints as Complaint[]
  }

  // UPDATE status/title/desc
  static async updatePengaduan(id: string, updates: ComplaintUpdateRequest): Promise<Complaint> {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken')

    // Jika hanya field status yang di-update, gunakan endpoint khusus PATCH /:id/status
    const isOnlyStatus =
      Object.keys(updates).length === 1 && typeof updates.status !== 'undefined'

    const url = isOnlyStatus
      ? `${API_BASE_URL}/complaints/${id}/status`
      : `${API_BASE_URL}/complaints/${id}`

    const method = isOnlyStatus ? 'PATCH' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(isOnlyStatus ? { status: updates.status } : updates),
    })

    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal memperbarui pengaduan')
    }
    return json.data as Complaint
  }

  static async deletePengaduan(id: string): Promise<void> {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken')
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.message || 'Gagal menghapus pengaduan')
    }
  }
} 
import type { Complaint, ComplaintCreateRequest, ComplaintUpdateRequest } from '../types/complaint'

const API_BASE_URL = 'https://api-test-production-ccbf.up.railway.app/api'

interface ListResponse {
  complaints: Complaint[]
  pagination: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
}

export class ComplaintService {
  static async create(data: ComplaintCreateRequest): Promise<Complaint> {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal membuat pengaduan')
    }
    return json.data as Complaint
  }

  static async list(params?: { page?: number; limit?: number; reporter?: string }): Promise<ListResponse> {
    const qp = new URLSearchParams()
    if (params?.page) qp.append('page', params.page.toString())
    if (params?.limit) qp.append('limit', params.limit.toString())
    if (params?.reporter) qp.append('reporter', params.reporter)

    const res = await fetch(`${API_BASE_URL}/complaints?${qp.toString()}`)
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengambil data')
    }
    return json.data as ListResponse
  }

  static async get(id: string): Promise<Complaint> {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`)
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengambil data')
    }
    return json.data as Complaint
  }

  static async update(id: string, updates: ComplaintUpdateRequest): Promise<Complaint> {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal memperbarui')
    }
    return json.data as Complaint
  }

  static async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.message || 'Gagal menghapus')
    }
  }
} 
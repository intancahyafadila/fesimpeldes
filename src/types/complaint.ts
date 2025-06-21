export type ComplaintStatus = 'OPEN' | 'IN-PROGRESS' | 'CLOSED'
export type ComplaintCategory = 'INFRASTRUCTURE' | 'PUBLIC_SERVICE' | 'OTHER'
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface ComplaintLocation {
  latitude: number
  longitude: number
  address: string
}

export interface Complaint {
  _id?: string
  userId?: string
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  location: ComplaintLocation
  images?: string[]
  status?: ComplaintStatus
  createdAt?: string
  updatedAt?: string
  reporter?: string
}

export interface ComplaintCreateRequest extends Omit<Complaint, '_id' | 'status' | 'createdAt' | 'updatedAt' | 'reporter'> {
  userId: string
}

export interface ComplaintUpdateRequest {
  title?: string
  description?: string
  category?: ComplaintCategory
  priority?: ComplaintPriority
  location?: ComplaintLocation
  images?: string[]
  status?: ComplaintStatus
} 
export interface Zayavka {
  _id?: string
  id?: string
  tzeh: string
  professia: string
  description: string
  requirements: string
  salary_min: number
  salary_max: number
  schedule: string
  experience_required: string
  contact_name: string
  contact_phone: string
  contact_email: string
  status: 'Активная' | 'Архивная' | 'Черновик'
  date: string
  id_sozdatelya?: string
  createdAt?: string
  updatedAt?: string
}

export interface ZayavkaListResponse {
  success: boolean
  data: Zayavka[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ZayavkaFilters {
  tzeh?: string
  professia?: string
  status?: string
  search?: string
  page?: number
  limit?: number
  sort?: string
}

export interface Deshife {
  _id?: string
  shifr: string
  description: string
  category: 'Начисления' | 'Удержания' | 'Прочее'
  createdAt?: string
  updatedAt?: string
}

export interface DeshifeListResponse {
  success: boolean
  data: Deshife[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PhoneTabel {
  _id?: string
  number_tzeh: string
  nuber_phone: string
  description: string
  is_active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PhoneTabelListResponse {
  success: boolean
  data: PhoneTabel[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface User {
  _id: string
  username: string
  role: 'admin' | 'moderator' | 'user'
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
}

export interface ApiError {
  success: false
  error: string
  message: string
  details?: Array<{ field: string; message: string }>
}

export interface StatsResponse {
  success: boolean
  data: {
    total: number
    active: number
    byTzeh: Array<{ _id: string; count: number }>
    bySchedule: Array<{ _id: string; count: number }>
  }
}
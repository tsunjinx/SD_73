// Base API configuration for GearUp application
import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // For Spring Boot backend, extract data from ResponseObject wrapper
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data
    }
    // Fallback to original response data
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      window.location.href = '/login'
    }
    
    // Handle Spring Boot error responses
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Có lỗi xảy ra'
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

// Base CRUD operations
export const createCRUDService = (endpoint) => ({
  // Get all items with pagination and filters
  getAll: (params = {}) => {
    return api.get(endpoint, { params })
  },
  
  // Get single item by ID
  getById: (id) => {
    return api.get(`${endpoint}/${id}`)
  },
  
  // Create new item
  create: (data) => {
    return api.post(endpoint, data)
  },
  
  // Update existing item
  update: (id, data) => {
    return api.put(`${endpoint}/${id}`, data)
  },
  
  // Delete item
  delete: (id) => {
    return api.delete(`${endpoint}/${id}`)
  },
  
  // Bulk delete
  bulkDelete: (ids) => {
    return api.delete(`${endpoint}/bulk`, { data: { ids } })
  },
  
  // Update status
  updateStatus: (id, trang_thai) => {
    return api.patch(`${endpoint}/${id}/status`, { trang_thai })
  }
})

// Authentication service
export const authService = {
  login: (usernameOrEmail, password) => {
    return api.post('/auth/login', { usernameOrEmail, password })
  },
  
  logout: () => {
    return api.post('/auth/logout')
  },
  
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refresh_token')
    return api.post('/auth/refresh', { refresh_token: refreshToken })
  },
  
  getCurrentUser: () => {
    return api.get('/auth/me')
  }
}

// File upload service
export const uploadService = {
  uploadSingle: (file, folder = 'uploads') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  uploadMultiple: (files, folder = 'uploads') => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('folder', folder)
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default api
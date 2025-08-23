// User Management Service - Spring Boot endpoints
import { createCRUDService } from './api.js'
import api from './api.js'

// Customer Service (khach_hang) - Spring Boot endpoints
export const customerService = {
  // Get all customers
  getAll: () => {
    return api.get('/khach-hang-management/playlist')
  },
  
  // Get with pagination
  getPaging: (page = 0, size = 10) => {
    return api.get('/khach-hang-management/paging', { params: { page, size } })
  },
  
  // Get by ID
  getById: (id) => {
    return api.get(`/khach-hang-management/detail/${id}`)
  },
  
  // Create new customer
  create: (data) => {
    return api.post('/khach-hang-management/add', data)
  },
  
  // Update customer
  update: (id, data) => {
    return api.put(`/khach-hang-management/update/${id}`, data)
  },
  
  // Delete customer
  delete: (id) => {
    return api.delete(`/khach-hang-management/delete/${id}`)
  }
}

// Employee Service (nhan_vien) - Spring Boot endpoints
export const employeeService = {
  // Get all employees
  getAll: () => {
    return api.get('/nhan-vien-management/playlist')
  },
  
  // Get with pagination
  getPaging: (page = 0, size = 10) => {
    return api.get('/nhan-vien-management/paging', { params: { page, size } })
  },
  
  // Get by ID
  getById: (id) => {
    return api.get(`/nhan-vien-management/detail/${id}`)
  },
  
  // Create new employee
  create: (data) => {
    return api.post('/nhan-vien-management/add', data)
  },
  
  // Update employee
  update: (id, data) => {
    return api.put(`/nhan-vien-management/update/${id}`, data)
  },
  
  // Delete employee
  delete: (id) => {
    return api.delete(`/nhan-vien-management/delete/${id}`)
  },
  
  // Get users by role
  getByRole: (vai_tro, params = {}) => {
    return api.get(`/users/role/${vai_tro}`, { params })
  },
  
  // Get customers only
  getCustomers: (params = {}) => {
    return api.get('/users/customers', { params })
  },
  
  // Get employees only
  getEmployees: (params = {}) => {
    return api.get('/users/employees', { params })
  },
  
  // Update user profile
  updateProfile: (id, profileData) => {
    return api.put(`/users/${id}/profile`, profileData)
  },
  
  // Change password
  changePassword: (id, passwordData) => {
    return api.patch(`/users/${id}/password`, passwordData)
  },
  
  // Upload avatar
  uploadAvatar: (id, avatarFile) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    
    return api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Get user statistics
  getStatistics: () => {
    return api.get('/users/statistics')
  },
  
  // Search users
  search: (query, params = {}) => {
    return api.get('/users/search', { 
      params: { q: query, ...params } 
    })
  },
  
  // Export users to Excel/CSV
  export: (format = 'excel', params = {}) => {
    return api.get(`/users/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Import users from file
  import: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Reset user password (admin only)
  resetPassword: (id) => {
    return api.post(`/users/${id}/reset-password`)
  },
  
  // Lock/unlock user account
  toggleLock: (id) => {
    return api.patch(`/users/${id}/toggle-lock`)
  }
}

// Additional customer methods
export const customerExtensions = {
  // Get customer order history
  getOrderHistory: (id, params = {}) => {
    return api.get(`/customers/${id}/orders`, { params })
  },
  
  // Get customer favorites
  getFavorites: (id, params = {}) => {
    return api.get(`/customers/${id}/favorites`, { params })
  },
  
  // Get customer cart
  getCart: (id) => {
    return api.get(`/customers/${id}/cart`)
  },
  
  // Get customer reviews
  getReviews: (id, params = {}) => {
    return api.get(`/customers/${id}/reviews`, { params })
  },
  
  // Get customer statistics
  getCustomerStats: (id) => {
    return api.get(`/customers/${id}/stats`)
  },
  
  // Update customer loyalty points
  updateLoyaltyPoints: (id, points, action = 'add') => {
    return api.patch(`/customers/${id}/loyalty-points`, { 
      points, 
      action 
    })
  }
}

// Additional employee methods
export const employeeExtensions = {
  // Get employees by department/role
  getByDepartment: (department) => {
    return api.get(`/employees/department/${department}`)
  },
  
  // Assign role to employee
  assignRole: (id, vai_tro) => {
    return api.patch(`/employees/${id}/role`, { vai_tro })
  },
  
  // Get employee performance data
  getPerformance: (id, period = 'month') => {
    return api.get(`/employees/${id}/performance`, {
      params: { period }
    })
  }
}
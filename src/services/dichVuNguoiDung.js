// User Management Service (ERD: nguoi_dung)
import { createCRUDService } from './api.js'
import api from './api.js'

// Base CRUD operations for users
const baseUserService = createCRUDService('/users')

export const userService = {
  ...baseUserService,
  
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

// Employee specific service
export const employeeService = {
  // Create employee with role assignment
  create: (employeeData) => {
    return api.post('/employees', {
      ...employeeData,
      vai_tro: employeeData.vai_tro || 'staff'
    })
  },
  
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

// Customer specific service
export const customerService = {
  // Create customer account
  create: (customerData) => {
    return api.post('/customers', {
      ...customerData,
      vai_tro: 'customer'
    })
  },
  
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

export default userService
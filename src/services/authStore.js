// Simple authentication state management
import { reactive } from 'vue'

const authState = reactive({
  user: null,
  isAuthenticated: false,
  isLoading: false
})

export const useAuth = () => {
  const login = (user) => {
    authState.user = user
    authState.isAuthenticated = true
    localStorage.setItem('user_info', JSON.stringify(user))
  }

  const logout = () => {
    authState.user = null
    authState.isAuthenticated = false
    localStorage.removeItem('user_info')
    localStorage.removeItem('access_token')
    localStorage.removeItem('remember_login')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user_info')
    if (savedUser) {
      try {
        authState.user = JSON.parse(savedUser)
        authState.isAuthenticated = true
      } catch (error) {
        console.error('Error parsing saved user info:', error)
        logout()
      }
    }
  }

  const checkRole = (requiredRole) => {
    if (!authState.user) return false
    
    // For employees, check their role/permission
    if (authState.user.loaiNguoiDung === 'nhan_vien') {
      return authState.user.quyenHan === requiredRole
    }
    
    // For customers
    if (authState.user.loaiNguoiDung === 'khach_hang') {
      return requiredRole === 'customer'
    }
    
    return false
  }

  const isEmployee = () => {
    return authState.user?.loaiNguoiDung === 'nhan_vien'
  }

  const isCustomer = () => {
    return authState.user?.loaiNguoiDung === 'khach_hang'
  }

  const isAdmin = () => {
    return isEmployee() && authState.user?.quyenHan === 'Admin'
  }

  return {
    authState,
    login,
    logout,
    initializeAuth,
    checkRole,
    isEmployee,
    isCustomer,
    isAdmin
  }
}

export default useAuth
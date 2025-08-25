<template>
  <StandaloneLogin
    brand-title="GearUp"
    brand-subtitle="Hệ thống quản lý"
    form-title="Đăng nhập hệ thống"
    username-label="Tên đăng nhập"
    username-placeholder="Nhập tên đăng nhập"
    username-icon="👤"
    password-label="Mật khẩu"
    password-placeholder="Nhập mật khẩu"
    password-icon="🔒"
    :show-remember-me="true"
    remember-me-text="Ghi nhớ đăng nhập"
    :show-forgot-password="true"
    forgot-password-text="Quên mật khẩu?"
    login-button-text="Đăng nhập"
    loading-button-text="Đang đăng nhập..."
    success-button-text="Đăng nhập thành công"
    login-icon="🚀"
    footer-text="© 2025 GearUp. All rights reserved."
    primary-color="#22c55e"
    primary-dark-color="#16a34a"
    @submit="handleLogin"
    @forgot-password="handleForgotPassword"
  >
    <template #logo>
      <GearUpLogo variant="large" />
    </template>
  </StandaloneLogin>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../services/khoXacThuc.js'
import GearUpLogo from '../components/ui/LogoGearUp.vue'
import StandaloneLogin from '../components/common/DangNhapDoc.vue'

const router = useRouter()
const { login: authLogin } = useAuth()

const handleLogin = async ({ username, password, remember, setLoading, setError, setSuccess }) => {
  try {
    setLoading(true)
    
    // Import authService dynamically to avoid circular dependency
    const { authService } = await import('../services/api.js')
    
    // Call the Spring Boot backend
    const response = await authService.login(username, password)
    
    if (response.success) {
      // Use auth store to manage user state
      authLogin(response.user)
      
      // Remember me functionality
      if (remember) {
        localStorage.setItem('remember_login', 'true')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      setError(response.message || 'Đăng nhập thất bại')
      setLoading(false)
    }
  } catch (error) {
    console.error('Login error:', error)
    setError(error.message || 'Có lỗi xảy ra khi đăng nhập')
    setLoading(false)
  }
}

const handleForgotPassword = () => {
  // Handle forgot password - can navigate to forgot password page
  console.log('Forgot password clicked')
  // router.push('/forgot-password')
}
</script>


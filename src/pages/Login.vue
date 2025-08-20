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
import GearUpLogo from '../components/ui/GearUpLogo.vue'
import StandaloneLogin from '../components/common/StandaloneLogin.vue'

const router = useRouter()

const handleLogin = async ({ username, password, remember, setLoading, setError, setSuccess }) => {
  // Simple mock login logic - replace with real authentication
  if (username === 'admin' && password === 'admin') {
    setSuccess(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } else {
    setError('Đăng nhập thất bại')
    setLoading(false)
  }
}

const handleForgotPassword = () => {
  // Handle forgot password - can navigate to forgot password page
  console.log('Forgot password clicked')
  // router.push('/forgot-password')
}
</script>


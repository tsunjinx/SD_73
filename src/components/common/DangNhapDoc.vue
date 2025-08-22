<template>
  <div class="login-page">
    <!-- Logo Card -->
    <div class="logo-card">
      <div class="logo-content">
        <slot name="logo">
          <div class="default-logo">
            <svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8 Q15 2, 22 8 Q29 2, 36 8 Q43 2, 50 8" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    fill="none" 
                    stroke-linecap="round"/>
              <path d="M8 20 Q15 14, 22 20 Q29 14, 36 20 Q43 14, 50 20" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    fill="none" 
                    stroke-linecap="round"/>
              <path d="M8 32 Q15 26, 22 32 Q29 26, 36 32 Q43 26, 50 32" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    fill="none" 
                    stroke-linecap="round"/>
            </svg>
            <span class="logo-text">GEARUP</span>
          </div>
        </slot>
      </div>
    </div>

    <!-- Main Login Card -->
    <div class="login-container">
      <div class="form-container">
        <div class="form-header">
          <h2>{{ formTitle }}</h2>
          <p v-if="formSubtitle">
            {{ formSubtitle }}
          </p>
        </div>

          <form
            ref="loginFormRef"
            class="login-form"
            :class="{ 'form-loading': loading, 'form-error': error, 'form-success': loginSuccess }"
            @submit.prevent="handleSubmit"
          >
            <div class="form-group">
              <label :for="usernameFieldId">{{ usernameLabel }}</label>
              <div class="input-wrapper">
                <span class="input-icon">{{ usernameIcon }}</span>
                <input
                  :id="usernameFieldId"
                  v-model="credentials.username"
                  :type="usernameType"
                  class="form-control"
                  :placeholder="usernamePlaceholder"
                  :required="usernameRequired"
                  :disabled="loading || loginSuccess"
                />
              </div>
            </div>

            <div class="form-group">
              <label :for="passwordFieldId">{{ passwordLabel }}</label>
              <div class="input-wrapper">
                <span class="input-icon">{{ passwordIcon }}</span>
                <input
                  :id="passwordFieldId"
                  v-model="credentials.password"
                  type="password"
                  class="form-control"
                  :placeholder="passwordPlaceholder"
                  :required="passwordRequired"
                  :disabled="loading || loginSuccess"
                />
              </div>
            </div>

            <div v-if="showRememberMe || showForgotPassword" class="form-options">
              <label v-if="showRememberMe" class="checkbox-container">
                <input v-model="credentials.remember" type="checkbox" :disabled="loading || loginSuccess" />
                <span class="checkmark" />
                <span class="checkbox-text">{{ rememberMeText }}</span>
              </label>

              <a v-if="showForgotPassword" href="#" class="forgot-password" @click.prevent="$emit('forgot-password')">
                {{ forgotPasswordText }}
              </a>
            </div>

            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-login"
              :disabled="loading || loginSuccess"
              :class="{ loading: loading && !loginSuccess, success: loginSuccess }"
            >
              <div class="button-content">
                <span v-if="loginSuccess" class="success-icon">✓</span>
                <span v-else class="login-icon">{{ loginIcon }}</span>
                <span class="button-text">
                  {{ buttonText }}
                </span>
              </div>
            </button>

            <slot name="additional-options" />
          </form>

        <div v-if="showFooter" class="login-footer">
          <slot name="footer">
            <p>{{ footerText }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // Branding
  brandTitle: {
    type: String,
    default: 'Your Brand'
  },
  brandSubtitle: {
    type: String,
    default: 'Welcome back'
  },

  // Form
  formTitle: {
    type: String,
    default: 'Sign in to your account'
  },
  formSubtitle: {
    type: String,
    default: ''
  },

  // Username field
  usernameLabel: {
    type: String,
    default: 'Username'
  },
  usernamePlaceholder: {
    type: String,
    default: 'Enter your username'
  },
  usernameType: {
    type: String,
    default: 'text',
    validator: value => ['text', 'email'].includes(value)
  },
  usernameRequired: {
    type: Boolean,
    default: true
  },
  usernameIcon: {
    type: String,
    default: '👤'
  },

  // Password field
  passwordLabel: {
    type: String,
    default: 'Password'
  },
  passwordPlaceholder: {
    type: String,
    default: 'Enter your password'
  },
  passwordRequired: {
    type: Boolean,
    default: true
  },
  passwordIcon: {
    type: String,
    default: '🔒'
  },

  // Options
  showRememberMe: {
    type: Boolean,
    default: true
  },
  rememberMeText: {
    type: String,
    default: 'Remember me'
  },
  showForgotPassword: {
    type: Boolean,
    default: true
  },
  forgotPasswordText: {
    type: String,
    default: 'Forgot password?'
  },

  // Button
  loginButtonText: {
    type: String,
    default: 'Sign in'
  },
  loadingButtonText: {
    type: String,
    default: 'Signing in...'
  },
  successButtonText: {
    type: String,
    default: 'Success!'
  },
  loginIcon: {
    type: String,
    default: '🚀'
  },

  // Footer
  showFooter: {
    type: Boolean,
    default: true
  },
  footerText: {
    type: String,
    default: '© 2025 Your Company. All rights reserved.'
  },

  // External loading/error states
  externalLoading: {
    type: Boolean,
    default: false
  },
  externalError: {
    type: String,
    default: ''
  },

  // Theme colors (CSS variables or hex values)
  primaryColor: {
    type: String,
    default: '#4ade80'
  },
  primaryDarkColor: {
    type: String,
    default: '#22c55e'
  }
})

const emit = defineEmits(['submit', 'forgot-password'])

// Generate unique IDs for form fields
const usernameFieldId = `username-${Math.random().toString(36).substr(2, 9)}`
const passwordFieldId = `password-${Math.random().toString(36).substr(2, 9)}`

// Local state
const loading = ref(false)
const error = ref('')
const loginSuccess = ref(false)
const loginFormRef = ref(null)

const credentials = ref({
  username: '',
  password: '',
  remember: false
})

// Watch for external loading/error changes
watch(
  () => props.externalLoading,
  newVal => {
    loading.value = newVal
  }
)

watch(
  () => props.externalError,
  newVal => {
    error.value = newVal
  }
)

// Computed button text
const buttonText = computed(() => {
  if (loginSuccess.value) return props.successButtonText
  if (loading.value) return props.loadingButtonText
  return props.loginButtonText
})

// Handle form submission
const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  // Emit the submit event with credentials
  emit('submit', {
    username: credentials.value.username,
    password: credentials.value.password,
    remember: credentials.value.remember,
    setLoading: value => {
      loading.value = value
    },
    setError: value => {
      error.value = value
    },
    setSuccess: value => {
      loginSuccess.value = value
    }
  })
}

// Expose methods for parent component
defineExpose({
  reset: () => {
    credentials.value = {
      username: '',
      password: '',
      remember: false
    }
    loading.value = false
    error.value = ''
    loginSuccess.value = false
  },
  setLoading: value => {
    loading.value = value
  },
  setError: value => {
    error.value = value
  },
  setSuccess: value => {
    loginSuccess.value = value
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: v-bind(primaryColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
  position: relative;
}

/* Logo Card */
.logo-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 0.8s ease-out;
}

.logo-content {
  text-align: center;
}

.default-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: v-bind(primaryColor);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* Main Login Card */
.login-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 0;
  width: 100%;
  max-width: 400px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.form-container {
  width: 100%;
  padding: 3rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.login-form.form-loading {
  opacity: 0.9;
}

.login-form.form-error {
  animation: shake 0.6s ease-in-out;
}

.login-form.form-success {
  animation: formSuccess 0.8s ease-out;
}

@keyframes formSuccess {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-3px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(3px);
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #9ca3af;
  z-index: 1;
  transition: all 0.3s ease;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  height: 3rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: v-bind(primaryColor);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.form-control:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.input-wrapper:focus-within .input-icon {
  color: v-bind(primaryColor);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input[type='checkbox'] {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  accent-color: v-bind(primaryColor);
}

.checkbox-container input[type='checkbox']:disabled {
  cursor: not-allowed;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.forgot-password {
  color: v-bind(primaryColor);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: v-bind(primaryDarkColor);
}

.btn-login {
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(45deg, v-bind(primaryColor), v-bind(primaryDarkColor));
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(74, 222, 128, 0.4);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-login.loading {
  animation: loadingPulse 2s ease-in-out infinite;
}

.btn-login.success {
  background: linear-gradient(45deg, #10b981, #059669) !important;
  animation: successPulse 0.6s ease-out;
}

@keyframes loadingPulse {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.login-icon,
.success-icon {
  font-size: 1.125rem;
}

.success-icon {
  animation: checkmarkBounce 0.6s ease-out;
}

@keyframes checkmarkBounce {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.4) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  color: #9ca3af;
  font-size: 0.8125rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
    gap: 1.5rem;
  }

  .logo-card {
    padding: 1.5rem 2rem;
  }

  .login-container {
    max-width: 100%;
  }

  .form-container {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 0.5rem;
    gap: 1rem;
  }

  .logo-card {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.25rem;
  }

  .btn-login {
    height: 2.75rem;
    font-size: 0.9rem;
  }

  .form-control {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
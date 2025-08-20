<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logoUrl from '@/assets/gearup-logo-official.svg'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(true) // Always keep sidebar open
const showNotifications = ref(false)
const showUserDropdown = ref(false)
const expandedMenus = ref({
  'QUẢN LÝ ĐƠN HÀNG': true,
  'QUẢN LÝ SẢN PHẨM': true,
  'GIẢM GIÁ & KHUYẾN MÃI': true,
  'HỖ TRỢ KHÁCH HÀNG': true,
  'NGƯỜI DÙNG': true
})

// Current user data (in a real app, this would come from authentication state)
const currentUser = ref({
  name: 'Admin',
  role: 'admin', // 'admin' or 'staff'
  fullName: 'Quản Trị Viên'
})

// Check if current route is login page
const isLoginPage = computed(() => route.path === '/login')

// Computed for display name with role
const displayName = computed(() => {
  const user = currentUser.value
  if (user.role === 'admin') {
    return {
      name: user.name,
      role: 'Quản Trị Viên'
    }
  } else {
    return {
      name: user.name,
      role: 'Nhân Viên'
    }
  }
})

// Page title from route
const pageTitle = computed(() => {
  const titleMap = {
    // Dashboard
    '/dashboard': 'Thống kê & Báo cáo',
    
    // User Management
    '/users/employees': 'Quản lý Nhân viên',
    '/users/customers': 'Quản lý Khách hàng',
    
    // Product Management
    '/products': 'Quản lý Sản phẩm',
    '/products/categories': 'Danh mục Sản phẩm',
    '/products/brands': 'Thương hiệu',
    '/products/colors': 'Màu sắc',
    '/products/sizes': 'Kích thước',
    '/products/materials': 'Chất liệu',
    
    // Sales & Orders
    '/sales/pos': 'Bán hàng tại quầy',
    '/sales/orders': 'Quản lý Đơn hàng',
    '/sales/returns': 'Quản lý Trả hàng',
    
    // Marketing & Promotions
    '/marketing/discounts': 'Mã giảm giá',
    '/marketing/campaigns': 'Chiến dịch khuyến mãi',
    '/marketing/vouchers': 'Phiếu giảm giá người dùng',
    
    // Customer Engagement
    '/customers/carts': 'Quản lý Giỏ hàng',
    '/customers/favorites': 'Sản phẩm Yêu thích',
    '/customers/reviews': 'Đánh giá Sản phẩm',
    '/customers/comments': 'Bình luận',
    
    // Communication
    '/communication/notifications': 'Thông báo',
    '/communication/contacts': 'Liên hệ',
    
    // Inventory
    '/inventory/imports': 'Nhập kho',
    
    // Analytics & System
    '/analytics/price-history': 'Lịch sử Giá',
    '/system/activity-logs': 'Nhật ký Hoạt động'
  }
  return titleMap[route.path] || 'GearUp Admin'
})

const menuItems = [
  // Order Management Section
  { 
    name: 'QUẢN LÝ ĐƠN HÀNG', 
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
    </svg>`,
    hasSubmenu: true,
    submenu: [
      { path: '/sales/pos', name: 'Bán hàng tại quầy' },
      { path: '/sales/orders', name: 'Danh sách đơn hàng' },
      { path: '/sales/returns', name: 'Trả hàng & hoàn tiền' },
      { path: '/inventory/imports', name: 'Nhập hàng' },
      { path: '/analytics/price-history', name: 'Lịch sử giá bán' },
      { path: '/system/activity-logs', name: 'Nhật ký giao dịch' }
    ]
  },
  
  // Product Management Section
  { 
    name: 'QUẢN LÝ SẢN PHẨM', 
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12"/>
    </svg>`,
    hasSubmenu: true,
    submenu: [
      { path: '/products', name: 'Danh sách sản phẩm' },
      { path: '/products/categories', name: 'Danh mục sản phẩm' },
      { path: '/products/brands', name: 'Thương hiệu' },
      { path: '/products/colors', name: 'Màu sắc' },
      { path: '/products/sizes', name: 'Kích thước' },
      { path: '/products/materials', name: 'Chất liệu' }
    ]
  },
  
  // Discounts Section
  { 
    name: 'GIẢM GIÁ & KHUYẾN MÃI',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.79 21L3 11.21V2H11.21L21 11.79L12.79 21ZM4.41 4H6.58V5.17C6.58 5.72 7.03 6.17 7.58 6.17S8.58 5.72 8.58 5.17V4H10.76L19 12.24L12.79 18.45L4.55 10.21L4.41 4Z"/>
    </svg>`,
    hasSubmenu: true,
    submenu: [
      { path: '/marketing/discounts', name: 'Mã giảm giá' },
      { path: '/marketing/campaigns', name: 'Chiến dịch khuyến mãi' },
      { path: '/marketing/vouchers', name: 'Phiếu giảm giá' }
    ]
  },
  
  // Customer Support Section
  { 
    name: 'HỖ TRỢ KHÁCH HÀNG',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6L21 9ZM3 9L9 6V4L3 7V9ZM15 18V20L21 17V15L15 18ZM3 15V17L9 20V18L3 15ZM12 8L18 11V13L12 16L6 13V11L12 8Z"/>
    </svg>`,
    hasSubmenu: true,
    submenu: [
      { path: '/customers/carts', name: 'Quản lý giỏ hàng' },
      { path: '/customers/favorites', name: 'Sản phẩm yêu thích' },
      { path: '/customers/reviews', name: 'Đánh giá sản phẩm' },
      { path: '/customers/comments', name: 'Bình luận khách hàng' },
      { path: '/communication/notifications', name: 'Thông báo hệ thống' },
      { path: '/communication/contacts', name: 'Liên hệ & khiếu nại' }
    ]
  },
  
  // Users Section
  { 
    name: 'NGƯỜI DÙNG', 
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12S12 10.2 12 8S13.8 4 16 4ZM4 8C4 5.8 5.8 4 8 4S12 5.8 12 8S10.2 12 8 12S4 10.2 4 8ZM8 14C12.4 14 16 16.6 16 20V22H0V20C0 16.6 3.6 14 8 14ZM24 20V22H18V20C18 18.2 17.2 16.5 15.8 15.3C17.1 14.8 18.5 14.5 20 14.5C22.2 14.5 24 17.1 24 20Z"/>
    </svg>`,
    hasSubmenu: true,
    submenu: [
      { path: '/users/employees', name: 'Nhân viên' },
      { path: '/users/customers', name: 'Khách hàng' }
    ]
  }
]

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const navigateToDashboard = () => {
  router.push('/dashboard')
}

const logout = () => {
  showUserDropdown.value = false
  router.push('/login')
}

const closeMobileMenu = () => {
  // For mobile menu handling if needed
}

const toggleSubmenu = (menuName) => {
  expandedMenus.value[menuName] = !expandedMenus.value[menuName]
}

const isSubmenuExpanded = (menuName) => {
  return expandedMenus.value[menuName] || false
}

const isSubmenuItemActive = (submenu) => {
  return submenu.some(item => route.path === item.path)
}

// Close dropdown when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.user-profile')) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<template>
  <!-- Login Page (standalone) -->
  <router-view v-if="isLoginPage" />
  
  <!-- Admin Layout (with sidebar and header) -->
  <div v-else class="admin-layout">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo" @click="navigateToDashboard">
          <img :src="logoUrl" alt="GearUp Logo" class="logo-icon" />
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <template v-for="item in menuItems" :key="item.name">
          <!-- Regular menu item -->
          <router-link 
            v-if="!item.hasSubmenu"
            :to="item.path" 
            class="menu-item"
            :class="{ 'active': route.path === item.path }"
            @click="closeMobileMenu"
          >
            <div class="menu-icon" v-if="item.iconSvg" v-html="item.iconSvg"></div>
            <div class="menu-icon-placeholder" v-else></div>
            <span class="menu-text">{{ item.name }}</span>
          </router-link>
          
          <!-- Menu item with submenu -->
          <div v-else class="menu-group">
            <div 
              class="menu-item menu-parent"
              :class="{ 
                'active': isSubmenuItemActive(item.submenu),
                'expanded': isSubmenuExpanded(item.name)
              }"
              @click="toggleSubmenu(item.name)"
            >
              <div class="menu-icon" v-if="item.iconSvg" v-html="item.iconSvg"></div>
              <div class="menu-icon-placeholder" v-else></div>
              <span class="menu-text">{{ item.name }}</span>
              <span class="menu-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </span>
            </div>
            
            <!-- Submenu items -->
            <div 
              class="submenu"
              :class="{ 'submenu-expanded': isSubmenuExpanded(item.name) }"
            >
              <router-link
                v-for="subitem in item.submenu"
                :key="subitem.path"
                :to="subitem.path"
                class="submenu-item"
                :class="{ 'active': route.path === subitem.path }"
                @click="closeMobileMenu"
              >
                <span class="submenu-bullet">•</span>
                <span class="submenu-text">{{ subitem.name }}</span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <div class="user-profile" @click="toggleUserDropdown">
            <div class="notification-icon" @click.stop="toggleNotifications">🔔</div>
            <div class="user-info">
              <div class="user-text-info" v-if="sidebarOpen">
                <div class="user-name">{{ displayName.name }}</div>
                <div class="user-role">{{ displayName.role }}</div>
              </div>
              <div class="user-avatar">
                <div class="avatar-circle">
                  <span class="avatar-initial">{{ displayName.name.charAt(0) }}</span>
                </div>
                <div class="online-indicator"></div>
              </div>
            </div>
            <div class="user-dropdown" v-if="showUserDropdown">
              <div class="dropdown-header">
                <div class="user-role-info">
                  <div class="user-name">{{ currentUser.name }}</div>
                  <div class="user-role">{{ currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên' }}</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              
              <button class="dropdown-item logout" @click="logout">
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--gray-50);
  transform: translate3d(0, 0, 0);
  will-change: auto;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  position: relative;
  overflow-y: auto;
  z-index: 1000;
}

.logo-section {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo-icon {
  height: 40px;
  width: auto;
  transition: all 0.3s ease;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-500);
  font-family: var(--font-family-heading);
}

/* Navigation Menu */
.nav-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid transparent;
}

.menu-item:hover {
  background-color: #f9fafb;
  color: #1f2937;
}

.menu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
  border-left: 3px solid #2563eb;
}

/* Menu with submenu */
.menu-group {
  margin-bottom: 0.25rem;
}

.menu-parent {
  justify-content: space-between;
  user-select: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #6b7280;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}

.menu-arrow {
  margin-left: auto;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  opacity: 0.6;
}

.menu-parent.expanded .menu-arrow {
  transform: rotate(180deg);
}

/* Submenu styles */
.submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: transparent;
}

.submenu-expanded {
  max-height: 500px;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  padding-left: 3rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
}

.submenu-item:hover {
  background-color: #f9fafb;
  color: #374151;
}

.submenu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
  border-left: 3px solid #2563eb;
}

.submenu-bullet {
  margin-right: 0.75rem;
  color: #9ca3af;
  font-size: 0.75rem;
  width: 4px;
  height: 4px;
  background-color: #9ca3af;
  border-radius: 50%;
}

.submenu-text {
  flex: 1;
}

.menu-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.menu-icon svg {
  width: 100%;
  height: 100%;
}

.menu-icon-placeholder {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-item:hover .menu-icon {
  opacity: 1;
  color: #374151;
}

.menu-item.active .menu-icon {
  opacity: 1;
  color: #2563eb;
}

.menu-text {
  margin-left: 0.75rem;
  flex: 1;
  font-size: 0.875rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: var(--spacing-lg) var(--spacing-3xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  box-shadow: var(--elevation-nav);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}


.page-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-family: var(--font-family-heading);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-text-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.2;
  text-align: right;
}

.user-role {
  font-weight: var(--font-weight-normal);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.2;
  text-align: right;
  opacity: 0.8;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  min-width: 250px;
  max-width: 300px;
}

.dropdown-header {
  padding: var(--spacing-md);
  background-color: var(--gray-50);
  border-bottom: 1px solid var(--border);
}

.user-role-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border);
  margin: 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  margin: 1px var(--spacing-xs);
}

.dropdown-item:hover {
  background-color: var(--gray-100);
  color: var(--primary-600);
}

.dropdown-item.logout {
  color: var(--danger-600);
  margin-top: var(--spacing-xs);
}

.dropdown-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-700);
}

.notification-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--gray-100);
  cursor: pointer;
  transition: var(--transition-base);
  color: var(--text-secondary);
}

.notification-icon:hover {
  background-color: var(--gray-200);
  color: var(--text-primary);
}

.user-avatar {
  position: relative;
  cursor: pointer;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid var(--surface);
}

.avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-initial {
  color: white;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  text-transform: uppercase;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border: 2px solid var(--surface);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Page Content */
.page-content {
  flex: 1;
  padding: var(--spacing-3xl);
  overflow-y: auto;
  background-color: var(--background);
}

/* Responsive Design */

@media (max-width: 768px) {
  .admin-layout {
    position: relative;
  }
  
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 1000;
    width: 280px;
    transition: left 0.3s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .header {
    padding: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: var(--spacing-md);
  }
  
  .header {
    padding: var(--spacing-md);
  }
  
  .page-title {
    font-size: var(--font-size-lg);
  }
  
  .user-text-info {
    display: none;
  }
  
  .avatar-circle {
    width: 36px;
    height: 36px;
  }
  
  .avatar-initial {
    font-size: var(--font-size-sm);
  }
  
  .online-indicator {
    width: 10px;
    height: 10px;
  }
}
</style>

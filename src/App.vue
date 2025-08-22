<script setup>
import { ref, computed, onMounted, onUnmounted, watch, markRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './services/authStore.js'
import { useNotifications } from './composables/useNotifications.js'
import { setGlobalNotificationInstance } from './services/notificationService.js'
import logoUrl from '@/assets/gearup-logo-official.svg'

const router = useRouter()
const route = useRoute()
const { authState, logout: authLogout, initializeAuth } = useAuth()

const sidebarOpen = ref(true) // Always keep sidebar open
const showNotifications = ref(false)
const showUserDropdown = ref(false)
const showAllNotificationsModal = ref(false)
const isModalClosing = ref(false)
const isCountUpdating = ref(false)
const expandedMenus = ref({
  'QUẢN LÝ ĐƠN HÀNG': true,
  'QUẢN LÝ SẢN PHẨM': true,
  'GIẢM GIÁ & KHUYẾN MÃI': true,
  'HỖ TRỢ KHÁCH HÀNG': true,
  'NGƯỜI DÙNG': true
})

// Notifications
const {
  notifications,
  unreadCount,
  startPolling,
  markAsRead: markAsReadComposable,
  markAllAsRead: markAllAsReadComposable,
  clearAllNotifications,
  addNotification,
  createOrderNotification,
  createProductNotification,
  createCustomerNotification,
  createSystemNotification
} = useNotifications()

const unreadNotifications = computed(() => unreadCount.value)
const previousUnreadCount = ref(0)

// Filters
const notificationFilters = markRaw([
  { key: 'all', label: 'Tất cả', icon: '📋' },
  { key: 'unread', label: 'Chưa đọc', icon: '🔴' },
  { key: 'order', label: 'Đơn hàng', icon: '🛒' },
  { key: 'inventory', label: 'Kho hàng', icon: '📦' },
  { key: 'review', label: 'Đánh giá', icon: '⭐' },
  { key: 'customer', label: 'Khách hàng', icon: '👥' },
  { key: 'report', label: 'Báo cáo', icon: '📊' }
])

const selectedFilter = ref('all')

// Current user data from auth state
const currentUser = computed(() => {
  if (!authState.user) {
    return {
      name: 'Guest',
      role: 'guest',
      fullName: 'Khách'
    }
  }
  
  return {
    name: authState.user.hoTen || 'User',
    role: authState.user.loaiNguoiDung === 'nhan_vien' ? 'staff' : 'customer',
    fullName: authState.user.hoTen || 'User',
    quyenHan: authState.user.quyenHan
  }
})

// Check if current route is login page
const isLoginPage = computed(() => route.path === '/login')

// Computed for display name with role
const displayName = computed(() => {
  const user = currentUser.value
  
  if (user.role === 'staff') {
    // For employees, show Admin or Staff based on permission
    const roleLabel = user.quyenHan === 'Admin' ? 'Admin' : 'Staff'
    return {
      name: user.name,
      role: roleLabel
    }
  } else if (user.role === 'customer') {
    return {
      name: user.name,
      role: 'Customer'
    }
  } else {
    return {
      name: user.name,
      role: 'Guest'
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
  // Dashboard Section
  { 
    path: '/dashboard',
    name: 'THỐNG KÊ & BÁO CÁO', 
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>`,
    hasSubmenu: false
  },
  
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

// Computed properties for filtered notifications
const filteredNotificationsModal = computed(() => {
  const notifs = notifications.value

  // Early return for 'all' filter to avoid unnecessary filtering
  if (selectedFilter.value === 'all') {
    return [...notifs].sort((a, b) => b.timestamp - a.timestamp)
  }

  let filtered
  if (selectedFilter.value === 'unread') {
    filtered = notifs.filter(n => !n.isRead)
  } else {
    // For type filters
    filtered = notifs.filter(n => n.type === selectedFilter.value)
  }

  return filtered.sort((a, b) => b.timestamp - a.timestamp)
})

// Create reactive computed properties for filter counts
const filterCounts = computed(() => {
  const counts = {
    all: notifications.value.length,
    unread: notifications.value.filter(n => !n.isRead).length,
    order: notifications.value.filter(n => n.type === 'order').length,
    inventory: notifications.value.filter(n => n.type === 'inventory').length,
    review: notifications.value.filter(n => n.type === 'review').length,
    customer: notifications.value.filter(n => n.type === 'customer').length,
    report: notifications.value.filter(n => n.type === 'report').length
  }

  return counts
})

// Notification functions
const toggleNotifications = () => {
  console.log('Toggle notifications clicked, current state:', showNotifications.value)
  showNotifications.value = !showNotifications.value
  console.log('New state:', showNotifications.value)
}

const markAsRead = async notificationId => {
  markAsReadComposable(notificationId)
}

const markAllAsRead = async () => {
  markAllAsReadComposable()
}

const viewAllNotifications = () => {
  showNotifications.value = false
  showAllNotificationsModal.value = true
}

const closeAllNotificationsModal = () => {
  isModalClosing.value = true
  setTimeout(() => {
    showAllNotificationsModal.value = false
    isModalClosing.value = false
  }, 400)
}

const getUnreadCountForFilter = filterKey => {
  switch (filterKey) {
    case 'all':
      return notifications.value.filter(n => !n.isRead).length
    case 'unread':
      return notifications.value.filter(n => !n.isRead).length
    default:
      // For specific types, count unread notifications of that type
      return notifications.value.filter(n => n.type === filterKey && !n.isRead).length
  }
}

const getTypeLabel = type => {
  const typeLabels = {
    order: 'Đơn hàng',
    inventory: 'Kho hàng',
    review: 'Đánh giá',
    customer: 'Khách hàng',
    report: 'Báo cáo'
  }
  return typeLabels[type] || 'Khác'
}

const getEmptyMessage = () => {
  const filter = selectedFilter.value
  if (filter === 'all') return 'Hiện tại không có thông báo nào.'
  if (filter === 'unread') return 'Tất cả thông báo đã được đọc.'
  const filterObj = notificationFilters.find(f => f.key === filter)
  return `Không có thông báo ${filterObj ? filterObj.label.toLowerCase() : 'này'}.`
}

const formatTimeAgo = timestamp => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

const formatFullDate = timestamp => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const navigateToDashboard = () => {
  router.push('/dashboard')
}

const logout = () => {
  showUserDropdown.value = false
  authLogout()
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

// Watch for unread count changes to trigger animation
watch(
  unreadNotifications,
  (newCount, oldCount) => {
    if (newCount !== oldCount && newCount > 0) {
      isCountUpdating.value = true
      setTimeout(() => {
        isCountUpdating.value = false
      }, 600)
    }
    previousUnreadCount.value = oldCount
  },
  { immediate: false }
)

// Close dropdown when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.user-profile')) {
    showUserDropdown.value = false
  }
  if (
    showNotifications.value &&
    !event.target.closest('.notification-button') &&
    !event.target.closest('.notifications-dropdown')
  ) {
    showNotifications.value = false
  }
  if (showAllNotificationsModal.value && !event.target.closest('.notifications-modal')) {
    closeAllNotificationsModal()
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
  initializeAuth() // Initialize auth state from localStorage
  startPolling() // Start notification system
  
  // Set up global notification instance
  setGlobalNotificationInstance({
    addNotification,
    createOrderNotification,
    createProductNotification,
    createCustomerNotification,
    createSystemNotification
  })
  
  // No automatic notifications - only trigger on actual changes
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
        </div>

        <div class="header-right">
          <div class="header-actions">
            <button class="notification-button" @click="toggleNotifications">
              <div class="bell-icon-container">
                <!-- Clean Bell Icon -->
                <svg
                  class="bell-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <div
                  v-if="unreadNotifications > 0"
                  :key="unreadNotifications"
                  class="notification-count"
                  :class="{ updating: isCountUpdating }"
                >
                  {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                </div>
              </div>
            </button>

            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
              <div class="notifications-header">
                <h3>Thông báo</h3>
                <button v-if="unreadNotifications > 0" class="mark-all-read" @click="markAllAsRead">
                  Đánh dấu đã đọc
                </button>
              </div>

              <div class="notifications-list">
                <div v-if="notifications.length === 0" class="no-notifications">
                  <i class="empty-icon">📭</i>
                  <p>Không có thông báo mới</p>
                </div>

                <div v-else>
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ unread: !notification.isRead }"
                    @click="markAsRead(notification.id)"
                  >
                    <div class="notification-icon">
                      {{ notification.icon }}
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">
                        {{ notification.title }}
                      </div>
                      <div class="notification-message">
                        {{ notification.message }}
                      </div>
                      <div class="notification-time">
                        {{ formatTimeAgo(notification.timestamp) }}
                      </div>
                    </div>
                    <div v-if="!notification.isRead" class="unread-indicator" />
                  </div>
                </div>
              </div>

              <div class="notifications-footer">
                <button class="view-all-btn" @click="viewAllNotifications">Xem tất cả thông báo</button>
              </div>
            </div>
          </div>

          <div class="user-profile" @click="toggleUserDropdown">
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
                  <div class="user-name">{{ displayName.name }}</div>
                  <div class="user-role">{{ displayName.role }}</div>
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

    <!-- All Notifications Modal -->
    <div
      v-if="showAllNotificationsModal"
      class="modal-overlay"
      :class="{ 'modal-closing': isModalClosing }"
      @click="closeAllNotificationsModal"
    >
      <div class="notifications-modal" :class="{ 'modal-closing': isModalClosing }" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <h2 class="modal-title">
              <i class="modal-icon">🔔</i>
              Tất cả thông báo
            </h2>
            <span class="notifications-count">{{ notifications.length }} thông báo</span>
          </div>
          <div class="modal-actions">
            <button v-if="unreadNotifications > 0" class="mark-all-read-modal" @click="markAllAsRead">
              <i class="check-icon">✓</i>
              Đánh dấu tất cả đã đọc
            </button>
            <button v-if="notifications.length > 0" class="clear-all-btn" @click="clearAllNotifications">
              <i class="clear-icon">🗑️</i>
              Xóa tất cả
            </button>
            <button class="close-modal-btn" @click="closeAllNotificationsModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="modal-filters">
          <div class="filter-tabs">
            <button
              v-for="filter in notificationFilters"
              :key="filter.key"
              class="filter-tab"
              :class="{ active: selectedFilter === filter.key }"
              @click="selectedFilter = filter.key"
            >
              <i class="tab-icon">{{ filter.icon }}</i>
              <span class="tab-label">{{ filter.label }}</span>
              <span v-if="filterCounts[filter.key] > 0" class="tab-badge" :class="{
                'badge-unread': getUnreadCountForFilter(filter.key) > 0,
                'badge-read': getUnreadCountForFilter(filter.key) === 0
              }">
                {{ filterCounts[filter.key] }}
              </span>
            </button>
          </div>
        </div>

        <div class="modal-content">
          <div v-if="filteredNotificationsModal.length === 0" class="empty-notifications">
            <div class="empty-icon">📭</div>
            <h3>Không có thông báo</h3>
            <p>{{ getEmptyMessage() }}</p>
          </div>

          <div v-else class="notifications-grid">
            <div
              v-for="(notification, index) in filteredNotificationsModal"
              :key="notification.id"
              class="notification-card"
              :class="{ unread: !notification.isRead }"
              :style="{ 'animation-delay': `${index * 0.05}s` }"
              @click="markAsRead(notification.id)"
            >
              <div class="card-header">
                <div class="notification-type" :class="`type-${notification.type}`">
                  <i class="type-icon">{{ notification.icon }}</i>
                  <span class="type-label">{{ getTypeLabel(notification.type) }}</span>
                </div>
                <div class="notification-meta">
                  <span class="notification-time-full">{{ formatFullDate(notification.timestamp) }}</span>
                  <div v-if="!notification.isRead" class="unread-dot" />
                </div>
              </div>

              <div class="card-body">
                <h4 class="notification-title-full">
                  {{ notification.title }}
                </h4>
                <p class="notification-message-full">
                  {{ notification.message }}
                </p>
              </div>

              <div class="card-footer">
                <span class="time-ago">{{ formatTimeAgo(notification.timestamp) }}</span>
                <button
                  v-if="!notification.isRead"
                  class="mark-read-btn"
                  @click.stop="markAsRead(notification.id)"
                >
                  <i class="check-icon">✓</i>
                  Đánh dấu đã đọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-right: var(--spacing-md);
  position: relative;
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

/* Modern Notification Button */
.notification-button {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notification-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-300);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.notification-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bell-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.notification-button:hover .bell-icon {
  color: var(--primary-600);
  transform: scale(1.05);
}

.notification-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  animation: badgeAppear 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
  z-index: 10;
  line-height: 1;
}

@keyframes badgeAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-90deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Badge update animation */
@keyframes badgeUpdate {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.15);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* Special animation for count updates */
.notification-count.updating {
  animation: badgeUpdate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Hover effect for notification button affects badge */
.notification-button:hover .notification-count {
  animation-play-state: paused;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
}

.notification-button:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Notifications Dropdown */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  min-width: 380px;
  max-width: 400px;
  overflow: hidden;
  animation: dropdownSlideIn 0.2s ease-out;
  transform-origin: top right;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.notifications-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mark-all-read {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--primary-600);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.mark-all-read:hover {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: var(--gray-500);
}

.no-notifications .empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.no-notifications p {
  margin: 0;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: var(--gray-50);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background: var(--primary-25);
  border-left: 3px solid var(--primary-500);
}

.notification-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-100);
  border-radius: 50%;
}

.notification-item.unread .notification-icon {
  background: var(--primary-100);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.notification-message {
  color: var(--gray-600);
  font-size: 0.8125rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  color: var(--gray-500);
  font-size: 0.75rem;
  font-weight: 500;
}

.unread-indicator {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
  margin-top: 0.25rem;
}

.notifications-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--gray-50);
}

.view-all-btn {
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--primary-600);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
  color: var(--primary-700);
}

/* Modal Overlay and Base */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Reset any global button styles in modal */
.notifications-modal button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* Override the reset for specific styled buttons */
.notifications-modal .mark-all-read-modal {
  background: var(--primary-500) !important;
  color: white !important;
  border: 2px solid var(--primary-500) !important;
  padding: 0.5rem 1rem !important;
}

.notifications-modal .close-modal-btn {
  background: white !important;
  border: 2px solid var(--gray-300) !important;
  padding: 0 !important;
}

.notifications-modal button:focus {
  outline: 0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.notifications-modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
}

/* Overlay closing animation */
.modal-overlay.modal-closing {
  animation: overlayFadeOut 0.4s ease-in forwards;
}

@keyframes overlayFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.notifications-modal.modal-closing {
  animation: modalSlideOut 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important;
}

/* Modal Header */
.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: relative;
}

.modal-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-icon {
  font-size: 1.5rem;
  color: var(--primary-600);
}

.notifications-count {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mark-all-read-modal {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.mark-all-read-modal:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.mark-all-read-modal .check-icon {
  font-size: 1rem;
  font-weight: bold;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--danger-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.clear-all-btn:hover {
  background: var(--danger-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.clear-all-btn .clear-icon {
  font-size: 1rem;
}

.close-modal-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--gray-300);
  background: white;
  color: var(--gray-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  color: var(--gray-700);
}

/* Modal Filters */
.modal-filters {
  padding: 1.5rem 2rem 1rem;
  background: white;
  border-bottom: 1px solid var(--border);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.notifications-modal .filter-tab {
  background: white;
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem !important;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 36px;
  user-select: none;
  will-change: transform, background-color;
}

.notifications-modal .filter-tab:hover {
  background: var(--gray-50) !important;
  border-color: var(--primary-300);
  transform: translate3d(0, -1px, 0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Active state - higher specificity and distinct styling */
.notifications-modal .filter-tab.active {
  background: var(--primary-500) !important;
  border-color: var(--primary-500) !important;
  color: white !important;
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Active tab hover state - slightly different from regular active */
.notifications-modal .filter-tab.active:hover {
  background: var(--primary-600) !important;
  border-color: var(--primary-600) !important;
  transform: translate3d(0, -2px, 0) !important;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4) !important;
}

.tab-icon {
  font-size: 1rem;
  line-height: 1;
}

.tab-label {
  font-weight: inherit;
  line-height: 1;
}

.tab-badge {
  background: var(--gray-200);
  color: var(--gray-700);
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s ease;
}

.tab-badge.badge-unread {
  background: var(--error);
  color: white;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.tab-badge.badge-read {
  background: var(--gray-400);
  color: white;
}

/* Active tab badges - higher specificity */
.notifications-modal .filter-tab.active .tab-badge.badge-unread {
  background: rgba(239, 68, 68, 0.9) !important;
  color: white !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
}

.notifications-modal .filter-tab.active .tab-badge.badge-read {
  background: rgba(156, 163, 175, 0.8) !important;
  color: white !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
}

/* Modal Content */
.modal-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.empty-notifications {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-500);
}

.empty-notifications .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-notifications h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--gray-700);
}

.empty-notifications p {
  margin: 0;
  font-size: 1rem;
}

.notifications-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.notification-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: cardSlideIn 0.4s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-200);
}

.notification-card.unread {
  border-left: 4px solid var(--primary-500);
  background: linear-gradient(135deg, var(--primary-25) 0%, white 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.notification-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--gray-100);
  border-radius: 16px;
}

.type-icon {
  font-size: 1rem;
}

.type-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-time-full {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 500;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
}

.card-body {
  margin-bottom: 1rem;
}

.notification-title-full {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.notification-message-full {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-ago {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 500;
}

.mark-read-btn {
  padding: 0.25rem 0.5rem;
  background: var(--primary-50);
  color: var(--primary-600);
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: var(--primary-100);
  color: var(--primary-700);
}

.mark-read-btn .check-icon {
  font-size: 0.75rem;
  font-weight: bold;
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

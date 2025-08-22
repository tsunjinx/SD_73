<template>
  <div class="notifications-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Thông báo</h1>
          <p class="page-subtitle">Tạo và quản lý thông báo gửi tới khách hàng</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Làm mới
          </button>
          <button class="btn-export" @click="exportData">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-export" @click="exportNotificationsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showCreateModal = true">
            <span class="btn-icon">➕</span>
            Tạo thông báo
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card total-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5H2A10 10 0 0012 2a10 10 0 0010 10h-1.5a7.5 7.5 0 01-7.5 7.5v5z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalNotifications }}</div>
          <div class="stat-label">Tổng thông báo</div>
          <div class="stat-trend positive">+15% từ tháng trước</div>
        </div>
      </div>
      
      <div class="stat-card unread-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ unreadNotifications }}</div>
          <div class="stat-label">Chưa đọc</div>
          <div class="stat-trend neutral">{{ Math.round((unreadNotifications/totalNotifications)*100) }}% chưa đọc</div>
        </div>
      </div>

      <div class="stat-card read-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ readNotifications }}</div>
          <div class="stat-label">Đã đọc</div>
          <div class="stat-trend positive">{{ Math.round((readNotifications/totalNotifications)*100) }}% đã đọc</div>
        </div>
      </div>

      <div class="stat-card recent-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ todayNotifications }}</div>
          <div class="stat-label">Hôm nay</div>
          <div class="stat-trend positive">+8% từ hôm qua</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-card">
      <div class="filter-header">
        <h3>Bộ lọc & Tìm kiếm</h3>
        <button class="btn btn-secondary" @click="resetFilters">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Đặt lại
        </button>
      </div>
      
      <div class="filter-grid">
        <div class="filter-group">
          <label>Tìm kiếm</label>
          <div class="search-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Tìm theo tiêu đề, người nhận..." 
              v-model="searchQuery"
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <label>Loại thông báo</label>
          <select v-model="selectedType" class="filter-select">
            <option value="">Tất cả loại</option>
            <option value="system">Hệ thống</option>
            <option value="promotion">Khuyến mãi</option>
            <option value="order">Đơn hàng</option>
            <option value="account">Tài khoản</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Trạng thái</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="sent">Đã gửi</option>
            <option value="read">Đã đọc</option>
            <option value="unread">Chưa đọc</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Từ ngày</label>
          <input type="date" v-model="fromDate" class="filter-input">
        </div>
        
        <div class="filter-group">
          <label>Đến ngày</label>
          <input type="date" v-model="toDate" class="filter-input">
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="data-card">
      <div class="data-header">
        <h3>Danh sách Thông báo ({{ filteredNotifications.length }} kết quả)</h3>
        <div class="header-controls">
          <select v-model="itemsPerPage" class="filter-select">
            <option value="10">10/trang</option>
            <option value="25">25/trang</option>
            <option value="50">50/trang</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Người nhận</th>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Thời gian gửi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notification, index) in paginatedNotifications" :key="notification.id">
              <td class="index-cell">{{ index + 1 + startIndex }}</td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ notification.nguoi_dung.ho_ten.charAt(0) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ notification.nguoi_dung.ho_ten }}</div>
                    <div class="user-email">{{ notification.nguoi_dung.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="notification-title">{{ notification.tieu_de }}</div>
                <div class="notification-preview">{{ notification.noi_dung.substring(0, 60) }}...</div>
              </td>
              <td>
                <span :class="['type-badge', getTypeClass(notification.loai)]">
                  {{ getTypeText(notification.loai) }}
                </span>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-main">{{ formatDate(notification.ngay_tao) }}</div>
                  <div class="date-ago">{{ getTimeAgo(notification.ngay_tao) }}</div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(notification)]">
                  {{ getStatusText(notification) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button 
                    class="action-btn view" 
                    @click="viewNotification(notification)"
                    title="Xem chi tiết"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    class="action-btn edit" 
                    @click="editNotification(notification)"
                    title="Chỉnh sửa"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    class="action-btn delete" 
                    @click="deleteNotification(notification)"
                    title="Xóa"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredNotifications.length }} thông báo
        </div>
        <div class="pagination">
          <button 
            class="pagination-btn" 
            @click="previousPage" 
            :disabled="currentPage === 1"
          >
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Trước
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            class="pagination-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
          >
            Sau
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? 'Tạo thông báo mới' : 'Chỉnh sửa thông báo' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="notification-form">
            <div class="form-section">
              <h4>Thông tin cơ bản</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input type="text" v-model="form.tieu_de" class="filter-input" placeholder="Nhập tiêu đề thông báo">
                </div>
                <div class="form-group">
                  <label>Loại thông báo</label>
                  <select v-model="form.loai" class="filter-select">
                    <option value="system">Hệ thống</option>
                    <option value="promotion">Khuyến mãi</option>
                    <option value="order">Đơn hàng</option>
                    <option value="account">Tài khoản</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Nội dung</h4>
              <div class="form-group">
                <textarea 
                  v-model="form.noi_dung" 
                  class="content-textarea" 
                  placeholder="Nhập nội dung thông báo..."
                  rows="5"
                ></textarea>
              </div>
            </div>

            <div class="form-section">
              <h4>Người nhận</h4>
              <div class="recipient-options">
                <label class="radio-option">
                  <input type="radio" v-model="form.recipient_type" value="all">
                  <span>Gửi tất cả khách hàng</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="form.recipient_type" value="specific">
                  <span>Chọn khách hàng cụ thể</span>
                </label>
              </div>
              
              <div v-if="form.recipient_type === 'specific'" class="customer-select">
                <select v-model="form.selected_users" multiple class="filter-select">
                  <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.ho_ten }} - {{ user.email }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">Hủy</button>
          <button class="btn btn-primary" @click="saveNotification">
            {{ showCreateModal ? 'Tạo thông báo' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết thông báo</h3>
          <button class="modal-close" @click="closeViewModal">×</button>
        </div>
        
        <div class="modal-body" v-if="selectedNotification">
          <div class="notification-detail">
            <div class="detail-section">
              <h4>Thông tin thông báo</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Tiêu đề</label>
                  <span>{{ selectedNotification.tieu_de }}</span>
                </div>
                <div class="info-item">
                  <label>Loại</label>
                  <span :class="['type-badge', getTypeClass(selectedNotification.loai)]">
                    {{ getTypeText(selectedNotification.loai) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Thời gian tạo</label>
                  <span>{{ formatDateTime(selectedNotification.ngay_tao) }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái</label>
                  <span :class="['status-badge', getStatusClass(selectedNotification)]">
                    {{ getStatusText(selectedNotification) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Nội dung</h4>
              <div class="content-display">
                {{ selectedNotification.noi_dung }}
              </div>
            </div>

            <div class="detail-section">
              <h4>Người nhận</h4>
              <div class="recipient-info">
                <div class="user-avatar-large">
                  {{ selectedNotification.nguoi_dung.ho_ten.charAt(0) }}
                </div>
                <div class="user-info-large">
                  <div class="user-name-large">{{ selectedNotification.nguoi_dung.ho_ten }}</div>
                  <div class="user-email-large">{{ selectedNotification.nguoi_dung.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeViewModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { exportToExcel, formatDataForExcel } from '../../utils/excelExport.js'

// Data
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedNotification = ref(null)

const form = ref({
  tieu_de: '',
  noi_dung: '',
  loai: 'system',
  recipient_type: 'all',
  selected_users: []
})

// Mock data based on ERD thong_bao table
const notifications = ref([
  {
    id: 1,
    id_nguoi_dung: 1,
    tieu_de: 'Chào mừng bạn đến với F-Shoes!',
    noi_dung: 'Cảm ơn bạn đã đăng ký tài khoản. Hãy khám phá bộ sưu tập giày thể thao mới nhất của chúng tôi.',
    loai: 'account',
    da_doc: true,
    ngay_tao: '2023-12-20T10:30:00Z',
    nguoi_dung: {
      id: 1,
      ho_ten: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com'
    }
  },
  {
    id: 2,
    id_nguoi_dung: 2,
    tieu_de: 'Đơn hàng của bạn đã được xác nhận',
    noi_dung: 'Đơn hàng #DH001 đã được xác nhận và đang trong quá trình chuẩn bị. Thời gian giao hàng dự kiến là 2-3 ngày.',
    loai: 'order',
    da_doc: false,
    ngay_tao: '2023-12-22T14:15:00Z',
    nguoi_dung: {
      id: 2,
      ho_ten: 'Trần Thị Bình',
      email: 'tranthibinh@email.com'
    }
  },
  {
    id: 3,
    id_nguoi_dung: 3,
    tieu_de: 'Sale cuối năm - Giảm giá đến 50%',
    noi_dung: 'Đừng bỏ lỡ cơ hội mua sắm với mức giảm giá lên đến 50% cho toàn bộ sản phẩm. Chương trình có hiệu lực từ ngày 25/12 đến 31/12.',
    loai: 'promotion',
    da_doc: true,
    ngay_tao: '2023-12-23T09:00:00Z',
    nguoi_dung: {
      id: 3,
      ho_ten: 'Lê Văn Cường',
      email: 'levancuong@email.com'
    }
  },
  {
    id: 4,
    id_nguoi_dung: 1,
    tieu_de: 'Cập nhật bảo mật tài khoản',
    noi_dung: 'Chúng tôi đã cập nhật hệ thống bảo mật. Vui lòng đổi mật khẩu để đảm bảo an toàn cho tài khoản của bạn.',
    loai: 'system',
    da_doc: false,
    ngay_tao: '2023-12-24T16:30:00Z',
    nguoi_dung: {
      id: 1,
      ho_ten: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com'
    }
  }
])

const availableUsers = ref([
  { id: 1, ho_ten: 'Nguyễn Văn An', email: 'nguyenvanan@email.com' },
  { id: 2, ho_ten: 'Trần Thị Bình', email: 'tranthibinh@email.com' },
  { id: 3, ho_ten: 'Lê Văn Cường', email: 'levancuong@email.com' }
])

// Computed
const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (searchQuery.value) {
    filtered = filtered.filter(n => 
      n.tieu_de.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.nguoi_dung.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(n => n.loai === selectedType.value)
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'read') {
      filtered = filtered.filter(n => n.da_doc === true)
    } else if (selectedStatus.value === 'unread') {
      filtered = filtered.filter(n => n.da_doc === false)
    }
  }

  if (fromDate.value) {
    filtered = filtered.filter(n => new Date(n.ngay_tao) >= new Date(fromDate.value))
  }

  if (toDate.value) {
    filtered = filtered.filter(n => new Date(n.ngay_tao) <= new Date(toDate.value))
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredNotifications.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredNotifications.value.length))

const paginatedNotifications = computed(() => {
  return filteredNotifications.value.slice(startIndex.value, endIndex.value)
})

// Statistics
const totalNotifications = computed(() => notifications.value.length)
const unreadNotifications = computed(() => notifications.value.filter(n => !n.da_doc).length)
const readNotifications = computed(() => notifications.value.filter(n => n.da_doc).length)
const todayNotifications = computed(() => {
  const today = new Date().toDateString()
  return notifications.value.filter(n => new Date(n.ngay_tao).toDateString() === today).length
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getTimeAgo = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInHours = Math.floor((now - past) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Vừa xong'
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} ngày trước`
}

const getTypeClass = (type) => {
  switch (type) {
    case 'system': return 'type-system'
    case 'promotion': return 'type-promotion'
    case 'order': return 'type-order'
    case 'account': return 'type-account'
    default: return 'type-system'
  }
}

const getTypeText = (type) => {
  switch (type) {
    case 'system': return 'Hệ thống'
    case 'promotion': return 'Khuyến mãi'
    case 'order': return 'Đơn hàng'
    case 'account': return 'Tài khoản'
    default: return 'Hệ thống'
  }
}

const getStatusClass = (notification) => {
  return notification.da_doc ? 'status-read' : 'status-unread'
}

const getStatusText = (notification) => {
  return notification.da_doc ? 'Đã đọc' : 'Chưa đọc'
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  fromDate.value = ''
  toDate.value = ''
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const viewNotification = (notification) => {
  selectedNotification.value = notification
  showViewModal.value = true
}

const editNotification = (notification) => {
  selectedNotification.value = notification
  form.value = {
    tieu_de: notification.tieu_de,
    noi_dung: notification.noi_dung,
    loai: notification.loai,
    recipient_type: 'specific',
    selected_users: [notification.id_nguoi_dung]
  }
  showEditModal.value = true
}

const deleteNotification = (notification) => {
  if (confirm(`Bạn có chắc chắn muốn xóa thông báo "${notification.tieu_de}"?`)) {
    const index = notifications.value.findIndex(n => n.id === notification.id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedNotification.value = null
  form.value = {
    tieu_de: '',
    noi_dung: '',
    loai: 'system',
    recipient_type: 'all',
    selected_users: []
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedNotification.value = null
}

const saveNotification = () => {
  if (showCreateModal.value) {
    // Create new notification
    const newId = Math.max(...notifications.value.map(n => n.id)) + 1
    const targetUsers = form.value.recipient_type === 'all' ? availableUsers.value : 
                       availableUsers.value.filter(u => form.value.selected_users.includes(u.id))
    
    targetUsers.forEach((user, index) => {
      notifications.value.push({
        id: newId + index,
        id_nguoi_dung: user.id,
        tieu_de: form.value.tieu_de,
        noi_dung: form.value.noi_dung,
        loai: form.value.loai,
        da_doc: false,
        ngay_tao: new Date().toISOString(),
        nguoi_dung: user
      })
    })
    
    alert(`Đã tạo thông báo cho ${targetUsers.length} người dùng`)
  } else {
    // Update existing notification
    const index = notifications.value.findIndex(n => n.id === selectedNotification.value.id)
    if (index !== -1) {
      notifications.value[index] = {
        ...notifications.value[index],
        tieu_de: form.value.tieu_de,
        noi_dung: form.value.noi_dung,
        loai: form.value.loai
      }
    }
    alert('Đã cập nhật thông báo')
  }
  
  closeModal()
}

const exportData = () => {
  alert('Chức năng xuất dữ liệu đang được phát triển')
}

const exportNotificationsToExcel = () => {
  try {
    const headerMapping = {
      nguoi_nhan: 'Người nhận',
      email_nguoi_nhan: 'Email người nhận',
      tieu_de: 'Tiêu đề',
      noi_dung: 'Nội dung',
      loai: 'Loại thông báo',
      da_doc: 'Đã đọc',
      ngay_tao: 'Ngày tạo'
    }
    
    const dataToExport = filteredNotifications.value.map(item => ({
      nguoi_nhan: item.nguoi_dung.ho_ten,
      email_nguoi_nhan: item.nguoi_dung.email,
      tieu_de: item.tieu_de,
      noi_dung: item.noi_dung,
      loai: getTypeText(item.loai),
      da_doc: item.da_doc ? 'Đã đọc' : 'Chưa đọc',
      ngay_tao: formatDateTime(item.ngay_tao)
    }))
    
    const formattedData = formatDataForExcel(dataToExport, headerMapping)
    
    const result = exportToExcel(
      formattedData,
      'Danh_sach_thong_bao',
      'Thông báo',
      { skipHeader: false }
    )
    
    if (result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result.message}`)
    }
  } catch (error) {
    console.error('Error in exportToExcel:', error)
    alert('❌ Có lỗi xảy ra khi xuất file Excel')
  }
}

// Initialize
const refreshData = () => {
  // Simulate data refresh  
  console.log('Refreshing notifications data...')
}

onMounted(() => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastMonth.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Use the same styling pattern as favorites page */
/* Base Layout */
.notifications-page {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Page Header uses global styling from globals.css */

/* Export buttons use global .btn-export styling from globals.css */

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.total-stat .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.unread-stat .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.read-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.recent-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-trend.positive {
  color: #22c55e;
}

.stat-trend.negative {
  color: #ef4444;
}

.stat-trend.neutral {
  color: #64748b;
}

/* Filter Card */
.filter-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.filter-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.filter-select, .filter-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

/* Data Card */
.data-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.index-cell {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.user-email {
  color: #64748b;
  font-size: 0.75rem;
}

/* Notification Info */
.notification-title {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-preview {
  color: #64748b;
  font-size: 0.75rem;
}

/* Type Badges */
.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-system {
  background: #e0e7ff;
  color: #3730a3;
}

.type-promotion {
  background: #fef3c7;
  color: #d97706;
}

.type-order {
  background: #dcfce7;
  color: #16a34a;
}

.type-account {
  background: #e0f2fe;
  color: #0369a1;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-read {
  background: #dcfce7;
  color: #16a34a;
}

.status-unread {
  background: #fef3c7;
  color: #d97706;
}

/* Date Info */
.date-info .date-main {
  color: #1e293b;
  font-size: 0.875rem;
}

.date-info .date-ago {
  color: #64748b;
  font-size: 0.75rem;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5f9;
}

.action-btn .icon {
  width: 16px;
  height: 16px;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.edit {
  color: #f59e0b;
}

.action-btn.delete {
  color: #ef4444;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn .icon {
  width: 16px;
  height: 16px;
}

.page-info {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
}

.btn-primary {
  background: #4ade80;
  color: white;
  border-color: #4ade80;
}

.btn-primary:hover {
  background: #22c55e;
  border-color: #22c55e;
}

.btn-secondary {
  background: white;
  color: #64748b;
  border-color: #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #374151;
}

.icon {
  width: 16px;
  height: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 1.125rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #374151;
}

.modal-body {
  padding: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
}

/* Form */
.notification-form, .notification-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section, .detail-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-section h4, .detail-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.content-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.content-textarea:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.recipient-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.customer-select select {
  height: 120px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.info-item span {
  color: #1e293b;
  font-size: 0.875rem;
}

.content-display {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.875rem;
  line-height: 1.5;
}

.recipient-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
}

.user-name-large {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.user-email-large {
  color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-page {
    padding: 1rem;
  }

  /* Page header responsive handled by globals.css */

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .data-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .modal-content {
    margin: 1rem;
    max-width: none;
  }
}
</style>
<template>
  <div class="contact-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Liên hệ</h1>
          <p class="page-subtitle">Quản lý và phản hồi các yêu cầu liên hệ từ khách hàng</p>
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
          <button class="btn-export" @click="exportContactsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card total-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalContacts }}</div>
          <div class="stat-label">Tổng liên hệ</div>
          <div class="stat-trend positive">+18% từ tháng trước</div>
        </div>
      </div>
      
      <div class="stat-card pending-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ pendingContacts }}</div>
          <div class="stat-label">Chờ xử lý</div>
          <div class="stat-trend neutral">{{ Math.round((pendingContacts/totalContacts)*100) }}% cần xử lý</div>
        </div>
      </div>

      <div class="stat-card resolved-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ resolvedContacts }}</div>
          <div class="stat-label">Đã giải quyết</div>
          <div class="stat-trend positive">{{ Math.round((resolvedContacts/totalContacts)*100) }}% hoàn thành</div>
        </div>
      </div>

      <div class="stat-card response-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ responseRate }}%</div>
          <div class="stat-label">Tỷ lệ phản hồi</div>
          <div class="stat-trend positive">+5% từ tháng trước</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-card">
      <div class="filter-header">
        <h3>Bộ lọc & Tìm kiếm</h3>
        <button class="btn-export" @click="resetFilters">
          <span class="btn-icon">🔄</span>
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
              placeholder="Tìm theo tên, email, tiêu đề..." 
              v-model="searchQuery"
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <label>Trạng thái</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="closed">Đã đóng</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Mức độ ưu tiên</label>
          <select v-model="selectedPriority" class="filter-select">
            <option value="">Tất cả mức độ</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
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

    <!-- Bulk Actions -->
    <div v-if="selectedContacts.length > 0" class="bulk-actions-card">
      <div class="bulk-info">
        <span class="bulk-count">{{ selectedContacts.length }}</span> liên hệ được chọn
      </div>
      <div class="bulk-buttons">
        <button class="btn-export" @click="bulkUpdateStatus('processing')">
          <span class="btn-icon">⏳</span>
          Đánh dấu đang xử lý
        </button>
        <button class="btn-export" @click="bulkUpdateStatus('resolved')">
          <span class="btn-icon">✅</span>
          Đánh dấu đã giải quyết
        </button>
        <button class="btn-export" @click="clearSelection">
          <span class="btn-icon">❌</span>
          Bỏ chọn
        </button>
      </div>
    </div>

    <!-- Contacts List -->
    <div class="data-card">
      <div class="data-header">
        <h3>Danh sách Liên hệ ({{ filteredContacts.length }} kết quả)</h3>
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
              <th>
                <input 
                  type="checkbox" 
                  @change="toggleSelectAll" 
                  :checked="isAllSelected"
                  class="checkbox"
                >
              </th>
              <th>#</th>
              <th>Thông tin liên hệ</th>
              <th>Tiêu đề</th>
              <th>Mức độ</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in paginatedContacts" :key="contact.id">
              <td>
                <input 
                  type="checkbox" 
                  :value="contact.id" 
                  v-model="selectedContacts"
                  class="checkbox"
                >
              </td>
              <td class="index-cell">{{ index + 1 + startIndex }}</td>
              <td>
                <div class="contact-info">
                  <div class="contact-avatar">
                    {{ contact.ho_ten.charAt(0) }}
                  </div>
                  <div class="contact-details">
                    <div class="contact-name">{{ contact.ho_ten }}</div>
                    <div class="contact-email">{{ contact.email }}</div>
                    <div class="contact-phone">{{ contact.so_dien_thoai }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-subject">{{ contact.chu_de }}</div>
                <div class="contact-preview">{{ contact.noi_dung.substring(0, 50) }}...</div>
              </td>
              <td>
                <span :class="['priority-badge', getPriorityClass(contact.muc_do_uu_tien)]">
                  {{ getPriorityText(contact.muc_do_uu_tien) }}
                </span>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-main">{{ formatDate(contact.ngay_tao) }}</div>
                  <div class="date-ago">{{ getTimeAgo(contact.ngay_tao) }}</div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(contact.trang_thai)]">
                  {{ getStatusText(contact.trang_thai) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button 
                    class="action-btn view" 
                    @click="viewContact(contact)"
                    title="Xem chi tiết"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    class="action-btn reply" 
                    @click="openReplyModal(contact)"
                    title="Phản hồi"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                  </button>
                  <button 
                    class="action-btn edit" 
                    @click="updateStatus(contact)"
                    title="Cập nhật trạng thái"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
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
          Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredContacts.length }} liên hệ
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

    <!-- View Contact Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết liên hệ</h3>
          <button class="modal-close" @click="closeViewModal">×</button>
        </div>
        
        <div class="modal-body" v-if="selectedContact">
          <div class="contact-detail">
            <div class="detail-section">
              <h4>Thông tin liên hệ</h4>
              <div class="contact-detail-info">
                <div class="contact-avatar-large">
                  {{ selectedContact.ho_ten.charAt(0) }}
                </div>
                <div class="contact-info-large">
                  <div class="contact-name-large">{{ selectedContact.ho_ten }}</div>
                  <div class="contact-email-large">{{ selectedContact.email }}</div>
                  <div class="contact-phone-large">{{ selectedContact.so_dien_thoai }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Nội dung liên hệ</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Chủ đề</label>
                  <span>{{ selectedContact.chu_de }}</span>
                </div>
                <div class="info-item">
                  <label>Mức độ ưu tiên</label>
                  <span :class="['priority-badge', getPriorityClass(selectedContact.muc_do_uu_tien)]">
                    {{ getPriorityText(selectedContact.muc_do_uu_tien) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Ngày gửi</label>
                  <span>{{ formatDateTime(selectedContact.ngay_tao) }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái</label>
                  <span :class="['status-badge', getStatusClass(selectedContact.trang_thai)]">
                    {{ getStatusText(selectedContact.trang_thai) }}
                  </span>
                </div>
              </div>
              
              <div class="content-section">
                <label>Nội dung</label>
                <div class="content-display">
                  {{ selectedContact.noi_dung }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeViewModal">
            <span class="btn-icon">❌</span>Đóng</button>
          <button class="btn-export" @click="replyFromModal">
            <span class="btn-icon">💬</span>
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
            </svg>
            Phản hồi
          </button>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="showReplyModal" class="modal-overlay" @click="closeReplyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Phản hồi liên hệ</h3>
          <button class="modal-close" @click="closeReplyModal">×</button>
        </div>
        
        <div class="modal-body" v-if="replyContact">
          <div class="reply-form">
            <div class="form-section">
              <h4>Thông tin liên hệ</h4>
              <div class="contact-summary">
                <strong>{{ replyContact.ho_ten }}</strong> - {{ replyContact.email }}
                <br>
                <span class="text-muted">{{ replyContact.chu_de }}</span>
              </div>
            </div>

            <div class="form-section">
              <h4>Nội dung phản hồi</h4>
              <div class="form-group">
                <label>Tiêu đề email</label>
                <input 
                  type="text" 
                  v-model="replyForm.subject" 
                  class="filter-input" 
                  placeholder="Tiêu đề email phản hồi"
                >
              </div>
              <div class="form-group">
                <label>Nội dung</label>
                <textarea 
                  v-model="replyForm.content" 
                  class="content-textarea" 
                  placeholder="Nhập nội dung phản hồi..."
                  rows="6"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeReplyModal">
            <span class="btn-icon">❌</span>Hủy</button>
          <button class="btn-export" @click="sendReply">
            <span class="btn-icon">📧</span>
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Gửi phản hồi
          </button>
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
const selectedStatus = ref('')
const selectedPriority = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedContacts = ref([])
const showViewModal = ref(false)
const showReplyModal = ref(false)
const selectedContact = ref(null)
const replyContact = ref(null)

const replyForm = ref({
  subject: '',
  content: ''
})

// Mock data based on ERD lien_he table
const contacts = ref([])

// Computed
const filteredContacts = computed(() => {
  let filtered = contacts.value

  if (searchQuery.value) {
    filtered = filtered.filter(c => 
      c.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.chu_de.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.so_dien_thoai.includes(searchQuery.value)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(c => c.trang_thai === selectedStatus.value)
  }

  if (selectedPriority.value) {
    filtered = filtered.filter(c => c.muc_do_uu_tien === selectedPriority.value)
  }

  if (fromDate.value) {
    filtered = filtered.filter(c => new Date(c.ngay_tao) >= new Date(fromDate.value))
  }

  if (toDate.value) {
    filtered = filtered.filter(c => new Date(c.ngay_tao) <= new Date(toDate.value))
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredContacts.value.length))

const paginatedContacts = computed(() => {
  return filteredContacts.value.slice(startIndex.value, endIndex.value)
})

const isAllSelected = computed(() => {
  return paginatedContacts.value.length > 0 && 
         paginatedContacts.value.every(contact => selectedContacts.value.includes(contact.id))
})

// Statistics
const totalContacts = computed(() => contacts.value.length)
const pendingContacts = computed(() => contacts.value.filter(c => c.trang_thai === 'pending').length)
const resolvedContacts = computed(() => contacts.value.filter(c => c.trang_thai === 'resolved').length)
const responseRate = computed(() => {
  const responded = contacts.value.filter(c => c.trang_thai !== 'pending').length
  return Math.round((responded / contacts.value.length) * 100)
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

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high': return 'priority-high'
    case 'medium': return 'priority-medium'
    case 'low': return 'priority-low'
    default: return 'priority-medium'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 'high': return 'Cao'
    case 'medium': return 'Trung bình'
    case 'low': return 'Thấp'
    default: return 'Trung bình'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'status-pending'
    case 'processing': return 'status-processing'
    case 'resolved': return 'status-resolved'
    case 'closed': return 'status-closed'
    default: return 'status-pending'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xử lý'
    case 'processing': return 'Đang xử lý'
    case 'resolved': return 'Đã giải quyết'
    case 'closed': return 'Đã đóng'
    default: return 'Chờ xử lý'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPriority.value = ''
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

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedContacts.value = selectedContacts.value.filter(id => 
      !paginatedContacts.value.some(contact => contact.id === id)
    )
  } else {
    const newSelections = paginatedContacts.value.map(contact => contact.id)
    selectedContacts.value = [...new Set([...selectedContacts.value, ...newSelections])]
  }
}

const clearSelection = () => {
  selectedContacts.value = []
}

const viewContact = (contact) => {
  selectedContact.value = contact
  showViewModal.value = true
}

const openReplyModal = (contact) => {
  replyContact.value = contact
  replyForm.value = {
    subject: `Phản hồi: ${contact.chu_de}`,
    content: `Xin chào ${contact.ho_ten},\n\nCảm ơn bạn đã liên hệ với chúng tôi. `
  }
  showReplyModal.value = true
}

const updateStatus = (contact) => {
  const newStatus = prompt('Nhập trạng thái mới (pending/processing/resolved/closed):', contact.trang_thai)
  if (newStatus && ['pending', 'processing', 'resolved', 'closed'].includes(newStatus)) {
    const index = contacts.value.findIndex(c => c.id === contact.id)
    if (index !== -1) {
      contacts.value[index].trang_thai = newStatus
    }
  }
}

const bulkUpdateStatus = (status) => {
  selectedContacts.value.forEach(contactId => {
    const index = contacts.value.findIndex(c => c.id === contactId)
    if (index !== -1) {
      contacts.value[index].trang_thai = status
    }
  })
  selectedContacts.value = []
  alert(`Đã cập nhật trạng thái cho ${selectedContacts.value.length} liên hệ`)
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedContact.value = null
}

const closeReplyModal = () => {
  showReplyModal.value = false
  replyContact.value = null
  replyForm.value = { subject: '', content: '' }
}

const replyFromModal = () => {
  if (selectedContact.value) {
    closeViewModal()
    openReplyModal(selectedContact.value)
  }
}

const sendReply = () => {
  // Simulate sending reply
  if (replyContact.value) {
    const index = contacts.value.findIndex(c => c.id === replyContact.value.id)
    if (index !== -1) {
      contacts.value[index].trang_thai = 'resolved'
    }
  }
  alert('Đã gửi phản hồi thành công')
  closeReplyModal()
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadContacts(),
      loadStats()
    ])
    console.log('Data refreshed successfully')
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  alert('Chức năng xuất dữ liệu đang được phát triển')
}

const exportContactsToExcel = () => {
  try {
    const headerMapping = {
      ho_ten: 'Họ tên',
      email: 'Email',
      so_dien_thoai: 'Số điện thoại',
      chu_de: 'Chủ đề',
      noi_dung: 'Nội dung',
      muc_do_uu_tien: 'Mức độ ưu tiên',
      trang_thai: 'Trạng thái',
      ngay_tao: 'Ngày tạo'
    }
    
    const dataToExport = filteredContacts.value.map(item => ({
      ho_ten: item.ho_ten,
      email: item.email,
      so_dien_thoai: item.so_dien_thoai,
      chu_de: item.chu_de,
      noi_dung: item.noi_dung,
      muc_do_uu_tien: getPriorityText(item.muc_do_uu_tien),
      trang_thai: getStatusText(item.trang_thai),
      ngay_tao: formatDate(item.ngay_tao)
    }))
    
    const formattedData = formatDataForExcel(dataToExport, headerMapping)
    
    const result = exportToExcel(
      formattedData,
      'Danh_sach_lien_he',
      'Liên hệ',
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
.contact-page {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Page Header styles are now defined in globals.css */

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

.pending-stat .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.resolved-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.response-stat .stat-icon {
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

/* Bulk Actions */
.bulk-actions-card {
  background: #fef9c3;
  border: 1px solid #fef08a;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #92400e;
  font-weight: 500;
}

.bulk-count {
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.bulk-buttons {
  display: flex;
  gap: 0.75rem;
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

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Contact Info */
.contact-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-avatar {
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

.contact-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.contact-email, .contact-phone {
  color: #64748b;
  font-size: 0.75rem;
}

/* Contact Subject */
.contact-subject {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.contact-preview {
  color: #64748b;
  font-size: 0.75rem;
}

/* Priority Badges */
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-low {
  background: #dcfce7;
  color: #16a34a;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-processing {
  background: #dbeafe;
  color: #2563eb;
}

.status-resolved {
  background: #dcfce7;
  color: #16a34a;
}

.status-closed {
  background: #f1f5f9;
  color: #64748b;
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

.action-btn.reply {
  color: #22c55e;
}

.action-btn.edit {
  color: #f59e0b;
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
.contact-detail, .reply-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section, .form-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.detail-section h4, .form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.contact-detail-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.contact-avatar-large {
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

.contact-name-large {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.contact-email-large, .contact-phone-large {
  color: #64748b;
  margin-bottom: 0.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

.content-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.content-section label {
  font-weight: 500;
  color: #64748b;
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

.contact-summary {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.875rem;
}

.text-muted {
  color: #64748b;
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

/* Responsive */
@media (max-width: 768px) {
  .contact-page {
    padding: 1rem;
  }

  /* page-header responsive styles are handled in globals.css */

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .bulk-actions-card {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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
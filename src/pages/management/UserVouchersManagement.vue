<template>
  <div class="vouchers-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Phiếu giảm giá người dùng</h1>
          <p class="page-subtitle">Quản lý và theo dõi phiếu giảm giá đã phân phối cho khách hàng</p>
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
          <button class="btn-export" @click="exportVouchersToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAssignModal = true">
            <span class="btn-icon">🎫</span>
            Phân phối voucher
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card vouchers-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalVouchers }}</div>
          <div class="stat-label">Tổng phiếu đã phát</div>
          <div class="stat-trend positive">+25% từ tháng trước</div>
        </div>
      </div>
      
      <div class="stat-card unused-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ unusedVouchers }}</div>
          <div class="stat-label">Chưa sử dụng</div>
          <div class="stat-trend neutral">{{ Math.round((unusedVouchers/totalVouchers)*100) }}% còn lại</div>
        </div>
      </div>

      <div class="stat-card used-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ usedVouchers }}</div>
          <div class="stat-label">Đã sử dụng</div>
          <div class="stat-trend positive">{{ Math.round((usedVouchers/totalVouchers)*100) }}% tỷ lệ dùng</div>
        </div>
      </div>

      <div class="stat-card expired-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ expiredVouchers }}</div>
          <div class="stat-label">Hết hạn</div>
          <div class="stat-trend negative">{{ Math.round((expiredVouchers/totalVouchers)*100) }}% hết hạn</div>
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
              placeholder="Tìm theo khách hàng, mã giảm giá..." 
              v-model="searchQuery"
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <label>Trạng thái</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="chua_su_dung">Chưa sử dụng</option>
            <option value="da_su_dung">Đã sử dụng</option>
            <option value="het_han">Hết hạn</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Mã giảm giá</label>
          <select v-model="selectedVoucherCode" class="filter-select">
            <option value="">Tất cả mã giảm giá</option>
            <option v-for="voucher in availableVouchers" :key="voucher.id" :value="voucher.ma_giam_gia">
              {{ voucher.ma_giam_gia }} - {{ voucher.mo_ta }}
            </option>
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

    <!-- Vouchers List -->
    <div class="data-card">
      <div class="data-header">
        <h3>Danh sách Phiếu giảm giá ({{ filteredUserVouchers.length }} kết quả)</h3>
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
              <th>Khách hàng</th>
              <th>Mã giảm giá</th>
              <th>Loại & Giá trị</th>
              <th>Ngày sử dụng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(userVoucher, index) in paginatedUserVouchers" :key="userVoucher.id">
              <td class="index-cell">{{ index + 1 + startIndex }}</td>
              <td>
                <div class="customer-info">
                  <div class="customer-avatar">
                    {{ userVoucher.nguoi_dung.ho_ten.charAt(0) }}
                  </div>
                  <div class="customer-details">
                    <div class="customer-name">{{ userVoucher.nguoi_dung.ho_ten }}</div>
                    <div class="customer-email">{{ userVoucher.nguoi_dung.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="voucher-info">
                  <div class="voucher-code">{{ userVoucher.ma_giam_gia.ma_giam_gia }}</div>
                  <div class="voucher-desc">{{ userVoucher.ma_giam_gia.mo_ta }}</div>
                </div>
              </td>
              <td>
                <div class="discount-info">
                  <span :class="['discount-type', userVoucher.ma_giam_gia.loai_giam_gia === 'phan_tram' ? 'type-percent' : 'type-cash']">
                    {{ userVoucher.ma_giam_gia.loai_giam_gia === 'phan_tram' ? 'Phần trăm' : 'Tiền mặt' }}
                  </span>
                  <div class="discount-value">{{ formatDiscount(userVoucher.ma_giam_gia) }}</div>
                </div>
              </td>
              <td>
                <div class="usage-info">
                  <div class="usage-date">
                    {{ userVoucher.ngay_su_dung ? formatDateTime(userVoucher.ngay_su_dung) : 'Chưa sử dụng' }}
                  </div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(userVoucher)]">
                  {{ getStatusText(userVoucher) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button 
                    class="action-btn view" 
                    @click="viewVoucherDetail(userVoucher)"
                    title="Xem chi tiết"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="userVoucher.trang_thai === 'chua_su_dung' && !isExpired(userVoucher.ma_giam_gia)"
                    class="action-btn revoke" 
                    @click="revokeVoucher(userVoucher)"
                    title="Thu hồi voucher"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
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
          Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredUserVouchers.length }} phiếu
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

    <!-- Assign Voucher Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click="closeAssignModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Phân phối voucher</h3>
          <button class="modal-close" @click="closeAssignModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="assign-form">
            <div class="form-section">
              <h4>Chọn mã giảm giá</h4>
              <select v-model="assignForm.selectedVoucher" class="filter-select" @change="updateVoucherInfo">
                <option value="">-- Chọn mã giảm giá --</option>
                <option v-for="voucher in availableVouchers" :key="voucher.id" :value="voucher">
                  {{ voucher.ma_giam_gia }} - {{ voucher.mo_ta }}
                </option>
              </select>

              <div v-if="assignForm.selectedVoucher" class="voucher-preview">
                <div class="preview-header">Thông tin mã giảm giá</div>
                <div class="preview-grid">
                  <div class="preview-item">
                    <label>Mã</label>
                    <span>{{ assignForm.selectedVoucher.ma_giam_gia }}</span>
                  </div>
                  <div class="preview-item">
                    <label>Loại</label>
                    <span>{{ assignForm.selectedVoucher.loai_giam_gia === 'phan_tram' ? 'Phần trăm' : 'Tiền mặt' }}</span>
                  </div>
                  <div class="preview-item">
                    <label>Giá trị</label>
                    <span>{{ formatDiscount(assignForm.selectedVoucher) }}</span>
                  </div>
                  <div class="preview-item">
                    <label>Còn lại</label>
                    <span>{{ assignForm.selectedVoucher.so_luong }} phiếu</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Phương thức phân phối</h4>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="assignForm.assignmentType" value="individual">
                  <span>Chọn khách hàng cụ thể</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="assignForm.assignmentType" value="bulk">
                  <span>Phân phối hàng loạt</span>
                </label>
              </div>
            </div>

            <div v-if="assignForm.assignmentType === 'individual'" class="form-section">
              <h4>Chọn khách hàng</h4>
              <div class="customer-search">
                <div class="search-wrapper">
                  <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input 
                    type="text" 
                    v-model="customerSearchQuery" 
                    placeholder="Tìm kiếm khách hàng..."
                    class="search-input"
                  >
                </div>
              </div>
              <div class="customer-list">
                <label v-for="customer in filteredCustomers" :key="customer.id" class="customer-option">
                  <input 
                    type="checkbox" 
                    :value="customer" 
                    v-model="assignForm.selectedCustomers"
                  >
                  <div class="customer-info">
                    <div class="customer-avatar">{{ customer.ho_ten.charAt(0) }}</div>
                    <div class="customer-details">
                      <div class="customer-name">{{ customer.ho_ten }}</div>
                      <div class="customer-email">{{ customer.email }}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div v-else-if="assignForm.assignmentType === 'bulk'" class="form-section">
              <h4>Tiêu chí phân phối</h4>
              <select v-model="assignForm.bulkCriteria" class="filter-select">
                <option value="">-- Chọn tiêu chí --</option>
                <option value="all">Tất cả khách hàng</option>
                <option value="new">Khách hàng mới</option>
                <option value="vip">Khách hàng VIP</option>
              </select>
              <div v-if="assignForm.bulkCriteria" class="bulk-preview">
                Sẽ phân phối cho {{ getBulkCustomerCount() }} khách hàng
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeAssignModal">
            <span class="btn-icon">❌</span>Hủy</button>
          <button 
            class="btn-export" 
            @click="assignVouchers"
            :disabled="!canAssign"
          >
            Phân phối
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết phiếu giảm giá</h3>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        
        <div class="modal-body" v-if="selectedUserVoucher">
          <div class="voucher-detail">
            <div class="customer-section">
              <h4>Thông tin khách hàng</h4>
              <div class="customer-detail">
                <div class="customer-avatar-large">
                  {{ selectedUserVoucher.nguoi_dung.ho_ten.charAt(0) }}
                </div>
                <div class="customer-info-large">
                  <div class="customer-name-large">{{ selectedUserVoucher.nguoi_dung.ho_ten }}</div>
                  <div class="customer-email-large">{{ selectedUserVoucher.nguoi_dung.email }}</div>
                  <div class="customer-phone-large">{{ selectedUserVoucher.nguoi_dung.sdt }}</div>
                </div>
              </div>
            </div>

            <div class="voucher-section">
              <h4>Thông tin voucher</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã giảm giá</label>
                  <span>{{ selectedUserVoucher.ma_giam_gia.ma_giam_gia }}</span>
                </div>
                <div class="info-item">
                  <label>Mô tả</label>
                  <span>{{ selectedUserVoucher.ma_giam_gia.mo_ta }}</span>
                </div>
                <div class="info-item">
                  <label>Loại giảm giá</label>
                  <span>{{ selectedUserVoucher.ma_giam_gia.loai_giam_gia === 'phan_tram' ? 'Phần trăm' : 'Tiền mặt' }}</span>
                </div>
                <div class="info-item">
                  <label>Giá trị giảm</label>
                  <span>{{ formatDiscount(selectedUserVoucher.ma_giam_gia) }}</span>
                </div>
                <div class="info-item">
                  <label>Đơn hàng tối thiểu</label>
                  <span>{{ formatCurrency(selectedUserVoucher.ma_giam_gia.don_hang_toi_thieu) }}</span>
                </div>
                <div class="info-item">
                  <label>Thời hạn</label>
                  <span>{{ formatDate(selectedUserVoucher.ma_giam_gia.ngay_bat_dau) }} - {{ formatDate(selectedUserVoucher.ma_giam_gia.ngay_ket_thuc) }}</span>
                </div>
              </div>
            </div>

            <div class="usage-section">
              <h4>Trạng thái sử dụng</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Trạng thái</label>
                  <span :class="['status-badge', getStatusClass(selectedUserVoucher)]">
                    {{ getStatusText(selectedUserVoucher) }}
                  </span>
                </div>
                <div v-if="selectedUserVoucher.ngay_su_dung" class="info-item">
                  <label>Ngày sử dụng</label>
                  <span>{{ formatDateTime(selectedUserVoucher.ngay_su_dung) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeDetailModal">
            <span class="btn-icon">❌</span>Đóng</button>
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
const selectedVoucherCode = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAssignModal = ref(false)
const showDetailModal = ref(false)
const selectedUserVoucher = ref(null)
const customerSearchQuery = ref('')

const assignForm = ref({
  selectedVoucher: null,
  assignmentType: 'individual',
  selectedCustomers: [],
  bulkCriteria: ''
})

// Mock data based on ERD phieu_giam_gia table
const userVouchers = ref([])

// Available vouchers for assignment
const availableVouchers = ref([])

// Available customers for assignment
const customers = ref([])

// Computed
const filteredUserVouchers = computed(() => {
  let filtered = userVouchers.value

  if (searchQuery.value) {
    filtered = filtered.filter(uv => 
      uv.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      uv.nguoi_dung.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      uv.ma_giam_gia.ma_giam_gia.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'het_han') {
      filtered = filtered.filter(uv => isExpired(uv.ma_giam_gia))
    } else {
      filtered = filtered.filter(uv => uv.trang_thai === selectedStatus.value)
    }
  }

  if (selectedVoucherCode.value) {
    filtered = filtered.filter(uv => uv.ma_giam_gia.ma_giam_gia === selectedVoucherCode.value)
  }

  return filtered
})

const filteredCustomers = computed(() => {
  if (!customerSearchQuery.value) {
    return customers.value
  }
  
  return customers.value.filter(customer => 
    customer.ho_ten.toLowerCase().includes(customerSearchQuery.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.value.toLowerCase()) ||
    customer.sdt.includes(customerSearchQuery.value)
  )
})

const totalPages = computed(() => Math.ceil(filteredUserVouchers.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredUserVouchers.value.length))

const paginatedUserVouchers = computed(() => {
  return filteredUserVouchers.value.slice(startIndex.value, endIndex.value)
})

const canAssign = computed(() => {
  if (!assignForm.value.selectedVoucher) return false
  
  if (assignForm.value.assignmentType === 'individual') {
    return assignForm.value.selectedCustomers.length > 0
  } else {
    return assignForm.value.bulkCriteria !== ''
  }
})

// Statistics
const totalVouchers = computed(() => userVouchers.value.length)
const unusedVouchers = computed(() => userVouchers.value.filter(v => v.trang_thai === 'chua_su_dung' && !isExpired(v.ma_giam_gia)).length)
const usedVouchers = computed(() => userVouchers.value.filter(v => v.trang_thai === 'da_su_dung').length)
const expiredVouchers = computed(() => userVouchers.value.filter(v => isExpired(v.ma_giam_gia)).length)

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDiscount = (voucher) => {
  if (voucher.loai_giam_gia === 'phan_tram') {
    return `${voucher.gia_tri_giam}%`
  } else {
    return formatCurrency(voucher.gia_tri_giam)
  }
}

const isExpired = (voucher) => {
  return new Date(voucher.ngay_ket_thuc) < new Date()
}

const getStatusClass = (userVoucher) => {
  if (userVoucher.trang_thai === 'da_su_dung') {
    return 'status-used'
  } else if (isExpired(userVoucher.ma_giam_gia)) {
    return 'status-expired'
  } else {
    return 'status-unused'
  }
}

const getStatusText = (userVoucher) => {
  if (userVoucher.trang_thai === 'da_su_dung') {
    return 'Đã sử dụng'
  } else if (isExpired(userVoucher.ma_giam_gia)) {
    return 'Hết hạn'
  } else {
    return 'Chưa sử dụng'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedVoucherCode.value = ''
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

const viewVoucherDetail = (userVoucher) => {
  selectedUserVoucher.value = userVoucher
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedUserVoucher.value = null
}

const closeAssignModal = () => {
  showAssignModal.value = false
  assignForm.value = {
    selectedVoucher: null,
    assignmentType: 'individual',
    selectedCustomers: [],
    bulkCriteria: ''
  }
  customerSearchQuery.value = ''
}

const revokeVoucher = (userVoucher) => {
  if (confirm(`Bạn có chắc chắn muốn thu hồi voucher "${userVoucher.ma_giam_gia.ma_giam_gia}" của khách hàng "${userVoucher.nguoi_dung.ho_ten}"?`)) {
    const index = userVouchers.value.findIndex(uv => uv.id === userVoucher.id)
    if (index !== -1) {
      userVouchers.value.splice(index, 1)
    }
  }
}

const updateVoucherInfo = () => {
  // Method called when voucher selection changes
}

const getBulkCustomerCount = () => {
  switch (assignForm.value.bulkCriteria) {
    case 'all':
      return customers.value.length
    case 'new':
      return Math.floor(customers.value.length * 0.3) // 30% khách hàng mới
    case 'vip':
      return Math.floor(customers.value.length * 0.2) // 20% khách hàng VIP
    default:
      return 0
  }
}

const assignVouchers = () => {
  let targetCustomers = []
  
  if (assignForm.value.assignmentType === 'individual') {
    targetCustomers = assignForm.value.selectedCustomers
  } else {
    // Bulk assignment logic would go here
    targetCustomers = customers.value.slice(0, getBulkCustomerCount())
  }

  // Create new user voucher records
  targetCustomers.forEach((customer, index) => {
    const newId = Math.max(...userVouchers.value.map(uv => uv.id)) + 1 + index
    userVouchers.value.push({
      id: newId,
      id_nguoi_dung: customer.id,
      id_ma_giam_gia: assignForm.value.selectedVoucher.id,
      ngay_su_dung: null,
      trang_thai: 'chua_su_dung',
      nguoi_dung: customer,
      ma_giam_gia: assignForm.value.selectedVoucher
    })
  })

  alert(`Đã phân phối voucher cho ${targetCustomers.length} khách hàng`)
  closeAssignModal()
}

const exportData = () => {
  alert('Chức năng xuất dữ liệu đang được phát triển')
}

const exportVouchersToExcel = () => {
  try {
    const headerMapping = {
      ten_khach_hang: 'Tên khách hàng',
      email_khach_hang: 'Email khách hàng',
      ma_giam_gia: 'Mã giảm giá',
      mo_ta_voucher: 'Mô tả voucher',
      loai_giam_gia: 'Loại giảm giá',
      gia_tri_giam: 'Giá trị giảm',
      don_hang_toi_thieu: 'Đơn hàng tối thiểu',
      ngay_su_dung: 'Ngày sử dụng',
      trang_thai: 'Trạng thái'
    }
    
    const dataToExport = filteredUserVouchers.value.map(item => ({
      ten_khach_hang: item.nguoi_dung.ho_ten,
      email_khach_hang: item.nguoi_dung.email,
      ma_giam_gia: item.ma_giam_gia.ma_giam_gia,
      mo_ta_voucher: item.ma_giam_gia.mo_ta,
      loai_giam_gia: item.ma_giam_gia.loai_giam_gia === 'phan_tram' ? 'Phần trăm' : 'Tiền mặt',
      gia_tri_giam: formatDiscount(item.ma_giam_gia),
      don_hang_toi_thieu: formatCurrency(item.ma_giam_gia.don_hang_toi_thieu),
      ngay_su_dung: item.ngay_su_dung ? formatDateTime(item.ngay_su_dung) : 'Chưa sử dụng',
      trang_thai: getStatusText(item)
    }))
    
    const formattedData = formatDataForExcel(dataToExport, headerMapping)
    
    const result = exportToExcel(
      formattedData,
      'Danh_sach_phieu_giam_gia_nguoi_dung',
      'Phiếu giảm giá người dùng',
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
  console.log('Refreshing user vouchers data...')
}

onMounted(() => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastMonth.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Base Layout */
.vouchers-page {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Page Header */
/* page-header styles are now defined in globals.css */

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

.vouchers-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.unused-stat .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.used-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.expired-stat .stat-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

/* Customer Info */
.customer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
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

.customer-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.customer-email {
  color: #64748b;
  font-size: 0.75rem;
}

/* Voucher Info */
.voucher-info {
  max-width: 200px;
}

.voucher-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  color: #4ade80;
  font-size: 0.875rem;
}

.voucher-desc {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Discount Info */
.discount-info {
  text-align: center;
}

.discount-type {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.type-percent {
  background: #dbeafe;
  color: #2563eb;
}

.type-cash {
  background: #dcfce7;
  color: #16a34a;
}

.discount-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

/* Usage Info */
.usage-info .usage-date {
  color: #1e293b;
  font-size: 0.875rem;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-unused {
  background: #fef3c7;
  color: #d97706;
}

.status-used {
  background: #dcfce7;
  color: #16a34a;
}

.status-expired {
  background: #fee2e2;
  color: #dc2626;
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

.action-btn.revoke {
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

/* Modal Content */
.assign-form, .voucher-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section, .customer-section, .voucher-section, .usage-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-section h4, .customer-section h4, .voucher-section h4, .usage-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.voucher-preview, .bulk-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-header {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-item label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.preview-item span {
  font-size: 0.875rem;
  color: #1e293b;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.customer-search {
  margin-bottom: 1rem;
}

.customer-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
}

.customer-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.customer-option:hover {
  background: #f8fafc;
}

.bulk-preview {
  color: #64748b;
  font-size: 0.875rem;
}

.customer-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-avatar-large {
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

.customer-name-large {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.customer-email-large, .customer-phone-large {
  color: #64748b;
  margin-bottom: 0.25rem;
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

/* Responsive */
@media (max-width: 768px) {
  .vouchers-page {
    padding: 1rem;
  }

  /* page-header responsive styles are handled in globals.css */

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .btn {
    flex: 1;
  }

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
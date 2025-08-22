<template>
  <div class="inventory-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Nhập hàng</h1>
          <p class="page-subtitle">Theo dõi và quản lý các phiếu nhập kho</p>
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
          <button class="btn-export" @click="showCreateModal = true">
            <span class="btn-icon">➕</span>
            Tạo phiếu nhập
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card total-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalImports }}</div>
          <div class="stat-label">Tổng phiếu nhập</div>
          <div class="stat-trend positive">+12% từ tháng trước</div>
        </div>
      </div>
      
      <div class="stat-card pending-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ pendingImports }}</div>
          <div class="stat-label">Chờ duyệt</div>
          <div class="stat-trend neutral">{{ Math.round((pendingImports/totalImports)*100) }}% chờ xử lý</div>
        </div>
      </div>

      <div class="stat-card completed-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ completedImports }}</div>
          <div class="stat-label">Hoàn thành</div>
          <div class="stat-trend positive">{{ Math.round((completedImports/totalImports)*100) }}% hoàn thành</div>
        </div>
      </div>

      <div class="stat-card value-stat">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatCurrency(totalValue) }}</div>
          <div class="stat-label">Tổng giá trị nhập</div>
          <div class="stat-trend positive">+20% từ tháng trước</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-card">
      <div class="filter-header">
        <h3>Bộ lọc & Tìm kiếm</h3>
        <button class="btn-export" @click="resetFilters">
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
              placeholder="Tìm theo mã phiếu, nhà cung cấp..." 
              v-model="searchQuery"
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <label>Trạng thái</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="cho_duyet">Chờ duyệt</option>
            <option value="da_duyet">Đã duyệt</option>
            <option value="dang_nhap">Đang nhập kho</option>
            <option value="hoan_thanh">Hoàn thành</option>
            <option value="huy">Hủy</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Nhà cung cấp</label>
          <input 
            type="text" 
            placeholder="Tên nhà cung cấp..." 
            v-model="supplierFilter"
            class="filter-input"
          >
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

    <!-- Import Records List -->
    <div class="data-card">
      <div class="data-header">
        <h3>Danh sách phiếu nhập ({{ filteredImports.length }} kết quả)</h3>
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
              <th>Mã phiếu nhập</th>
              <th>Nhà cung cấp</th>
              <th>Người tạo</th>
              <th>Ngày nhập</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(importRecord, index) in paginatedImports" :key="importRecord.id">
              <td class="index-cell">{{ index + 1 + startIndex }}</td>
              <td>
                <div class="import-code">{{ importRecord.ma_phieu_nhap }}</div>
              </td>
              <td>
                <div class="supplier-info">
                  <div class="supplier-name">{{ importRecord.nha_cung_cap }}</div>
                  <div class="supplier-contact">{{ importRecord.lien_he_nha_cung_cap }}</div>
                </div>
              </td>
              <td>
                <div class="creator-info">
                  <div class="creator-avatar">
                    {{ importRecord.nguoi_tao.ho_ten.charAt(0) }}
                  </div>
                  <div class="creator-details">
                    <div class="creator-name">{{ importRecord.nguoi_tao.ho_ten }}</div>
                    <div class="creator-role">{{ importRecord.nguoi_tao.vai_tro }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-main">{{ formatDate(importRecord.ngay_nhap) }}</div>
                  <div class="date-ago">{{ getTimeAgo(importRecord.ngay_nhap) }}</div>
                </div>
              </td>
              <td>
                <div class="amount-info">{{ formatCurrency(importRecord.tong_tien) }}</div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(importRecord.trang_thai)]">
                  {{ getStatusText(importRecord.trang_thai) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button 
                    class="action-btn view" 
                    @click="viewImport(importRecord)"
                    title="Xem chi tiết"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="importRecord.trang_thai === 'cho_duyet'"
                    class="action-btn approve" 
                    @click="approveImport(importRecord)"
                    title="Duyệt"
                  >
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button 
                    class="action-btn edit" 
                    @click="editImport(importRecord)"
                    title="Chỉnh sửa"
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
          Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredImports.length }} phiếu nhập
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
          <h3>{{ showCreateModal ? 'Tạo phiếu nhập mới' : 'Chỉnh sửa phiếu nhập' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="import-form">
            <div class="form-section">
              <h4>Thông tin cơ bản</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Mã phiếu nhập</label>
                  <input 
                    type="text" 
                    v-model="form.ma_phieu_nhap" 
                    class="filter-input" 
                    placeholder="Nhập mã phiếu"
                    :readonly="showEditModal"
                  >
                </div>
                <div class="form-group">
                  <label>Nhà cung cấp</label>
                  <input 
                    type="text" 
                    v-model="form.nha_cung_cap" 
                    class="filter-input" 
                    placeholder="Tên nhà cung cấp"
                  >
                </div>
                <div class="form-group">
                  <label>Liên hệ nhà cung cấp</label>
                  <input 
                    type="text" 
                    v-model="form.lien_he_nha_cung_cap" 
                    class="filter-input" 
                    placeholder="Email hoặc số điện thoại"
                  >
                </div>
                <div class="form-group">
                  <label>Ngày nhập</label>
                  <input 
                    type="date" 
                    v-model="form.ngay_nhap" 
                    class="filter-input"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Chi tiết sản phẩm</h4>
              <div class="products-section">
                <div v-for="(item, index) in form.chi_tiet" :key="index" class="product-item">
                  <div class="product-grid">
                    <div class="form-group">
                      <label>Sản phẩm</label>
                      <select v-model="item.id_san_pham" class="filter-select">
                        <option value="">Chọn sản phẩm</option>
                        <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                          {{ product.ten_san_pham }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Số lượng</label>
                      <input 
                        type="number" 
                        v-model="item.so_luong" 
                        class="filter-input" 
                        placeholder="0"
                        min="1"
                      >
                    </div>
                    <div class="form-group">
                      <label>Đơn giá</label>
                      <input 
                        type="number" 
                        v-model="item.don_gia" 
                        class="filter-input" 
                        placeholder="0"
                        min="0"
                      >
                    </div>
                    <div class="form-group">
                      <label>Thành tiền</label>
                      <input 
                        type="text" 
                        :value="formatCurrency(item.so_luong * item.don_gia || 0)" 
                        class="filter-input" 
                        readonly
                      >
                    </div>
                  </div>
                  <button 
                    class="remove-item-btn" 
                    @click="removeProduct(index)"
                    v-if="form.chi_tiet.length > 1"
                  >
                    ×
                  </button>
                </div>
                
                <button class="btn-export" @click="addProduct">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            <div class="form-section">
              <h4>Tổng kết</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <label>Tổng số lượng</label>
                  <span>{{ getTotalQuantity() }}</span>
                </div>
                <div class="summary-item">
                  <label>Tổng tiền</label>
                  <span class="total-amount">{{ formatCurrency(getTotalAmount()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeModal">Hủy</button>
          <button class="btn-export" @click="saveImport">
            {{ showCreateModal ? 'Tạo phiếu nhập' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết phiếu nhập</h3>
          <button class="modal-close" @click="closeViewModal">×</button>
        </div>
        
        <div class="modal-body" v-if="selectedImport">
          <div class="import-detail">
            <div class="detail-section">
              <h4>Thông tin phiếu nhập</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã phiếu nhập</label>
                  <span>{{ selectedImport.ma_phieu_nhap }}</span>
                </div>
                <div class="info-item">
                  <label>Nhà cung cấp</label>
                  <span>{{ selectedImport.nha_cung_cap }}</span>
                </div>
                <div class="info-item">
                  <label>Liên hệ</label>
                  <span>{{ selectedImport.lien_he_nha_cung_cap }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày nhập</label>
                  <span>{{ formatDateTime(selectedImport.ngay_nhap) }}</span>
                </div>
                <div class="info-item">
                  <label>Người tạo</label>
                  <span>{{ selectedImport.nguoi_tao.ho_ten }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái</label>
                  <span :class="['status-badge', getStatusClass(selectedImport.trang_thai)]">
                    {{ getStatusText(selectedImport.trang_thai) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Chi tiết sản phẩm</h4>
              <div class="products-table">
                <table class="detail-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedImport.chi_tiet" :key="item.id">
                      <td>{{ item.san_pham.ten_san_pham }}</td>
                      <td>{{ item.so_luong }}</td>
                      <td>{{ formatCurrency(item.don_gia) }}</td>
                      <td>{{ formatCurrency(item.so_luong * item.don_gia) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="3"><strong>Tổng cộng</strong></td>
                      <td><strong>{{ formatCurrency(selectedImport.tong_tien) }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-export" @click="closeViewModal">Đóng</button>
          <button 
            v-if="selectedImport && selectedImport.trang_thai === 'cho_duyet'"
            class="btn-export" 
            @click="approveFromModal"
          >
            Duyệt phiếu nhập
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data
const searchQuery = ref('')
const selectedStatus = ref('')
const supplierFilter = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedImport = ref(null)

const form = ref({
  ma_phieu_nhap: '',
  nha_cung_cap: '',
  lien_he_nha_cung_cap: '',
  ngay_nhap: '',
  chi_tiet: [
    {
      id_san_pham: '',
      so_luong: 1,
      don_gia: 0
    }
  ]
})

const imports = ref([])

const availableProducts = ref([])

// Computed
const filteredImports = computed(() => {
  let filtered = imports.value

  if (searchQuery.value) {
    filtered = filtered.filter(imp => 
      imp.ma_phieu_nhap.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      imp.nha_cung_cap.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      imp.nguoi_tao.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(imp => imp.trang_thai === selectedStatus.value)
  }

  if (supplierFilter.value) {
    filtered = filtered.filter(imp => 
      imp.nha_cung_cap.toLowerCase().includes(supplierFilter.value.toLowerCase())
    )
  }

  if (fromDate.value) {
    filtered = filtered.filter(imp => new Date(imp.ngay_nhap) >= new Date(fromDate.value))
  }

  if (toDate.value) {
    filtered = filtered.filter(imp => new Date(imp.ngay_nhap) <= new Date(toDate.value))
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredImports.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredImports.value.length))

const paginatedImports = computed(() => {
  return filteredImports.value.slice(startIndex.value, endIndex.value)
})

// Statistics
const totalImports = computed(() => imports.value.length)
const pendingImports = computed(() => imports.value.filter(imp => imp.trang_thai === 'cho_duyet').length)
const completedImports = computed(() => imports.value.filter(imp => imp.trang_thai === 'hoan_thanh').length)
const totalValue = computed(() => imports.value.reduce((sum, imp) => sum + imp.tong_tien, 0))

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

const getTimeAgo = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInHours = Math.floor((now - past) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Vừa xong'
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} ngày trước`
}

const getStatusClass = (status) => {
  switch (status) {
    case 'cho_duyet': return 'status-pending'
    case 'da_duyet': return 'status-approved'
    case 'dang_nhap': return 'status-importing'
    case 'hoan_thanh': return 'status-completed'
    case 'huy': return 'status-cancelled'
    default: return 'status-pending'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'cho_duyet': return 'Chờ duyệt'
    case 'da_duyet': return 'Đã duyệt'
    case 'dang_nhap': return 'Đang nhập kho'
    case 'hoan_thanh': return 'Hoàn thành'
    case 'huy': return 'Hủy'
    default: return 'Chờ duyệt'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  supplierFilter.value = ''
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

const viewImport = (importRecord) => {
  selectedImport.value = importRecord
  showViewModal.value = true
}

const editImport = (importRecord) => {
  selectedImport.value = importRecord
  form.value = {
    ma_phieu_nhap: importRecord.ma_phieu_nhap,
    nha_cung_cap: importRecord.nha_cung_cap,
    lien_he_nha_cung_cap: importRecord.lien_he_nha_cung_cap,
    ngay_nhap: importRecord.ngay_nhap.split('T')[0],
    chi_tiet: importRecord.chi_tiet.map(item => ({
      id_san_pham: item.id_san_pham,
      so_luong: item.so_luong,
      don_gia: item.don_gia
    }))
  }
  showEditModal.value = true
}

const approveImport = (importRecord) => {
  if (confirm(`Bạn có chắc chắn muốn duyệt phiếu nhập "${importRecord.ma_phieu_nhap}"?`)) {
    const index = imports.value.findIndex(imp => imp.id === importRecord.id)
    if (index !== -1) {
      imports.value[index].trang_thai = 'da_duyet'
    }
    alert('Đã duyệt phiếu nhập')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedImport.value = null
  form.value = {
    ma_phieu_nhap: '',
    nha_cung_cap: '',
    lien_he_nha_cung_cap: '',
    ngay_nhap: '',
    chi_tiet: [
      {
        id_san_pham: '',
        so_luong: 1,
        don_gia: 0
      }
    ]
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedImport.value = null
}

const addProduct = () => {
  form.value.chi_tiet.push({
    id_san_pham: '',
    so_luong: 1,
    don_gia: 0
  })
}

const removeProduct = (index) => {
  if (form.value.chi_tiet.length > 1) {
    form.value.chi_tiet.splice(index, 1)
  }
}

const getTotalQuantity = () => {
  return form.value.chi_tiet.reduce((sum, item) => sum + (parseInt(item.so_luong) || 0), 0)
}

const getTotalAmount = () => {
  return form.value.chi_tiet.reduce((sum, item) => sum + ((item.so_luong || 0) * (item.don_gia || 0)), 0)
}

const saveImport = () => {
  if (showCreateModal.value) {
    // Create new import
    const newId = Math.max(...imports.value.map(imp => imp.id)) + 1
    const newImport = {
      id: newId,
      ma_phieu_nhap: form.value.ma_phieu_nhap,
      nha_cung_cap: form.value.nha_cung_cap,
      lien_he_nha_cung_cap: form.value.lien_he_nha_cung_cap,
      ngay_nhap: new Date(form.value.ngay_nhap).toISOString(),
      tong_tien: getTotalAmount(),
      trang_thai: 'cho_duyet',
      nguoi_tao: {
        id: 1,
        ho_ten: 'Admin',
        vai_tro: 'Quản lý'
      },
      chi_tiet: form.value.chi_tiet.map((item, index) => ({
        id: newId * 100 + index,
        id_san_pham: parseInt(item.id_san_pham),
        so_luong: parseInt(item.so_luong),
        don_gia: parseFloat(item.don_gia),
        san_pham: availableProducts.value.find(p => p.id === parseInt(item.id_san_pham))
      }))
    }
    
    imports.value.push(newImport)
    alert('Đã tạo phiếu nhập mới')
  } else {
    // Update existing import
    const index = imports.value.findIndex(imp => imp.id === selectedImport.value.id)
    if (index !== -1) {
      imports.value[index] = {
        ...imports.value[index],
        nha_cung_cap: form.value.nha_cung_cap,
        lien_he_nha_cung_cap: form.value.lien_he_nha_cung_cap,
        ngay_nhap: new Date(form.value.ngay_nhap).toISOString(),
        tong_tien: getTotalAmount(),
        chi_tiet: form.value.chi_tiet.map((item, idx) => ({
          id: selectedImport.value.id * 100 + idx,
          id_san_pham: parseInt(item.id_san_pham),
          so_luong: parseInt(item.so_luong),
          don_gia: parseFloat(item.don_gia),
          san_pham: availableProducts.value.find(p => p.id === parseInt(item.id_san_pham))
        }))
      }
    }
    alert('Đã cập nhật phiếu nhập')
  }
  
  closeModal()
}

const approveFromModal = () => {
  if (selectedImport.value) {
    approveImport(selectedImport.value)
    closeViewModal()
  }
}

const exportData = () => {
  alert('Chức năng xuất dữ liệu đang được phát triển')
}

// Initialize
onMounted(() => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastMonth.toISOString().split('T')[0]
  
  // Generate import code for new import
  form.value.ma_phieu_nhap = `PN${String(imports.value.length + 1).padStart(3, '0')}`
  form.value.ngay_nhap = today.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Use the same styling pattern as favorites page */
/* Base Layout */
.inventory-page {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-left h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

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

.completed-stat .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.value-stat .stat-icon {
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

/* Import Code */
.import-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
}

/* Supplier Info */
.supplier-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.supplier-contact {
  color: #64748b;
  font-size: 0.75rem;
}

/* Creator Info */
.creator-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.creator-avatar {
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

.creator-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.creator-role {
  color: #64748b;
  font-size: 0.75rem;
}

/* Amount Info */
.amount-info {
  font-weight: 600;
  color: #22c55e;
  font-size: 0.875rem;
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

.status-approved {
  background: #dbeafe;
  color: #2563eb;
}

.status-importing {
  background: #e0f2fe;
  color: #0369a1;
}

.status-completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
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

.action-btn.approve {
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

/* btn-export styles now in globals.css */

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
  max-width: 900px;
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
.import-form, .import-detail {
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

.products-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  position: relative;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.product-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
}

.remove-item-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.summary-item label {
  font-weight: 500;
  color: #64748b;
}

.summary-item span {
  font-weight: 600;
  color: #1e293b;
}

.total-amount {
  color: #22c55e !important;
  font-size: 1.125rem !important;
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

.products-table {
  overflow-x: auto;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.detail-table th,
.detail-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.detail-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.detail-table td {
  color: #1e293b;
  font-size: 0.875rem;
}

.total-row {
  background: #f8fafc;
  font-weight: 600;
}

.total-row td {
  border-bottom: none;
  color: #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
  .inventory-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>

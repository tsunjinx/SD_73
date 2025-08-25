<template>
  <div class="discount-coupons">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Phiếu giảm giá</h1>
          <p class="page-subtitle">Tạo và quản lý các phiếu giảm giá</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Làm mới
          </button>
          <button class="btn-refresh" @click="exportData">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-refresh" @click="exportToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-refresh" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Tạo mới
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Filter Section -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <div class="filter-title">
            <span class="filter-icon">🎫</span>
            <h3>Tìm kiếm phiếu giảm giá</h3>
          </div>
          <div class="filter-stats">
            {{ filteredCoupons.length }} / {{ coupons.length }} phiếu
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tên phiếu giảm giá..."
                class="form-control search-input"
              />
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
                <span>✕</span>
              </button>
            </div>
          </div>
          
          <!-- Bộ lọc theo nhóm -->
          <div class="filters-container">
            <!-- Nhóm lọc cơ bản -->
            <div class="filter-group-section">
              <div class="group-title">
                <span class="group-icon">⚙️</span>
                <span>Lọc cơ bản</span>
              </div>
              <div class="filters-grid">
                <div class="filter-group">
                  <label class="filter-label">
                    <span class="label-icon">💰</span>
                    Kiểu giảm giá
                  </label>
                  <select v-model="selectedType" class="form-select">
                    <option value="">Tất cả kiểu</option>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định</option>
                  </select>
                </div>
                
                <div class="filter-group">
                  <label class="filter-label">
                    <span class="label-icon">🏷️</span>
                    Loại phiếu
                  </label>
                  <select v-model="selectedType2" class="form-select">
                    <option value="">Tất cả loại</option>
                    <option value="public">Công khai</option>
                    <option value="private">Cá nhân</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label class="filter-label">
                    <span class="label-icon">📈</span>
                    Trạng thái
                  </label>
                  <select v-model="selectedStatus" class="form-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Đang diễn ra</option>
                    <option value="expired">Hết hạn</option>
                    <option value="upcoming">Sắp diễn ra</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Nhóm lọc thời gian -->
            <div class="filter-group-section">
              <div class="group-title">
                <span class="group-icon">📅</span>
                <span>Lọc theo thời gian</span>
              </div>
              <div class="date-filters-grid">
                <div class="filter-group">
                  <label class="filter-label">
                    <span class="label-icon">📅</span>
                    Từ ngày
                  </label>
                  <input type="date" v-model="fromDate" class="form-control date-input">
                </div>

                <div class="filter-group">
                  <label class="filter-label">
                    <span class="label-icon">📅</span>
                    Đến ngày
                  </label>
                  <input type="date" v-model="toDate" class="form-control date-input">
                </div>
              </div>
            </div>

            <!-- Hành động lọc -->
            <div class="filter-actions-section">
              <div class="filter-actions-container">
                <button @click="clearFilters" class="btn btn-outline">
                  <span class="btn-icon">🔄</span>
                  Đặt lại
                </button>
                <button @click="applyFilters" class="btn btn-primary">
                  <span class="btn-icon">🔍</span>
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Coupons Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên</th>
              <th>Kiểu</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coupon, index) in filteredCoupons" :key="coupon.id">
              <td>{{ index + 1 }}</td>
              <td class="coupon-code">{{ coupon.code }}</td>
              <td class="coupon-name">{{ coupon.name }}</td>
              <td>
                <span :class="['badge', coupon.type === 'percent' ? 'badge-info' : 'badge-secondary']">
                  {{ coupon.type === 'percent' ? 'Cá nhân' : 'Công khai' }}
                </span>
              </td>
              <td>{{ coupon.discountType === 'percent' ? coupon.value + '%' : formatCurrency(coupon.value) }}</td>
              <td>{{ coupon.quantity }}</td>
              <td>{{ formatDate(coupon.startDate) }}</td>
              <td>{{ formatDate(coupon.endDate) }}</td>
              <td>
                <span :class="['badge', getStatusClass(coupon)]">
                  {{ getStatusText(coupon) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-export" 
                    @click="viewCoupon(coupon)"
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(5, filteredCoupons.length) }} Phiếu giảm giá
          </div>
          <div class="pagination">
            <button class="btn-export" disabled>
              <span class="btn-icon">❮</span>
            </button>
            <span class="page-info">1</span>
            <button class="btn-export" disabled>
              <span class="btn-icon">❯</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Coupon Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Tạo phiếu giảm giá</h3>
          <button class="modal-close" @click="showAddModal = false">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveCoupon">
            <div class="form-sections">
              <!-- Basic Information -->
              <div class="form-section">
                <h4>Thông tin cơ bản</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Mã giảm giá *</label>
                    <input 
                      type="text" 
                      v-model="couponForm.code" 
                      class="form-control" 
                      placeholder="Nhập mã giảm giá"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tên phiếu giảm giá *</label>
                    <input 
                      type="text" 
                      v-model="couponForm.name" 
                      class="form-control" 
                      placeholder="Nhập tên phiếu giảm giá"
                      required
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Mô tả</label>
                  <textarea 
                    v-model="couponForm.description" 
                    class="form-control" 
                    rows="3"
                    placeholder="Nhập mô tả phiếu giảm giá"
                  ></textarea>
                </div>
              </div>

              <!-- Discount Settings -->
              <div class="form-section">
                <h4>Cài đặt giảm giá</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Kiểu giảm giá *</label>
                    <select v-model="couponForm.discountType" class="form-control" required>
                      <option value="">Chọn kiểu giảm giá</option>
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (VND)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Giá trị giảm *</label>
                    <input 
                      type="number" 
                      v-model="couponForm.value" 
                      class="form-control" 
                      :placeholder="couponForm.discountType === 'percent' ? 'Nhập % giảm (1-100)' : 'Nhập số tiền'"
                      :min="couponForm.discountType === 'percent' ? 1 : 1000"
                      :max="couponForm.discountType === 'percent' ? 100 : undefined"
                      required
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Số tiền đơn hàng tối thiểu</label>
                    <input 
                      type="number" 
                      v-model="couponForm.minOrderAmount" 
                      class="form-control" 
                      placeholder="0"
                      min="0"
                    >
                  </div>
                  <div class="form-group" v-if="couponForm.discountType === 'percent'">
                    <label class="form-label">Giảm tối đa</label>
                    <input 
                      type="number" 
                      v-model="couponForm.maxDiscount" 
                      class="form-control" 
                      placeholder="Số tiền giảm tối đa"
                      min="0"
                    >
                  </div>
                </div>
              </div>

              <!-- Usage Settings -->
              <div class="form-section">
                <h4>Cài đặt sử dụng</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Số lượng *</label>
                    <input 
                      type="number" 
                      v-model="couponForm.quantity" 
                      class="form-control" 
                      placeholder="Nhập số lượng"
                      min="1"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label class="form-label">Loại phiếu *</label>
                    <select v-model="couponForm.type" class="form-control" required>
                      <option value="">Chọn loại phiếu</option>
                      <option value="public">Công khai</option>
                      <option value="private">Cá nhân</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ngày bắt đầu *</label>
                    <input 
                      type="datetime-local" 
                      v-model="couponForm.startDate" 
                      class="form-control" 
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label class="form-label">Ngày kết thúc *</label>
                    <input 
                      type="datetime-local" 
                      v-model="couponForm.endDate" 
                      class="form-control" 
                      required
                    >
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="modal-btn modal-btn-cancel" @click="showAddModal = false">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button type="submit" class="modal-btn modal-btn-submit">
            <span class="btn-icon">💾</span>
            Tạo phiếu giảm giá
          </button>
        </div>
      </div>
    </div>

    <!-- Coupon Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết phiếu giảm giá</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedCoupon">
          <div class="coupon-detail">
            <div class="coupon-info">
              <h4>{{ selectedCoupon.name }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã giảm giá:</label>
                  <span class="coupon-code">{{ selectedCoupon.code }}</span>
                </div>
                <div class="info-item">
                  <label>Mô tả:</label>
                  <span>{{ selectedCoupon.description || 'Không có mô tả' }}</span>
                </div>
                <div class="info-item">
                  <label>Kiểu giảm giá:</label>
                  <span>{{ selectedCoupon.discountType === 'percent' ? 'Phần trăm (%)' : 'Số tiền cố định (VND)' }}</span>
                </div>
                <div class="info-item">
                  <label>Giá trị giảm:</label>
                  <span class="discount-value">
                    {{ selectedCoupon.discountType === 'percent' ? selectedCoupon.value + '%' : formatCurrency(selectedCoupon.value) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Đơn hàng tối thiểu:</label>
                  <span>{{ formatCurrency(selectedCoupon.minOrderAmount) }}</span>
                </div>
                <div class="info-item" v-if="selectedCoupon.maxDiscount">
                  <label>Giảm tối đa:</label>
                  <span>{{ formatCurrency(selectedCoupon.maxDiscount) }}</span>
                </div>
                <div class="info-item">
                  <label>Số lượng:</label>
                  <span>{{ selectedCoupon.quantity }}</span>
                </div>
                <div class="info-item">
                  <label>Đã sử dụng:</label>
                  <span>{{ selectedCoupon.used || 0 }}</span>
                </div>
                <div class="info-item">
                  <label>Loại phiếu:</label>
                  <span>{{ selectedCoupon.type === 'public' ? 'Công khai' : 'Cá nhân' }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày bắt đầu:</label>
                  <span>{{ formatDateTime(selectedCoupon.startDate) }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày kết thúc:</label>
                  <span>{{ formatDateTime(selectedCoupon.endDate) }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', getStatusClass(selectedCoupon)]">
                    {{ getStatusText(selectedCoupon) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dichVuPhieuGiamGia } from '../../services/dichVuPhieuGiamGia.js'

// Data
const searchQuery = ref('')
const fromDate = ref('')
const toDate = ref('')
const selectedType = ref('')
const selectedType2 = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedCoupon = ref(null)
const loading = ref(false)

const couponForm = ref({
  code: '',
  name: '',
  description: '',
  discountType: '',
  value: 0,
  minOrderAmount: 0,
  maxDiscount: 0,
  quantity: 1,
  type: '',
  startDate: '',
  endDate: ''
})

const coupons = ref([])

// Computed
const filteredCoupons = computed(() => {
  let filtered = coupons.value

  if (searchQuery.value) {
    filtered = filtered.filter(coupon => 
      coupon.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(coupon => coupon.discountType === selectedType.value)
  }

  if (selectedType2.value) {
    filtered = filtered.filter(coupon => coupon.type === selectedType2.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(coupon => {
      const status = getCouponStatus(coupon)
      return status === selectedStatus.value
    })
  }

  if (fromDate.value) {
    filtered = filtered.filter(coupon => 
      new Date(coupon.startDate) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(coupon => 
      new Date(coupon.endDate) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' đ')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getCouponStatus = (coupon) => {
  const now = new Date()
  const startDate = new Date(coupon.startDate)
  const endDate = new Date(coupon.endDate)

  if (now < startDate) {
    return 'upcoming'
  } else if (now > endDate) {
    return 'expired'
  } else {
    return 'active'
  }
}

const getStatusClass = (coupon) => {
  const status = getCouponStatus(coupon)
  const statusClasses = {
    'active': 'badge-success',
    'expired': 'badge-danger',
    'upcoming': 'badge-warning'
  }
  return statusClasses[status] || 'badge-secondary'
}

const getStatusText = (coupon) => {
  const status = getCouponStatus(coupon)
  const statusTexts = {
    'active': 'Đang diễn ra',
    'expired': 'Hết hạn',
    'upcoming': 'Sắp diễn ra'
  }
  return statusTexts[status] || 'Không xác định'
}

const viewCoupon = (coupon) => {
  selectedCoupon.value = coupon
  showDetailModal.value = true
}

const saveCoupon = async () => {
  // Validate required fields
  if (!couponForm.value.code || !couponForm.value.name || !couponForm.value.discountType) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  // Validate dates
  if (new Date(couponForm.value.startDate) >= new Date(couponForm.value.endDate)) {
    alert('Ngày kết thúc phải sau ngày bắt đầu')
    return
  }

  try {
    loading.value = true
    await dichVuPhieuGiamGia.taoMoi(couponForm.value)
    
    // Reset form and refresh data
    resetForm()
    showAddModal.value = false
    await loadCoupons()
    
    alert('Tạo phiếu giảm giá thành công!')
  } catch (error) {
    console.error('Error creating coupon:', error)
    alert('Có lỗi xảy ra: ' + (error.message || 'Không thể tạo phiếu giảm giá'))
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  couponForm.value = {
    code: '',
    name: '',
    description: '',
    discountType: '',
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    quantity: 1,
    type: '',
    startDate: '',
    endDate: ''
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedType2.value = ''
  selectedStatus.value = ''
  fromDate.value = ''
  toDate.value = ''
}

const applyFilters = () => {
  // Filters are already applied through computed property
  console.log('Filters applied')
}

const refreshData = async () => {
  await loadCoupons()
}

const exportData = () => {
  alert('Xuất báo cáo phiếu giảm giá')
}

const exportToExcel = () => {
  try {
    const headerMapping = {
      'id': 'ID',
      'ma_phieu': 'Mã phiếu',
      'ten_phieu': 'Tên phiếu', 
      'loai_giam_gia': 'Loại giảm giá',
      'gia_tri': 'Giá trị',
      'so_luong': 'Số lượng',
      'da_su_dung': 'Đã sử dụng',
      'ngay_bat_dau': 'Ngày bắt đầu',
      'ngay_ket_thuc': 'Ngày kết thúc',
      'trang_thai': 'Trạng thái'
    }
    
    const filteredData = filteredCoupons.value.map(item => ({
      id: item.id || 'N/A',
      ma_phieu: item.ma_phieu || 'N/A',
      ten_phieu: item.ten_phieu || 'N/A',
      loai_giam_gia: item.loai_giam_gia === 'percent' ? 'Phần trăm' : 'Số tiền cố định',
      gia_tri: item.loai_giam_gia === 'percent' ? `${item.gia_tri}%` : new Intl.NumberFormat('vi-VN').format(item.gia_tri),
      so_luong: item.so_luong || 0,
      da_su_dung: item.da_su_dung || 0,
      ngay_bat_dau: item.ngay_bat_dau ? new Date(item.ngay_bat_dau).toLocaleDateString('vi-VN') : 'N/A',
      ngay_ket_thuc: item.ngay_ket_thuc ? new Date(item.ngay_ket_thuc).toLocaleDateString('vi-VN') : 'N/A',
      trang_thai: item.trang_thai === 'active' ? 'Hoạt động' : 'Tạm dừng'
    }))
    
    const result = exportToExcel(filteredData, 'Discount_Coupons', 'Danh sách phiếu giảm giá', headerMapping)
    
    if (result && result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result ? result.message : 'Có lỗi xảy ra khi xuất file Excel'}`)
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert(`❌ Có lỗi xảy ra khi xuất file Excel: ${error.message}`)
  }
}

// Load coupons from backend
const loadCoupons = async () => {
  try {
    loading.value = true
    const response = await dichVuPhieuGiamGia.layTatCa()
    coupons.value = response.map(item => dichVuPhieuGiamGia.chuyenDoiDuLieu(item))
  } catch (error) {
    console.error('Error loading coupons:', error)
    alert('Không thể tải danh sách phiếu giảm giá: ' + (error.message || 'Lỗi không xác định'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Initialize with empty date values
  fromDate.value = ''
  toDate.value = ''
  
  // Load coupons from backend
  await loadCoupons()
})
</script>

<style scoped>
.discount-coupons {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.125rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

/* Modern Filter Section */
.filter-section {
  margin-bottom: 2rem;
}

.filter-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 10px;
}

.filter-title h3 {
  margin: 0;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
}

.filter-stats {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter-content {
  padding: 1.5rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.25rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: #ef4444;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Filter Group Sections */
.filter-group-section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.filter-group-section:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.group-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 8px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.date-filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.label-icon {
  font-size: 1rem;
}

.form-select,
.date-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
  color: #374151;
}

.form-select:focus,
.date-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.filter-actions-section {
  margin-top: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.filter-actions-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-outline {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.btn-primary {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.btn-export {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.btn-export:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Modal specific button styles */
.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  min-width: 120px;
  justify-content: center;
}

.modal-btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.modal-btn-cancel:hover {
  background: #e9ecef;
  color: #495057;
  border-color: #adb5bd;
}

.modal-btn-submit {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.modal-btn-submit:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Table Styles */
.table th {
  background-color: #4ade80;
  color: white;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
}

.table td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
}

.coupon-code {
  font-weight: 600;
  color: #4ade80;
}

.coupon-name {
  font-weight: 500;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-weight: 600;
  color: var(--secondary-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--secondary-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.modal-close:hover {
  background-color: var(--light-gray);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Form Sections */
.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.125rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Coupon Detail */
.coupon-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.coupon-info h4 {
  text-align: center;
  margin: 0 0 2rem 0;
  color: var(--secondary-color);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 500;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.info-item span {
  color: var(--secondary-color);
}

.discount-value {
  font-weight: 600;
  color: var(--success-color);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .filters-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-content {
    padding: 1rem;
  }
  
  .filter-group-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .date-filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-actions-section {
    margin-top: 1rem;
    padding: 1rem;
  }
  
  .filter-actions-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-actions-container .btn {
    width: 100%;
    justify-content: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .filter-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filter-title h3 {
    font-size: 1.125rem;
  }
  
  .search-input {
    padding: 0.75rem 2.5rem;
    font-size: 0.875rem;
  }
  
  .group-title {
    font-size: 0.875rem;
  }
  
  .form-select,
  .date-input {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
}
</style>

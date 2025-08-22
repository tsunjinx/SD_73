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
          <button class="btn-export" @click="exportData">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-export" @click="exportToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Tạo mới
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="search-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm phiếu giảm giá theo mã hoặc tên" 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
        
        <div class="date-filters">
          <div class="date-group">
            <label>Từ ngày</label>
            <input type="date" v-model="fromDate" class="form-control">
          </div>
          <div class="date-group">
            <label>Đến ngày</label>
            <input type="date" v-model="toDate" class="form-control">
          </div>
        </div>

        <div class="filter-controls">
          <select v-model="selectedType" class="form-control">
            <option value="">Kiểu: Tất cả</option>
            <option value="percent">Phần trăm</option>
            <option value="fixed">Số tiền cố định</option>
          </select>
          
          <select v-model="selectedType2" class="form-control">
            <option value="">Loại: Tất cả</option>
            <option value="public">Công khai</option>
            <option value="private">Cá nhân</option>
          </select>
          
          <select v-model="selectedStatus" class="form-control">
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Đang diễn ra</option>
            <option value="expired">Hết hạn</option>
            <option value="upcoming">Sắp diễn ra</option>
          </select>
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
          <button type="button" class="btn-export" @click="showAddModal = false">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button type="submit" class="btn-export" @click="saveCoupon">
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

// Mock data
const coupons = ref([
  {
    id: 1,
    code: 'PGGTT',
    name: 'tri an kh',
    type: 'private',
    discountType: 'percent',
    value: 100,
    quantity: 0,
    used: 0,
    minOrderAmount: 0,
    maxDiscount: null,
    startDate: '2023-12-20T10:29:00',
    endDate: '2023-12-23T00:00:00',
    description: 'Phiếu giảm giá tri ân khách hàng'
  },
  {
    id: 2,
    code: 'PGG2023',
    name: 'Thi báo về',
    type: 'public',
    discountType: 'percent',
    value: 10,
    quantity: 97,
    used: 3,
    minOrderAmount: 0,
    maxDiscount: 100000,
    startDate: '2023-12-20T10:05:00',
    endDate: '2023-12-30T00:00:00',
    description: 'Phiếu giảm giá cuối năm'
  },
  {
    id: 3,
    code: 'PGG/653',
    name: 'Tri ân khách hàng',
    type: 'private',
    discountType: 'percent',
    value: 10,
    quantity: 20,
    used: 0,
    minOrderAmount: 1000000,
    maxDiscount: 200000,
    startDate: '2023-12-18T00:00:00',
    endDate: '2023-12-29T00:00:00',
    description: 'Tri ân khách hàng thân thiết'
  },
  {
    id: 4,
    code: 'PGG12',
    name: 'Lập động',
    type: 'public',
    discountType: 'fixed',
    value: 250000,
    quantity: 30,
    used: 5,
    minOrderAmount: 1000000,
    maxDiscount: null,
    startDate: '2023-12-01T00:00:00',
    endDate: '2023-12-30T00:00:00',
    description: 'Giảm giá cố định cho đơn hàng lớn'
  },
  {
    id: 5,
    code: 'PGG613',
    name: 'Black Friday',
    type: 'public',
    discountType: 'percent',
    value: 20,
    quantity: 8,
    used: 2,
    minOrderAmount: 500000,
    maxDiscount: 300000,
    startDate: '2023-12-13T00:00:00',
    endDate: '2023-12-22T00:00:00',
    description: 'Giảm giá Black Friday'
  }
])

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

const saveCoupon = () => {
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

  // Add new coupon
  const newCoupon = {
    ...couponForm.value,
    id: Math.max(...coupons.value.map(c => c.id)) + 1,
    used: 0
  }
  
  coupons.value.push(newCoupon)
  
  // Reset form
  resetForm()
  showAddModal.value = false
  
  alert('Tạo phiếu giảm giá thành công!')
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

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing discount coupons data...')
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

onMounted(() => {
  // Set default dates
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  fromDate.value = today.toISOString().split('T')[0]
  toDate.value = nextWeek.toISOString().split('T')[0]
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

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.date-filters {
  display: flex;
  gap: 1rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-group label {
  font-size: 0.875rem;
  color: var(--medium-gray);
  font-weight: 500;
}

.date-group input {
  min-width: 150px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-controls select {
  min-width: 150px;
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
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-filters {
    flex-direction: column;
  }
  
  .filter-controls {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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
</style>

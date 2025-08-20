<template>
  <div class="price-history-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Quản lý Lịch sử Giá</h2>
      <div class="header-actions">
        <button class="btn btn-outline" @click="exportData">
          📊 Xuất báo cáo
        </button>
        <button class="btn btn-primary" @click="analyzePriceTrends">
          📈 Phân tích xu hướng
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-cards">
      <div class="stats-card">
        <div class="stats-icon">📝</div>
        <div class="stats-content">
          <div class="stats-number">{{ totalPriceChanges }}</div>
          <div class="stats-label">Lần thay đổi giá</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon">📈</div>
        <div class="stats-content">
          <div class="stats-number">{{ priceIncreases }}</div>
          <div class="stats-label">Lần tăng giá</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon">📉</div>
        <div class="stats-content">
          <div class="stats-number">{{ priceDecreases }}</div>
          <div class="stats-label">Lần giảm giá</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon">💰</div>
        <div class="stats-content">
          <div class="stats-number">{{ formatCurrency(avgPriceChange) }}</div>
          <div class="stats-label">Biến động TB</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo sản phẩm hoặc người thay đổi..." 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
        
        <div class="filter-group">
          <select v-model="selectedProduct" class="form-control">
            <option value="">Tất cả sản phẩm</option>
            <option v-for="product in availableProducts" :key="product.id" :value="product.id">
              {{ product.ten_san_pham }}
            </option>
          </select>
          
          <select v-model="selectedUser" class="form-control">
            <option value="">Tất cả người thay đổi</option>
            <option v-for="user in availableUsers" :key="user.id" :value="user.id">
              {{ user.ho_ten }}
            </option>
          </select>

          <select v-model="changeType" class="form-control">
            <option value="">Tất cả loại</option>
            <option value="increase">Tăng giá</option>
            <option value="decrease">Giảm giá</option>
          </select>
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

        <div class="view-toggle">
          <button 
            :class="['toggle-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
          >
            📋 Danh sách
          </button>
          <button 
            :class="['toggle-btn', { active: viewMode === 'chart' }]"
            @click="viewMode = 'chart'"
          >
            📊 Biểu đồ
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Giá cũ</th>
              <th>Giá mới</th>
              <th>Biến động</th>
              <th>Lý do</th>
              <th>Người thay đổi</th>
              <th>Ngày thay đổi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in filteredPriceHistory" :key="history.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="product-info">
                  <img :src="history.san_pham.hinh_anh" :alt="history.san_pham.ten_san_pham" class="product-image">
                  <div class="product-details">
                    <div class="product-name">{{ history.san_pham.ten_san_pham }}</div>
                    <div class="product-brand">{{ history.san_pham.thuong_hieu }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="old-price">{{ formatCurrency(history.gia_cu) }}</span>
              </td>
              <td>
                <span class="new-price">{{ formatCurrency(history.gia_moi) }}</span>
              </td>
              <td>
                <div class="price-change" :class="getPriceChangeClass(history.gia_cu, history.gia_moi)">
                  <div class="change-amount">{{ formatPriceChange(history.gia_cu, history.gia_moi) }}</div>
                  <div class="change-percentage">{{ formatPercentageChange(history.gia_cu, history.gia_moi) }}</div>
                </div>
              </td>
              <td>
                <div class="reason-info">
                  <p>{{ history.ly_do || 'Không có' }}</p>
                </div>
              </td>
              <td>
                <div class="user-info">
                  <div class="user-name">{{ history.nguoi_thay_doi.ho_ten }}</div>
                  <div class="user-role">{{ history.nguoi_thay_doi.vai_tro }}</div>
                </div>
              </td>
              <td>
                <div class="date-info">
                  {{ formatDateTime(history.ngay_thay_doi) }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-primary" @click="viewDetails(history)">
                    👁️ Chi tiết
                  </button>
                  <button class="btn btn-sm btn-info" @click="viewPriceChart(history.san_pham)">
                    📊 Biểu đồ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ totalFilteredHistory }} bản ghi
          </div>
          <div class="pagination">
            <button 
              class="btn btn-outline btn-sm" 
              @click="previousPage" 
              :disabled="currentPage === 1"
            >
              ❮ Trước
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              class="btn btn-outline btn-sm" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              Sau ❯
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart View -->
    <div v-if="viewMode === 'chart'" class="chart-section">
      <div class="chart-controls">
        <select v-model="selectedProductForChart" class="form-control">
          <option value="">Chọn sản phẩm để xem biểu đồ</option>
          <option v-for="product in availableProducts" :key="product.id" :value="product.id">
            {{ product.ten_san_pham }}
          </option>
        </select>
      </div>

      <div v-if="selectedProductForChart" class="price-chart-container">
        <div class="chart-header">
          <h4>Biểu đồ biến động giá: {{ getProductName(selectedProductForChart) }}</h4>
        </div>
        <div class="price-timeline">
          <div v-for="point in getProductPriceTimeline(selectedProductForChart)" :key="point.id" class="timeline-point">
            <div class="timeline-date">{{ formatDate(point.ngay_thay_doi) }}</div>
            <div class="timeline-connector"></div>
            <div class="timeline-content">
              <div class="price-change-info" :class="getPriceChangeClass(point.gia_cu, point.gia_moi)">
                <div class="change-prices">
                  <span class="from-price">{{ formatCurrency(point.gia_cu) }}</span>
                  <span class="arrow">→</span>
                  <span class="to-price">{{ formatCurrency(point.gia_moi) }}</span>
                </div>
                <div class="change-details">
                  <span class="change-amount">{{ formatPriceChange(point.gia_cu, point.gia_moi) }}</span>
                  <span class="change-percentage">{{ formatPercentageChange(point.gia_cu, point.gia_moi) }}</span>
                </div>
                <div class="change-reason">{{ point.ly_do || 'Không có lý do' }}</div>
                <div class="change-author">Bởi: {{ point.nguoi_thay_doi.ho_ten }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-chart-selected">
        <div class="no-chart-icon">📊</div>
        <div class="no-chart-text">Chọn sản phẩm để xem biểu đồ biến động giá</div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết thay đổi giá</h3>
          <button class="modal-close" @click="showDetailsModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedHistory">
          <div class="history-detail">
            <div class="detail-section">
              <h4>Thông tin sản phẩm</h4>
              <div class="product-detail">
                <img :src="selectedHistory.san_pham.hinh_anh" :alt="selectedHistory.san_pham.ten_san_pham" class="detail-product-image">
                <div class="product-detail-info">
                  <div class="product-name">{{ selectedHistory.san_pham.ten_san_pham }}</div>
                  <div class="product-brand">{{ selectedHistory.san_pham.thuong_hieu }}</div>
                  <div class="product-category">{{ selectedHistory.san_pham.danh_muc }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Thông tin thay đổi giá</h4>
              <div class="price-change-detail">
                <div class="price-comparison">
                  <div class="price-item old">
                    <div class="price-label">Giá cũ</div>
                    <div class="price-value">{{ formatCurrency(selectedHistory.gia_cu) }}</div>
                  </div>
                  <div class="price-arrow">→</div>
                  <div class="price-item new">
                    <div class="price-label">Giá mới</div>
                    <div class="price-value">{{ formatCurrency(selectedHistory.gia_moi) }}</div>
                  </div>
                </div>
                <div class="change-summary" :class="getPriceChangeClass(selectedHistory.gia_cu, selectedHistory.gia_moi)">
                  <div class="change-amount">{{ formatPriceChange(selectedHistory.gia_cu, selectedHistory.gia_moi) }}</div>
                  <div class="change-percentage">{{ formatPercentageChange(selectedHistory.gia_cu, selectedHistory.gia_moi) }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Thông tin khác</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Người thay đổi:</label>
                  <span>{{ selectedHistory.nguoi_thay_doi.ho_ten }}</span>
                </div>
                <div class="info-item">
                  <label>Vai trò:</label>
                  <span>{{ selectedHistory.nguoi_thay_doi.vai_tro }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày thay đổi:</label>
                  <span>{{ formatDateTime(selectedHistory.ngay_thay_doi) }}</span>
                </div>
                <div class="info-item">
                  <label>Lý do:</label>
                  <span>{{ selectedHistory.ly_do || 'Không có' }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-info" @click="viewProductHistory(selectedHistory.san_pham)">
                📊 Xem toàn bộ lịch sử
              </button>
              <button class="btn btn-secondary" @click="showDetailsModal = false">
                Đóng
              </button>
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
const selectedProduct = ref('')
const selectedUser = ref('')
const changeType = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const showDetailsModal = ref(false)
const selectedHistory = ref(null)
const viewMode = ref('list')
const selectedProductForChart = ref('')

// Available data for filtering
const availableProducts = ref([
  { id: 1, ten_san_pham: 'Nike Air Max 270', thuong_hieu: 'Nike' },
  { id: 2, ten_san_pham: 'Adidas Ultraboost 22', thuong_hieu: 'Adidas' },
  { id: 3, ten_san_pham: 'Converse Chuck Taylor', thuong_hieu: 'Converse' }
])

const availableUsers = ref([
  { id: 1, ho_ten: 'Nguyễn Văn Admin', vai_tro: 'Quản trị viên' },
  { id: 2, ho_ten: 'Trần Thị Manager', vai_tro: 'Quản lý' },
  { id: 3, ho_ten: 'Lê Văn Staff', vai_tro: 'Nhân viên' }
])

// Mock data - should match ERD lich_su_gia table
const priceHistory = ref([
  {
    id: 1,
    id_san_pham: 1,
    gia_cu: 2800000,
    gia_moi: 2500000,
    ngay_thay_doi: '2023-12-20T10:30:00Z',
    nguoi_thay_doi_id: 1,
    ly_do: 'Khuyến mãi cuối năm - giảm giá để tăng doanh số',
    san_pham: {
      ten_san_pham: 'Nike Air Max 270',
      thuong_hieu: 'Nike',
      hinh_anh: '/images/nike-air-max-270.jpg',
      danh_muc: 'Giày thể thao'
    },
    nguoi_thay_doi: {
      ho_ten: 'Nguyễn Văn Admin',
      vai_tro: 'Quản trị viên'
    }
  },
  {
    id: 2,
    id_san_pham: 2,
    gia_cu: 3000000,
    gia_moi: 3200000,
    ngay_thay_doi: '2023-12-19T14:15:00Z',
    nguoi_thay_doi_id: 2,
    ly_do: 'Tăng giá do chi phí nguyên liệu tăng',
    san_pham: {
      ten_san_pham: 'Adidas Ultraboost 22',
      thuong_hieu: 'Adidas',
      hinh_anh: '/images/adidas-ultraboost-22.jpg',
      danh_muc: 'Giày chạy bộ'
    },
    nguoi_thay_doi: {
      ho_ten: 'Trần Thị Manager',
      vai_tro: 'Quản lý'
    }
  },
  {
    id: 3,
    id_san_pham: 3,
    gia_cu: 2000000,
    gia_moi: 1800000,
    ngay_thay_doi: '2023-12-21T09:00:00Z',
    nguoi_thay_doi_id: 3,
    ly_do: 'Thanh lý tồn kho, giảm giá để xả hàng',
    san_pham: {
      ten_san_pham: 'Converse Chuck Taylor',
      thuong_hieu: 'Converse',
      hinh_anh: '/images/converse-chuck-taylor.jpg',
      danh_muc: 'Giày thời trang'
    },
    nguoi_thay_doi: {
      ho_ten: 'Lê Văn Staff',
      vai_tro: 'Nhân viên'
    }
  },
  {
    id: 4,
    id_san_pham: 1,
    gia_cu: 2500000,
    gia_moi: 2650000,
    ngay_thay_doi: '2023-12-22T11:30:00Z',
    nguoi_thay_doi_id: 1,
    ly_do: 'Điều chỉnh giá theo thị trường sau khuyến mãi',
    san_pham: {
      ten_san_pham: 'Nike Air Max 270',
      thuong_hieu: 'Nike',
      hinh_anh: '/images/nike-air-max-270.jpg',
      danh_muc: 'Giày thể thao'
    },
    nguoi_thay_doi: {
      ho_ten: 'Nguyễn Văn Admin',
      vai_tro: 'Quản trị viên'
    }
  }
])

// Computed
const filteredPriceHistory = computed(() => {
  let filtered = priceHistory.value

  if (searchQuery.value) {
    filtered = filtered.filter(history => 
      history.san_pham.ten_san_pham.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      history.nguoi_thay_doi.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedProduct.value) {
    filtered = filtered.filter(history => history.id_san_pham === parseInt(selectedProduct.value))
  }

  if (selectedUser.value) {
    filtered = filtered.filter(history => history.nguoi_thay_doi_id === parseInt(selectedUser.value))
  }

  if (changeType.value) {
    if (changeType.value === 'increase') {
      filtered = filtered.filter(history => history.gia_moi > history.gia_cu)
    } else if (changeType.value === 'decrease') {
      filtered = filtered.filter(history => history.gia_moi < history.gia_cu)
    }
  }

  if (fromDate.value) {
    filtered = filtered.filter(history => 
      new Date(history.ngay_thay_doi) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(history => 
      new Date(history.ngay_thay_doi) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  // Sort by date descending
  filtered = filtered.sort((a, b) => new Date(b.ngay_thay_doi) - new Date(a.ngay_thay_doi))

  return filtered.slice(startIndex.value, endIndex.value)
})

const totalPriceChanges = computed(() => priceHistory.value.length)
const totalFilteredHistory = computed(() => filteredPriceHistory.value.length)
const priceIncreases = computed(() => priceHistory.value.filter(h => h.gia_moi > h.gia_cu).length)
const priceDecreases = computed(() => priceHistory.value.filter(h => h.gia_moi < h.gia_cu).length)
const avgPriceChange = computed(() => {
  const total = priceHistory.value.reduce((sum, h) => sum + Math.abs(h.gia_moi - h.gia_cu), 0)
  return totalPriceChanges.value > 0 ? total / totalPriceChanges.value : 0
})

const totalPages = computed(() => Math.ceil(totalFilteredHistory.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalFilteredHistory.value))

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount)
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatPriceChange = (oldPrice, newPrice) => {
  const change = newPrice - oldPrice
  const sign = change >= 0 ? '+' : ''
  return `${sign}${formatCurrency(change)}`
}

const formatPercentageChange = (oldPrice, newPrice) => {
  if (oldPrice === 0) return '0%'
  const percentage = ((newPrice - oldPrice) / oldPrice) * 100
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

const getPriceChangeClass = (oldPrice, newPrice) => {
  if (newPrice > oldPrice) return 'price-increase'
  if (newPrice < oldPrice) return 'price-decrease'
  return 'price-neutral'
}

const getProductName = (productId) => {
  const product = availableProducts.value.find(p => p.id === parseInt(productId))
  return product ? product.ten_san_pham : ''
}

const getProductPriceTimeline = (productId) => {
  return priceHistory.value
    .filter(h => h.id_san_pham === parseInt(productId))
    .sort((a, b) => new Date(a.ngay_thay_doi) - new Date(b.ngay_thay_doi))
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

const viewDetails = (history) => {
  selectedHistory.value = history
  showDetailsModal.value = true
}

const viewPriceChart = (product) => {
  viewMode.value = 'chart'
  selectedProductForChart.value = product.id || product.id_san_pham
}

const viewProductHistory = (product) => {
  viewMode.value = 'chart'
  selectedProductForChart.value = product.id || product.id_san_pham
  showDetailsModal.value = false
}

const analyzePriceTrends = () => {
  alert('Phân tích xu hướng giá sản phẩm')
}

const exportData = () => {
  alert('Xuất báo cáo lịch sử giá')
}

onMounted(() => {
  // Set default date filter to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  fromDate.value = thirtyDaysAgo.toISOString().split('T')[0]
  toDate.value = today.toISOString().split('T')[0]
})
</script>

<style scoped>
.price-history-management {
  max-width: 1800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  color: var(--secondary-color);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Statistics Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 12px;
}

.stats-content {
  flex: 1;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.stats-label {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-controls > div {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.filter-group {
  display: flex;
  gap: 1rem;
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

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.toggle-btn.active,
.toggle-btn:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Table Styles */
.table th {
  background-color: var(--primary-color);
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

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: var(--secondary-color);
}

.product-brand {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.old-price {
  color: var(--medium-gray);
  text-decoration: line-through;
}

.new-price {
  font-weight: 600;
  color: var(--secondary-color);
}

.price-change {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.change-amount {
  font-weight: 600;
  font-size: 1rem;
}

.change-percentage {
  font-size: 0.875rem;
}

.price-increase .change-amount,
.price-increase .change-percentage {
  color: #dc3545;
}

.price-decrease .change-amount,
.price-decrease .change-percentage {
  color: #28a745;
}

.price-neutral .change-amount,
.price-neutral .change-percentage {
  color: var(--medium-gray);
}

.price-increase::before {
  content: '📈';
  margin-right: 0.25rem;
}

.price-decrease::before {
  content: '📉';
  margin-right: 0.25rem;
}

.reason-info {
  text-align: left;
  max-width: 200px;
}

.reason-info p {
  margin: 0;
  color: var(--secondary-color);
  font-size: 0.875rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.user-info {
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: var(--secondary-color);
}

.user-role {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.date-info {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.chart-controls {
  margin-bottom: 2rem;
}

.chart-controls select {
  max-width: 400px;
}

.chart-header {
  margin-bottom: 2rem;
}

.chart-header h4 {
  margin: 0;
  color: var(--secondary-color);
  font-size: 1.25rem;
}

.price-timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-point {
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid var(--border-color);
}

.timeline-point:last-child {
  border-left: none;
}

.timeline-date {
  position: absolute;
  left: -120px;
  top: 0;
  width: 100px;
  font-weight: 600;
  color: var(--secondary-color);
  font-size: 0.875rem;
  text-align: right;
}

.timeline-connector {
  position: absolute;
  left: -6px;
  top: 5px;
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--border-color);
}

.timeline-content {
  margin-left: 2rem;
}

.price-change-info {
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--border-color);
}

.price-change-info.price-increase {
  background-color: rgba(220, 53, 69, 0.05);
  border-left-color: #dc3545;
}

.price-change-info.price-decrease {
  background-color: rgba(40, 167, 69, 0.05);
  border-left-color: #28a745;
}

.change-prices {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.from-price, .to-price {
  font-weight: 600;
  font-size: 1.125rem;
}

.from-price {
  color: var(--medium-gray);
}

.to-price {
  color: var(--secondary-color);
}

.arrow {
  color: var(--primary-color);
  font-weight: bold;
}

.change-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.change-details .change-amount,
.change-details .change-percentage {
  font-weight: 600;
}

.change-reason {
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  font-style: italic;
}

.change-author {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.no-chart-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--medium-gray);
}

.no-chart-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-chart-text {
  font-size: 1.125rem;
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

.history-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.125rem;
}

.product-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.product-detail-info {
  flex: 1;
}

.product-detail-info .product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.product-detail-info .product-brand,
.product-detail-info .product-category {
  color: var(--medium-gray);
  margin-bottom: 0.25rem;
}

.price-change-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-comparison {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
}

.price-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.875rem;
  color: var(--medium-gray);
}

.price-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.price-item.old .price-value {
  color: var(--medium-gray);
  text-decoration: line-through;
}

.price-item.new .price-value {
  color: var(--secondary-color);
}

.price-arrow {
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: bold;
}

.change-summary {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--light-gray);
}

.change-summary .change-amount,
.change-summary .change-percentage {
  font-size: 1.25rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .filter-controls > div {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .date-filters {
    flex-direction: column;
  }
  
  .price-comparison {
    flex-direction: column;
    gap: 1rem;
  }
  
  .change-summary {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-date {
    position: relative;
    left: auto;
    width: auto;
    text-align: left;
    margin-bottom: 0.5rem;
  }
  
  .timeline-content {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .product-detail {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .price-timeline {
    padding-left: 1rem;
  }
}
</style>
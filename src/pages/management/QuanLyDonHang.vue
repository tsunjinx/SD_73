<template>
  <div class="order-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý đơn hàng</h1>
          <p class="page-subtitle">Theo dõi và xử lý đơn hàng</p>
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
          <button class="btn-export" @click="exportOrdersToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="createOrder">
            <span class="btn-icon">➕</span>
            Tạo đơn hàng
          </button>
          <button class="btn-export" @click="scanQRCode">
            <span class="btn-icon">📱</span>
            Quét mã QR
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-overview">
      <div class="stat-card total">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalOrders }}</div>
          <div class="stat-label">Tổng đơn hàng</div>
        </div>
        <div class="stat-trend positive">+12%</div>
      </div>
      
      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-number">{{ pendingOrdersCount }}</div>
          <div class="stat-label">Chờ xử lý</div>
        </div>
        <div class="stat-trend">{{ pendingOrdersCount }} đơn</div>
      </div>
      
      <div class="stat-card processing">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <div class="stat-number">{{ processingOrdersCount }}</div>
          <div class="stat-label">Đang xử lý</div>
        </div>
        <div class="stat-trend">{{ processingOrdersCount }} đơn</div>
      </div>
      
      <div class="stat-card completed">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ completedOrdersCount }}</div>
          <div class="stat-label">Hoàn thành</div>
        </div>
        <div class="stat-trend positive">+8%</div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="filters-panel">
      <div class="filters-header">
        <h3>Bộ lọc & Tìm kiếm</h3>
        <button class="btn-export" @click="resetFilters">
          <span class="btn-icon">🔄</span>
          Đặt lại
        </button>
      </div>
      
      <div class="filters-content">
        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-input-group">
            <div class="search-icon">🔍</div>
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn hàng, tên khách hàng, SĐT..." 
              v-model="searchQuery"
              class="search-input"
            >
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
          </div>
        </div>
        
        <!-- Filter Grid -->
        <div class="filter-grid">
          <!-- Date Range -->
          <div class="filter-group">
            <label class="filter-label">Thời gian</label>
            <div class="date-range-group">
              <input 
                type="date" 
                v-model="fromDate" 
                class="date-input"
                placeholder="Từ ngày"
              >
              <span class="date-separator">→</span>
              <input 
                type="date" 
                v-model="toDate" 
                class="date-input"
                placeholder="Đến ngày"
              >
            </div>
          </div>

          <!-- Order Type -->
          <div class="filter-group">
            <label class="filter-label">Loại đơn hàng</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" value="" v-model="selectedType">
                <span class="radio-text">Tất cả</span>
              </label>
              <label class="radio-option">
                <input type="radio" value="online" v-model="selectedType">
                <span class="radio-text">Trực tuyến</span>
              </label>
              <label class="radio-option">
                <input type="radio" value="pos" v-model="selectedType">
                <span class="radio-text">Tại quầy</span>
              </label>
            </div>
          </div>

          <!-- Amount Range -->
          <div class="filter-group">
            <label class="filter-label">Khoảng giá</label>
            <div class="amount-range-group">
              <input 
                type="number" 
                v-model="minAmount" 
                class="amount-input"
                placeholder="Từ"
              >
              <span class="amount-separator">-</span>
              <input 
                type="number" 
                v-model="maxAmount" 
                class="amount-input"
                placeholder="Đến"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Tabs with Improved Design -->
    <div class="status-tabs-container">
      <div class="status-tabs">
        <button 
          v-for="status in statusTabs" 
          :key="status.value"
          :class="['status-tab', { active: selectedStatus === status.value }]"
          @click="selectedStatus = status.value"
        >
          <span class="tab-icon">{{ status.icon }}</span>
          <span class="tab-text">{{ status.label }}</span>
          <span class="tab-count">{{ getStatusCount(status.value) }}</span>
        </button>
      </div>
      
      <div class="view-options">
        <button 
          :class="['view-btn', { active: viewMode === 'table' }]"
          @click="viewMode = 'table'"
          title="Xem dạng bảng"
        >
          📋
        </button>
        <button 
          :class="['view-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
          title="Xem dạng lưới"
        >
          ▦
        </button>
      </div>
    </div>

    <!-- Orders Display -->
    <div class="orders-container">
      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="table-view">
        <div class="table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th class="sortable" @click="sortBy('code')">
                  <span>Mã đơn hàng</span>
                  <span class="sort-icon">{{ getSortIcon('code') }}</span>
                </th>
                <th class="sortable" @click="sortBy('customerName')">
                  <span>Khách hàng</span>
                  <span class="sort-icon">{{ getSortIcon('customerName') }}</span>
                </th>
                <th>Sản phẩm</th>
                <th class="sortable text-right" @click="sortBy('totalAmount')">
                  <span>Tổng tiền</span>
                  <span class="sort-icon">{{ getSortIcon('totalAmount') }}</span>
                </th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th class="sortable" @click="sortBy('createdAt')">
                  <span>Ngày tạo</span>
                  <span class="sort-icon">{{ getSortIcon('createdAt') }}</span>
                </th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id" class="order-row">
                <td class="order-code">
                  <div class="code-cell">
                    <span class="code-text">{{ order.code }}</span>
                    <span class="code-id">#{{ order.id }}</span>
                  </div>
                </td>
                <td class="customer-cell">
                  <div class="customer-info">
                    <div class="customer-name">{{ order.customerName || 'Khách lẻ' }}</div>
                    <div class="customer-phone">{{ order.phone || 'N/A' }}</div>
                  </div>
                </td>
                <td class="items-cell">
                  <div class="items-info">
                    <span class="items-count">{{ order.totalItems }} sản phẩm</span>
                  </div>
                </td>
                <td class="amount-cell text-right">
                  <div class="amount-info">
                    <span class="amount-value">{{ formatCurrency(order.totalAmount) }}</span>
                  </div>
                </td>
                <td class="type-cell">
                  <span :class="['type-badge', order.type]">
                    <span class="type-icon">{{ order.type === 'online' ? '🌐' : '🏪' }}</span>
                    <span class="type-text">{{ order.type === 'online' ? 'Online' : 'Tại quầy' }}</span>
                  </span>
                </td>
                <td class="status-cell">
                  <span :class="['status-badge', getStatusClass(order.status)]">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="date-cell">
                  <div class="date-info">
                    <span class="date-value">{{ formatDate(order.createdAt) }}</span>
                    <span class="time-value">{{ formatTime(order.createdAt) }}</span>
                  </div>
                </td>
                <td class="actions-cell text-center">
                  <div class="action-buttons">
                    <button 
                      class="action-btn view-btn" 
                      @click="viewOrder(order)"
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button 
                      class="action-btn edit-btn" 
                      @click="editOrder(order)"
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button 
                      class="action-btn print-btn" 
                      @click="printOrder(order)"
                      title="In hóa đơn"
                    >
                      🖨️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div class="orders-grid">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="card-header">
              <div class="order-meta">
                <span class="order-code">{{ order.code }}</span>
                <span :class="['type-badge', order.type]">
                  {{ order.type === 'online' ? '🌐 Online' : '🏪 Tại quầy' }}
                </span>
              </div>
              <span :class="['status-badge', getStatusClass(order.status)]">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="card-body">
              <div class="customer-section">
                <div class="customer-name">{{ order.customerName || 'Khách lẻ' }}</div>
                <div class="customer-phone">{{ order.phone || 'N/A' }}</div>
              </div>
              
              <div class="order-details">
                <div class="detail-item">
                  <span class="label">Sản phẩm:</span>
                  <span class="value">{{ order.totalItems }} item</span>
                </div>
                <div class="detail-item">
                  <span class="label">Tổng tiền:</span>
                  <span class="value amount">{{ formatCurrency(order.totalAmount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Ngày tạo:</span>
                  <span class="value">{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button class="action-btn primary" @click="viewOrder(order)">
                <span class="btn-icon">👁️</span>
                <span class="btn-text">Xem</span>
              </button>
              <button class="action-btn secondary" @click="editOrder(order)">
                <span class="btn-icon">✏️</span>
                <span class="btn-text">Sửa</span>
              </button>
              <button class="action-btn tertiary" @click="printOrder(order)">
                <span class="btn-icon">🖨️</span>
                <span class="btn-text">In</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div class="pagination-section">
        <div class="pagination-info">
          <span class="showing">Hiển thị {{ startIndex + 1 }} - {{ endIndex }} trong tổng số {{ totalOrders }} đơn hàng</span>
          <div class="per-page-selector">
            <label>Hiển thị:</label>
            <select v-model="itemsPerPage" class="per-page-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        
        <div class="pagination-controls">
          <button 
            class="pagination-btn first" 
            @click="goToPage(1)" 
            :disabled="currentPage === 1"
            title="Trang đầu"
          >
            ⏮️
          </button>
          <button 
            class="pagination-btn prev" 
            @click="previousPage" 
            :disabled="currentPage === 1"
            title="Trang trước"
          >
            ◀️
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              :class="['page-btn', { active: page === currentPage, dots: page === '...' }]"
              @click="goToPage(page)"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn next" 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            title="Trang sau"
          >
            ▶️
          </button>
          <button 
            class="pagination-btn last" 
            @click="goToPage(totalPages)" 
            :disabled="currentPage === totalPages"
            title="Trang cuối"
          >
            ⏭️
          </button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Thông tin đơn hàng - {{ selectedOrder?.code }}</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedOrder">
          <!-- Order Actions -->
          <div class="order-actions">
            <button class="btn-export">Chi tiết</button>
            <button class="btn-export">In hóa đơn</button>
          </div>

          <!-- Order Info -->
          <div class="order-detail-info">
            <div class="info-section">
              <h4>Thông tin đơn hàng - Đơn tại quầy</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã:</label>
                  <span>{{ selectedOrder.code }}</span>
                </div>
                <div class="info-item">
                  <label>Tên khách hàng:</label>
                  <span>{{ selectedOrder.customerName || 'Khách lẻ' }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', getStatusClass(selectedOrder.status)]">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Số người nhận:</label>
                  <span>{{ selectedOrder.phone || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Loại:</label>
                  <span :class="['badge', selectedOrder.type === 'online' ? 'badge-info' : 'badge-success']">
                    {{ selectedOrder.type === 'online' ? 'Trực tuyến' : 'Tại quầy' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Tên người nhận:</label>
                  <span>{{ selectedOrder.receiverName || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Payment History -->
            <div class="payment-history">
              <h4>Lịch sử thanh toán</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>Số tiền</th>
                    <th>Thời gian</th>
                    <th>Loại giao dịch</th>
                    <th>PTTT</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th>Nhân viên xác nhận</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in selectedOrder.payments" :key="payment.id">
                    <td class="amount">{{ formatCurrency(payment.amount) }}</td>
                    <td>{{ formatDateTime(payment.createdAt) }}</td>
                    <td>
                      <span :class="['badge', payment.type === 'payment' ? 'badge-success' : 'badge-warning']">
                        {{ payment.type === 'payment' ? 'Thanh toán' : 'Tiền mặt' }}
                      </span>
                    </td>
                    <td>
                      <span :class="['badge', payment.method === 'completed' ? 'badge-success' : 'badge-info']">
                        {{ payment.method === 'completed' ? 'Thành công' : 'Tím một' }}
                      </span>
                    </td>
                    <td>
                      <span :class="['badge', payment.status === 'completed' ? 'badge-success' : 'badge-warning']">
                        {{ payment.status === 'completed' ? 'Thành công' : 'Chờ xử lý' }}
                      </span>
                    </td>
                    <td>{{ payment.note || '-' }}</td>
                    <td>{{ payment.confirmedBy }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Order Timeline -->
            <div class="order-timeline">
              <h4>Lịch sử đơn hàng</h4>
              <div class="timeline">
                <div class="timeline-item completed">
                  <div class="timeline-icon">✓</div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="timeline-title">Tạo đơn hàng</span>
                      <span class="timeline-time">{{ formatDateTime(selectedOrder.createdAt) }}</span>
                    </div>
                    <div class="timeline-description">Nhân viên - {{ selectedOrder.createdBy }} - NV6</div>
                  </div>
                </div>
                <div class="timeline-item completed">
                  <div class="timeline-icon">✓</div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="timeline-title">Hoàn thành</span>
                      <span class="timeline-time">{{ formatDateTime(selectedOrder.completedAt) }}</span>
                    </div>
                    <div class="timeline-description">Nhân viên - {{ selectedOrder.completedBy }} - NV6</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product List -->
            <div class="product-list">
              <h4>Danh sách sản phẩm</h4>
              <div class="product-items">
                <div v-for="item in selectedOrder.items" :key="item.id" class="product-item">
                  <div class="product-image">
                    <img v-if="item.image" :src="item.image" :alt="item.name">
                    <div v-else class="placeholder-image">👟</div>
                  </div>
                  <div class="product-info">
                    <h5>{{ item.name }}</h5>
                    <p class="product-details">Mã: {{ item.code }} | Size: {{ item.size }}</p>
                  </div>
                  <div class="product-quantity">x{{ item.quantity }}</div>
                  <div class="product-price">{{ formatCurrency(item.price) }}</div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="order-summary">
                <div class="summary-row">
                  <span>Phiếu giảm giá:</span>
                  <span>{{ selectedOrder.couponCode || 'N/A' }}</span>
                </div>
                <div class="summary-row">
                  <span>Giảm giá từ cửa hàng:</span>
                  <span>{{ selectedOrder.storeDiscount || '0%' }}</span>
                </div>
                <div class="summary-row">
                  <span>Tổng tiền hàng:</span>
                  <span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span>Giảm giá:</span>
                  <span class="discount">-{{ formatCurrency(selectedOrder.discount) }}</span>
                </div>
                <div class="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatCurrency(selectedOrder.shippingFee) }}</span>
                </div>
                <div class="summary-row">
                  <span>Miễn phí vận chuyển với đơn hàng có tổng tiền trên 1.000.000 VND</span>
                </div>
                <div class="summary-row total">
                  <span>Tổng tiền:</span>
                  <span class="total-amount">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
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
import { useRouter } from 'vue-router'
import { exportToExcel, formatDataForExcel } from '../../utils/xuatExcel.js'
import { orderService } from '@/services/dichVuDonHang.js'

const router = useRouter()

// Data
const searchQuery = ref('')
const fromDate = ref('')
const toDate = ref('')
const selectedType = ref('')
const selectedStatus = ref('TAT_CA')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const viewMode = ref('table') // 'table' or 'grid'
const minAmount = ref('')
const maxAmount = ref('')
const sortField = ref('')
const sortDirection = ref('asc') // 'asc' or 'desc'
const showDetailModal = ref(false)
const selectedOrder = ref(null)

const statusTabs = [
  { value: 'TAT_CA', label: 'TẤT CẢ', icon: '📋' },
  { value: 'CHO_XAC_NHAN', label: 'CHỜ XÁC NHẬN', icon: '⏳' },
  { value: 'CHO_GIAO_HANG', label: 'CHỜ GIAO HÀNG', icon: '📦' },
  { value: 'DANG_VAN_CHUYEN', label: 'ĐANG VẬN CHUYỂN', icon: '🚚' },
  { value: 'DA_GIAO_HANG', label: 'ĐÃ GIAO HÀNG', icon: '✅' },
  { value: 'CHO_THANH_TOAN', label: 'CHỜ THANH TOÁN', icon: '💳' },
  { value: 'DA_THANH_TOAN', label: 'ĐÃ THANH TOÁN', icon: '💰' },
  { value: 'HOAN_THANH', label: 'HOÀN THÀNH', icon: '🎉' },
  { value: 'DA_HUY', label: 'ĐÃ HỦY', icon: '❌' }
]

// Data state
const orders = ref([])
const loading = ref(false)
const error = ref(null)

// Load orders from API
const loadOrders = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('Loading orders from API...')
    
    const response = await orderService.getPaging(0, 100)
    orders.value = response || []
    
    console.log('Orders loaded successfully:', orders.value.length)
  } catch (err) {
    console.error('Error loading orders:', err)
    error.value = 'Không thể tải danh sách đơn hàng'
    
    // Fallback to mock data
    orders.value = [
      {
        id: 1,
        ma_hoa_don: 'HD001',
        khach_hang: 'Nguyễn Văn A',
        tong_tien: 2500000,
        trang_thai: 'CHO_XAC_NHAN',
        ngay_tao: '2024-01-15',
        phuong_thuc_thanh_toan: 'TIEN_MAT',
        ghi_chu: 'Giao hàng nhanh'
      },
      {
        id: 2,
        ma_hoa_don: 'HD002',
        khach_hang: 'Trần Thị B',
        tong_tien: 1800000,
        trang_thai: 'DA_GIAO_HANG',
        ngay_tao: '2024-01-14',
        phuong_thuc_thanh_toan: 'CHUYEN_KHOAN',
        ghi_chu: ''
      }
    ]
  } finally {
    loading.value = false
  }
}

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value
  console.log('Total orders:', orders.value.length)
  console.log('Selected status:', selectedStatus.value)
  console.log('From date:', fromDate.value)
  console.log('To date:', toDate.value)

  if (searchQuery.value) {
    filtered = filtered.filter(order => 
      order.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(order => order.type === selectedType.value)
  }

  if (selectedStatus.value && selectedStatus.value !== 'TAT_CA') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  if (fromDate.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  if (minAmount.value) {
    filtered = filtered.filter(order => order.totalAmount >= parseInt(minAmount.value))
  }

  if (maxAmount.value) {
    filtered = filtered.filter(order => order.totalAmount <= parseInt(maxAmount.value))
  }

  console.log('Filtered orders count:', filtered.length)
  console.log('Start index:', startIndex.value, 'End index:', endIndex.value)
  
  return filtered.slice(startIndex.value, endIndex.value)
})

const totalOrders = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    filtered = filtered.filter(order => 
      order.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(order => order.type === selectedType.value)
  }

  if (selectedStatus.value && selectedStatus.value !== 'TAT_CA') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  if (fromDate.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  if (minAmount.value) {
    filtered = filtered.filter(order => order.totalAmount >= parseInt(minAmount.value))
  }

  if (maxAmount.value) {
    filtered = filtered.filter(order => order.totalAmount <= parseInt(maxAmount.value))
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalOrders.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalOrders.value))

// Statistics computed
const pendingOrdersCount = computed(() => 
  orders.value.filter(order => order.status === 'CHO_XAC_NHAN').length
)

const processingOrdersCount = computed(() => 
  orders.value.filter(order => ['CHO_GIAO_HANG', 'DANG_VAN_CHUYEN'].includes(order.status)).length
)

const completedOrdersCount = computed(() => 
  orders.value.filter(order => order.status === 'HOAN_THANH').length
)

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

const getStatusClass = (status) => {
  const statusClasses = {
    'HOAN_THANH': 'badge-success',
    'CHO_XAC_NHAN': 'badge-warning',
    'CHO_GIAO_HANG': 'badge-info',
    'DANG_VAN_CHUYEN': 'badge-info',
    'DA_GIAO_HANG': 'badge-success',
    'DA_THANH_TOAN': 'badge-success',
    'CHO_THANH_TOAN': 'badge-warning',
    'DA_HUY': 'badge-danger'
  }
  return statusClasses[status] || 'badge-secondary'
}

const getStatusText = (status) => {
  const statusTexts = {
    'HOAN_THANH': 'Hoàn thành',
    'CHO_XAC_NHAN': 'Chờ xác nhận',
    'CHO_GIAO_HANG': 'Chờ giao hàng',
    'DANG_VAN_CHUYEN': 'Đang vận chuyển',
    'DA_GIAO_HANG': 'Đã giao hàng',
    'DA_THANH_TOAN': 'Đã thanh toán',
    'CHO_THANH_TOAN': 'Chờ thanh toán',
    'DA_HUY': 'Đã hủy'
  }
  return statusTexts[status] || 'Không xác định'
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

const viewOrder = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const createOrder = () => {
  // Navigate to POS system to create new order
  router.push('/sales/pos')
}

const scanQRCode = () => {
  console.log('Open QR code scanner')
}

const exportOrdersToExcel = () => {
  try {
    const headerMapping = {
      code: 'Mã đơn hàng',
      customerName: 'Khách hàng',
      phone: 'Số điện thoại',
      totalItems: 'Tổng sản phẩm',
      totalAmount: 'Tổng tiền',
      type: 'Loại đơn hàng',
      status: 'Trạng thái',
      createdAt: 'Ngày tạo'
    }
    
    const dataToExport = filteredOrders.value.map(order => ({
      code: order.code,
      customerName: order.customerName || 'Khách lẻ',
      phone: order.phone || 'N/A',
      totalItems: order.totalItems,
      totalAmount: order.totalAmount,
      type: order.type === 'online' ? 'Trực tuyến' : 'Tại quầy',
      status: getStatusText(order.status),
      createdAt: order.createdAt
    }))
    
    const formattedData = formatDataForExcel(dataToExport, headerMapping)
    
    const result = exportToExcel(
      formattedData,
      'Danh_sach_don_hang',
      'Đơn hàng',
      { skipHeader: false }
    )
    
    if (result && result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result ? result.message : 'Có lỗi xảy ra khi xuất file'}`)
    }
  } catch (error) {
    console.error('Error exporting orders to Excel:', error)
    alert(`❌ Có lỗi xảy ra khi xuất file Excel: ${error.message}`)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  fromDate.value = ''
  toDate.value = ''
  selectedType.value = ''
  selectedStatus.value = 'TAT_CA'
  minAmount.value = ''
  maxAmount.value = ''
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '⇅'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const getStatusCount = (status) => {
  if (status === 'TAT_CA') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editOrder = (order) => {
  console.log('Edit order:', order)
}

const printOrder = (order) => {
  console.log('Print order:', order)
}

const goToPage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getPageNumbers = () => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing orders data...')
}

const exportData = () => {
  alert('Chức năng xuất báo cáo đang được phát triển')
}

onMounted(() => {
  console.log('QuanLyDonHang component mounted, loading orders...')
  
  // Set default dates to show all data
  const today = new Date()
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = '2025-01-01' // Set to beginning of 2025 to show all example data
  
  // Load orders data
  loadOrders()
})
</script>

<style scoped>
.order-management {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* === STATISTICS OVERVIEW === */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card.total::before {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.stat-card.pending::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.stat-card.processing::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.stat-card.completed::before {
  background: linear-gradient(90deg, #43e97b, #38f9d7);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-trend {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: var(--gray-100);
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-trend.positive {
  background: rgba(74, 222, 128, 0.1);
  color: var(--success-color);
}

/* === ADVANCED FILTERS PANEL === */
.filters-panel {
  background: white;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.filters-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.btn-reset {
  background: transparent !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border-color) !important;
  padding: 0.5rem 1rem !important;
}

.btn-reset:hover {
  background: var(--gray-50) !important;
  color: var(--text-primary) !important;
}

.filters-content {
  padding: 2rem;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input-group {
  position: relative;
  max-width: 100%;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.125rem;
  color: var(--text-secondary);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-range-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #4ade80;
}

.date-separator {
  color: var(--text-secondary);
  font-weight: 600;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #4ade80;
}

.radio-text {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.radio-option:hover .radio-text {
  color: var(--text-primary);
}

.amount-range-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.amount-input {
  flex: 1;
  min-width: 80px;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.amount-input:focus {
  outline: none;
  border-color: #4ade80;
}

.amount-separator {
  color: var(--text-secondary);
  font-weight: 600;
  flex-shrink: 0;
}

/* === STATUS TABS ENHANCED === */
.status-tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.status-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-tab {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.8125rem;
}

.status-tab:hover {
  background: var(--gray-50);
  border-color: #4ade80;
}

.status-tab.active {
  background: #4ade80;
  border-color: #4ade80;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

.tab-icon {
  font-size: 1rem;
}

.tab-text {
  font-weight: 500;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.status-tab:not(.active) .tab-count {
  background: var(--gray-100);
  color: var(--text-secondary);
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.view-btn:hover {
  background: var(--gray-50);
  border-color: #4ade80;
}

.view-btn.active {
  background: #4ade80;
  border-color: #4ade80;
  color: white;
}

/* === ENHANCED TABLE VIEW === */
.orders-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.table-container {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.orders-table thead th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: var(--text-primary);
  font-weight: 600;
  padding: 1.25rem 1rem;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background: var(--gray-100) !important;
}

.sort-icon {
  margin-left: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.sortable:hover .sort-icon {
  opacity: 1;
}

.order-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--border-light);
}

.order-row:hover {
  background: var(--gray-50);
}

.order-row:last-child {
  border-bottom: none;
}

.orders-table td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
}

.code-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.code-text {
  font-weight: 700;
  color: #4ade80;
  font-size: 0.9375rem;
}

.code-id {
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.customer-phone {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.items-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.items-count {
  font-weight: 500;
}

.amount-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.amount-value {
  font-weight: 700;
  color: var(--success-color);
  font-size: 1rem;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.online {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.type-badge.pos {
  background: rgba(74, 222, 128, 0.1);
  color: #15803d;
}

.type-icon {
  font-size: 0.875rem;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  min-width: 80px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.date-value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.time-value {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.view-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.action-btn.edit-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.action-btn.print-btn:hover {
  background: rgba(107, 114, 128, 0.1);
  border-color: #6b7280;
}

/* === ENHANCED GRID VIEW === */
.grid-view {
  padding: 1.5rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-card .order-code {
  font-weight: 700;
  color: #4ade80;
  font-size: 1.125rem;
}

.card-body {
  padding: 1.25rem;
}

.customer-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.customer-section .customer-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.customer-section .customer-phone {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-item .value {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-item .value.amount {
  color: var(--success-color);
  font-size: 1rem;
}

.card-actions {
  padding: 1.25rem;
  background: var(--gray-50);
  display: flex;
  gap: 0.75rem;
}

.card-actions .action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  min-height: 40px;
}

.card-actions .action-btn.primary {
  background: #4ade80;
  border-color: #4ade80;
  color: white;
}

.card-actions .action-btn.secondary {
  background: white;
  border-color: var(--border-color);
  color: var(--text-primary);
}

.card-actions .action-btn.tertiary {
  background: var(--gray-100);
  border-color: var(--gray-200);
  color: var(--text-secondary);
}

/* === ENHANCED PAGINATION === */
.pagination-section {
  padding: 1.5rem 2rem;
  background: var(--gray-50);
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.showing {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.per-page-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: #4ade80;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.page-btn:hover:not(.active):not(:disabled) {
  background: var(--gray-50);
  border-color: #4ade80;
}

.page-btn.active {
  background: #4ade80;
  border-color: #4ade80;
  color: white;
}

.page-btn.dots {
  border: none;
  background: none;
  cursor: default;
  color: var(--text-secondary);
}

.page-btn:disabled {
  cursor: not-allowed;
}

/* page-header styles are now defined in globals.css */

/* Modern Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover:before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}

.btn-secondary {
  background: linear-gradient(135deg, #4ade80, #16a34a);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #5b5fcf, #3730a3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* btn-export styles now in globals.css */

.btn-icon {
  font-size: 1.125rem;
}

.btn-text {
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .filter-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .search-input-group {
    max-width: 100%;
  }
  
  .date-range-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .date-separator {
    display: none;
  }
  
  .amount-range-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .amount-separator {
    display: none;
  }
  
  .radio-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .status-tabs-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .view-options {
    justify-content: center;
  }
  /* page-header responsive styles are handled in globals.css */
  
  .header-actions {
    flex-direction: column;
  }
  
  .status-tabs {
    flex-wrap: wrap;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem;
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
  
  .order-actions {
    flex-direction: column;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-direction: column;
    text-align: center;
  }
  
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>

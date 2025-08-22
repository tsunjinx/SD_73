<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Thống kê & Báo cáo</h1>
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
          <button class="btn-export" @click="exportData">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics Overview -->
    <div class="metrics-overview">
      <!-- Loading state for metrics -->
      <div v-if="loadingMetrics" class="metric-card skeleton">
        <div class="skeleton-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-trend"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
      <div v-if="loadingMetrics" class="metric-card skeleton">
        <div class="skeleton-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-trend"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
      <div v-if="loadingMetrics" class="metric-card skeleton">
        <div class="skeleton-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-trend"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
      <div v-if="loadingMetrics" class="metric-card skeleton">
        <div class="skeleton-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-trend"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>

      <!-- Actual data -->
      <div v-if="!loadingMetrics" class="metric-card revenue">
        <div class="metric-header">
          <div class="metric-icon">💰</div>
          <div class="metric-trend positive">+12.5%</div>
        </div>
        <div class="metric-content">
          <h3 class="metric-title">Tổng doanh thu</h3>
          <p class="metric-value">{{ formatCurrency(totalRevenue) }}</p>
          <p class="metric-subtitle">So với tháng trước</p>
        </div>
      </div>

      <div v-if="!loadingMetrics" class="metric-card orders">
        <div class="metric-header">
          <div class="metric-icon">📦</div>
          <div class="metric-trend positive">+8.2%</div>
        </div>
        <div class="metric-content">
          <h3 class="metric-title">Tổng đơn hàng</h3>
          <p class="metric-value">{{ totalOrders }}</p>
          <p class="metric-subtitle">Trong tháng này</p>
        </div>
      </div>

      <div v-if="!loadingMetrics" class="metric-card products">
        <div class="metric-header">
          <div class="metric-icon">👟</div>
          <div class="metric-trend neutral">0%</div>
        </div>
        <div class="metric-content">
          <h3 class="metric-title">Sản phẩm bán</h3>
          <p class="metric-value">{{ totalProducts }}</p>
          <p class="metric-subtitle">Sản phẩm khác nhau</p>
        </div>
      </div>

      <div v-if="!loadingMetrics" class="metric-card customers">
        <div class="metric-header">
          <div class="metric-icon">👥</div>
          <div class="metric-trend positive">+15.1%</div>
        </div>
        <div class="metric-content">
          <h3 class="metric-title">Khách hàng mới</h3>
          <p class="metric-value">{{ newCustomers }}</p>
          <p class="metric-subtitle">Trong tuần này</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards Row -->
    <div class="stats-grid">
      <!-- Today Stats -->
      <div class="stat-card today">
        <div class="stat-header">
          <div class="stat-icon">📅</div>
          <div class="stat-period">Hôm nay</div>
        </div>
        <div class="stat-content">
          <div class="stat-main">
            <h3 class="stat-amount">{{ formatCurrency(todayStats.revenue) }}</h3>
            <div class="stat-change positive">+{{ ((todayStats.revenue / weekStats.revenue * 7 - 1) * 100).toFixed(1) }}%</div>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span class="stat-label">Sản phẩm</span>
              <span class="stat-value">{{ todayStats.products }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn thành công</span>
              <span class="stat-value">{{ todayStats.completedOrders }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn hủy</span>
              <span class="stat-value">{{ todayStats.cancelledOrders }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- This Week Stats -->
      <div class="stat-card week">
        <div class="stat-header">
          <div class="stat-icon">📈</div>
          <div class="stat-period">Tuần này</div>
        </div>
        <div class="stat-content">
          <div class="stat-main">
            <h3 class="stat-amount">{{ formatCurrency(weekStats.revenue) }}</h3>
            <div class="stat-change positive">+{{ ((weekStats.revenue / monthStats.revenue * 4 - 1) * 100).toFixed(1) }}%</div>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span class="stat-label">Sản phẩm</span>
              <span class="stat-value">{{ weekStats.products }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn thành công</span>
              <span class="stat-value">{{ weekStats.completedOrders }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn hủy</span>
              <span class="stat-value">{{ weekStats.cancelledOrders }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- This Month Stats -->
      <div class="stat-card month">
        <div class="stat-header">
          <div class="stat-icon">📊</div>
          <div class="stat-period">Tháng này</div>
        </div>
        <div class="stat-content">
          <div class="stat-main">
            <h3 class="stat-amount">{{ formatCurrency(monthStats.revenue) }}</h3>
            <div class="stat-change neutral">0%</div>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span class="stat-label">Sản phẩm</span>
              <span class="stat-value">{{ monthStats.products }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn thành công</span>
              <span class="stat-value">{{ monthStats.completedOrders }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn hủy</span>
              <span class="stat-value">{{ monthStats.cancelledOrders }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- This Year Stats -->
      <div class="stat-card year">
        <div class="stat-header">
          <div class="stat-icon">🎯</div>
          <div class="stat-period">Năm này</div>
        </div>
        <div class="stat-content">
          <div class="stat-main">
            <h3 class="stat-amount">{{ formatCurrency(yearStats.revenue) }}</h3>
            <div class="stat-change positive">+25.3%</div>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span class="stat-label">Sản phẩm</span>
              <span class="stat-value">{{ yearStats.products }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn thành công</span>
              <span class="stat-value">{{ yearStats.completedOrders }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Đơn hủy</span>
              <span class="stat-value">{{ yearStats.cancelledOrders }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Filter Section -->
    <div class="modern-filter-section">
      <div class="filter-container">
        <!-- Quick Period Selector -->
        <div class="quick-filters">
          <div class="quick-filter-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="filter-icon">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            <span>Thời gian</span>
          </div>
          <div class="period-chips">
            <button 
              v-for="period in filterPeriods.slice(0, 4)" 
              :key="period.value"
              :class="['period-chip', { active: selectedPeriod.value === period.value }]"
              @click="selectedPeriod.value = period.value"
            >
              <span class="chip-icon">{{ period.icon }}</span>
              <span class="chip-text">{{ period.label }}</span>
            </button>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div class="custom-date-filter" :class="{ active: selectedPeriod === 'TUY_CHINH' }">
          <button 
            :class="['custom-toggle', { active: selectedPeriod === 'TUY_CHINH' }]"
            @click="selectedPeriod = 'TUY_CHINH'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span>Tùy chỉnh</span>
          </button>
          <div class="date-range-inputs" v-show="selectedPeriod === 'TUY_CHINH'">
            <div class="date-input-group">
              <input type="date" v-model="fromDate" class="modern-date-input" placeholder="Từ ngày">
            </div>
            <div class="date-separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
            <div class="date-input-group">
              <input type="date" v-model="toDate" class="modern-date-input" placeholder="Đến ngày">
            </div>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="filter-actions">
          <button class="filter-apply-btn" @click="applyFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            Áp dụng
          </button>
          <button class="filter-reset-btn" @click="resetFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Revenue Chart -->
    <div class="main-analytics-section">
      <div class="analytics-card large">
        <div class="card-header">
          <div class="header-content">
            <h4 class="card-title">{{ currentChartTitle }}</h4>
            <p class="card-subtitle">{{ currentChartSubtitle }}</p>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click="changeChartType">
              <span class="action-icon">📈</span>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loadingChart" class="chart-wrapper skeleton-chart">
            <div class="skeleton-chart-content"></div>
          </div>
          <div v-if="!loadingChart" class="chart-wrapper">
            <canvas ref="salesChart" class="main-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid: Products & Status/Quick Stats -->
    <div class="content-grid">
      <!-- Top Products Table -->
      <div class="left-column">
        <div class="dashboard-card products-card">
          <div class="card-header">
            <div class="header-content">
              <h4 class="card-title">Sản phẩm bán chạy nhất</h4>
              <p class="card-subtitle">Top 5 sản phẩm có doanh số cao nhất</p>
            </div>
            <div class="header-actions">
              <button class="view-all-btn">Xem tất cả →</button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loadingProducts" class="products-list">
              <div class="product-item skeleton" v-for="i in 5" :key="i">
                <div class="skeleton-rank"></div>
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                  <div class="skeleton-name"></div>
                  <div class="skeleton-details"></div>
                </div>
                <div class="skeleton-trend-icon"></div>
              </div>
            </div>
            <div v-if="!loadingProducts" class="products-list">
              <div class="product-item" v-for="(product, index) in topProducts.slice(0, 5)" :key="product.id">
                <div class="product-rank">
                  <span class="rank-number">{{ index + 1 }}</span>
                </div>
                <div class="product-image">
                  <div class="image-placeholder">👟</div>
                </div>
                <div class="product-info">
                  <h5 class="product-name">{{ product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name }}</h5>
                  <div class="product-details">
                    <span class="product-price">{{ formatCurrency(product.price) }}</span>
                    <span class="product-sales">{{ product.quantity }} đã bán</span>
                  </div>
                </div>
                <div class="product-trend">
                  <div class="trend-indicator positive">↗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Status & Quick Stats -->
      <div class="right-column">
        <!-- Order Status Distribution -->
        <div class="status-chart-card modern-card">
          <div class="modern-card-header">
            <div class="card-title-section">
              <div class="title-icon-wrapper">
                <div class="title-icon">📊</div>
              </div>
              <div class="title-text">
                <h4 class="modern-card-title">Trạng thái đơn hàng</h4>
                <p class="modern-card-subtitle">Phân bố theo tình trạng xử lý</p>
              </div>
            </div>
            <div class="card-actions">
              <button class="action-dot-btn">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </button>
            </div>
          </div>
          <div class="modern-card-body">
            <div class="status-overview">
              <div class="chart-section">
                <div class="modern-chart-wrapper">
                  <canvas ref="statusChart" class="modern-status-chart"></canvas>
                  <div class="chart-center-display">
                    <div class="center-number">{{ orderStatus.filter(s => s.count > 0).reduce((sum, s) => sum + s.count, 0) }}</div>
                    <div class="center-label">Tổng đơn hàng</div>
                  </div>
                </div>
              </div>
              <div class="status-breakdown">
                <div class="breakdown-item" v-for="status in orderStatus.filter(s => s.count > 0)" :key="status.name">
                  <div class="breakdown-header">
                    <div class="status-indicator" :style="{ backgroundColor: status.color }"></div>
                    <span class="status-name">{{ status.name }}</span>
                  </div>
                  <div class="breakdown-stats">
                    <div class="stat-number">{{ status.count }}</div>
                    <div class="stat-percentage" :style="{ color: status.color }">{{ status.percentage }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Quick Stats Cards - Full Width Section -->
    <div class="quick-stats-section">
      <div class="modern-quick-stats">
        <div class="modern-quick-stat-card target-card">
          <div class="quick-card-background"></div>
          <div class="quick-card-content">
            <div class="quick-header">
              <div class="quick-icon-wrapper target">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                </svg>
              </div>
              <div class="quick-title">Mục tiêu tháng</div>
            </div>
            <div class="quick-main-stat">75%</div>
            <div class="modern-progress-container">
              <div class="modern-progress-bar">
                <div class="modern-progress-fill target-fill" style="width: 75%"></div>
              </div>
              <div class="progress-label">Đạt được 75% mục tiêu</div>
            </div>
          </div>
        </div>

        <div class="modern-quick-stat-card pending-card">
          <div class="quick-card-background"></div>
          <div class="quick-card-content">
            <div class="quick-header">
              <div class="quick-icon-wrapper pending">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                </svg>
              </div>
              <div class="quick-title">Chờ xử lý</div>
            </div>
            <div class="quick-main-stat">{{ pendingOrders }}</div>
            <div class="quick-action">
              <button class="modern-action-btn pending">
                <span>Xử lý ngay</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="modern-quick-stat-card stock-card">
          <div class="quick-card-background"></div>
          <div class="quick-card-content">
            <div class="quick-header">
              <div class="quick-icon-wrapper stock">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div class="quick-title">Sắp hết hàng</div>
            </div>
            <div class="quick-main-stat">{{ lowStockProducts }}</div>
            <div class="quick-action">
              <button class="modern-action-btn stock">
                <span>Bổ sung kho</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="modern-quick-stat-card vip-card">
          <div class="quick-card-background"></div>
          <div class="quick-card-content">
            <div class="quick-header">
              <div class="quick-icon-wrapper vip">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <div class="quick-title">Khách VIP</div>
            </div>
            <div class="quick-main-stat">{{ vipCustomers }}</div>
            <div class="quick-action">
              <button class="modern-action-btn vip">
                <span>Xem chi tiết</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { exportToExcel, formatDataForExcel } from '../utils/xuatExcel.js'
import { exportToCSV } from '../utils/xuatCSV.js'
import { dashboardService } from '../services/bangDieuKhien.js'

Chart.register(...registerables)

// Data
const selectedPeriod = ref('THANG')
const selectedTimeframe = ref('30d')
const fromDate = ref('')
const toDate = ref('')
const chartInstance = ref(null)

// Loading states
const loading = ref(false)
const loadingMetrics = ref(false)
const loadingChart = ref(false)
const loadingProducts = ref(false)
const loadingOrderStatus = ref(false)

// API Data
const keyMetrics = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  newCustomers: 0
})

const timeBasedStats = ref({
  today: { revenue: 0, products: 0, completedOrders: 0, cancelledOrders: 0 },
  week: { revenue: 0, products: 0, completedOrders: 0, cancelledOrders: 0 },
  month: { revenue: 0, products: 0, completedOrders: 0, cancelledOrders: 0 },
  year: { revenue: 0, products: 0, completedOrders: 0, cancelledOrders: 0 }
})

const topProductsData = ref([])
const orderStatusData = ref([])
const quickStatsData = ref({
  pendingOrders: 0,
  lowStockProducts: 0,
  vipCustomers: 0
})

const chartData = ref({
  labels: [],
  data: [],
  title: 'Doanh thu theo tháng trong năm'
})

const filterPeriods = [
  { value: 'NGAY', label: 'NGÀY', icon: '📅' },
  { value: 'TUAN', label: 'TUẦN', icon: '📈' },
  { value: 'THANG', label: 'THÁNG', icon: '📊' },
  { value: 'NAM', label: 'NĂM', icon: '🎯' },
  { value: 'TUY_CHINH', label: 'TÙY CHỈNH', icon: '⚙️' }
]

// Computed properties for chart
const currentChartData = computed(() => {
  return chartData.value
})

const currentChartTitle = computed(() => {
  return chartData.value.title
})

const currentChartSubtitle = computed(() => {
  const periodLabels = {
    'NGAY': 'hôm nay',
    'TUAN': 'tuần này', 
    'THANG': 'tháng này',
    'NAM': 'các năm gần đây',
    'TUY_CHINH': `từ ${fromDate.value} đến ${toDate.value}`
  }
  const currentPeriod = selectedPeriod.value === 'TUY_CHINH' ? 'TUY_CHINH' : selectedPeriod.value
  return `Phân tích xu hướng ${periodLabels[currentPeriod] || 'tháng này'}`
})

// Key Metrics
const totalRevenue = computed(() => keyMetrics.value.totalRevenue)
const totalOrders = computed(() => keyMetrics.value.totalOrders)
const totalProducts = computed(() => keyMetrics.value.totalProducts)
const newCustomers = computed(() => keyMetrics.value.newCustomers)
const pendingOrders = computed(() => quickStatsData.value.pendingOrders)
const lowStockProducts = computed(() => quickStatsData.value.lowStockProducts)
const vipCustomers = computed(() => quickStatsData.value.vipCustomers)

// Computed properties for API data
const orderStatus = computed(() => orderStatusData.value)
const todayStats = computed(() => timeBasedStats.value.today)
const weekStats = computed(() => timeBasedStats.value.week)
const monthStats = computed(() => timeBasedStats.value.month)
const yearStats = computed(() => timeBasedStats.value.year)
const topProducts = computed(() => topProductsData.value)

const salesChart = ref(null)
const statusChart = ref(null)

// API Methods
const loadKeyMetrics = async () => {
  try {
    loadingMetrics.value = true
    const response = await dashboardService.getKeyMetrics()
    keyMetrics.value = response
  } catch (error) {
    console.error('Error loading key metrics:', error)
  } finally {
    loadingMetrics.value = false
  }
}

const loadTimeBasedStats = async () => {
  try {
    const response = await dashboardService.getTimeBasedStats()
    timeBasedStats.value = response
  } catch (error) {
    console.error('Error loading time-based stats:', error)
  }
}

const loadTopProducts = async () => {
  try {
    loadingProducts.value = true
    const response = await dashboardService.getTopProducts()
    topProductsData.value = response
  } catch (error) {
    console.error('Error loading top products:', error)
  } finally {
    loadingProducts.value = false
  }
}

const loadOrderStatusDistribution = async () => {
  try {
    loadingOrderStatus.value = true
    const response = await dashboardService.getOrderStatusDistribution()
    orderStatusData.value = response
  } catch (error) {
    console.error('Error loading order status distribution:', error)
  } finally {
    loadingOrderStatus.value = false
  }
}

const loadQuickStats = async () => {
  try {
    const response = await dashboardService.getQuickStats()
    quickStatsData.value = response
  } catch (error) {
    console.error('Error loading quick stats:', error)
  }
}

const loadChartData = async (period = null, fromDate = null, toDate = null) => {
  try {
    loadingChart.value = true
    const currentPeriod = period || selectedPeriod.value
    const response = await dashboardService.getChartData(currentPeriod, fromDate, toDate)
    chartData.value = response
  } catch (error) {
    console.error('Error loading chart data:', error)
  } finally {
    loadingChart.value = false
  }
}

const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadKeyMetrics(),
      loadTimeBasedStats(),
      loadTopProducts(),
      loadOrderStatusDistribution(),
      loadQuickStats(),
      loadChartData()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', 'đ')
}

const refreshData = async () => {
  console.log('Refreshing dashboard data...')
  await loadAllData()
}

const exportData = () => {
  try {
    console.log('exportData function called - starting dashboard export')
    
    // Create dashboard summary data
    const dashboardData = [
      {
        'Chỉ số': 'Tổng doanh thu',
        'Giá trị': totalRevenue.value,
        'Đơn vị': 'VND',
        'Thay đổi': '+12.5%'
      },
      {
        'Chỉ số': 'Tổng đơn hàng',
        'Giá trị': totalOrders.value,
        'Đơn vị': 'Đơn',
        'Thay đổi': '+8.2%'
      },
      {
        'Chỉ số': 'Sản phẩm đang bán',
        'Giá trị': totalProducts.value,
        'Đơn vị': 'Sản phẩm',
        'Thay đổi': '+15.3%'
      },
      {
        'Chỉ số': 'Khách hàng mới',
        'Giá trị': newCustomers.value,
        'Đơn vị': 'Người',
        'Thay đổi': '+22.1%'
      },
      {
        'Chỉ số': 'Đơn hàng chờ xử lý',
        'Giá trị': pendingOrders.value,
        'Đơn vị': 'Đơn',
        'Thay đổi': '-3.5%'
      },
      {
        'Chỉ số': 'Sản phẩm sắp hết hàng',
        'Giá trị': lowStockProducts.value,
        'Đơn vị': 'Sản phẩm',
        'Thay đổi': '+5.2%'
      },
      {
        'Chỉ số': 'Khách hàng VIP',
        'Giá trị': vipCustomers.value,
        'Đơn vị': 'Người',
        'Thay đổi': '+18.7%'
      }
    ]
    
    console.log('Dashboard data prepared:', dashboardData)
    
    // Try Excel export first, with CSV fallback
    console.log('Attempting Excel export...')
    let result
    
    try {
      result = exportToExcel(
        dashboardData,
        'Dashboard_Summary',
        'Tổng quan Dashboard'
      )
      console.log('Excel export result:', result)
    } catch (xlsxError) {
      console.warn('Excel export failed, trying CSV fallback:', xlsxError)
      result = exportToCSV(dashboardData, 'Dashboard_Summary')
      console.log('CSV export result:', result)
    }
    
    console.log('Export result:', result)
    
    if (result && result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result ? result.message : 'Có lỗi xảy ra khi xuất file'}`)
    }
  } catch (error) {
    console.error('Error in dashboard exportData:', error)
    alert(`❌ Có lỗi xảy ra khi xuất file Dashboard: ${error.message}`)
  }
}

const changeChartType = () => {
  console.log('Changing chart type...')
}

const updateChart = () => {
  console.log('updateChart called, checking chart instance...')
  
  if (!chartInstance.value) {
    console.log('Chart instance is null/undefined')
    return
  }
  
  console.log('Chart instance exists:', !!chartInstance.value)
  console.log('Chart data exists:', !!chartInstance.value.data)
  console.log('Chart datasets exists:', !!chartInstance.value.data?.datasets)
  console.log('First dataset exists:', !!chartInstance.value.data?.datasets?.[0])

  if (!chartInstance.value.data || 
      !chartInstance.value.data.datasets || 
      chartInstance.value.data.datasets.length === 0) {
    console.log('Chart data structure is incomplete')
    return
  }

  const newData = currentChartData.value
  console.log('New data to apply:', newData)
  
  try {
    // Update chart data
    chartInstance.value.data.labels = [...newData.labels]
    chartInstance.value.data.datasets[0].data = [...newData.data]
    
    // Update chart with smooth animation
    chartInstance.value.update('active')
    
    console.log('Chart successfully updated for period:', selectedPeriod.value)
  } catch (error) {
    console.error('Error updating chart:', error)
    console.log('Chart instance details:', {
      hasData: !!chartInstance.value.data,
      hasDatasets: !!chartInstance.value.data?.datasets,
      datasetsLength: chartInstance.value.data?.datasets?.length,
      hasFirstDataset: !!chartInstance.value.data?.datasets?.[0],
      updateMethod: typeof chartInstance.value.update
    })
  }
}

// Watch for period changes and update chart automatically
watch(selectedPeriod, (newPeriod) => {
  console.log('Period changed to:', newPeriod)
  setTimeout(() => {
    updateChart()
  }, 50)
})

const applyFilters = async () => {
  console.log('Applying filters...', {
    period: selectedPeriod.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  })
  
  // Load new chart data based on filters
  await loadChartData(selectedPeriod.value, fromDate.value, toDate.value)
  
  // Update the chart with new data after a small delay to ensure chart is ready
  setTimeout(() => {
    updateChart()
  }, 100)
}

const resetFilters = () => {
  selectedPeriod.value = 'THANG'
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastWeek.toISOString().split('T')[0]
  
  // Update chart after reset with delay
  setTimeout(() => {
    updateChart()
  }, 100)
}

// Chart initialization
onMounted(async () => {
  // Load all dashboard data first
  await loadAllData()

  // Initialize sales trend chart with delay to ensure DOM is ready
  setTimeout(() => {
    if (salesChart.value) {
      try {
        const ctx = salesChart.value.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 400)
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)')
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')

        const initialData = currentChartData.value
        console.log('Initializing chart with data:', initialData)

        chartInstance.value = new Chart(salesChart.value, {
          type: 'line',
          data: {
            labels: initialData.labels,
            datasets: [{
              label: 'Doanh thu (triệu VND)',
              data: initialData.data,
              borderColor: '#4ade80',
              backgroundColor: gradient,
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#4ade80',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#6b7280'
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                },
                ticks: {
                  color: '#6b7280',
                  callback: function(value) {
                    return value + 'M'
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
        })
        
        console.log('Sales chart initialized successfully')
      } catch (error) {
        console.error('Error initializing sales chart:', error)
      }
    }

    // Initialize modern status chart
    if (statusChart.value) {
      try {
        const filteredStatuses = orderStatus.value.filter(s => s.count > 0)
        new Chart(statusChart.value, {
          type: 'doughnut',
          data: {
            labels: filteredStatuses.map(s => s.name),
            datasets: [{
              data: filteredStatuses.map(s => s.count),
              backgroundColor: filteredStatuses.map(s => s.color),
              borderWidth: 4,
              borderColor: '#ffffff',
              cutout: '70%',
              borderRadius: 12,
              borderJoinStyle: 'round',
              hoverBorderWidth: 6,
              hoverBorderColor: '#ffffff',
              hoverBackgroundColor: filteredStatuses.map(s => {
                // Make colors slightly lighter on hover
                const hex = s.color.replace('#', '')
                const r = parseInt(hex.substr(0, 2), 16)
                const g = parseInt(hex.substr(2, 2), 16)
                const b = parseInt(hex.substr(4, 2), 16)
                return `rgba(${r}, ${g}, ${b}, 0.8)`
              })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                borderWidth: 2,
                cornerRadius: 12,
                displayColors: true,
                padding: 12,
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 13,
                  weight: '500'
                },
                callbacks: {
                  title: function(context) {
                    return context[0].label
                  },
                  label: function(context) {
                    const value = context.parsed
                    const total = context.dataset.data.reduce((a, b) => a + b, 0)
                    const percentage = Math.round((value / total) * 100)
                    return ` ${value} đơn hàng (${percentage}%)`
                  }
                }
              }
            },
            animation: {
              animateRotate: true,
              duration: 1200,
              easing: 'easeInOutQuart'
            },
            hover: {
              animationDuration: 300
            },
            elements: {
              arc: {
                borderWidth: 0
              }
            }
          }
        })
        
        console.log('Status chart initialized successfully')
      } catch (error) {
        console.error('Error initializing status chart:', error)
      }
    }
  }, 200)

  // Set default dates
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastWeek.toISOString().split('T')[0]
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Dashboard-specific styles - headers now use global CSS */

/* btn-export styles are defined in globals.css */
.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* btn-excel now uses btn-export styling */

.btn-icon {
  font-size: 1.125rem;
}

/* Key Metrics Overview */
.metrics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.metric-card.revenue::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.metric-card.orders::before {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.metric-card.products::before {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.metric-card.customers::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.metric-icon {
  font-size: 1.75rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
}

.metric-trend {
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.metric-trend.positive {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
}

.metric-trend.neutral {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #6b7280;
}

.metric-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.metric-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.today::before {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

.stat-card.week::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.stat-card.month::before {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.stat-card.year::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stat-period {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.stat-content {
  flex: 1;
}

.stat-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.stat-change {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
}

.stat-change.neutral {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #6b7280;
}

.stat-details {
  display: grid;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 3px solid #e2e8f0;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

/* Modern Filter Section */
.modern-filter-section {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

/* Quick Filters */
.quick-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.quick-filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

.filter-icon {
  color: #4ade80;
}

.period-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.period-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  position: relative;
  overflow: hidden;
}

.period-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.6s ease;
}

.period-chip:hover::before {
  left: 100%;
}

.period-chip:hover {
  border-color: #4ade80;
  background: rgba(99, 102, 241, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.period-chip.active {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-color: #4ade80;
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.chip-icon {
  font-size: 1rem;
}

.chip-text {
  font-weight: 600;
}

/* Custom Date Filter */
.custom-date-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
}

.custom-toggle:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
  transform: translateY(-2px);
}

.custom-toggle.active {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-color: #f59e0b;
  color: white;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
}

.date-range-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.date-input-group {
  display: flex;
  flex-direction: column;
}

.modern-date-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.8125rem;
  background: white;
  transition: all 0.2s ease;
  min-width: 140px;
}

.modern-date-input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.date-separator {
  color: #f59e0b;
  padding: 0 0.25rem;
}

/* Filter Actions */
.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.filter-apply-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.filter-apply-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

.filter-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-reset-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

/* Main Analytics Section */
.main-analytics-section {
  margin-bottom: 2rem;
}

.main-analytics-section .analytics-card {
  height: 300px;
  max-height: 300px;
}

.main-analytics-section .analytics-card.large .card-body {
  height: 220px;
  overflow: hidden;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.left-column {
  display: flex;
  flex-direction: column;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Modern Status Chart Card */
.status-chart-card {
  height: auto;
  min-height: 420px;
}

.modern-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.modern-card-header {
  padding: 1.5rem 2rem 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(168, 85, 247, 0.03));
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.card-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
}

.title-icon {
  font-size: 1.5rem;
  color: white;
}

.title-text {
  flex: 1;
}

.modern-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.modern-card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.card-actions {
  display: flex;
  align-items: center;
}

.action-dot-btn {
  background: rgba(99, 102, 241, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-dot-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: scale(1.05);
}

.action-dot-btn .dot {
  width: 4px;
  height: 4px;
  background: #4ade80;
  border-radius: 50%;
}

.modern-card-body {
  padding: 1.5rem 2rem 2rem 2rem;
}

.status-overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modern-chart-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.modern-status-chart {
  width: 100% !important;
  height: 100% !important;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.chart-center-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.center-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 0.5rem;
  letter-spacing: 0.025em;
}

.status-breakdown {
  display: grid;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8));
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.breakdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--status-color, #e2e8f0);
  opacity: 0.6;
}

.breakdown-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 1));
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.breakdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.status-indicator {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.status-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.01em;
}

.breakdown-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-number {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-percentage {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid currentColor;
  min-width: 48px;
  text-align: center;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1.4fr 1fr;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .right-column {
    gap: 1rem;
  }
  
  .main-analytics-section .analytics-card {
    height: auto;
    max-height: none;
  }
  
  .main-analytics-section .analytics-card.large .card-body {
    height: auto;
  }
  
  .chart-wrapper {
    height: 200px;
  }
  
  .status-chart-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .status-chart-card {
    min-height: 380px;
  }
  
  .modern-chart-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .center-number {
    font-size: 2rem;
  }
  
  .modern-quick-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }
}

.analytics-card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease;
  height: 100%;
}

.analytics-card.large {
  /* Main chart card styles */
  display: flex;
  flex-direction: column;
  height: 260px;
  max-height: 260px;
}

.analytics-card.large .card-body {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 180px;
  overflow: hidden;
}

.analytics-card:hover {
  transform: translateY(-2px);
}

.card-header {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-icon {
  font-size: 1.125rem;
}

.card-body {
  padding: 0.75rem 1rem;
}

.chart-wrapper {
  position: relative;
  height: 140px;
  padding: 0 0.5rem;
}

.main-chart {
  width: 100% !important;
  height: 100% !important;
}

.status-chart {
  width: 100% !important;
  height: 100% !important;
}

/* Dashboard Grid - Now handled by content-grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
}

.view-all-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

/* Products List */
.products-list {
  display: grid;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.product-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.product-rank {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

.product-image {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ddd6fe, #c4b5fd);
  border-radius: 12px;
}

.image-placeholder {
  font-size: 1.5rem;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.product-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.product-price {
  font-weight: 700;
  color: #059669;
}

.product-sales {
  color: #6b7280;
}

.product-trend {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-indicator {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 700;
}

.trend-indicator.positive {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
}

/* Status Legend */
.status-legend {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.status-card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}

.status-chart-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-chart-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.chart-center-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.total-orders {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.total-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.legend-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.legend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}

.legend-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-count {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f2937;
}

.legend-percentage {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  min-width: 35px;
  text-align: right;
}

.legend-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

/* Quick Stats Section */
.quick-stats-section {
  margin-bottom: 2rem;
}

/* Modern Quick Stats */
.modern-quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
}

.modern-quick-stat-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 18px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.modern-quick-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.quick-card-background {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  opacity: 0.05;
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.target-card .quick-card-background {
  background: linear-gradient(135deg, #4ade80, #22c55e);
}

.pending-card .quick-card-background {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stock-card .quick-card-background {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.vip-card .quick-card-background {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.modern-quick-stat-card:hover .quick-card-background {
  opacity: 0.1;
  transform: translate(20px, -20px) scale(1.1);
}

.quick-card-content {
  position: relative;
  padding: 1.25rem 1.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.quick-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.quick-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.quick-icon-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.3s ease;
}

.modern-quick-stat-card:hover .quick-icon-wrapper::before {
  transform: rotate(45deg) translate(100%, 100%);
}

.quick-icon-wrapper.target {
  background: linear-gradient(135deg, #4ade80, #22c55e);
}

.quick-icon-wrapper.pending {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.quick-icon-wrapper.stock {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.quick-icon-wrapper.vip {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.quick-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: -0.01em;
  line-height: 1.3;
  flex: 1;
}

.quick-main-stat {
  font-size: 2rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1;
  letter-spacing: -0.02em;
}

.modern-progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modern-progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.modern-progress-fill {
  height: 100%;
  border-radius: 3px;
  position: relative;
  transition: width 0.6s ease;
}

.target-fill {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.modern-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.3;
  margin-top: 0.5rem;
}

.quick-action {
  margin-top: 0.5rem;
}

.modern-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: white;
  margin-top: auto;
}

.modern-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.modern-action-btn:hover::before {
  left: 100%;
}

.modern-action-btn.pending {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.modern-action-btn.pending:hover {
  background: linear-gradient(135deg, #e982f0, #f04462);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240, 147, 251, 0.6);
}

.modern-action-btn.stock {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

.modern-action-btn.stock:hover {
  background: linear-gradient(135deg, #3d9bfe, #00e1fe);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 172, 254, 0.6);
}

.modern-action-btn.vip {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.4);
}

.modern-action-btn.vip:hover {
  background: linear-gradient(135deg, #32d86a, #27e8c6);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(67, 233, 123, 0.6);
}

.modern-action-btn svg {
  transition: transform 0.2s ease;
}

.modern-action-btn:hover svg {
  transform: translateX(2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .metrics-overview {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-overview {
    grid-template-columns: 1fr;
  }
  
  .filter-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .quick-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .period-chips {
    justify-content: center;
  }
  
  .custom-date-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .date-range-inputs {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .product-details {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .modern-quick-stats {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1.5rem;
  }
  
  .metric-card,
  .stat-card,
  .analytics-card,
  .dashboard-card {
    padding: 1.5rem;
  }
  
  .filter-section {
    padding: 1.5rem;
  }
}

/* Loading Skeleton Styles */
.skeleton {
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

@keyframes skeleton-loading {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  background: #e2e8f0;
  border-radius: 12px;
}

.skeleton-trend {
  width: 60px;
  height: 24px;
  background: #e2e8f0;
  border-radius: 16px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-title {
  width: 80px;
  height: 14px;
  background: #e2e8f0;
  border-radius: 4px;
}

.skeleton-value {
  width: 120px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 4px;
}

.skeleton-subtitle {
  width: 100px;
  height: 14px;
  background: #e2e8f0;
  border-radius: 4px;
}

.skeleton-rank {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 50%;
}

.skeleton-image {
  width: 48px;
  height: 48px;
  background: #e2e8f0;
  border-radius: 12px;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-name {
  width: 60%;
  height: 14px;
  background: #e2e8f0;
  border-radius: 4px;
}

.skeleton-details {
  width: 40%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 4px;
}

.skeleton-trend-icon {
  width: 28px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 50%;
}

.skeleton-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.skeleton-chart-content {
  width: 90%;
  height: 80%;
  background: #e2e8f0;
  border-radius: 8px;
}
</style>

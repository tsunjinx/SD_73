import api from './api.js'

export const dashboardService = {
  // Key metrics - Spring Boot endpoint
  getKeyMetrics: () => {
    return api.get('/thong-ke/key-metrics')
  },

  // Revenue statistics by period - Spring Boot endpoint
  getRevenueByPeriod: (period = 'THANG', fromDate = null, toDate = null) => {
    const params = { period }
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    return api.get('/thong-ke/revenue-by-period', { params })
  },

  // Time-based statistics - Spring Boot endpoint
  getTimeBasedStats: () => {
    return api.get('/thong-ke/time-based-stats')
  },

  // Top selling products - Spring Boot endpoint
  getTopProducts: (limit = 5) => {
    return api.get('/thong-ke/top-products', { params: { limit } })
  },

  // Order status distribution - Spring Boot endpoint
  getOrderStatusDistribution: () => {
    return api.get('/thong-ke/order-status-distribution')
  },

  // Quick stats - Spring Boot endpoint
  getQuickStats: () => {
    return api.get('/thong-ke/quick-stats')
  },

  // Chart data for different periods - Spring Boot endpoint
  getChartData: (period = 'THANG', fromDate = null, toDate = null) => {
    const params = { period }
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    return api.get('/thong-ke/chart-data', { params })
  },

  // Additional Spring Boot endpoints for stats
  getProductStats: () => {
    return api.get('/san-pham-management/paging?page=0&size=5')
  },

  getCustomerStats: () => {
    return api.get('/khach-hang-management/paging?page=0&size=5')
  }
}
import api from './api.js'

export const dashboardService = {
  // Key metrics
  getKeyMetrics: () => {
    return api.get('/thong-ke/key-metrics')
  },

  // Revenue statistics by period
  getRevenueByPeriod: (period = 'THANG', fromDate = null, toDate = null) => {
    const params = { period }
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    return api.get('/thong-ke/revenue-by-period', { params })
  },

  // Time-based statistics (today, week, month, year)
  getTimeBasedStats: () => {
    return api.get('/thong-ke/time-based-stats')
  },

  // Top selling products
  getTopProducts: (limit = 5) => {
    return api.get('/thong-ke/top-products', { params: { limit } })
  },

  // Order status distribution
  getOrderStatusDistribution: () => {
    return api.get('/thong-ke/order-status-distribution')
  },

  // Quick stats (pending orders, low stock, VIP customers)
  getQuickStats: () => {
    return api.get('/thong-ke/quick-stats')
  },

  // Chart data for different periods
  getChartData: (period = 'THANG', fromDate = null, toDate = null) => {
    const params = { period }
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    return api.get('/thong-ke/chart-data', { params })
  }
}
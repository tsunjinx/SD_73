// System and Analytics Service (ERD: nhat_ky_hoat_dong, lich_su_gia)
import { createCRUDService } from './api.js'
import api from './api.js'

// Activity Logs Service (nhat_ky_hoat_dong)
const baseActivityService = createCRUDService('/activity-logs')

export const activityLogService = {
  ...baseActivityService,
  
  // Get logs by user
  getByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/activity-logs`, { params })
  },
  
  // Get logs by action type
  getByAction: (hanh_dong, params = {}) => {
    return api.get(`/activity-logs/action/${hanh_dong}`, { params })
  },
  
  // Get logs by date range
  getByDateRange: (tu_ngay, den_ngay, params = {}) => {
    return api.get('/activity-logs/date-range', {
      params: { tu_ngay, den_ngay, ...params }
    })
  },
  
  // Get recent activities
  getRecent: (limit = 50) => {
    return api.get('/activity-logs/recent', { 
      params: { limit } 
    })
  },
  
  // Log activity
  logActivity: (activityData) => {
    return api.post('/activity-logs', {
      ...activityData,
      thoi_gian: new Date().toISOString(),
      ip_address: activityData.ip_address || 'unknown'
    })
  },
  
  // Get user activity summary
  getUserSummary: (id_nguoi_dung, period = 'month') => {
    return api.get(`/users/${id_nguoi_dung}/activity-summary`, {
      params: { period }
    })
  },
  
  // Get system activity statistics
  getStatistics: (period = 'month') => {
    return api.get('/activity-logs/statistics', { 
      params: { period } 
    })
  },
  
  // Get most active users
  getMostActiveUsers: (period = 'month', limit = 10) => {
    return api.get('/activity-logs/most-active-users', {
      params: { period, limit }
    })
  },
  
  // Get activity by IP address
  getByIP: (ip_address, params = {}) => {
    return api.get('/activity-logs/by-ip', {
      params: { ip_address, ...params }
    })
  },
  
  // Search activities
  searchActivities: (query, params = {}) => {
    return api.get('/activity-logs/search', {
      params: { q: query, ...params }
    })
  },
  
  // Export activity logs
  export: (format = 'excel', params = {}) => {
    return api.get(`/activity-logs/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Get failed login attempts
  getFailedLogins: (hours = 24) => {
    return api.get('/activity-logs/failed-logins', {
      params: { hours }
    })
  },
  
  // Get security events
  getSecurityEvents: (params = {}) => {
    return api.get('/activity-logs/security-events', { params })
  },
  
  // Archive old logs
  archiveOldLogs: (days = 365) => {
    return api.post('/activity-logs/archive', { days })
  }
}

// Price History Service (lich_su_gia)
const basePriceHistoryService = createCRUDService('/price-history')

export const priceHistoryService = {
  ...basePriceHistoryService,
  
  // Get price history by product
  getByProduct: (id_san_pham, params = {}) => {
    return api.get(`/products/${id_san_pham}/price-history`, { params })
  },
  
  // Record price change
  recordPriceChange: (priceChangeData) => {
    return api.post('/price-history', priceChangeData)
  },
  
  // Get price changes by user
  getByUser: (nguoi_thay_doi, params = {}) => {
    return api.get(`/price-history/by-user/${nguoi_thay_doi}`, { params })
  },
  
  // Get price changes by date range
  getByDateRange: (tu_ngay, den_ngay, params = {}) => {
    return api.get('/price-history/date-range', {
      params: { tu_ngay, den_ngay, ...params }
    })
  },
  
  // Get recent price changes
  getRecent: (limit = 50) => {
    return api.get('/price-history/recent', { 
      params: { limit } 
    })
  },
  
  // Get price trends
  getPriceTrends: (id_san_pham, period = 'year') => {
    return api.get(`/products/${id_san_pham}/price-trends`, {
      params: { period }
    })
  },
  
  // Get products with frequent price changes
  getFrequentChanges: (days = 30, min_changes = 5) => {
    return api.get('/price-history/frequent-changes', {
      params: { days, min_changes }
    })
  },
  
  // Get price change statistics
  getStatistics: (period = 'month') => {
    return api.get('/price-history/statistics', { 
      params: { period } 
    })
  },
  
  // Get price comparison report
  getComparisonReport: (product_ids, period = 'month') => {
    return api.get('/price-history/comparison-report', {
      params: { product_ids: product_ids.join(','), period }
    })
  },
  
  // Get average price by period
  getAveragePrice: (id_san_pham, period = 'month') => {
    return api.get(`/products/${id_san_pham}/average-price`, {
      params: { period }
    })
  },
  
  // Export price history
  export: (format = 'excel', params = {}) => {
    return api.get(`/price-history/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Bulk update prices
  bulkUpdatePrices: (price_updates, ly_do) => {
    return api.post('/price-history/bulk-update', {
      updates: price_updates,
      ly_do
    })
  },
  
  // Schedule price changes
  schedulePriceChange: (schedule_data) => {
    return api.post('/price-history/schedule-change', schedule_data)
  },
  
  // Get scheduled price changes
  getScheduledChanges: () => {
    return api.get('/price-history/scheduled')
  },
  
  // Cancel scheduled price change
  cancelScheduledChange: (id) => {
    return api.delete(`/price-history/scheduled/${id}`)
  }
}

// System Analytics Service
export const analyticsService = {
  // Get dashboard overview
  getDashboardOverview: (period = 'month') => {
    return api.get('/analytics/dashboard', { 
      params: { period } 
    })
  },
  
  // Get sales analytics
  getSalesAnalytics: (period = 'month', filters = {}) => {
    return api.get('/analytics/sales', { 
      params: { period, ...filters } 
    })
  },
  
  // Get product analytics
  getProductAnalytics: (period = 'month') => {
    return api.get('/analytics/products', { 
      params: { period } 
    })
  },
  
  // Get customer analytics
  getCustomerAnalytics: (period = 'month') => {
    return api.get('/analytics/customers', { 
      params: { period } 
    })
  },
  
  // Get inventory analytics
  getInventoryAnalytics: () => {
    return api.get('/analytics/inventory')
  },
  
  // Get financial analytics
  getFinancialAnalytics: (period = 'month') => {
    return api.get('/analytics/financial', { 
      params: { period } 
    })
  },
  
  // Get real-time metrics
  getRealTimeMetrics: () => {
    return api.get('/analytics/real-time')
  },
  
  // Get performance metrics
  getPerformanceMetrics: (period = 'month') => {
    return api.get('/analytics/performance', { 
      params: { period } 
    })
  },
  
  // Get trend analysis
  getTrendAnalysis: (metric, period = 'year') => {
    return api.get('/analytics/trends', {
      params: { metric, period }
    })
  },
  
  // Generate custom report
  generateCustomReport: (report_config) => {
    return api.post('/analytics/custom-report', report_config, {
      responseType: 'blob'
    })
  }
}

// System Configuration Service
export const systemConfigService = {
  // Get system settings
  getSettings: () => {
    return api.get('/system/settings')
  },
  
  // Update system settings
  updateSettings: (settings) => {
    return api.put('/system/settings', settings)
  },
  
  // Get system info
  getSystemInfo: () => {
    return api.get('/system/info')
  },
  
  // Get system health
  getHealthCheck: () => {
    return api.get('/system/health')
  },
  
  // Get system logs
  getSystemLogs: (level = 'all', limit = 100) => {
    return api.get('/system/logs', {
      params: { level, limit }
    })
  },
  
  // Clear system cache
  clearCache: (cache_type = 'all') => {
    return api.post('/system/clear-cache', { cache_type })
  },
  
  // Backup database
  backupDatabase: () => {
    return api.post('/system/backup', {}, {
      responseType: 'blob'
    })
  },
  
  // Get backup list
  getBackupList: () => {
    return api.get('/system/backups')
  },
  
  // Restore backup
  restoreBackup: (backup_id) => {
    return api.post(`/system/restore/${backup_id}`)
  }
}

// Combined system service
export const systemService = {
  activityLogs: activityLogService,
  priceHistory: priceHistoryService,
  analytics: analyticsService,
  config: systemConfigService,
  
  // Get complete system dashboard
  getSystemDashboard: () => {
    return Promise.all([
      activityLogService.getStatistics('month'),
      priceHistoryService.getStatistics('month'),
      analyticsService.getDashboardOverview('month'),
      systemConfigService.getHealthCheck()
    ]).then(([activityStats, priceStats, overview, health]) => ({
      activity: activityStats,
      pricing: priceStats,
      overview,
      health
    }))
  },
  
  // Get system alerts
  getAlerts: () => {
    return Promise.all([
      activityLogService.getSecurityEvents({ limit: 5 }),
      systemConfigService.getHealthCheck(),
      activityLogService.getFailedLogins(24)
    ]).then(([securityEvents, health, failedLogins]) => ({
      security: securityEvents,
      health,
      failedLogins
    }))
  },
  
  // Log system activity
  logSystemActivity: (hanh_dong, mo_ta, id_nguoi_dung = null) => {
    return activityLogService.logActivity({
      id_nguoi_dung,
      hanh_dong,
      mo_ta,
      thoi_gian: new Date().toISOString()
    })
  }
}

export default systemService
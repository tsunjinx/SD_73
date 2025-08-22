// Discount Management Service (ERD: ma_giam_gia, phieu_giam_gia)
import { createCRUDService } from './api.js'
import api from './api.js'

// Discount Codes Service (ma_giam_gia)
const baseDiscountService = createCRUDService('/discount-codes')

export const discountService = {
  ...baseDiscountService,
  
  // Validate discount code
  validateCode: (ma_giam_gia, don_hang_tong = 0) => {
    return api.post('/discount-codes/validate', {
      ma_giam_gia,
      don_hang_tong
    })
  },
  
  // Apply discount code
  applyCode: (ma_giam_gia, don_hang_data) => {
    return api.post('/discount-codes/apply', {
      ma_giam_gia,
      ...don_hang_data
    })
  },
  
  // Get active discount codes
  getActive: (params = {}) => {
    return api.get('/discount-codes/active', { params })
  },
  
  // Get expired discount codes
  getExpired: (params = {}) => {
    return api.get('/discount-codes/expired', { params })
  },
  
  // Generate unique discount code
  generateCode: (pattern = 'AUTO') => {
    return api.post('/discount-codes/generate', { pattern })
  },
  
  // Get discount usage statistics
  getUsageStats: (id) => {
    return api.get(`/discount-codes/${id}/usage-stats`)
  },
  
  // Extend discount validity
  extendValidity: (id, ngay_ket_thuc_moi) => {
    return api.patch(`/discount-codes/${id}/extend`, {
      ngay_ket_thuc: ngay_ket_thuc_moi
    })
  },
  
  // Deactivate discount code
  deactivate: (id) => {
    return api.patch(`/discount-codes/${id}/deactivate`)
  },
  
  // Get discount codes by type
  getByType: (loai_giam_gia, params = {}) => {
    return api.get(`/discount-codes/type/${loai_giam_gia}`, { params })
  },
  
  // Export discount codes
  export: (format = 'excel', params = {}) => {
    return api.get(`/discount-codes/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Import discount codes
  import: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/discount-codes/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// User Vouchers Service (phieu_giam_gia)
const baseVoucherService = createCRUDService('/user-vouchers')

export const voucherService = {
  ...baseVoucherService,
  
  // Get vouchers by user
  getByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/vouchers`, { params })
  },
  
  // Get available vouchers for user
  getAvailableForUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/vouchers/available`, { params })
  },
  
  // Get used vouchers by user
  getUsedByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/vouchers/used`, { params })
  },
  
  // Distribute voucher to users
  distributeToUsers: (id_ma_giam_gia, user_ids, expires_at = null) => {
    return api.post('/user-vouchers/distribute', {
      id_ma_giam_gia,
      user_ids,
      expires_at
    })
  },
  
  // Distribute voucher to all users
  distributeToAll: (id_ma_giam_gia, user_criteria = {}) => {
    return api.post('/user-vouchers/distribute-all', {
      id_ma_giam_gia,
      criteria: user_criteria
    })
  },
  
  // Use voucher
  useVoucher: (id, don_hang_data) => {
    return api.post(`/user-vouchers/${id}/use`, don_hang_data)
  },
  
  // Mark voucher as used
  markAsUsed: (id, id_hoa_don) => {
    return api.patch(`/user-vouchers/${id}/mark-used`, { id_hoa_don })
  },
  
  // Get voucher usage statistics
  getUsageStatistics: (period = 'month') => {
    return api.get('/user-vouchers/usage-statistics', {
      params: { period }
    })
  },
  
  // Send voucher notification to user
  sendNotification: (id) => {
    return api.post(`/user-vouchers/${id}/send-notification`)
  },
  
  // Bulk send voucher notifications
  bulkSendNotifications: (voucher_ids) => {
    return api.post('/user-vouchers/bulk-send-notifications', {
      voucher_ids
    })
  },
  
  // Get voucher distribution report
  getDistributionReport: (id_ma_giam_gia, params = {}) => {
    return api.get(`/discount-codes/${id_ma_giam_gia}/distribution-report`, { params })
  }
}

// Campaign Service (for managing discount campaigns)
export const campaignService = {
  // Get all campaigns
  getAll: (params = {}) => {
    return api.get('/campaigns', { params })
  },
  
  // Create campaign
  create: (campaignData) => {
    return api.post('/campaigns', campaignData)
  },
  
  // Update campaign
  update: (id, campaignData) => {
    return api.put(`/campaigns/${id}`, campaignData)
  },
  
  // Delete campaign
  delete: (id) => {
    return api.delete(`/campaigns/${id}`)
  },
  
  // Get active campaigns
  getActive: (params = {}) => {
    return api.get('/campaigns/active', { params })
  },
  
  // Launch campaign
  launch: (id) => {
    return api.post(`/campaigns/${id}/launch`)
  },
  
  // Pause campaign
  pause: (id) => {
    return api.post(`/campaigns/${id}/pause`)
  },
  
  // Get campaign performance
  getPerformance: (id, period = 'campaign') => {
    return api.get(`/campaigns/${id}/performance`, {
      params: { period }
    })
  },
  
  // Get campaign participants
  getParticipants: (id, params = {}) => {
    return api.get(`/campaigns/${id}/participants`, { params })
  }
}

// Combined discount service
export const discountManagementService = {
  codes: discountService,
  vouchers: voucherService,
  campaigns: campaignService,
  
  // Get dashboard data
  getDashboardData: () => {
    return Promise.all([
      discountService.getActive({ limit: 5 }),
      voucherService.getUsageStatistics('month'),
      campaignService.getActive({ limit: 5 })
    ]).then(([activeCodes, voucherStats, activeCampaigns]) => ({
      activeCodes,
      voucherStats,
      activeCampaigns
    }))
  },
  
  // Create campaign with discount codes
  createCampaignWithCodes: (campaignData, discountCodes) => {
    return api.post('/campaigns/with-codes', {
      campaign: campaignData,
      discount_codes: discountCodes
    })
  }
}

export default discountService
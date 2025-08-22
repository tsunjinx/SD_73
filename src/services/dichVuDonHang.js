// Orders and Sales Service (ERD: hoa_don, hoa_don_chi_tiet, thanh_toan, hoa_don_tra, hoa_don_tra_chi_tiet)
import { createCRUDService } from './api.js'
import api from './api.js'

// Order Service (hoa_don + hoa_don_chi_tiet)
const baseOrderService = createCRUDService('/orders')

export const orderService = {
  ...baseOrderService,
  
  // Get orders with details and pagination
  getWithDetails: (params = {}) => {
    return api.get('/orders/with-details', { params })
  },
  
  // Get order by ID with full details
  getOrderDetails: (id) => {
    return api.get(`/orders/${id}/details`)
  },
  
  // Get orders by status
  getByStatus: (trang_thai, params = {}) => {
    return api.get(`/orders/status/${trang_thai}`, { params })
  },
  
  // Get orders by customer
  getByCustomer: (id_nguoi_dung, params = {}) => {
    return api.get(`/orders/customer/${id_nguoi_dung}`, { params })
  },
  
  // Get orders by date range
  getByDateRange: (ngay_tu, ngay_den, params = {}) => {
    return api.get('/orders/date-range', {
      params: { ngay_tu, ngay_den, ...params }
    })
  },
  
  // Create order from cart
  createFromCart: (orderData) => {
    return api.post('/orders/from-cart', orderData)
  },
  
  // Create POS order
  createPOSOrder: (orderData) => {
    return api.post('/orders/pos', orderData)
  },
  
  // Update order status
  updateStatus: (id, trang_thai, ghi_chu = '') => {
    return api.patch(`/orders/${id}/status`, { 
      trang_thai, 
      ghi_chu 
    })
  },
  
  // Update shipping address
  updateShippingAddress: (id, addressData) => {
    return api.patch(`/orders/${id}/shipping`, addressData)
  },
  
  // Apply discount to order
  applyDiscount: (id, ma_giam_gia) => {
    return api.patch(`/orders/${id}/discount`, { ma_giam_gia })
  },
  
  // Calculate order total
  calculateTotal: (orderItems, discountCode = null) => {
    return api.post('/orders/calculate-total', {
      items: orderItems,
      ma_giam_gia: discountCode
    })
  },
  
  // Get order statistics
  getStatistics: (period = 'month') => {
    return api.get('/orders/statistics', { 
      params: { period } 
    })
  },
  
  // Get sales report
  getSalesReport: (params = {}) => {
    return api.get('/orders/sales-report', { params })
  },
  
  // Export orders
  export: (format = 'excel', params = {}) => {
    return api.get(`/orders/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Generate invoice PDF
  generateInvoice: (id) => {
    return api.get(`/orders/${id}/invoice`, {
      responseType: 'blob'
    })
  },
  
  // Send order confirmation email
  sendConfirmationEmail: (id) => {
    return api.post(`/orders/${id}/send-confirmation`)
  },
  
  // Track order status
  trackOrder: (id) => {
    return api.get(`/orders/${id}/tracking`)
  }
}

// Order Items Service (hoa_don_chi_tiet)
export const orderItemService = {
  // Get items by order
  getByOrder: (id_hoa_don) => {
    return api.get(`/orders/${id_hoa_don}/items`)
  },
  
  // Add item to order
  addItem: (id_hoa_don, itemData) => {
    return api.post(`/orders/${id_hoa_don}/items`, itemData)
  },
  
  // Update item quantity
  updateItem: (id, itemData) => {
    return api.put(`/order-items/${id}`, itemData)
  },
  
  // Remove item from order
  removeItem: (id) => {
    return api.delete(`/order-items/${id}`)
  },
  
  // Get item details
  getItemDetails: (id) => {
    return api.get(`/order-items/${id}`)
  }
}

// Payment Service (thanh_toan)
const basePaymentService = createCRUDService('/payments')

export const paymentService = {
  ...basePaymentService,
  
  // Get payments by order
  getByOrder: (id_hoa_don) => {
    return api.get(`/orders/${id_hoa_don}/payments`)
  },
  
  // Process payment
  processPayment: (paymentData) => {
    return api.post('/payments/process', paymentData)
  },
  
  // Process cash payment
  processCashPayment: (id_hoa_don, so_tien, tien_thua = 0) => {
    return api.post('/payments/cash', {
      id_hoa_don,
      so_tien,
      tien_thua,
      phuong_thuc: 'cash'
    })
  },
  
  // Process card payment
  processCardPayment: (paymentData) => {
    return api.post('/payments/card', paymentData)
  },
  
  // Process online payment (VNPay, MoMo, etc.)
  processOnlinePayment: (paymentData) => {
    return api.post('/payments/online', paymentData)
  },
  
  // Verify payment status
  verifyPayment: (ma_giao_dich) => {
    return api.get(`/payments/verify/${ma_giao_dich}`)
  },
  
  // Refund payment
  refundPayment: (id, so_tien_hoan, ly_do) => {
    return api.post(`/payments/${id}/refund`, {
      so_tien_hoan,
      ly_do
    })
  },
  
  // Get payment statistics
  getStatistics: (period = 'month') => {
    return api.get('/payments/statistics', { 
      params: { period } 
    })
  },
  
  // Get payment methods report
  getMethodsReport: (params = {}) => {
    return api.get('/payments/methods-report', { params })
  }
}

// Returns Service (hoa_don_tra + hoa_don_tra_chi_tiet)
const baseReturnService = createCRUDService('/returns')

export const returnService = {
  ...baseReturnService,
  
  // Get returns with details
  getWithDetails: (params = {}) => {
    return api.get('/returns/with-details', { params })
  },
  
  // Get return by order
  getByOrder: (id_hoa_don) => {
    return api.get(`/orders/${id_hoa_don}/returns`)
  },
  
  // Create return request
  createReturn: (returnData) => {
    return api.post('/returns/create', returnData)
  },
  
  // Process return
  processReturn: (id, action = 'approve', ghi_chu = '') => {
    return api.patch(`/returns/${id}/process`, {
      action,
      ghi_chu
    })
  },
  
  // Get return details
  getReturnDetails: (id) => {
    return api.get(`/returns/${id}/details`)
  },
  
  // Update return status
  updateReturnStatus: (id, trang_thai, ghi_chu = '') => {
    return api.patch(`/returns/${id}/status`, {
      trang_thai,
      ghi_chu
    })
  },
  
  // Calculate return amount
  calculateReturnAmount: (returnItems) => {
    return api.post('/returns/calculate-amount', {
      items: returnItems
    })
  },
  
  // Get return statistics
  getStatistics: (period = 'month') => {
    return api.get('/returns/statistics', { 
      params: { period } 
    })
  },
  
  // Export returns
  export: (format = 'excel', params = {}) => {
    return api.get(`/returns/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  }
}

// Return Items Service (hoa_don_tra_chi_tiet)
export const returnItemService = {
  // Get items by return
  getByReturn: (id_hoa_don_tra) => {
    return api.get(`/returns/${id_hoa_don_tra}/items`)
  },
  
  // Add item to return
  addItem: (id_hoa_don_tra, itemData) => {
    return api.post(`/returns/${id_hoa_don_tra}/items`, itemData)
  },
  
  // Update return item
  updateItem: (id, itemData) => {
    return api.put(`/return-items/${id}`, itemData)
  },
  
  // Remove item from return
  removeItem: (id) => {
    return api.delete(`/return-items/${id}`)
  }
}

// Combined sales service
export const salesService = {
  orders: orderService,
  orderItems: orderItemService,
  payments: paymentService,
  returns: returnService,
  returnItems: returnItemService,
  
  // Get complete sales dashboard data
  getDashboardData: (period = 'month') => {
    return Promise.all([
      orderService.getStatistics(period),
      paymentService.getStatistics(period),
      returnService.getStatistics(period)
    ]).then(([orderStats, paymentStats, returnStats]) => ({
      orders: orderStats,
      payments: paymentStats,
      returns: returnStats
    }))
  },
  
  // Get sales summary
  getSalesSummary: (ngay_tu, ngay_den) => {
    return api.get('/sales/summary', {
      params: { ngay_tu, ngay_den }
    })
  }
}

export default orderService
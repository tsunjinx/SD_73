// Inventory Management Service (ERD: phieu_nhap, phieu_nhap_chi_tiet)
import { createCRUDService } from './api.js'
import api from './api.js'

// Import Receipt Service (phieu_nhap)
const baseImportService = createCRUDService('/import-receipts')

export const importReceiptService = {
  ...baseImportService,
  
  // Get import receipts with details
  getWithDetails: (params = {}) => {
    return api.get('/import-receipts/with-details', { params })
  },
  
  // Get import receipt details
  getReceiptDetails: (id) => {
    return api.get(`/import-receipts/${id}/details`)
  },
  
  // Create import receipt
  createReceipt: (receiptData) => {
    return api.post('/import-receipts', receiptData)
  },
  
  // Update receipt status
  updateStatus: (id, trang_thai, ghi_chu = '') => {
    return api.patch(`/import-receipts/${id}/status`, { 
      trang_thai, 
      ghi_chu 
    })
  },
  
  // Approve import receipt
  approveReceipt: (id, approved_by) => {
    return api.patch(`/import-receipts/${id}/approve`, { approved_by })
  },
  
  // Reject import receipt
  rejectReceipt: (id, reason, rejected_by) => {
    return api.patch(`/import-receipts/${id}/reject`, { 
      reason, 
      rejected_by 
    })
  },
  
  // Get receipts by status
  getByStatus: (trang_thai, params = {}) => {
    return api.get(`/import-receipts/status/${trang_thai}`, { params })
  },
  
  // Get receipts by supplier
  getBySupplier: (nha_cung_cap, params = {}) => {
    return api.get('/import-receipts/supplier', { 
      params: { nha_cung_cap, ...params } 
    })
  },
  
  // Get receipts by date range
  getByDateRange: (ngay_tu, ngay_den, params = {}) => {
    return api.get('/import-receipts/date-range', {
      params: { ngay_tu, ngay_den, ...params }
    })
  },
  
  // Get pending receipts
  getPending: (params = {}) => {
    return api.get('/import-receipts/pending', { params })
  },
  
  // Get receipts created by user
  getByCreator: (id_nguoi_tao, params = {}) => {
    return api.get(`/import-receipts/creator/${id_nguoi_tao}`, { params })
  },
  
  // Calculate receipt total
  calculateTotal: (receiptItems) => {
    return api.post('/import-receipts/calculate-total', {
      items: receiptItems
    })
  },
  
  // Generate receipt code
  generateCode: () => {
    return api.post('/import-receipts/generate-code')
  },
  
  // Get import statistics
  getStatistics: (period = 'month') => {
    return api.get('/import-receipts/statistics', { 
      params: { period } 
    })
  },
  
  // Export receipts
  export: (format = 'excel', params = {}) => {
    return api.get(`/import-receipts/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Get suppliers list
  getSuppliers: () => {
    return api.get('/import-receipts/suppliers')
  },
  
  // Add new supplier
  addSupplier: (supplierData) => {
    return api.post('/import-receipts/suppliers', supplierData)
  },
  
  // Process receipt and update inventory
  processReceipt: (id) => {
    return api.post(`/import-receipts/${id}/process`)
  }
}

// Import Receipt Items Service (phieu_nhap_chi_tiet)
export const importItemService = {
  // Get items by receipt
  getByReceipt: (id_phieu_nhap) => {
    return api.get(`/import-receipts/${id_phieu_nhap}/items`)
  },
  
  // Add item to receipt
  addItem: (id_phieu_nhap, itemData) => {
    return api.post(`/import-receipts/${id_phieu_nhap}/items`, itemData)
  },
  
  // Update receipt item
  updateItem: (id, itemData) => {
    return api.put(`/import-items/${id}`, itemData)
  },
  
  // Remove item from receipt
  removeItem: (id) => {
    return api.delete(`/import-items/${id}`)
  },
  
  // Get item details
  getItemDetails: (id) => {
    return api.get(`/import-items/${id}`)
  },
  
  // Bulk add items to receipt
  bulkAddItems: (id_phieu_nhap, items) => {
    return api.post(`/import-receipts/${id_phieu_nhap}/items/bulk`, {
      items
    })
  },
  
  // Import items from file
  importFromFile: (id_phieu_nhap, file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post(`/import-receipts/${id_phieu_nhap}/items/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Inventory Tracking Service
export const inventoryService = {
  // Get current inventory levels
  getCurrentLevels: (params = {}) => {
    return api.get('/inventory/current-levels', { params })
  },
  
  // Get low stock products
  getLowStock: (threshold = 10) => {
    return api.get('/inventory/low-stock', { 
      params: { threshold } 
    })
  },
  
  // Get out of stock products
  getOutOfStock: () => {
    return api.get('/inventory/out-of-stock')
  },
  
  // Get inventory movements
  getMovements: (params = {}) => {
    return api.get('/inventory/movements', { params })
  },
  
  // Get inventory by product
  getByProduct: (id_san_pham) => {
    return api.get(`/inventory/product/${id_san_pham}`)
  },
  
  // Update product stock
  updateStock: (id_san_pham, adjustment_data) => {
    return api.post(`/inventory/product/${id_san_pham}/adjust`, adjustment_data)
  },
  
  // Bulk update stock levels
  bulkUpdateStock: (stock_updates) => {
    return api.post('/inventory/bulk-update', { updates: stock_updates })
  },
  
  // Get inventory valuation
  getValuation: (valuation_method = 'FIFO') => {
    return api.get('/inventory/valuation', {
      params: { method: valuation_method }
    })
  },
  
  // Generate inventory report
  generateReport: (report_type, params = {}) => {
    return api.get(`/inventory/reports/${report_type}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Get inventory turnover
  getTurnover: (period = 'year') => {
    return api.get('/inventory/turnover', { 
      params: { period } 
    })
  },
  
  // Get ABC analysis
  getABCAnalysis: () => {
    return api.get('/inventory/abc-analysis')
  },
  
  // Set reorder points
  setReorderPoints: (reorder_data) => {
    return api.post('/inventory/reorder-points', reorder_data)
  },
  
  // Get reorder suggestions
  getReorderSuggestions: () => {
    return api.get('/inventory/reorder-suggestions')
  },
  
  // Physical inventory count
  startPhysicalCount: (count_data) => {
    return api.post('/inventory/physical-count/start', count_data)
  },
  
  // Submit count results
  submitCountResults: (count_id, results) => {
    return api.post(`/inventory/physical-count/${count_id}/results`, {
      results
    })
  },
  
  // Get count discrepancies
  getCountDiscrepancies: (count_id) => {
    return api.get(`/inventory/physical-count/${count_id}/discrepancies`)
  },
  
  // Approve count adjustments
  approveCountAdjustments: (count_id) => {
    return api.post(`/inventory/physical-count/${count_id}/approve`)
  }
}

// Warehouse Management Service
export const warehouseService = {
  // Get warehouse locations
  getLocations: () => {
    return api.get('/warehouse/locations')
  },
  
  // Create warehouse location
  createLocation: (locationData) => {
    return api.post('/warehouse/locations', locationData)
  },
  
  // Update location
  updateLocation: (id, locationData) => {
    return api.put(`/warehouse/locations/${id}`, locationData)
  },
  
  // Get products by location
  getProductsByLocation: (location_id) => {
    return api.get(`/warehouse/locations/${location_id}/products`)
  },
  
  // Move products between locations
  moveProducts: (movement_data) => {
    return api.post('/warehouse/move-products', movement_data)
  },
  
  // Get movement history
  getMovementHistory: (params = {}) => {
    return api.get('/warehouse/movements', { params })
  }
}

// Combined inventory service
export const inventoryManagementService = {
  imports: importReceiptService,
  importItems: importItemService,
  inventory: inventoryService,
  warehouse: warehouseService,
  
  // Get inventory dashboard data
  getDashboardData: () => {
    return Promise.all([
      importReceiptService.getStatistics('month'),
      inventoryService.getCurrentLevels({ summary: true }),
      inventoryService.getLowStock(),
      inventoryService.getOutOfStock()
    ]).then(([importStats, currentLevels, lowStock, outOfStock]) => ({
      imports: importStats,
      levels: currentLevels,
      lowStock,
      outOfStock
    }))
  },
  
  // Create complete import workflow
  createImportWorkflow: (receiptData, items) => {
    return api.post('/inventory/import-workflow', {
      receipt: receiptData,
      items
    })
  },
  
  // Get inventory alerts
  getAlerts: () => {
    return Promise.all([
      inventoryService.getLowStock(),
      inventoryService.getOutOfStock(),
      importReceiptService.getPending({ limit: 5 })
    ]).then(([lowStock, outOfStock, pendingImports]) => ({
      lowStock,
      outOfStock,
      pendingImports
    }))
  }
}

export default inventoryManagementService
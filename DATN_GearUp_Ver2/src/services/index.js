// Central export file for all API services
// This file provides easy access to all services in the GearUp application

// Base API configuration
export { default as api, authService, uploadService, createCRUDService } from './api.js'

// User Management Services (ERD: nguoi_dung)
export { 
  default as userService, 
  userService, 
  employeeService, 
  customerService 
} from './userService.js'

// Product Management Services (ERD: san_pham, bien_the_san_pham, hinh_anh_san_pham)
export { 
  default as productService, 
  productService, 
  productVariantService, 
  productImageService 
} from './productService.js'

// Product Attributes Services (ERD: danh_muc, thuong_hieu, mau_sac, kich_thuoc)
export { 
  default as attributeService,
  attributeService,
  categoryService, 
  brandService, 
  colorService, 
  sizeService 
} from './attributeService.js'

// Order and Sales Services (ERD: hoa_don, hoa_don_chi_tiet, thanh_toan, hoa_don_tra, hoa_don_tra_chi_tiet)
export { 
  default as orderService,
  orderService,
  orderItemService,
  paymentService,
  returnService,
  returnItemService,
  salesService
} from './orderService.js'

// Discount and Promotion Services (ERD: ma_giam_gia, phieu_giam_gia)
export { 
  default as discountService,
  discountService,
  voucherService,
  campaignService,
  discountManagementService
} from './discountService.js'

// Customer Engagement Services (ERD: gio_hang, yeu_thich, danh_gia, binh_luan)
export { 
  default as engagementService,
  engagementService,
  cartService,
  favoritesService,
  reviewsService,
  commentsService
} from './engagementService.js'

// Communication Services (ERD: thong_bao, lien_he)
export { 
  default as communicationService,
  communicationService,
  notificationService,
  contactService,
  emailService,
  smsService
} from './communicationService.js'

// Inventory Management Services (ERD: phieu_nhap, phieu_nhap_chi_tiet)
export { 
  default as inventoryManagementService,
  inventoryManagementService,
  importReceiptService,
  importItemService,
  inventoryService,
  warehouseService
} from './inventoryService.js'

// System and Analytics Services (ERD: nhat_ky_hoat_dong, lich_su_gia)
export { 
  default as systemService,
  systemService,
  activityLogService,
  priceHistoryService,
  analyticsService,
  systemConfigService
} from './systemService.js'

// Service collections organized by functional area
export const services = {
  // Authentication & Core
  auth: authService,
  upload: uploadService,
  
  // User Management
  users: userService,
  employees: employeeService,
  customers: customerService,
  
  // Product Management
  products: productService,
  productVariants: productVariantService,
  productImages: productImageService,
  
  // Product Attributes
  categories: categoryService,
  brands: brandService,
  colors: colorService,
  sizes: sizeService,
  
  // Sales & Orders
  orders: orderService,
  orderItems: orderItemService,
  payments: paymentService,
  returns: returnService,
  returnItems: returnItemService,
  
  // Marketing & Promotions
  discounts: discountService,
  vouchers: voucherService,
  campaigns: campaignService,
  
  // Customer Engagement
  cart: cartService,
  favorites: favoritesService,
  reviews: reviewsService,
  comments: commentsService,
  
  // Communication
  notifications: notificationService,
  contacts: contactService,
  emails: emailService,
  sms: smsService,
  
  // Inventory Management
  imports: importReceiptService,
  importItems: importItemService,
  inventory: inventoryService,
  warehouse: warehouseService,
  
  // System & Analytics
  activityLogs: activityLogService,
  priceHistory: priceHistoryService,
  analytics: analyticsService,
  systemConfig: systemConfigService
}

// Composite services for complex operations
export const compositeServices = {
  sales: salesService,
  engagement: engagementService,
  communication: communicationService,
  inventory: inventoryManagementService,
  discount: discountManagementService,
  system: systemService,
  attributes: attributeService
}

// Helper functions for common operations
export const serviceHelpers = {
  // Initialize all services with base URL
  initServices: (baseURL) => {
    api.defaults.baseURL = baseURL
    return services
  },
  
  // Get all dashboard data
  getDashboardData: async () => {
    try {
      const [sales, engagement, inventory, communication] = await Promise.all([
        salesService.getDashboardData(),
        engagementService.getDashboardData(),
        inventoryManagementService.getDashboardData(),
        communicationService.getDashboardData()
      ])
      
      return { sales, engagement, inventory, communication }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      throw error
    }
  },
  
  // Get all alerts/notifications
  getAllAlerts: async () => {
    try {
      const [inventory, system] = await Promise.all([
        inventoryManagementService.getAlerts(),
        systemService.getAlerts()
      ])
      
      return { inventory, system }
    } catch (error) {
      console.error('Error loading alerts:', error)
      throw error
    }
  },
  
  // Search across all entities
  globalSearch: async (query) => {
    try {
      const [products, users, orders] = await Promise.all([
        productService.search(query),
        userService.search(query),
        orderService.search?.(query) || Promise.resolve([])
      ])
      
      return { products, users, orders }
    } catch (error) {
      console.error('Error in global search:', error)
      throw error
    }
  }
}

// Export default services object
export default services
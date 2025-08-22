import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './styles/style.css'
import './styles/globals.css'
import App from './App.vue'

// Import pages
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'

// User Management (ERD: nguoi_dung)
import EmployeeManagement from './pages/management/EmployeeManagement.vue'
import CustomerManagement from './pages/management/CustomerManagement.vue'

// Product Management (ERD: san_pham, bien_the_san_pham, hinh_anh_san_pham)
import ProductManagement from './pages/management/ProductManagement.vue'

// Product Attributes (ERD: danh_muc, thuong_hieu, mau_sac, kich_thuoc)
import ProductTypes from './pages/products/ProductTypes.vue'
import ProductBrands from './pages/products/ProductBrands.vue'
import ProductColors from './pages/products/ProductColors.vue'
import ProductSizes from './pages/management/ProductSizes.vue'
import ProductMaterials from './pages/products/ProductMaterials.vue'

// Order Management (ERD: hoa_don, hoa_don_chi_tiet, thanh_toan)
import OrderManagement from './pages/management/OrderManagement.vue'
import POSSystem from './pages/sales/POSSystem.vue'

// Return Management (ERD: hoa_don_tra, hoa_don_tra_chi_tiet)
import ReturnsManagement from './pages/management/ReturnsManagement.vue'

// Discount Management (ERD: ma_giam_gia, phieu_giam_gia)
import DiscountCoupons from './pages/management/DiscountCoupons.vue'
import DiscountCampaigns from './pages/management/DiscountCampaigns.vue'
import UserVouchersManagement from './pages/management/UserVouchersManagement.vue'

// Customer Engagement (ERD: gio_hang, yeu_thich, danh_gia, binh_luan)
import CartManagement from './pages/management/CartManagement.vue'
import FavoritesManagement from './pages/management/FavoritesManagement.vue'
import ReviewsManagement from './pages/management/ReviewsManagement.vue'
import CommentsManagement from './pages/management/CommentsManagement.vue'

// Communication (ERD: thong_bao, lien_he)
import NotificationsManagement from './pages/management/NotificationsManagement.vue'
import ContactManagement from './pages/management/ContactManagement.vue'

// Inventory Management (ERD: phieu_nhap, phieu_nhap_chi_tiet)
import InventoryImportManagement from './pages/management/InventoryImportManagement.vue'

// System & Analytics (ERD: nhat_ky_hoat_dong, lich_su_gia)
import ActivityLogsManagement from './pages/management/ActivityLogsManagement.vue'
import PriceHistoryManagement from './pages/management/PriceHistoryManagement.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  
  // User Management
  { path: '/users/employees', component: EmployeeManagement },
  { path: '/users/customers', component: CustomerManagement },
  
  // Product Management
  { path: '/products', component: ProductManagement },
  { path: '/products/categories', component: ProductTypes },
  { path: '/products/brands', component: ProductBrands },
  { path: '/products/colors', component: ProductColors },
  { path: '/products/sizes', component: ProductSizes },
  { path: '/products/materials', component: ProductMaterials },
  
  // Sales & Orders
  { path: '/sales/pos', component: POSSystem },
  { path: '/sales/orders', component: OrderManagement },
  { path: '/sales/returns', component: ReturnsManagement },
  
  // Marketing & Promotions
  { path: '/marketing/discounts', component: DiscountCoupons },
  { path: '/marketing/campaigns', component: DiscountCampaigns },
  { path: '/marketing/vouchers', component: UserVouchersManagement },
  
  // Customer Engagement
  { path: '/customers/carts', component: CartManagement },
  { path: '/customers/favorites', component: FavoritesManagement },
  { path: '/customers/reviews', component: ReviewsManagement },
  { path: '/customers/comments', component: CommentsManagement },
  
  // Communication
  { path: '/communication/notifications', component: NotificationsManagement },
  { path: '/communication/contacts', component: ContactManagement },
  
  // Inventory
  { path: '/inventory/imports', component: InventoryImportManagement },
  
  // Analytics & System
  { path: '/analytics/price-history', component: PriceHistoryManagement },
  { path: '/system/activity-logs', component: ActivityLogsManagement },
  
  // Legacy routes (for compatibility)
  { path: '/orders', redirect: '/sales/orders' },
  { path: '/pos', redirect: '/sales/pos' },
  { path: '/employees', redirect: '/users/employees' },
  { path: '/customers', redirect: '/users/customers' },
  { path: '/discounts', redirect: '/marketing/discounts' },
  { path: '/returns', redirect: '/sales/returns' },
  { path: '/reviews', redirect: '/customers/reviews' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')

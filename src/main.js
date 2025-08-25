import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './styles/style.css'
import './styles/globals.css'
import App from './App.vue'

// Import pages
import Login from './pages/DangNhap.vue'
import Dashboard from './pages/BangDieuKhien.vue'

// User Management (ERD: nguoi_dung)
import EmployeeManagement from './pages/management/QuanLyNhanVien.vue'
import CustomerManagement from './pages/management/QuanLyKhachHang.vue'

// Product Management (ERD: san_pham, bien_the_san_pham, hinh_anh_san_pham)
import ProductManagement from './pages/management/QuanLySanPham.vue'

// Product Attributes (ERD: danh_muc, thuong_hieu, mau_sac, kich_thuoc)
import ProductTypes from './pages/products/LoaiSanPham.vue'
import ProductDetails from './pages/products/ChiTietSanPham.vue'

// Order Management (ERD: hoa_don, hoa_don_chi_tiet, thanh_toan)
import OrderManagement from './pages/management/QuanLyDonHang.vue'
import POSSystem from './pages/sales/HePOSBanHang.vue'

// Return Management (ERD: hoa_don_tra, hoa_don_tra_chi_tiet)
import ReturnsManagement from './pages/management/QuanLyTraHang.vue'

// Discount Management (ERD: ma_giam_gia, phieu_giam_gia)
import DiscountCoupons from './pages/management/PhieuGiamGia.vue'
import DiscountCampaigns from './pages/management/CampainGiamGia.vue'
import UserVouchersManagement from './pages/management/QuanLyPhieuNguoiDung.vue'

// Customer Engagement (ERD: gio_hang, yeu_thich, danh_gia, binh_luan)
import CartManagement from './pages/management/QuanLyGioHang.vue'
import FavoritesManagement from './pages/management/QuanLyYeuThich.vue'
import ReviewsManagement from './pages/management/QuanLyDanhGia.vue'
import CommentsManagement from './pages/management/QuanLyBinhLuan.vue'

// Communication (ERD: thong_bao, lien_he)
import NotificationsManagement from './pages/management/QuanLyThongBao.vue'
import ContactManagement from './pages/management/QuanLyLienHe.vue'

// Inventory Management (ERD: phieu_nhap, phieu_nhap_chi_tiet)
import InventoryImportManagement from './pages/management/QuanLyNhapKho.vue'

// System & Analytics (ERD: nhat_ky_hoat_dong, lich_su_gia)
import ActivityLogsManagement from './pages/management/QuanLyNhatKyHoatDong.vue'
import PriceHistoryManagement from './pages/management/QuanLyLichSuGia.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  
  // User Management
  { path: '/users/employees', component: EmployeeManagement },
  { path: '/users/customers', component: CustomerManagement },
  
  // Product Management
  { path: '/products', component: ProductManagement },
  { path: '/products/details', component: ProductDetails },
  { path: '/products/categories', component: ProductTypes },
  
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

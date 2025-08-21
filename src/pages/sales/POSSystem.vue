<template>
  <div class="pos-system">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Hệ thống bán hàng</h1>
          <p class="page-subtitle">Quản lý đơn hàng và thanh toán trực tiếp</p>
        </div>
        <div class="header-actions">
          <button class="btn-export" @click="showProductSearch = true">
            <span class="btn-icon">🔍</span>
            Tìm sản phẩm
          </button>
          <button class="btn-export" @click="createNewOrder">
            <span class="btn-icon">➕</span>
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Order Tabs -->
    <div class="modern-tabs-container">
      <div class="order-tabs">
        <div 
          v-for="order in orders" 
          :key="order.id"
          :class="['modern-tab', { active: currentOrderId === order.id }]"
          @click="switchOrder(order.id)"
        >
          <div class="tab-content">
            <div class="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-2V6a2 2 0 00-2-2h-4a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h6l2.29 2.29c.39.39 1.02.39 1.41 0L16 12h3a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <span class="tab-text">{{ order.name }}</span>
            <div class="tab-indicator"></div>
          </div>
          <button 
            v-if="orders.length > 1"
            class="modern-close-btn" 
            @click.stop="closeOrder(order.id)"
            title="Đóng đơn hàng"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <button class="add-tab-btn" @click="createNewOrder" title="Thêm đơn hàng mới">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="pos-content">
      <!-- Modern Product Section -->
      <div class="modern-product-section">
        <div class="modern-section-header">
          <div class="header-title-group">
            <div class="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-2V6a2 2 0 00-2-2h-4a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h6l2.29 2.29c.39.39 1.02.39 1.41 0L16 12h3a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <div class="title-text">
              <h3 class="section-title">Giỏ hàng</h3>
              <p class="section-subtitle">Quản lý sản phẩm trong đơn hàng</p>
            </div>
          </div>
          <div class="section-actions">
            <button class="action-btn secondary" @click="showProductSearch = true">
              <div class="btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
              </div>
              <span>Quét QR</span>
            </button>
            <button class="action-btn primary" @click="showProductSearch = true">
              <div class="btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span>Thêm SP</span>
            </button>
          </div>
        </div>

        <!-- Modern Cart Items -->
        <div class="modern-cart-items" v-if="currentOrder && currentOrder.items.length > 0">
          <div v-for="item in currentOrder.items" :key="item.id" class="modern-cart-item">
            <div class="discount-badge" v-if="item.discount > 0">
              <span class="discount-text">{{ item.discount }}% OFF</span>
            </div>
            
            <div class="item-checkbox">
              <label class="modern-checkbox">
                <input type="checkbox" v-model="item.selected">
                <span class="checkmark"></span>
              </label>
            </div>
            
            <div class="item-image">
              <div class="image-container">
                <img v-if="item.image" :src="item.image" :alt="item.name">
                <div v-else class="placeholder-image">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,6H16V4A2,2 0 0,0 14,2H10A2,2 0 0,0 8,4V6H4A1,1 0 0,0 3,7V8A1,1 0 0,0 4,9H5V19A3,3 0 0,0 8,22H16A3,3 0 0,0 19,19V9H20A1,1 0 0,0 21,8V7A1,1 0 0,0 20,6M10,4H14V6H10V4M17,19A1,1 0 0,1 16,20H8A1,1 0 0,1 7,19V9H17V19Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="item-details">
              <div class="item-header">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-meta">
                  <span class="item-size">Size {{ item.size }}</span>
                </div>
              </div>
              <div class="item-pricing">
                <span v-if="item.discount > 0" class="original-price">{{ formatCurrency(item.originalPrice) }}</span>
                <span class="current-price">{{ formatCurrency(item.price) }}</span>
              </div>
            </div>
            
            <div class="item-controls">
              <div class="quantity-section">
                <div class="quantity-controls">
                  <button @click="updateQuantity(item, -1)" class="modern-qty-btn minus">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H5v-2h14v2z"/>
                    </svg>
                  </button>
                  <div class="quantity-display">{{ item.quantity }}</div>
                  <button @click="updateQuantity(item, 1)" class="modern-qty-btn plus">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                </div>
                <div class="item-total">{{ formatCurrency(item.price * item.quantity) }}</div>
              </div>
              <button @click="removeItem(item)" class="modern-remove-btn" title="Xóa sản phẩm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Modern Empty State -->
        <div v-else class="modern-empty-cart">
          <div class="empty-animation">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5H5.21L4.27,3H1M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
              </svg>
            </div>
            <div class="empty-circles">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
              <div class="circle circle-3"></div>
            </div>
          </div>
          <div class="empty-content">
            <h3 class="empty-title">Giỏ hàng trống</h3>
            <p class="empty-subtitle">Thêm sản phẩm để bắt đầu tạo đơn hàng</p>
            <button class="modern-btn btn-primary" @click="showProductSearch = true">
              <div class="btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span>Thêm sản phẩm đầu tiên</span>
            </button>
          </div>
        </div>

        <!-- Modern Total Section -->
        <div class="modern-total-section" v-if="currentOrder">
          <div class="total-background"></div>
          <div class="total-content">
            <div class="total-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L8,5H11V14H13V5H16M18,23H6A2,2 0 0,1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z"/>
              </svg>
            </div>
            <div class="total-info">
              <span class="total-label">Tổng tiền hàng</span>
              <span class="total-amount">{{ formatCurrency(currentOrder.subtotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Customer Section -->
      <div class="modern-customer-section">
        <div class="modern-section-header">
          <div class="header-title-group">
            <div class="section-icon customer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
            </div>
            <div class="title-text">
              <h3 class="section-title">Khách hàng & Thanh toán</h3>
              <p class="section-subtitle">Thông tin khách hàng và xử lý thanh toán</p>
            </div>
          </div>
          <button class="action-btn primary" @click="showCustomerSearch = true">
            <div class="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <span>Chọn KH</span>
          </button>
        </div>

        <div class="customer-form">
          <!-- Customer Info Section -->
          <div class="customer-info-section">
            <div class="form-group">
              <label class="form-label">Tên Khách hàng</label>
              <input 
                type="text" 
                v-model="currentOrder.customer.name" 
                class="form-control"
                placeholder="Nhập tên khách hàng"
              >
            </div>
          </div>

          <!-- Discount Section -->
          <div class="discount-section">
            <h4 class="subsection-title">💰 Giảm giá & Khuyến mãi</h4>
            <div class="form-group">
              <label class="form-label">Phiếu giảm giá</label>
              <div class="coupon-input">
                <input 
                  type="text" 
                  v-model="currentOrder.couponCode" 
                  class="form-control"
                  placeholder="Nhập mã giảm giá"
                >
                <button class="btn btn-outline" @click="applyCoupon">Áp dụng</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Phần trăm giảm</label>
              <input 
                type="number" 
                v-model="currentOrder.discountPercent" 
                class="form-control"
                placeholder="0"
                min="0"
                max="100"
              >
            </div>
          </div>

          <!-- Shipping Section -->
          <div class="shipping-section">
            <h4 class="subsection-title">🚚 Giao hàng</h4>
            <div class="delivery-toggle">
              <label class="toggle-option">
                <input type="radio" value="pickup" v-model="currentOrder.deliveryType">
                <span>Nhận tại cửa hàng</span>
              </label>
              <label class="toggle-option">
                <input type="radio" value="delivery" v-model="currentOrder.deliveryType">
                <span>Giao hàng tận nơi</span>
              </label>
            </div>
            
            <div class="shipping-info" v-if="currentOrder.deliveryType === 'delivery'">
              <div class="delivery-service-selector">
                <label class="form-label">Đơn vị vận chuyển:</label>
                <div class="delivery-service-toggle">
                  <button 
                    v-for="service in deliveryServices" 
                    :key="service.code"
                    :class="['service-btn', { active: currentOrder.selectedDeliveryService === service.code }]"
                    @click="selectDeliveryService(service)"
                  >
                    <div class="service-logo">
                      <span class="service-text" :style="{ color: service.color }">{{ service.name }}</span>
                    </div>
                    <div class="service-info">
                      <div class="service-time">{{ service.deliveryTime }}</div>
                      <div class="service-fee">{{ formatCurrency(service.fee) }}</div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div class="selected-service-info" v-if="currentOrder.selectedDeliveryService">
                <div class="shipping-method">
                  <span>🚚 Đơn vị: {{ selectedService?.name }}</span>
                </div>
                <div class="estimated-delivery">
                  <span>📅 Thời gian: {{ selectedService?.deliveryTime }}</span>
                </div>
                <div class="shipping-fee">
                  <span>💰 Phí vận chuyển: {{ formatCurrency(selectedService?.fee || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="price-summary-section">
            <h4 class="subsection-title">📊 Tổng kết đơn hàng</h4>
            <div class="price-breakdown">
              <div class="price-row">
                <span>Tiền hàng</span>
                <span>{{ formatCurrency(currentOrder.subtotal) }}</span>
              </div>
              <div class="price-row">
                <span>Phí vận chuyển</span>
                <span>{{ formatCurrency(currentOrder.shippingFee) }}</span>
              </div>
              <div class="price-row">
                <span>Giảm giá</span>
                <span class="discount">-{{ formatCurrency(currentOrder.discount) }}</span>
              </div>
              <div class="price-row total">
                <span>Tổng số tiền</span>
                <span class="total-amount">{{ formatCurrency(currentOrder.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="payment-section">
            <h4 class="subsection-title">💳 Thanh toán</h4>
            <div class="payment-method">
              <label class="form-label">Khách thanh toán</label>
              <div class="payment-amount">
                <input 
                  type="number" 
                  v-model="currentOrder.paidAmount" 
                  class="form-control"
                  placeholder="Nhập số tiền khách thanh toán"
                >
              </div>
            </div>
            
            <div class="payment-details">
              <div class="detail-row">
                <span>Tiền thiếu</span>
                <span class="amount deficit">{{ formatCurrency(Math.max(0, currentOrder.total - currentOrder.paidAmount)) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn btn-primary btn-lg w-100" @click="confirmOrder">
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Search Modal -->
    <div v-if="showProductSearch" class="modal-overlay" @click="showProductSearch = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Tìm kiếm sản phẩm</h3>
          <button class="modal-close" @click="showProductSearch = false">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- Search and Filter -->
          <div class="search-section">
            <div class="search-bar">
              <input 
                type="text" 
                v-model="productSearchQuery" 
                class="form-control"
                placeholder="Tìm theo tên sản phẩm, mã và thuộc tính sản phẩm"
              >
            </div>
            
            <div class="price-range">
              <span>{{ formatCurrency(priceRange.min) }}</span>
              <input 
                type="range" 
                :min="priceRange.min" 
                :max="priceRange.max" 
                v-model="selectedPriceMax"
                class="price-slider"
              >
              <span>{{ formatCurrency(priceRange.max) }}</span>
            </div>

            <div class="filter-row">
              <select v-model="selectedCategory" class="form-control">
                <option value="">Danh mục: Tất cả</option>
                <option value="giay-the-thao">Giày thể thao</option>
                <option value="giay-luoi">Giày lười</option>
              </select>
              
              <select v-model="selectedBrand" class="form-control">
                <option value="">Màu sắc: Tất cả</option>
                <option value="blue">Xanh dương</option>
                <option value="gray">Xám</option>
              </select>
              
              <select v-model="selectedMaterial" class="form-control">
                <option value="">Chất liệu: Tất cả</option>
                <option value="leather">Da</option>
                <option value="fabric">Vải</option>
              </select>
              
              <select v-model="selectedSize" class="form-control">
                <option value="">Kích cỡ: Tất cả</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
              </select>
              
              <select v-model="selectedSole" class="form-control">
                <option value="">Đế giày: Tất cả</option>
                <option value="rubber">Cao su</option>
                <option value="leather">Da</option>
              </select>
              
              <select v-model="selectedBrandFilter" class="form-control">
                <option value="">Thương hiệu: Tất cả</option>
                <option value="balenciaga">Balenciaga</option>
                <option value="converse">Converse</option>
              </select>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="product-grid">
            <div v-for="product in filteredSearchProducts" :key="product.id" class="product-card">
              <div class="discount-label" v-if="product.discount > 0">45% OFF</div>
              <div class="product-image">
                <img v-if="product.image" :src="product.image" :alt="product.name">
                <div v-else class="placeholder-image">👟</div>
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p class="product-details">{{ product.code }} | {{ product.sole }} | {{ product.brand }}</p>
                <p class="product-specs">{{ product.color }} | {{ product.material }} | Size: {{ product.size }}</p>
                <div class="product-price">
                  <span v-if="product.discount > 0" class="original-price">{{ formatCurrency(product.originalPrice) }}</span>
                  <span class="current-price">{{ formatCurrency(product.price) }}</span>
                </div>
              </div>
              <div class="product-actions">
                <button class="btn btn-primary btn-sm" @click="addProductToCart(product)">
                  CHỌN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Search Modal -->
    <div v-if="showCustomerSearch" class="modal-overlay" @click="showCustomerSearch = false">
      <div class="modal-content customer-modal" @click.stop>
        <div class="modal-header">
          <h3>Tìm kiếm khách hàng</h3>
          <button class="modal-close" @click="showCustomerSearch = false">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="search-section">
            <input 
              type="text" 
              v-model="customerSearchQuery" 
              class="form-control"
              placeholder="Tìm kiếm tên hoặc số điện thoại hoặc email"
            >
            <button class="btn btn-primary" @click="searchCustomers">
              ➕ THÊM KHÁCH HÀNG
            </button>
          </div>

          <div class="customer-list">
            <table class="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Ngày sinh</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(customer, index) in filteredCustomers" :key="customer.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.birthDate }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.gender }}</td>
                  <td>
                    <span class="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm" @click="selectCustomer(customer)">
                      CHỌN
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data
const orders = ref([
  {
    id: 1,
    name: 'Đơn hàng 1 - HD13',
    items: [],
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    couponCode: '',
    discountPercent: 0,
    deliveryType: 'pickup',
    selectedDeliveryService: 'ghn',
    paidAmount: 0
  }
])

const currentOrderId = ref(1)
const showProductSearch = ref(false)
const showCustomerSearch = ref(false)
const productSearchQuery = ref('')
const customerSearchQuery = ref('')

// Filters
const selectedCategory = ref('')
const selectedBrand = ref('')
const selectedMaterial = ref('')
const selectedSize = ref('')
const selectedSole = ref('')
const selectedBrandFilter = ref('')
const selectedPriceMax = ref(3200000)

const priceRange = ref({
  min: 100000,
  max: 3200000
})

// Delivery services data
const deliveryServices = ref([
  {
    code: 'ghn',
    name: 'GHN',
    color: '#ff6b00',
    deliveryTime: '2-3 ngày',
    fee: 25000,
    description: 'Giao Hàng Nhanh'
  },
  {
    code: 'viettel',
    name: 'Viettel Post',
    color: '#e60012',
    deliveryTime: '3-4 ngày',
    fee: 20000,
    description: 'Viettel Post'
  },
  {
    code: 'best',
    name: 'Best Express',
    color: '#2e7d32',
    deliveryTime: '2-3 ngày',
    fee: 28000,
    description: 'Best Express'
  },
  {
    code: 'vnpost',
    name: 'VietnamPost',
    color: '#1976d2',
    deliveryTime: '4-5 ngày',
    fee: 15000,
    description: 'Bưu điện Việt Nam'
  }
])

// Mock data
const availableProducts = ref([
  {
    id: 1,
    name: 'Balen Grey 2023',
    code: 'PD12',
    brand: 'Balenciaga',
    color: 'Xám',
    material: 'Da',
    sole: 'Đế nhựa',
    size: '41',
    price: 137500,
    originalPrice: 250000,
    discount: 45,
    image: ''
  },
  {
    id: 2,
    name: 'Balen Grey 2023',
    code: 'PD13',
    brand: 'Balenciaga',
    color: 'Xám',
    material: 'Da',
    sole: 'Đế nhựa',
    size: '40',
    price: 231000,
    originalPrice: 420000,
    discount: 45,
    image: ''
  },
  {
    id: 3,
    name: 'Balen Grey 2023',
    code: 'PD11',
    brand: 'Balenciaga',
    color: 'Xám',
    material: 'Da',
    sole: 'Đế nhựa',
    size: '42',
    price: 302500,
    originalPrice: 550000,
    discount: 45,
    image: ''
  }
])

const customers = ref([
  {
    id: 1,
    name: 'Trần Minh Hà',
    email: 'tranminhha@gmail.com',
    phone: '0987654321',
    birthDate: '15/03/1995',
    gender: 'Nữ'
  },
  {
    id: 2,
    name: 'Phạm Quốc Việt',
    email: 'phamquocviet@gmail.com',
    phone: '0909876543',
    birthDate: '22/08/1992',
    gender: 'Nam'
  },
  {
    id: 3,
    name: 'Lê Thị Thanh Mai',
    email: 'lethithanhmai@gmail.com',
    phone: '0912345678',
    birthDate: '10/11/1998',
    gender: 'Nữ'
  },
  {
    id: 4,
    name: 'Hoàng Anh Tuấn',
    email: 'hoanganhtuan@gmail.com',
    phone: '0923456789',
    birthDate: '05/07/1990',
    gender: 'Nam'
  },
  {
    id: 5,
    name: 'Ngô Thị Bích Ngọc',
    email: 'ngothibichngoc@gmail.com',
    phone: '0934567890',
    birthDate: '18/12/1996',
    gender: 'Nữ'
  }
])

// Computed
const currentOrder = computed(() => {
  return orders.value.find(order => order.id === currentOrderId.value)
})

const selectedService = computed(() => {
  if (!currentOrder.value?.selectedDeliveryService) return null
  return deliveryServices.value.find(service => service.code === currentOrder.value.selectedDeliveryService)
})

const filteredSearchProducts = computed(() => {
  let filtered = availableProducts.value

  if (productSearchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(productSearchQuery.value.toLowerCase()) ||
      product.code.toLowerCase().includes(productSearchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    // Add category filtering logic
  }

  if (selectedBrandFilter.value) {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === selectedBrandFilter.value
    )
  }

  return filtered.filter(product => product.price <= selectedPriceMax.value)
})

const filteredCustomers = computed(() => {
  if (!customerSearchQuery.value) return customers.value

  return customers.value.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchQuery.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.value.toLowerCase()) ||
    customer.phone.includes(customerSearchQuery.value)
  )
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' VND')
}

const selectDeliveryService = (service) => {
  if (currentOrder.value) {
    currentOrder.value.selectedDeliveryService = service.code
    updateOrderTotals()
  }
}

const createNewOrder = () => {
  const newId = Math.max(...orders.value.map(o => o.id)) + 1
  const newOrder = {
    id: newId,
    name: `Đơn hàng ${orders.value.length + 1} - HD${10 + newId}`,
    items: [],
    customer: { name: '', email: '', phone: '' },
    couponCode: '',
    discountPercent: 0,
    deliveryType: 'pickup',
    selectedDeliveryService: 'ghn',
    paidAmount: 0
  }
  
  orders.value.push(newOrder)
  currentOrderId.value = newId
}

const switchOrder = (orderId) => {
  currentOrderId.value = orderId
}

const closeOrder = (orderId) => {
  if (orders.value.length > 1) {
    const index = orders.value.findIndex(o => o.id === orderId)
    orders.value.splice(index, 1)
    
    if (currentOrderId.value === orderId) {
      currentOrderId.value = orders.value[0].id
    }
  }
}

const addProductToCart = (product) => {
  const order = currentOrder.value
  const existingItem = order.items.find(item => 
    item.productId === product.id && item.size === product.size
  )
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    const newItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      size: product.size,
      quantity: 1,
      selected: true,
      image: product.image
    }
    order.items.push(newItem)
  }
  
  updateOrderTotals()
  showProductSearch.value = false
}

const updateQuantity = (item, change) => {
  item.quantity = Math.max(1, item.quantity + change)
  updateOrderTotals()
}

const removeItem = (item) => {
  const order = currentOrder.value
  const index = order.items.findIndex(i => i.id === item.id)
  if (index > -1) {
    order.items.splice(index, 1)
    updateOrderTotals()
  }
}

const updateOrderTotals = () => {
  const order = currentOrder.value
  if (!order) return

  order.subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate shipping fee based on delivery type and selected service
  if (order.deliveryType === 'delivery' && order.selectedDeliveryService) {
    const service = deliveryServices.value.find(s => s.code === order.selectedDeliveryService)
    order.shippingFee = service?.fee || 0
  } else {
    order.shippingFee = 0
  }
  
  order.discount = (order.subtotal * order.discountPercent) / 100
  order.total = order.subtotal + order.shippingFee - order.discount
}

const applyCoupon = () => {
  // Apply coupon logic
  if (currentOrder.value.couponCode === 'PGG2023') {
    currentOrder.value.discountPercent = 10
    updateOrderTotals()
  }
}

const selectCustomer = (customer) => {
  currentOrder.value.customer = { ...customer }
  showCustomerSearch.value = false
}

const searchCustomers = () => {
  // Search customers logic
}

const confirmOrder = () => {
  const order = currentOrder.value
  if (order.items.length === 0) {
    alert('Vui lòng thêm sản phẩm vào đơn hàng')
    return
  }
  
  if (!order.customer.name) {
    alert('Vui lòng nhập thông tin khách hàng')
    return
  }
  
  alert('Đơn hàng đã được tạo thành công!')
  
  // Reset current order
  order.items = []
  order.customer = { name: '', email: '', phone: '' }
  order.couponCode = ''
  order.discountPercent = 0
  order.deliveryType = 'pickup'
  order.selectedDeliveryService = 'ghn'
  order.paidAmount = 0
  updateOrderTotals()
}

// Watch for order changes
const { computed: watch } = computed

onMounted(() => {
  updateOrderTotals()
})
</script>

<style scoped>
.pos-system {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modern Header */
/* pos-header now uses global page-header styling */

/* header-content, page-title, page-subtitle, header-actions now use global CSS */

/* Modern buttons now use global btn-export styling */

/* btn-icon now uses global CSS */

/* Modern Order Tabs */
.modern-tabs-container {
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.order-tabs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.modern-tab {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.modern-tab:hover .tab-content {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-color: #0ea5e9;
  transform: translateY(-1px);
}

.modern-tab.active .tab-content {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border-color: #4ade80;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modern-tab.active .tab-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  transition: color 0.3s ease;
}

.modern-tab.active .tab-text {
  color: white;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.modern-tab.active .tab-indicator {
  transform: scaleX(1);
}

.modern-close-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.modern-tab:hover .modern-close-btn {
  opacity: 1;
}

.modern-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.add-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);
  margin-left: 0.5rem;
}

.add-tab-btn:hover {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.4);
}

/* POS Content */
.pos-content {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2rem;
  min-height: calc(100vh - 280px);
  max-height: calc(100vh - 280px);
}

/* Modern Product Section */
.modern-product-section {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.modern-product-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.modern-section-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.03), rgba(34, 197, 94, 0.03));
  border-bottom: 1px solid rgba(74, 222, 128, 0.1);
  position: relative;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
  transition: all 0.3s ease;
}

.section-icon.customer {
  background: linear-gradient(135deg, #4ade80, #16a34a);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
}

.section-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.4);
}

.action-btn.secondary {
  background: rgba(71, 85, 105, 0.1);
  color: #475569;
  border-color: rgba(71, 85, 105, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(71, 85, 105, 0.2);
  border-color: rgba(71, 85, 105, 0.3);
  transform: translateY(-2px);
}

/* Modern Cart Items */
.modern-cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modern-cart-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  transition: all 0.3s ease;
  animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modern-cart-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 1));
  border-color: rgba(74, 222, 128, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.discount-badge {
  position: absolute;
  top: -8px;
  left: 60px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  z-index: 10;
}

.discount-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.modern-checkbox {
  position: relative;
  cursor: pointer;
  display: block;
  width: 24px;
  height: 24px;
}

.modern-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.modern-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-color: #4ade80;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);
}

.modern-checkbox input:checked ~ .checkmark::after {
  display: block;
}

.image-container {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-container:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  color: #94a3b8;
  transition: color 0.3s ease;
}

.modern-cart-item:hover .placeholder-image {
  color: #4ade80;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-header {
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
}

.item-size {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.item-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.original-price {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.current-price {
  color: #059669;
  font-size: 1rem;
  font-weight: 700;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.modern-qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #64748b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modern-qty-btn:hover {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  transform: scale(1.1);
}

.modern-qty-btn.minus:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.quantity-display {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
}

.item-total {
  font-size: 0.875rem;
  font-weight: 700;
  color: #059669;
  text-align: center;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1));
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(5, 150, 105, 0.2);
}

.modern-remove-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  border: 2px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modern-remove-btn:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #dc2626;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Modern Empty State */
.modern-empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-animation {
  position: relative;
  margin-bottom: 2rem;
}

.empty-icon {
  color: #cbd5e1;
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.empty-circles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: -60px;
  left: -60px;
  animation-delay: 0s;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: -40px;
  left: -40px;
  animation-delay: 0.5s;
}

.circle-3 {
  width: 40px;
  height: 40px;
  top: -20px;
  left: -20px;
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

/* Modern Total Section */
.modern-total-section {
  position: relative;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05), rgba(34, 197, 94, 0.05));
  border-top: 1px solid rgba(74, 222, 128, 0.1);
}

.total-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
  opacity: 0.5;
}

.total-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
}

.total-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669;
  background: linear-gradient(135deg, #059669, #047857);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Modern Customer Section */
.modern-customer-section {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.modern-customer-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

/* Customer Form Sections */
.customer-form {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.customer-info-section,
.discount-section,
.price-summary-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8));
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .pos-content {
    grid-template-columns: 1fr;
    min-height: auto;
    max-height: none;
    gap: 1.5rem;
  }
  
  .modern-product-section,
  .modern-customer-section {
    height: auto;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .pos-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .modern-tabs-container {
    padding: 0.25rem;
  }
  
  .order-tabs {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .modern-tab .tab-content {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
  
  .tab-text {
    font-size: 0.8125rem;
  }
  
  .modern-section-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
  
  .modern-cart-items {
    padding: 1rem 1.5rem;
  }
  
  .modern-cart-item {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  .quantity-section {
    flex-direction: row;
    align-items: center;
  }
  
  .modern-empty-cart {
    padding: 2rem 1rem;
  }
  
  .empty-title {
    font-size: 1.25rem;
  }
  
  .modern-total-section {
    padding: 1rem 1.5rem;
  }
  
  .total-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .total-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  /* Responsive styles now handled by global CSS */
  
  .header-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .order-tabs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .add-tab-btn {
    width: 100%;
    height: 40px;
    margin-left: 0;
    margin-top: 0.5rem;
  }
  
  .modern-section-header {
    padding: 1rem;
  }
  
  .section-icon {
    width: 40px;
    height: 40px;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .action-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  .modern-cart-items {
    padding: 0.75rem 1rem;
  }
  
  .modern-cart-item {
    padding: 0.875rem;
  }
  
  .quantity-controls {
    padding: 0.125rem;
  }
  
  .modern-qty-btn {
    width: 28px;
    height: 28px;
  }
  
  .empty-animation {
    margin-bottom: 1.5rem;
  }
  
  .empty-icon svg {
    width: 60px;
    height: 60px;
  }
  
  .circle-1 {
    width: 100px;
    height: 100px;
    top: -50px;
    left: -50px;
  }
  
  .circle-2 {
    width: 70px;
    height: 70px;
    top: -35px;
    left: -35px;
  }
  
  .circle-3 {
    width: 35px;
    height: 35px;
    top: -17.5px;
    left: -17.5px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  color: var(--secondary-color);
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

/* Cart Items */
.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.cart-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.discount-badge {
  position: absolute;
  top: -8px;
  left: 60px;
  background-color: var(--success-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.item-checkbox {
  flex-shrink: 0;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  font-size: 1.5rem;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--secondary-color);
}

.item-price {
  margin: 0.25rem 0;
}

.original-price {
  text-decoration: line-through;
  color: var(--medium-gray);
  margin-right: 0.5rem;
}

.current-price {
  color: var(--primary-color);
  font-weight: bold;
}

.item-size, .item-sku {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--medium-gray);
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background-color: var(--light-gray);
}

.quantity {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  color: var(--primary-color);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.remove-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--medium-gray);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Total Section */
.total-section {
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.125rem;
  font-weight: bold;
}

.total-amount {
  color: var(--primary-color);
}

/* Customer Section */
.customer-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.customer-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.coupon-input {
  display: flex;
  gap: 0.5rem;
}

.coupon-input input {
  flex: 1;
}

/* Shipping Section */
.shipping-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.shipping-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
}

.delivery-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.toggle-option:hover {
  background-color: var(--light-gray);
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
}

.delivery-service-selector {
  margin-bottom: 1rem;
}

.delivery-service-toggle {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.service-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.service-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-btn.active {
  border-color: var(--primary-color);
  background-color: var(--primary-50);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.service-logo {
  margin-bottom: 0.25rem;
}

.service-text {
  font-weight: bold;
  font-size: 0.875rem;
  white-space: nowrap;
}

.service-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--medium-gray);
}

.service-time {
  font-weight: 500;
}

.service-fee {
  color: var(--success-color);
  font-weight: 600;
}

.selected-service-info {
  background-color: var(--gray-50);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid var(--primary-color);
}

.selected-service-info > div {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.selected-service-info > div:last-child {
  margin-bottom: 0;
}

/* Price Breakdown */
.price-breakdown {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.price-row.total {
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 1.125rem;
}

.discount {
  color: var(--success-color);
}

/* Payment Section */
.payment-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.payment-amount input {
  width: 120px;
  text-align: right;
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
}

.amount.deficit {
  color: var(--danger-color);
  font-weight: bold;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.large {
  max-width: 1200px;
}

.modal-content.customer-modal {
  max-width: 1200px;
  width: 92vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--secondary-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.modal-close:hover {
  background-color: var(--light-gray);
}

.modal-body {
  padding: 1.5rem;
}

/* Product Search Modal */
.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price-slider {
  flex: 1;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.product-card {
  position: relative;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.discount-label {
  position: absolute;
  top: -8px;
  left: 8px;
  background-color: var(--success-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.product-card .product-image {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.product-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--secondary-color);
}

.product-details,
.product-specs {
  font-size: 0.875rem;
  color: var(--medium-gray);
  margin: 0.25rem 0;
}

.product-price {
  margin: 0.5rem 0;
}

.product-actions {
  text-align: center;
  margin-top: 1rem;
}

/* Customer Search */
.customer-modal .search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.customer-modal .search-section input {
  flex: 1;
  min-width: 0;
}

.customer-list {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.customer-modal .table {
  width: 100%;
  table-layout: fixed;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.customer-modal .table th:nth-child(1) { width: 60px; }  /* STT */
.customer-modal .table th:nth-child(2) { width: 25%; }   /* Email */
.customer-modal .table th:nth-child(3) { width: 20%; }   /* Họ tên */
.customer-modal .table th:nth-child(4) { width: 15%; }   /* Ngày sinh */
.customer-modal .table th:nth-child(5) { width: 15%; }   /* SĐT */
.customer-modal .table th:nth-child(6) { width: 10%; }   /* Giới tính */
.customer-modal .table th:nth-child(7) { width: 10%; }   /* Trạng thái */
.customer-modal .table th:nth-child(8) { width: 100px; } /* Thao tác */

.customer-modal .table th {
  background-color: var(--gray-100);
  color: var(--secondary-color);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.customer-modal .table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.customer-modal .table tbody tr:hover {
  background-color: var(--gray-50);
}

.customer-modal .table tbody tr:last-child td {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .pos-content {
    grid-template-columns: 1fr;
    min-height: auto;
    max-height: none;
  }
  
  .product-section,
  .customer-section {
    height: auto;
    min-height: 400px;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  /* pos-header responsive styles now handled by global page-header CSS */
  
  .order-tabs {
    flex-wrap: wrap;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: center;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .customer-modal {
    width: 95vw;
    max-width: none;
  }
  
  .customer-modal .search-section {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .customer-modal .table {
    font-size: 0.8rem;
  }
  
  .customer-modal .table th,
  .customer-modal .table td {
    padding: 0.5rem;
  }
  
  /* Hide some columns on mobile for customer table */
  .customer-modal .table th:nth-child(4),
  .customer-modal .table td:nth-child(4),
  .customer-modal .table th:nth-child(6),
  .customer-modal .table td:nth-child(6) {
    display: none;
  }
  
  .delivery-toggle {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .delivery-service-toggle {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .service-btn {
    padding: 0.5rem 0.25rem;
  }
  
  .service-text {
    font-size: 0.75rem;
  }
}
</style>

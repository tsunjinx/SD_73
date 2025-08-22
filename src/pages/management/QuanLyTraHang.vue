<template>
  <div class="returns-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Đổi trả</h1>
          <p class="page-subtitle">Xử lý yêu cầu đổi trả sản phẩm từ khách hàng</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Làm mới
          </button>
          <button class="btn-export" @click="exportData">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-export" @click="exportReturnsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="scanQR">
            <span class="btn-icon">📱</span>
            Quét mã QR
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <div class="search-input">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Mã hóa đơn:" 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
        <button class="btn btn-primary" @click="searchOrder">TÌM KIẾM</button>
        <button class="btn btn-outline" @click="scanQR">📱 QUÉT MÃ</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!selectedOrder" class="empty-state">
      <div class="empty-illustration">
        <div class="delivery-truck">
          <div class="truck-body">
            <div class="truck-cabin"></div>
            <div class="truck-cargo">
              <div class="package">📦</div>
              <div class="package">📦</div>
            </div>
          </div>
          <div class="truck-wheels">
            <div class="wheel"></div>
            <div class="wheel"></div>
          </div>
        </div>
        <div class="delivery-person">👤</div>
      </div>
      <h3>TRẢ HÀNG</h3>
      <p>Nhập mã hóa đơn để bắt đầu quy trình trả hàng</p>
    </div>

    <!-- Return Form -->
    <div v-if="selectedOrder" class="return-form">
      <!-- Order Info -->
      <div class="order-info">
        <h3>Thông tin đơn hàng</h3>
        <div class="order-details">
          <div class="detail-item">
            <label>Mã đơn hàng:</label>
            <span>{{ selectedOrder.code }}</span>
          </div>
          <div class="detail-item">
            <label>Khách hàng:</label>
            <span>{{ selectedOrder.customerName }}</span>
          </div>
          <div class="detail-item">
            <label>Người nhận:</label>
            <span>{{ selectedOrder.receiverName || 'Địa chỉ 12' }}</span>
          </div>
          <div class="detail-item">
            <label>Địa chỉ:</label>
            <span>{{ selectedOrder.address || 'aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La' }}</span>
          </div>
        </div>
      </div>

      <!-- Return Products -->
      <div class="return-products">
        <h3>Chọn sản phẩm cần trả</h3>
        <div class="products-list">
          <div v-for="item in selectedOrder.items" :key="item.id" class="product-item">
            <div class="product-checkbox">
              <input 
                type="checkbox" 
                :id="'product-' + item.id"
                v-model="item.selected"
                @change="updateReturnTotal"
              >
            </div>
            <div class="product-image">
              <img v-if="item.image" :src="item.image" :alt="item.name">
              <div v-else class="placeholder-image">👟</div>
            </div>
            <div class="product-info">
              <h4>{{ item.name }}</h4>
              <p class="product-details">Size: {{ item.size }}</p>
              <p class="product-quantity">Số lượng: {{ item.quantity }} / {{ item.quantity }}</p>
            </div>
            <div class="product-controls">
              <div class="quantity-selector">
                <button 
                  @click="decreaseQuantity(item)" 
                  :disabled="!item.selected || item.returnQuantity <= 0"
                  class="qty-btn"
                >
                  -
                </button>
                <span class="quantity">{{ item.returnQuantity || 0 }}</span>
                <button 
                  @click="increaseQuantity(item)" 
                  :disabled="!item.selected || item.returnQuantity >= item.quantity"
                  class="qty-btn"
                >
                  +
                </button>
              </div>
              <div class="item-total">{{ formatCurrency(item.price) }}</div>
            </div>
          </div>
        </div>

        <!-- Return Summary -->
        <div v-if="hasSelectedItems" class="return-summary">
          <h4>🔄 Danh sách sản phẩm trả</h4>
          <div class="summary-items">
            <div v-for="item in selectedItems" :key="'return-' + item.id" class="summary-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-quantity">x{{ item.returnQuantity }}</span>
              <span class="item-price">{{ formatCurrency(item.price * item.returnQuantity) }}</span>
            </div>
          </div>
          
          <div class="summary-totals">
            <div class="total-row">
              <span>Tổng tiền</span>
              <span class="total-amount">{{ formatCurrency(returnTotal) }}</span>
            </div>
            <div class="total-row">
              <span>Giảm giá</span>
              <span class="discount-amount">{{ formatCurrency(returnDiscount) }}</span>
            </div>
            <div class="total-row final">
              <span>Số tiền hoàn trả</span>
              <span class="refund-amount">{{ formatCurrency(refundAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="customer-section">
          <h4>📋 Thông tin hoàn trả</h4>
          <div class="customer-info">
            <div class="info-item">
              <span class="info-label">👤 Khách hàng:</span>
              <span class="info-value">{{ selectedOrder.customerName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">👥 Người nhận:</span>
              <span class="info-value">{{ selectedOrder.receiverName || 'Địa chỉ 12' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📍 Địa chỉ:</span>
              <span class="info-value">{{ selectedOrder.address || 'aaaaa, Xã Mường Giàng, Huyện Quỳnh Nhai, Sơn La' }}</span>
            </div>
          </div>
          
          <div class="return-totals">
            <div class="total-item">
              <span>Tổng tiền:</span>
              <span class="amount">{{ formatCurrency(returnTotal) }}</span>
            </div>
            <div class="total-item">
              <span>Giảm giá:</span>
              <span class="amount discount">{{ formatCurrency(returnDiscount) }}</span>
            </div>
            <div class="total-item final">
              <span>Số tiền hoàn trả:</span>
              <span class="amount refund">{{ formatCurrency(refundAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="hasSelectedItems" class="action-buttons">
          <button class="btn btn-primary btn-lg" @click="processReturn">
            🔄 TRẢ HÀNG
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success" @click.stop>
        <div class="modal-body">
          <div class="success-icon">✅</div>
          <h3>Trả hàng thành công!</h3>
          <p>Số tiền hoàn trả: <strong>{{ formatCurrency(refundAmount) }}</strong></p>
          <button class="btn btn-primary" @click="resetForm">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { exportToExcel, formatDataForExcel } from '../../utils/xuatExcel.js'
import { 
  notifyOrderUpdated, 
  triggerCustomNotification,
  notifySystemReport 
} from '../../services/dichVuThongBao.js'

// Data
const searchQuery = ref('')
const selectedOrder = ref(null)
const showSuccessModal = ref(false)

const mockOrders = {}

// Computed
const hasSelectedItems = computed(() => {
  return selectedOrder.value?.items.some(item => item.selected && item.returnQuantity > 0)
})

const selectedItems = computed(() => {
  if (!selectedOrder.value) return []
  return selectedOrder.value.items.filter(item => item.selected && item.returnQuantity > 0)
})

const returnTotal = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.price * item.returnQuantity)
  }, 0)
})

const returnDiscount = computed(() => {
  if (!selectedOrder.value || returnTotal.value === 0) return 0
  
  // Calculate proportional discount
  const discountRate = selectedOrder.value.discount / selectedOrder.value.totalAmount
  return Math.round(returnTotal.value * discountRate)
})

const refundAmount = computed(() => {
  return returnTotal.value - returnDiscount.value
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' VND')
}

const searchOrder = () => {
  if (searchQuery.value.trim()) {
    const orderCode = searchQuery.value.toUpperCase()
    const foundOrder = mockOrders[orderCode]
    
    if (foundOrder) {
      // Create a deep copy of the found order
      selectedOrder.value = JSON.parse(JSON.stringify(foundOrder))
      // Reset return quantities
      selectedOrder.value.items.forEach(item => {
        item.returnQuantity = 0
        item.selected = false
      })
    } else {
      alert('Không tìm thấy đơn hàng với mã: ' + orderCode)
      selectedOrder.value = null
    }
  } else {
    alert('Vui lòng nhập mã hóa đơn')
  }
}

const scanQR = () => {
  // Simulate QR scan
  alert('Chức năng quét QR sẽ được cập nhật trong phiên bản tiếp theo')
}

const increaseQuantity = (item) => {
  if (item.returnQuantity < item.quantity) {
    item.returnQuantity++
    updateReturnTotal()
  }
}

const decreaseQuantity = (item) => {
  if (item.returnQuantity > 0) {
    item.returnQuantity--
    if (item.returnQuantity === 0) {
      item.selected = false
    }
    updateReturnTotal()
  }
}

const updateReturnTotal = () => {
  // Auto-set return quantity when item is selected
  selectedOrder.value.items.forEach(item => {
    if (item.selected && item.returnQuantity === 0) {
      item.returnQuantity = 1
    }
    if (!item.selected) {
      item.returnQuantity = 0
    }
  })
}

const processReturn = () => {
  if (!hasSelectedItems.value) {
    alert('Vui lòng chọn ít nhất một sản phẩm để trả hàng')
    return
  }
  
  // Process return logic here
  // TODO: Add actual API call to process return
  // Only trigger notification after successful API response
  
  showSuccessModal.value = true
  
  // Example: Only trigger notification after successful return processing
  // const orderId = selectedOrder.value.id
  // const returnValue = refundAmount.value
  // const itemCount = selectedItems.value.length
  //
  // triggerCustomNotification({
  //   title: 'Trả hàng thành công',
  //   message: `Đơn hàng #${orderId} đã được trả ${itemCount} sản phẩm. Hoàn tiền: ${returnValue.toLocaleString('vi-VN')}đ`,
  //   icon: '🔄',
  //   type: 'order'
  // })
}

const resetForm = () => {
  selectedOrder.value = null
  searchQuery.value = ''
  showSuccessModal.value = false
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing returns data...')
}

const exportReturnsToExcel = () => {
  try {
    const headerMapping = {
      'orderCode': 'Mã đơn hàng',
      'customerName': 'Khách hàng',
      'phone': 'Số điện thoại',
      'returnDate': 'Ngày đổi trả',
      'reason': 'Lý do',
      'status': 'Trạng thái',
      'total': 'Tổng tiền'
    }
    
    const data = selectedOrder.value ? [selectedOrder.value] : []
    const filteredData = data.map(item => ({
      orderCode: item.order_code || 'N/A',
      customerName: item.customer_name || 'N/A',
      phone: item.phone || 'N/A',
      returnDate: new Date().toLocaleDateString('vi-VN'),
      reason: 'Đổi trả sản phẩm',
      status: 'Đã xử lý',
      total: item.total ? new Intl.NumberFormat('vi-VN').format(item.total) + ' đ' : 'N/A'
    }))
    
    const result = exportToExcel(filteredData, 'Returns_Data', 'Dữ liệu đổi trả', headerMapping)
    
    if (result && result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result ? result.message : 'Có lỗi xảy ra khi xuất file Excel'}`)
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert(`❌ Có lỗi xảy ra khi xuất file Excel: ${error.message}`)
  }
}

// No auto search - start with empty state
</script>

<style scoped>
.returns-management {
  max-width: 1200px;
  margin: 0 auto;
}

/* page-header styles are now defined in globals.css */

/* Search Section */
.search-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

.search-box {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--medium-gray);
}

.search-input input {
  padding-left: 2.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.empty-illustration {
  position: relative;
  width: 200px;
  height: 120px;
  margin: 0 auto 2rem;
}

.delivery-truck {
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}

.truck-body {
  display: flex;
  align-items: flex-end;
}

.truck-cabin {
  width: 40px;
  height: 30px;
  background-color: #4ade80;
  border-radius: 8px 8px 0 0;
}

.truck-cargo {
  width: 60px;
  height: 40px;
  background-color: #34495e;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.package {
  font-size: 12px;
}

.truck-wheels {
  display: flex;
  justify-content: space-between;
  width: 100px;
  margin-top: -5px;
}

.wheel {
  width: 15px;
  height: 15px;
  background-color: #2c3e50;
  border-radius: 50%;
}

.delivery-person {
  position: absolute;
  right: 20px;
  bottom: 0;
  font-size: 2rem;
}

.empty-state h3 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.5rem;
}

.empty-state p {
  color: var(--medium-gray);
  font-size: 1rem;
}

/* Return Form */
.return-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Order Info */
.order-info {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.order-info h3 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
}

.order-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-weight: 500;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.detail-item span {
  color: var(--secondary-color);
}

/* Return Products */
.return-products {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.return-products h3 {
  margin: 0 0 1.5rem 0;
  color: var(--secondary-color);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.product-item:has(input:checked) {
  border-color: #4ade80;
  background-color: rgba(255, 123, 0, 0.05);
}

.product-checkbox {
  flex-shrink: 0;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
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

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-color);
  font-size: 1rem;
}

.product-details,
.product-quantity {
  margin: 0.25rem 0;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.product-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.quantity-selector {
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
  transition: all 0.3s ease;
}

.qty-btn:not(:disabled):hover {
  background-color: #4ade80;
  color: white;
  border-color: #4ade80;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  color: #4ade80;
}

/* Return Summary */
.return-summary {
  border: 2px solid #4ade80;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.return-summary h4 {
  margin: 0 0 1rem 0;
  color: #4ade80;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  flex: 1;
  font-weight: 500;
}

.item-quantity {
  color: var(--medium-gray);
  margin: 0 1rem;
}

.item-price {
  font-weight: bold;
  color: #4ade80;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.total-row.final {
  border-top: 2px solid #4ade80;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 1.125rem;
}

.total-amount,
.refund-amount {
  color: #4ade80;
  font-weight: bold;
}

.discount-amount {
  color: var(--success-color);
}

/* Customer Section */
.customer-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.customer-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-label {
  font-weight: 500;
  color: var(--medium-gray);
  min-width: 100px;
}

.info-value {
  color: var(--secondary-color);
}

.return-totals {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.total-item.final {
  border-top: 2px solid #4ade80;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: bold;
  font-size: 1.125rem;
}

.amount {
  font-weight: bold;
}

.amount.discount {
  color: var(--success-color);
}

.amount.refund {
  color: #4ade80;
}

/* Action Buttons */
.action-buttons {
  text-align: center;
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
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.success {
  border-top: 4px solid var(--success-color);
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-body h3 {
  margin: 0 0 1rem 0;
  color: var(--success-color);
}

.modal-body p {
  margin: 0 0 2rem 0;
  color: var(--secondary-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .order-details {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .product-controls {
    flex-direction: row;
    justify-content: center;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-label {
    min-width: auto;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}
</style>

<template>
  <div class="product-details">
    <!-- Modern Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Chi tiết sản phẩm</h1>
          <p class="page-subtitle">Quản lý biến thể sản phẩm, giá bán và số lượng tồn kho</p>
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
          <button class="btn-export" @click="exportDetailsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Thêm chi tiết SP
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Filter Section -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <div class="filter-title">
            <span class="filter-icon">👟</span>
            <h3>Tìm kiếm & Lọc chi tiết sản phẩm</h3>
          </div>
          <div class="filter-stats">
            {{ filteredDetails.length }} / {{ productDetails.length }} chi tiết sản phẩm
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm tên sản phẩm, màu sắc, kích thước..."
                class="form-control search-input"
              />
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
                <span>✕</span>
              </button>
            </div>
          </div>
          
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">📦</span>
                Sản phẩm
              </label>
              <select v-model="selectedProduct" class="form-select">
                <option value="">Tất cả sản phẩm</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.ten_san_pham }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">🎨</span>
                Màu sắc
              </label>
              <select v-model="selectedColor" class="form-select">
                <option value="">Tất cả màu sắc</option>
                <option v-for="color in colors" :key="color.id" :value="color.id">
                  {{ color.ten_mau_sac }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">📏</span>
                Kích thước
              </label>
              <select v-model="selectedSize" class="form-select">
                <option value="">Tất cả kích thước</option>
                <option v-for="size in sizes" :key="size.id" :value="size.id">
                  {{ size.ten_kich_thuoc }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">⚡</span>
                Trạng thái
              </label>
              <select v-model="statusFilter" class="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="1">✅ Hoạt động</option>
                <option value="0">❌ Ngừng hoạt động</option>
              </select>
            </div>
            
            <div class="filter-actions">
              <button @click="clearFilters" class="btn btn-outline">
                <span class="btn-icon">🔄</span>
                Đặt lại
              </button>
              <button @click="applyFilters" class="btn btn-primary">
                <span class="btn-icon">🔍</span>
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Màu sắc</th>
              <th>Kích thước</th>
              <th>Chất liệu</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in paginatedDetails" :key="detail.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="product-name">
                <div class="product-info">
                  <strong>{{ detail.product?.ten_san_pham || 'N/A' }}</strong>
                  <small>{{ detail.product?.ma_san_pham || '' }}</small>
                </div>
              </td>
              <td>
                <span class="color-badge" :style="{ backgroundColor: getColorCode(detail.color?.ten_mau_sac) }">
                  {{ detail.color?.ten_mau_sac || 'N/A' }}
                </span>
              </td>
              <td class="size-info">{{ detail.size?.ten_kich_thuoc || 'N/A' }}</td>
              <td>{{ detail.material?.ten_chat_lieu || 'N/A' }}</td>
              <td class="price">{{ formatCurrency(detail.gia_ban) }}</td>
              <td>
                <span :class="['stock', { 'low-stock': detail.so_luong < 10 }]">
                  {{ detail.so_luong }}
                </span>
              </td>
              <td>
                <span class="badge" :class="detail.trang_thai ? 'badge-success' : 'badge-danger'">
                  {{ detail.trang_thai ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <button class="btn-export" @click="editDetail(detail)">
                    <span class="btn-icon">✏️</span>
                    Sửa
                  </button>
                  <button class="btn-export" @click="deleteDetail(detail.id)">
                    <span class="btn-icon">🗑️</span>
                    Xóa
                  </button>
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="paginatedDetails.length === 0">
              <td colspan="9" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredDetails.length }} chi tiết sản phẩm
          </div>
          <div class="pagination">
            <button 
              class="btn-export" 
              @click="previousPage" 
              :disabled="currentPage === 1"
            >
              <span class="btn-icon">❮</span>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              class="btn-export" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              <span class="btn-icon">❯</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm chi tiết sản phẩm' : 'Cập nhật chi tiết sản phẩm' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Sản phẩm *</label>
              <select
                v-model="formData.id_san_pham"
                class="form-control"
                required
              >
                <option value="">Chọn sản phẩm</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.ten_san_pham }} ({{ product.ma_san_pham }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Màu sắc *</label>
              <select
                v-model="formData.id_mau_sac"
                class="form-control"
                required
              >
                <option value="">Chọn màu sắc</option>
                <option v-for="color in colors" :key="color.id" :value="color.id">
                  {{ color.ten_mau_sac }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kích thước *</label>
              <select
                v-model="formData.id_kich_thuoc"
                class="form-control"
                required
              >
                <option value="">Chọn kích thước</option>
                <option v-for="size in sizes" :key="size.id" :value="size.id">
                  {{ size.ten_kich_thuoc }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Chất liệu *</label>
              <select
                v-model="formData.id_chat_lieu"
                class="form-control"
                required
              >
                <option value="">Chọn chất liệu</option>
                <option v-for="material in materials" :key="material.id" :value="material.id">
                  {{ material.ten_chat_lieu }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Đế giày</label>
              <select v-model="formData.id_de_giay" class="form-control">
                <option value="">Chọn đế giày</option>
                <option v-for="sole in soles" :key="sole.id" :value="sole.id">
                  {{ sole.ten_de_giay }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Đệm giày</label>
              <select v-model="formData.id_dem_giay" class="form-control">
                <option value="">Chọn đệm giày</option>
                <option v-for="insole in insoles" :key="insole.id" :value="insole.id">
                  {{ insole.ten_dem_giay }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Giá bán *</label>
              <input
                v-model="formData.gia_ban"
                type="number"
                class="form-control"
                placeholder="Nhập giá bán"
                min="0"
                step="1000"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Số lượng *</label>
              <input
                v-model="formData.so_luong"
                type="number"
                class="form-control"
                placeholder="Nhập số lượng"
                min="0"
                required
              />
            </div>

            <div class="form-group span-2">
              <label class="form-label">Trạng thái</label>
              <select v-model="formData.trang_thai" class="form-control">
                <option :value="1">Hoạt động</option>
                <option :value="0">Ngừng hoạt động</option>
              </select>
            </div>

            <div class="form-group span-2">
              <label class="form-label">Ghi chú</label>
              <textarea
                v-model="formData.ghi_chu"
                class="form-control"
                rows="3"
                placeholder="Nhập ghi chú..."
              ></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-export" @click="closeModals">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button class="btn-export" @click="saveDetail">
            <span class="btn-icon">💾</span>
            {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ButtonGroup from '@/components/ui/NhomNut.vue'
import { productDetailsService } from '@/services/dichVuSanPham.js'

// Reactive data
const searchQuery = ref('')
const selectedProduct = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDetail = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const formData = ref({
  id_san_pham: '',
  id_mau_sac: '',
  id_kich_thuoc: '',
  id_chat_lieu: '',
  id_de_giay: '',
  id_dem_giay: '',
  id_trong_luong: '',
  id_mon_the_thao: '',
  id_loai_mua: '',
  id_do_ben: '',
  id_chong_nuoc: '',
  so_luong: 0,
  gia_ban: 0,
  trang_thai: 1,
  ghi_chu: ''
})

// Mock data - Replace with actual API calls
const productDetails = ref([])
const products = ref([])
const colors = ref([])
const sizes = ref([])
const materials = ref([])
const soles = ref([])
const insoles = ref([])

// Computed
const filteredDetails = computed(() => {
  return productDetails.value.filter(detail => {
    const matchesSearch = !searchQuery.value || 
      detail.product?.ten_san_pham?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      detail.color?.ten_mau_sac?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      detail.size?.ten_kich_thuoc?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesProduct = !selectedProduct.value || detail.id_san_pham == selectedProduct.value
    const matchesColor = !selectedColor.value || detail.id_mau_sac == selectedColor.value
    const matchesSize = !selectedSize.value || detail.id_kich_thuoc == selectedSize.value
    const matchesStatus = statusFilter.value === '' || detail.trang_thai == statusFilter.value
    
    return matchesSearch && matchesProduct && matchesColor && matchesSize && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredDetails.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredDetails.value.length))

const paginatedDetails = computed(() => {
  return filteredDetails.value.slice(startIndex.value, startIndex.value + itemsPerPage.value)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' VND')
}

const getColorCode = (colorName) => {
  const colorMap = {
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Đỏ': '#FF0000',
    'Xanh': '#0000FF',
    'Vàng': '#FFFF00',
    'Xám': '#808080',
    'Nâu': '#8B4513',
    'Hồng': '#FFC0CB'
  }
  return colorMap[colorName] || '#E5E7EB'
}

const editDetail = (detail) => {
  editingDetail.value = detail
  formData.value = { 
    ...detail,
    id_san_pham: detail.id_san_pham,
    id_mau_sac: detail.id_mau_sac,
    id_kich_thuoc: detail.id_kich_thuoc,
    id_chat_lieu: detail.id_chat_lieu,
    id_de_giay: detail.id_de_giay,
    id_dem_giay: detail.id_dem_giay
  }
  showEditModal.value = true
}

const deleteDetail = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?')) {
    const index = productDetails.value.findIndex(d => d.id === id)
    if (index > -1) {
      productDetails.value.splice(index, 1)
    }
  }
}

const saveDetail = () => {
  if (!formData.value.id_san_pham || !formData.value.id_mau_sac || !formData.value.id_kich_thuoc) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newDetail = {
      ...formData.value,
      id: Date.now(),
      product: products.value.find(p => p.id == formData.value.id_san_pham),
      color: colors.value.find(c => c.id == formData.value.id_mau_sac),
      size: sizes.value.find(s => s.id == formData.value.id_kich_thuoc),
      material: materials.value.find(m => m.id == formData.value.id_chat_lieu)
    }
    productDetails.value.unshift(newDetail)
  } else if (showEditModal.value && editingDetail.value) {
    const index = productDetails.value.findIndex(d => d.id === editingDetail.value.id)
    if (index > -1) {
      productDetails.value[index] = {
        ...editingDetail.value,
        ...formData.value,
        product: products.value.find(p => p.id == formData.value.id_san_pham),
        color: colors.value.find(c => c.id == formData.value.id_mau_sac),
        size: sizes.value.find(s => s.id == formData.value.id_kich_thuoc),
        material: materials.value.find(m => m.id == formData.value.id_chat_lieu)
      }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingDetail.value = null
  formData.value = {
    id_san_pham: '',
    id_mau_sac: '',
    id_kich_thuoc: '',
    id_chat_lieu: '',
    id_de_giay: '',
    id_dem_giay: '',
    id_trong_luong: '',
    id_mon_the_thao: '',
    id_loai_mua: '',
    id_do_ben: '',
    id_chong_nuoc: '',
    so_luong: 0,
    gia_ban: 0,
    trang_thai: 1,
    ghi_chu: ''
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedProduct.value = ''
  selectedColor.value = ''
  selectedSize.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const refreshData = () => {
  console.log('Refreshing product details data...')
}

const exportData = () => {
  console.log('Exporting product details report...')
  alert('Xuất báo cáo thành công! (Chức năng đang được phát triển)')
}

const exportDetailsToExcel = () => {
  console.log('Exporting product details to Excel...')
  alert('Xuất Excel thành công! (Chức năng đang được phát triển)')
}

onMounted(() => {
  // Load initial data - Replace with actual API calls
  loadMockData()
})

const loadMockData = () => {
  // Mock products
  products.value = [
    { id: 1, ten_san_pham: 'Nike Air Force 1', ma_san_pham: 'NAF001' },
    { id: 2, ten_san_pham: 'Adidas Ultraboost 22', ma_san_pham: 'AUB022' },
    { id: 3, ten_san_pham: 'Converse Chuck Taylor', ma_san_pham: 'CCT001' }
  ]

  // Mock colors
  colors.value = [
    { id: 1, ten_mau_sac: 'Đen' },
    { id: 2, ten_mau_sac: 'Trắng' },
    { id: 3, ten_mau_sac: 'Đỏ' },
    { id: 4, ten_mau_sac: 'Xanh' }
  ]

  // Mock sizes
  sizes.value = [
    { id: 1, ten_kich_thuoc: '39' },
    { id: 2, ten_kich_thuoc: '40' },
    { id: 3, ten_kich_thuoc: '41' },
    { id: 4, ten_kich_thuoc: '42' },
    { id: 5, ten_kich_thuoc: '43' }
  ]

  // Mock materials
  materials.value = [
    { id: 1, ten_chat_lieu: 'Da thật' },
    { id: 2, ten_chat_lieu: 'Da tổng hợp' },
    { id: 3, ten_chat_lieu: 'Vải canvas' },
    { id: 4, ten_chat_lieu: 'Vải lưới' }
  ]

  // Mock soles and insoles
  soles.value = [
    { id: 1, ten_de_giay: 'Cao su' },
    { id: 2, ten_de_giay: 'EVA' },
    { id: 3, ten_de_giay: 'TPU' }
  ]

  insoles.value = [
    { id: 1, ten_dem_giay: 'Memory Foam' },
    { id: 2, ten_dem_giay: 'Gel' },
    { id: 3, ten_dem_giay: 'Air' }
  ]
}
</script>

<style scoped>
.product-details {
  max-width: 1400px;
  margin: 0 auto;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: auto;
  position: relative;
}

.table th {
  background-color: #4ade80;
  color: white;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.product-name {
  text-align: left;
}

.product-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.product-info small {
  color: var(--medium-gray);
  font-size: 0.75rem;
}

.color-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  border: 1px solid rgba(0,0,0,0.1);
}

.size-info {
  font-weight: 600;
  color: #4ade80;
}

.price {
  font-weight: 600;
  color: #4ade80;
}

.stock {
  font-weight: 600;
}

.stock.low-stock {
  color: var(--danger-color);
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-weight: 600;
  color: var(--secondary-color);
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.large {
  max-width: 1000px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Form styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-details {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .table {
    font-size: 0.8125rem;
  }
  
  .table th, .table td {
    padding: 0.5rem 0.25rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  /* Hide less important columns on mobile */
  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(8),
  .table td:nth-child(8) {
    display: none;
  }
}
</style>
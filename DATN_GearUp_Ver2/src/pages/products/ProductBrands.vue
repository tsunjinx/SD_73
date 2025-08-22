<template>
  <div class="product-brands">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý thương hiệu</h1>
          <p class="page-subtitle">Quản lý danh sách thương hiệu sản phẩm</p>
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
          <button class="btn-export" @click="exportBrandsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Thêm thương hiệu
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Filter Section -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <div class="filter-title">
            <span class="filter-icon">🔍</span>
            <h3>Tìm kiếm & Lọc</h3>
          </div>
          <div class="filter-stats">
            {{ filteredBrands.length }} / {{ brands.length }} thương hiệu
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm tên thương hiệu, mô tả..."
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
                <span class="label-icon">🌍</span>
                Quốc gia
              </label>
              <select v-model="countryFilter" class="form-select">
                <option value="">Tất cả quốc gia</option>
                <option value="USA">🇺🇸 Mỹ</option>
                <option value="Germany">🇩🇪 Đức</option>
                <option value="Japan">🇯🇵 Nhật Bản</option>
                <option value="UK">🇬🇧 Anh</option>
                <option value="Vietnam">🇻🇳 Việt Nam</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">⚡</span>
                Trạng thái
              </label>
              <select v-model="statusFilter" class="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="active">✅ Hoạt động</option>
                <option value="inactive">❌ Ngừng hoạt động</option>
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

    <!-- Brands Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Logo</th>
              <th>Mã thương hiệu</th>
              <th>Tên thương hiệu</th>
              <th>Quốc gia</th>
              <th>Năm thành lập</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(brand, index) in filteredBrands" :key="brand.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="brand-logo">
                  <img v-if="brand.logo" :src="brand.logo" :alt="brand.name">
                  <div v-else class="placeholder-logo">{{ brand.name.charAt(0) }}</div>
                </div>
              </td>
              <td class="brand-code">{{ brand.code }}</td>
              <td class="brand-name">{{ brand.name }}</td>
              <td>
                <div class="country-info">
                  <span class="country-flag">{{ getCountryFlag(brand.country) }}</span>
                  <span>{{ getCountryText(brand.country) }}</span>
                </div>
              </td>
              <td>{{ brand.foundedYear }}</td>
              <td>
                <span class="badge" :class="brand.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ brand.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <button class="btn-export" @click="viewBrand(brand)">
                    <span class="btn-icon">👁️</span>
                    Xem
                  </button>
                  <button class="btn-export" @click="editBrand(brand)">
                    <span class="btn-icon">✏️</span>
                    Sửa
                  </button>
                  <button class="btn-export" @click="deleteBrand(brand.id)">
                    <span class="btn-icon">🗑️</span>
                    Xóa
                  </button>
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="filteredBrands.length === 0">
              <td colspan="8" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredBrands.length) }} thương hiệu
          </div>
          <div class="pagination">
            <button class="btn btn-outline btn-sm" disabled>❮</button>
            <span class="page-info">1</span>
            <button class="btn btn-outline btn-sm" disabled>❯</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm thương hiệu' : 'Cập nhật thương hiệu' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Logo thương hiệu</label>
            <div class="logo-upload">
              <div class="logo-preview">
                <img v-if="logoPreview" :src="logoPreview" alt="Logo preview">
                <div v-else class="placeholder-logo large">
                  📷
                  <span>Chọn logo</span>
                </div>
              </div>
              <input 
                type="file" 
                @change="handleLogoUpload" 
                accept="image/*"
                class="file-input"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mã thương hiệu *</label>
            <input
              v-model="formData.code"
              type="text"
              class="form-control"
              placeholder="Nhập mã thương hiệu"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Tên thương hiệu *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              placeholder="Nhập tên thương hiệu"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Quốc gia *</label>
            <select v-model="formData.country" class="form-control">
              <option value="">Chọn quốc gia</option>
              <option value="USA">Mỹ</option>
              <option value="Germany">Đức</option>
              <option value="Japan">Nhật Bản</option>
              <option value="UK">Anh</option>
              <option value="Vietnam">Việt Nam</option>
              <option value="France">Pháp</option>
              <option value="Italy">Ý</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Năm thành lập</label>
            <input
              v-model.number="formData.foundedYear"
              type="number"
              min="1800"
              max="2024"
              class="form-control"
              placeholder="Nhập năm thành lập"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả thương hiệu"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select v-model="formData.status" class="form-control">
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModals">Hủy</button>
          <button class="btn btn-primary" @click="saveBrand">
            {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Brand Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết thương hiệu</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedBrand">
          <div class="brand-detail">
            <div class="brand-logo-section">
              <div class="brand-logo large">
                <img v-if="selectedBrand.logo" :src="selectedBrand.logo" :alt="selectedBrand.name">
                <div v-else class="placeholder-logo large">{{ selectedBrand.name.charAt(0) }}</div>
              </div>
            </div>
            
            <div class="brand-info">
              <h4>{{ selectedBrand.name }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã thương hiệu:</label>
                  <span>{{ selectedBrand.code }}</span>
                </div>
                <div class="info-item">
                  <label>Quốc gia:</label>
                  <span>{{ getCountryFlag(selectedBrand.country) }} {{ getCountryText(selectedBrand.country) }}</span>
                </div>
                <div class="info-item">
                  <label>Năm thành lập:</label>
                  <span>{{ selectedBrand.foundedYear }}</span>
                </div>
                <div class="info-item">
                  <label>Tuổi thương hiệu:</label>
                  <span>{{ new Date().getFullYear() - selectedBrand.foundedYear }} năm</span>
                </div>
                <div class="info-item">
                  <label>Mô tả:</label>
                  <span>{{ selectedBrand.description || 'Không có mô tả' }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', selectedBrand.status === 'active' ? 'badge-success' : 'badge-danger']">
                    {{ selectedBrand.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActionButton from '@/components/ui/ActionButton.vue'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

// Reactive data
const searchQuery = ref('')
const countryFilter = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const editingBrand = ref(null)
const selectedBrand = ref(null)
const logoPreview = ref('')

const formData = ref({
  code: '',
  name: '',
  country: '',
  foundedYear: null,
  description: '',
  status: 'active',
  logo: ''
})

// Mock data
const brands = ref([])

// Computed
const filteredBrands = computed(() => {
  return brands.value.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         brand.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCountry = !countryFilter.value || brand.country === countryFilter.value
    const matchesStatus = !statusFilter.value || brand.status === statusFilter.value
    return matchesSearch && matchesCountry && matchesStatus
  })
})

// Methods
const getCountryFlag = (country) => {
  const flagMap = {
    'USA': '🇺🇸',
    'Germany': '🇩🇪',
    'Japan': '🇯🇵',
    'UK': '🇬🇧',
    'Vietnam': '🇻🇳',
    'France': '🇫🇷',
    'Italy': '🇮🇹'
  }
  return flagMap[country] || '🌍'
}

const getCountryText = (country) => {
  const countryMap = {
    'USA': 'Mỹ',
    'Germany': 'Đức',
    'Japan': 'Nhật Bản',
    'UK': 'Anh',
    'Vietnam': 'Việt Nam',
    'France': 'Pháp',
    'Italy': 'Ý'
  }
  return countryMap[country] || country
}

const viewBrand = (brand) => {
  selectedBrand.value = brand
  showDetailModal.value = true
}

const editBrand = (brand) => {
  editingBrand.value = brand
  formData.value = { ...brand }
  logoPreview.value = brand.logo || ''
  showEditModal.value = true
}

const deleteBrand = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
    const index = brands.value.findIndex(b => b.id === id)
    if (index > -1) {
      brands.value.splice(index, 1)
    }
  }
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
      formData.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveBrand = () => {
  if (!formData.value.code.trim() || !formData.value.name.trim() || !formData.value.country) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newBrand = {
      ...formData.value,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    brands.value.unshift(newBrand)
  } else if (showEditModal.value && editingBrand.value) {
    const index = brands.value.findIndex(b => b.id === editingBrand.value.id)
    if (index > -1) {
      brands.value[index] = { ...editingBrand.value, ...formData.value }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  editingBrand.value = null
  selectedBrand.value = null
  logoPreview.value = ''
  formData.value = {
    code: '',
    name: '',
    country: '',
    foundedYear: null,
    description: '',
    status: 'active',
    logo: ''
  }
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing brands data...')
}

const exportData = () => {
  // Export general report functionality
  console.log('Exporting brands report...')
  alert('Xuất báo cáo thành công! (Chức năng đang được phát triển)')
}

const exportBrandsToExcel = () => {
  // Export to Excel functionality
  console.log('Exporting brands to Excel...')
  const exportData = filteredBrands.value.map(brand => ({
    'ID': brand.id,
    'Tên thương hiệu': brand.name,
    'Mã thương hiệu': brand.code,
    'Quốc gia': getCountryText(brand.country),
    'Năm thành lập': brand.foundedYear,
    'Mô tả': brand.description || 'Không có',
    'Trạng thái': brand.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'
  }))
  
  // In a real application, you would use a library like xlsx
  alert('Xuất Excel thành công! (Chức năng đang được phát triển)')
}
</script>

<style scoped>
.product-brands {
  max-width: 1400px;
  margin: 0 auto;
}

/* page-header styles are now defined in globals.css */
/* .page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  color: var(--secondary-color);
} */

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 300px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-controls select {
  min-width: 150px;
}

/* Table Styles */
.card {
  overflow-x: auto;
}

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

.brand-logo {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.brand-logo.large {
  width: 80px;
  height: 80px;
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-logo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  flex-direction: column;
}

.placeholder-logo.large {
  font-size: 1.5rem;
}

.placeholder-logo span {
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.brand-code {
  font-weight: 600;
  color: #4ade80;
}

.brand-name {
  font-weight: 500;
  text-align: left;
}

.country-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.country-flag {
  font-size: 1.2rem;
}

/* Logo upload */
.logo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border-color);
  cursor: pointer;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input {
  max-width: 200px;
}

/* Brand Detail */
.brand-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.brand-logo-section {
  text-align: center;
}

.brand-info {
  width: 100%;
}

.brand-info h4 {
  text-align: center;
  margin: 0 0 2rem 0;
  color: var(--secondary-color);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 500;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.info-item span {
  color: var(--secondary-color);
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-brands {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .table {
    font-size: 0.8125rem;
  }
  
  .table th, .table td {
    padding: 0.5rem 0.25rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .brand-detail {
    text-align: center;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}
</style>
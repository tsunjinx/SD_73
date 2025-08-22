<template>
  <div class="product-sizes">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Kích cỡ</h1>
          <p class="page-subtitle">Quản lý danh sách size và kích cỡ sản phẩm</p>
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
          <button class="btn-export" @click="exportSizesToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Thêm đế giày
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
            <h3>Tìm kiếm kích cỡ</h3>
          </div>
          <div class="filter-stats">
            {{ filteredSizes.length }} / {{ sizes.length }} kích cỡ
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm tên đế giày, mô tả..."
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
                <span class="label-icon">🧪</span>
                Chất liệu
              </label>
              <select v-model="materialFilter" class="form-select">
                <option value="">Tất cả chất liệu</option>
                <option value="rubber">🔧 Cao su</option>
                <option value="eva">✨ EVA</option>
                <option value="pu">💎 PU</option>
                <option value="tpr">⚙️ TPR</option>
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

    <!-- Sizes Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đế</th>
              <th>Tên đế giày</th>
              <th>Chất liệu</th>
              <th>Độ dày (mm)</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(size, index) in filteredSizes" :key="size.id">
              <td>{{ index + 1 }}</td>
              <td class="sole-code">{{ size.code }}</td>
              <td class="sole-name">{{ size.name }}</td>
              <td>
                <span class="badge badge-info">
                  {{ getMaterialText(size.material) }}
                </span>
              </td>
              <td>
                <div class="thickness-indicator">
                  <div class="thickness-bar">
                    <div class="thickness-fill" :style="{height: (size.thickness / 50 * 100) + '%'}"></div>
                  </div>
                  <span class="thickness-value">{{ size.thickness }}mm</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="size.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ size.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>{{ formatDate(size.created_at) }}</td>
              <td>
                <ButtonGroup spacing="xs">
                  <button class="btn btn-secondary" @click="editSize(size)">
                    <span class="btn-icon">✏️</span>
                    Sửa
                  </button>
                  <button class="btn btn-danger" @click="deleteSize(size.id)">
                    <span class="btn-icon">🗑️</span>
                    Xóa
                  </button>
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="filteredSizes.length === 0">
              <td colspan="8" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredSizes.length) }} đế giày
          </div>
          <div class="pagination">
            <button class="btn btn-secondary" disabled>
              <span class="btn-icon">❮</span>
            </button>
            <span class="page-info">1</span>
            <button class="btn btn-secondary" disabled>
              <span class="btn-icon">❯</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm đế giày' : 'Cập nhật đế giày' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Mã đế giày *</label>
            <input
              v-model="formData.code"
              type="text"
              class="form-control"
              placeholder="Nhập mã đế giày"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Tên đế giày *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              placeholder="Nhập tên đế giày"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Chất liệu *</label>
            <select v-model="formData.material" class="form-control">
              <option value="">Chọn chất liệu</option>
              <option value="rubber">Cao su</option>
              <option value="eva">EVA</option>
              <option value="pu">PU</option>
              <option value="tpr">TPR</option>
              <option value="leather">Da</option>
              <option value="fabric">Vải</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Độ dày (mm)</label>
            <input
              v-model.number="formData.thickness"
              type="range"
              min="5"
              max="50"
              step="1"
              class="form-range"
            />
            <div class="range-value">{{ formData.thickness }}mm</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả đế giày"
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
          <button class="btn btn-secondary" @click="closeModals">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button class="btn btn-primary" @click="saveSize">
            <span class="btn-icon">💾</span>
            {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { exportToExcel, formatDataForExcel } from '../../utils/xuatExcel.js'
import ActionButton from '@/components/ui/NutHanhDong.vue'
import ButtonGroup from '@/components/ui/NhomNut.vue'

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const materialFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSize = ref(null)

const formData = ref({
  code: '',
  name: '',
  material: '',
  thickness: 20,
  description: '',
  status: 'active'
})

// Mock data
const sizes = ref([])
  
// Computed
const filteredSizes = computed(() => {
  return sizes.value.filter(size => {
    const matchesSearch = size.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         size.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || size.status === statusFilter.value
    const matchesMaterial = !materialFilter.value || size.material === materialFilter.value
    return matchesSearch && matchesStatus && matchesMaterial
  })
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getMaterialText = (material) => {
  const materialMap = {
    'rubber': 'Cao su',
    'eva': 'EVA',
    'pu': 'PU',
    'tpr': 'TPR',
    'leather': 'Da',
    'fabric': 'Vải'
  }
  return materialMap[material] || material
}

const editSize = (size) => {
  editingSize.value = size
  formData.value = { ...size }
  showEditModal.value = true
}

const deleteSize = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa đế giày này?')) {
    const index = sizes.value.findIndex(s => s.id === id)
    if (index > -1) {
      sizes.value.splice(index, 1)
    }
  }
}

const saveSize = () => {
  if (!formData.value.code.trim() || !formData.value.name.trim() || !formData.value.material) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newSize = {
      ...formData.value,
      id: Date.now(),
      created_at: new Date().toISOString()
    }
    sizes.value.unshift(newSize)
  } else if (showEditModal.value && editingSize.value) {
    const index = sizes.value.findIndex(s => s.id === editingSize.value.id)
    if (index > -1) {
      sizes.value[index] = { ...editingSize.value, ...formData.value }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingSize.value = null
  formData.value = {
    code: '',
    name: '',
    material: '',
    thickness: 20,
    description: '',
    status: 'active'
  }
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing product sizes data...')
}

const exportData = () => {
  alert('Chức năng xuất báo cáo đang được phát triển')
}

const exportSizesToExcel = () => {
  try {
    const headerMapping = {
      'code': 'Mã đế giày',
      'name': 'Tên đế giày', 
      'material': 'Chất liệu',
      'thickness': 'Độ dày (mm)',
      'description': 'Mô tả',
      'status': 'Trạng thái'
    }
    
    const filteredData = filteredSizes.value.map(item => ({
      code: item.code || 'N/A',
      name: item.name || 'N/A',
      material: item.material || 'N/A',
      thickness: `${item.thickness || 20}mm`,
      description: item.description || 'N/A', 
      status: item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'
    }))
    
    const result = exportToExcel(filteredData, 'Product_Sizes', 'Danh sách kích cỡ sản phẩm', headerMapping)
    
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
</script>

<style scoped>
.product-sizes {
  max-width: 1400px;
  margin: 0 auto;
}

/* page-header styles are now defined in globals.css */

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

.sole-code {
  font-weight: 600;
  color: #4ade80;
}

.sole-name {
  font-weight: 500;
  text-align: left;
}

.thickness-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.thickness-bar {
  width: 6px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.thickness-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #4ade80 0%, #22c55e 50%, #16a34a 100%);
  border-radius: 3px;
  transition: height 0.3s ease;
}

.thickness-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--secondary-color);
  min-width: 35px;
}

/* Form styles */
.form-range {
  width: 100%;
  margin: 0.5rem 0;
}

.range-value {
  text-align: center;
  font-weight: 600;
  color: #4ade80;
  margin-top: 0.5rem;
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
  .product-sizes {
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
  
  .thickness-bar {
    height: 30px;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  /* Hide less important columns on mobile */
  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(5),
  .table td:nth-child(5) {
    display: none;
  }
}
</style>
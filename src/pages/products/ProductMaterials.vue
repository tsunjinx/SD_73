<template>
  <div class="product-materials">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Chất liệu</h2>
      <ActionButton
        icon="add"
        variant="primary"
        size="md"
        label="Thêm chất liệu"
        show-label
        @click="showAddModal = true"
      />
    </div>

    <!-- Search and Filters -->
    <div class="filter-section">
      <div class="search-controls">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm tên chất liệu..."
            class="form-control"
          />
          <ActionButton
            icon="search"
            variant="secondary"
            size="sm"
            tooltip="Tìm kiếm"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="categoryFilter" class="form-control">
            <option value="">Loại: Tất cả</option>
            <option value="upper">Chất liệu mặt giày</option>
            <option value="sole">Chất liệu đế</option>
            <option value="lining">Lót giày</option>
          </select>

          <select v-model="statusFilter" class="form-control">
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>

          <ActionButton
            icon="download"
            variant="success"
            size="md"
            label="Xuất Excel"
            show-label
          />
        </div>
      </div>
    </div>

    <!-- Materials Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã chất liệu</th>
              <th>Tên chất liệu</th>
              <th>Loại</th>
              <th>Độ bền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(material, index) in filteredMaterials" :key="material.id">
              <td>{{ index + 1 }}</td>
              <td class="material-code">{{ material.code }}</td>
              <td class="material-name">{{ material.name }}</td>
              <td>
                <span class="badge badge-info">
                  {{ getCategoryText(material.category) }}
                </span>
              </td>
              <td>
                <div class="durability-bar">
                  <div class="durability-fill" :style="{width: material.durability + '%'}"></div>
                  <span class="durability-text">{{ material.durability }}%</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="material.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ material.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>{{ formatDate(material.createdAt) }}</td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa"
                    @click="editMaterial(material)"
                  />
                  <ActionButton
                    icon="delete"
                    variant="danger"
                    size="sm"
                    tooltip="Xóa"
                    @click="deleteMaterial(material.id)"
                  />
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="filteredMaterials.length === 0">
              <td colspan="8" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredMaterials.length) }} chất liệu
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
          <h3>{{ showAddModal ? 'Thêm chất liệu' : 'Cập nhật chất liệu' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Mã chất liệu *</label>
            <input
              v-model="formData.code"
              type="text"
              class="form-control"
              placeholder="Nhập mã chất liệu"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Tên chất liệu *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              placeholder="Nhập tên chất liệu"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Loại chất liệu *</label>
            <select v-model="formData.category" class="form-control">
              <option value="">Chọn loại chất liệu</option>
              <option value="upper">Chất liệu mặt giày</option>
              <option value="sole">Chất liệu đế</option>
              <option value="lining">Lót giày</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Độ bền (%)</label>
            <input
              v-model.number="formData.durability"
              type="range"
              min="0"
              max="100"
              class="form-range"
            />
            <div class="range-value">{{ formData.durability }}%</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả chất liệu"
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
          <button class="btn btn-primary" @click="saveMaterial">
            {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
          </button>
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
const categoryFilter = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingMaterial = ref(null)

const formData = ref({
  code: '',
  name: '',
  category: '',
  durability: 85,
  description: '',
  status: 'active'
})

// Mock data
const materials = ref([
  {
    id: 1,
    code: 'LEATHER',
    name: 'Da thật',
    category: 'upper',
    durability: 95,
    description: 'Da thật cao cấp, bền đẹp',
    status: 'active',
    createdAt: '2023-01-15T10:30:00'
  },
  {
    id: 2,
    code: 'CANVAS',
    name: 'Vải canvas',
    category: 'upper',
    durability: 75,
    description: 'Vải canvas thoáng khí, nhẹ',
    status: 'active',
    createdAt: '2023-02-20T14:20:00'
  },
  {
    id: 3,
    code: 'RUBBER',
    name: 'Cao su',
    category: 'sole',
    durability: 90,
    description: 'Cao su chống trượt, đàn hồi tốt',
    status: 'active',
    createdAt: '2023-03-10T09:15:00'
  },
  {
    id: 4,
    code: 'EVA',
    name: 'Xốp EVA',
    category: 'sole',
    durability: 80,
    description: 'Xốp EVA nhẹ, êm ái',
    status: 'active',
    createdAt: '2023-04-05T16:45:00'
  },
  {
    id: 5,
    code: 'MESH',
    name: 'Lưới thoáng khí',
    category: 'upper',
    durability: 70,
    description: 'Chất liệu lưới thoáng khí',
    status: 'active',
    createdAt: '2023-05-12T11:30:00'
  },
  {
    id: 6,
    code: 'FOAM',
    name: 'Xốp êm',
    category: 'lining',
    durability: 65,
    description: 'Xốp lót giày êm ái',
    status: 'active',
    createdAt: '2023-06-18T08:45:00'
  },
  {
    id: 7,
    code: 'PU',
    name: 'Da PU',
    category: 'upper',
    durability: 60,
    description: 'Da nhân tạo PU',
    status: 'inactive',
    createdAt: '2023-07-22T13:20:00'
  }
])

// Computed
const filteredMaterials = computed(() => {
  return materials.value.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         material.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || material.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || material.status === statusFilter.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getCategoryText = (category) => {
  const categoryMap = {
    'upper': 'Mặt giày',
    'sole': 'Đế giày',
    'lining': 'Lót giày'
  }
  return categoryMap[category] || category
}

const editMaterial = (material) => {
  editingMaterial.value = material
  formData.value = { ...material }
  showEditModal.value = true
}

const deleteMaterial = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa chất liệu này?')) {
    const index = materials.value.findIndex(m => m.id === id)
    if (index > -1) {
      materials.value.splice(index, 1)
    }
  }
}

const saveMaterial = () => {
  if (!formData.value.code.trim() || !formData.value.name.trim() || !formData.value.category) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newMaterial = {
      ...formData.value,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    materials.value.unshift(newMaterial)
  } else if (showEditModal.value && editingMaterial.value) {
    const index = materials.value.findIndex(m => m.id === editingMaterial.value.id)
    if (index > -1) {
      materials.value[index] = { ...editingMaterial.value, ...formData.value }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingMaterial.value = null
  formData.value = {
    code: '',
    name: '',
    category: '',
    durability: 85,
    description: '',
    status: 'active'
  }
}
</script>

<style scoped>
.product-materials {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  color: var(--secondary-color);
}

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
  background-color: var(--primary-color);
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

.material-code {
  font-weight: 600;
  color: var(--primary-color);
}

.material-name {
  font-weight: 500;
  text-align: left;
}

.durability-bar {
  position: relative;
  width: 100px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin: 0 auto;
  overflow: hidden;
}

.durability-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b 0%, #ffa726 50%, #66bb6a 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.durability-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
}

/* Form styles */
.form-range {
  width: 100%;
  margin: 0.5rem 0;
}

.range-value {
  text-align: center;
  font-weight: 600;
  color: var(--primary-color);
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
  max-width: 500px;
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
  .product-materials {
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
  
  .durability-bar {
    width: 80px;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}
</style>
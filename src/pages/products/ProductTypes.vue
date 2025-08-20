<template>
  <div class="product-types">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Loại giày</h2>
      <ActionButton
        icon="add"
        variant="primary"
        size="md"
        label="Thêm loại giày"
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
            placeholder="Tìm kiếm tên loại giày..."
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

    <!-- Types Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã loại</th>
              <th>Tên loại giày</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(type, index) in filteredTypes" :key="type.id">
              <td>{{ index + 1 }}</td>
              <td class="type-code">{{ type.code }}</td>
              <td class="type-name">{{ type.name }}</td>
              <td>{{ type.description }}</td>
              <td>
                <span class="badge" :class="type.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ type.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>{{ formatDate(type.createdAt) }}</td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa"
                    @click="editType(type)"
                  />
                  <ActionButton
                    icon="delete"
                    variant="danger"
                    size="sm"
                    tooltip="Xóa"
                    @click="deleteType(type.id)"
                  />
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="filteredTypes.length === 0">
              <td colspan="7" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredTypes.length) }} loại giày
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
          <h3>{{ showAddModal ? 'Thêm loại giày' : 'Cập nhật loại giày' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Mã loại *</label>
            <input
              v-model="formData.code"
              type="text"
              class="form-control"
              placeholder="Nhập mã loại giày"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Tên loại giày *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              placeholder="Nhập tên loại giày"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả"
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
          <button class="btn btn-primary" @click="saveType">
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
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingType = ref(null)

const formData = ref({
  code: '',
  name: '',
  description: '',
  status: 'active'
})

// Mock data
const types = ref([
  {
    id: 1,
    code: 'SNEAKER',
    name: 'Giày thể thao',
    description: 'Giày dành cho hoạt động thể thao và tập luyện',
    status: 'active',
    createdAt: '2023-01-15T10:30:00'
  },
  {
    id: 2,
    code: 'RUNNING',
    name: 'Giày chạy bộ',
    description: 'Giày chuyên dụng cho chạy bộ với đệm êm',
    status: 'active',
    createdAt: '2023-02-20T14:20:00'
  },
  {
    id: 3,
    code: 'BASKETBALL',
    name: 'Giày bóng rổ',
    description: 'Giày cao cổ hỗ trợ cổ chân cho bóng rổ',
    status: 'active',
    createdAt: '2023-03-10T09:15:00'
  },
  {
    id: 4,
    code: 'FOOTBALL',
    name: 'Giày bóng đá',
    description: 'Giày có đinh hoặc đế bằng cho sân cỏ',
    status: 'active',
    createdAt: '2023-04-05T16:45:00'
  },
  {
    id: 5,
    code: 'CASUAL',
    name: 'Giày thường ngày',
    description: 'Giày phong cách thoải mái cho hàng ngày',
    status: 'active',
    createdAt: '2023-05-12T11:30:00'
  },
  {
    id: 6,
    code: 'BOOT',
    name: 'Giày boot',
    description: 'Giày cổ cao, phong cách mạnh mẽ',
    status: 'inactive',
    createdAt: '2023-06-18T08:45:00'
  }
])

// Computed
const filteredTypes = computed(() => {
  return types.value.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         type.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || type.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const editType = (type) => {
  editingType.value = type
  formData.value = { ...type }
  showEditModal.value = true
}

const deleteType = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa loại giày này?')) {
    const index = types.value.findIndex(t => t.id === id)
    if (index > -1) {
      types.value.splice(index, 1)
    }
  }
}

const saveType = () => {
  if (!formData.value.code.trim() || !formData.value.name.trim()) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newType = {
      ...formData.value,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    types.value.unshift(newType)
  } else if (showEditModal.value && editingType.value) {
    const index = types.value.findIndex(t => t.id === editingType.value.id)
    if (index > -1) {
      types.value[index] = { ...editingType.value, ...formData.value }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingType.value = null
  formData.value = {
    code: '',
    name: '',
    description: '',
    status: 'active'
  }
}
</script>

<style scoped>
.product-types {
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

.type-code {
  font-weight: 600;
  color: var(--primary-color);
}

.type-name {
  font-weight: 500;
  text-align: left;
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
  .product-types {
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
  
  .modal-overlay {
    padding: 1rem;
  }
}
</style>
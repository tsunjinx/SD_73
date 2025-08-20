<template>
  <div class="product-colors">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Quản lý màu sắc</h2>
      <button class="btn btn-primary btn-add-color" @click="showAddModal = true">
        <span class="btn-icon">➕</span>
        <span class="btn-text">Thêm màu sắc</span>
      </button>
    </div>

    <!-- Search Section -->
    <div class="filter-section">
      <div class="search-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm màu sắc..." 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
      </div>
    </div>

    <!-- Colors Grid -->
    <div class="colors-grid">
      <div v-for="color in filteredColors" :key="color.id" class="color-card">
        <div class="color-display">
          <div class="color-circle" :style="{ backgroundColor: color.ma_mau }">
            <div class="color-overlay">
              <span class="color-name-overlay">{{ color.ten_mau_sac }}</span>
            </div>
          </div>
        </div>
        
        <div class="color-info">
          <h3 class="color-title">{{ color.ten_mau_sac }}</h3>
          <div class="color-code-display">
            <span class="color-code-label">Mã màu:</span>
            <code class="color-code">{{ color.ma_mau }}</code>
          </div>
        </div>
        
        <div class="color-actions">
          <button 
            class="btn btn-outline btn-edit" 
            @click="editColor(color)"
            title="Chỉnh sửa màu sắc"
          >
            <span class="btn-icon">✏️</span>
            <span class="btn-text">Sửa</span>
          </button>
          <button 
            class="btn btn-danger btn-delete" 
            @click="deleteColor(color)"
            title="Xóa màu sắc"
          >
            <span class="btn-icon">🗑️</span>
            <span class="btn-text">Xóa</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredColors.length === 0" class="empty-state">
      <div class="empty-icon">🎨</div>
      <h3>{{ searchQuery ? 'Không tìm thấy màu sắc' : 'Chưa có màu sắc nào' }}</h3>
      <p>{{ searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Nhấn nút "Thêm màu sắc" để bắt đầu' }}</p>
      <button v-if="!searchQuery" class="btn btn-primary btn-add-first" @click="showAddModal = true">
        <span class="btn-icon">🎨</span>
        <span class="btn-text">Thêm màu sắc đầu tiên</span>
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm màu sắc' : 'Chỉnh sửa màu sắc' }}</h3>
          <button class="modal-close btn-close" @click="closeModal">
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveColor">
            <div class="form-group">
              <label for="colorName">Tên màu sắc *</label>
              <input 
                type="text" 
                id="colorName"
                v-model="colorForm.ten_mau_sac"
                class="form-control"
                required
                placeholder="Ví dụ: Đỏ, Xanh dương..."
              >
            </div>

            <div class="form-group">
              <label for="colorCode">Mã màu *</label>
              <div class="color-input-group">
                <input 
                  type="text" 
                  id="colorCode"
                  v-model="colorForm.ma_mau"
                  class="form-control"
                  required
                  placeholder="Ví dụ: #FF0000, #0066CC..."
                  pattern="^#[0-9A-Fa-f]{6}$"
                >
                <input 
                  type="color" 
                  v-model="colorForm.ma_mau"
                  class="color-picker"
                >
              </div>
              <small class="text-muted">Mã màu hex (ví dụ: #FF0000)</small>
            </div>

            <div class="form-group">
              <label>Xem trước</label>
              <div class="color-preview-large" :style="{ backgroundColor: colorForm.ma_mau }">
                <span class="preview-text">{{ colorForm.ten_mau_sac || 'Màu sắc' }}</span>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary btn-cancel" @click="closeModal">
                <span class="btn-icon">✕</span>
                <span class="btn-text">Hủy</span>
              </button>
              <button type="submit" class="btn btn-primary btn-save">
                <span class="btn-icon">{{ showAddModal ? '➕' : '✏️' }}</span>
                <span class="btn-text">{{ showAddModal ? 'Thêm' : 'Cập nhật' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="modal-close btn-close" @click="showDeleteModal = false">
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa màu sắc <strong>{{ colorToDelete?.ten_mau_sac }}</strong>?</p>
          <p class="text-warning">⚠️ Hành động này không thể hoàn tác!</p>
          
          <div class="modal-actions">
            <button class="btn btn-secondary btn-cancel-delete" @click="showDeleteModal = false">
              <span class="btn-icon">✕</span>
              <span class="btn-text">Hủy</span>
            </button>
            <button class="btn btn-danger btn-confirm-delete" @click="confirmDelete">
              <span class="btn-icon">🗑️</span>
              <span class="btn-text">Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const colorToDelete = ref(null)

const colorForm = ref({
  id: null,
  ten_mau_sac: '',
  ma_mau: '#000000'
})

// Mock data - should match ERD mau_sac table
const colors = ref([
  {
    id: 1,
    ten_mau_sac: 'Đỏ',
    ma_mau: '#FF0000'
  },
  {
    id: 2,
    ten_mau_sac: 'Xanh dương',
    ma_mau: '#0066CC'
  },
  {
    id: 3,
    ten_mau_sac: 'Xanh lá',
    ma_mau: '#00CC66'
  },
  {
    id: 4,
    ten_mau_sac: 'Vàng',
    ma_mau: '#FFCC00'
  },
  {
    id: 5,
    ten_mau_sac: 'Tím',
    ma_mau: '#CC00CC'
  },
  {
    id: 6,
    ten_mau_sac: 'Cam',
    ma_mau: '#FF6600'
  },
  {
    id: 7,
    ten_mau_sac: 'Hồng',
    ma_mau: '#FF66CC'
  },
  {
    id: 8,
    ten_mau_sac: 'Đen',
    ma_mau: '#000000'
  },
  {
    id: 9,
    ten_mau_sac: 'Trắng',
    ma_mau: '#FFFFFF'
  },
  {
    id: 10,
    ten_mau_sac: 'Xám',
    ma_mau: '#808080'
  }
])

// Computed
const filteredColors = computed(() => {
  if (!searchQuery.value) {
    return colors.value
  }
  
  return colors.value.filter(color => 
    color.ten_mau_sac.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    color.ma_mau.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const resetForm = () => {
  colorForm.value = {
    id: null,
    ten_mau_sac: '',
    ma_mau: '#000000'
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  resetForm()
}

const editColor = (color) => {
  colorForm.value = { ...color }
  showEditModal.value = true
}

const deleteColor = (color) => {
  colorToDelete.value = color
  showDeleteModal.value = true
}

const saveColor = () => {
  if (showAddModal.value) {
    // Add new color
    const newId = Math.max(...colors.value.map(c => c.id)) + 1
    colors.value.push({
      ...colorForm.value,
      id: newId
    })
  } else {
    // Update existing color
    const index = colors.value.findIndex(c => c.id === colorForm.value.id)
    if (index !== -1) {
      colors.value[index] = { ...colorForm.value }
    }
  }
  
  closeModal()
}

const confirmDelete = () => {
  const index = colors.value.findIndex(c => c.id === colorToDelete.value.id)
  if (index !== -1) {
    colors.value.splice(index, 1)
  }
  showDeleteModal.value = false
  colorToDelete.value = null
}

onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
.product-colors {
  max-width: 1200px;
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
  flex: 1;
  min-width: 300px;
}

/* Modern Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover:before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #4a90e2);
  color: white;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(52, 144, 220, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 144, 220, 0.4);
  background: linear-gradient(135deg, #2980b9, var(--primary-color));
}

.btn-secondary {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  background: linear-gradient(135deg, #c82333, #a71e2a);
}

.btn-outline {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 144, 220, 0.3);
}

/* Header Button */
.btn-add-color {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(52, 144, 220, 0.25);
}

.btn-add-color:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(52, 144, 220, 0.35);
}

/* Empty State Button */
.btn-add-first {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(52, 144, 220, 0.2);
}

.btn-add-first:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(52, 144, 220, 0.3);
}

/* Modal Action Buttons */
.btn-save, .btn-cancel, .btn-confirm-delete, .btn-cancel-delete {
  min-width: 120px;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  border-radius: 10px;
}

.btn-save:hover, .btn-confirm-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(52, 144, 220, 0.35);
}

.btn-cancel:hover, .btn-cancel-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Button Icons */
.btn-icon {
  font-size: 1.1em;
  display: inline-flex;
  align-items: center;
}

.btn-text {
  font-weight: 600;
}

/* Colors Grid Layout */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.color-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Color Display */
.color-display {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.color-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.color-card:hover .color-circle {
  transform: scale(1.05);
}

.color-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-circle:hover .color-overlay {
  opacity: 1;
}

.color-name-overlay {
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  padding: 0.25rem;
}

/* Color Info */
.color-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.color-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--secondary-color);
}

.color-code-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.color-code-label {
  font-size: 0.875rem;
  color: var(--medium-gray);
}

.color-code {
  font-family: 'Courier New', monospace;
  background-color: var(--light-gray);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--secondary-color);
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
}

/* Color Actions */
.color-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-edit, .btn-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.btn-edit:before, .btn-delete:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-edit:hover:before, .btn-delete:hover:before {
  left: 100%;
}

.btn-edit {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(52, 144, 220, 0.15);
}

.btn-edit:hover {
  background: linear-gradient(135deg, var(--primary-color), #4a90e2);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 144, 220, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  color: #dc3545;
  border: 2px solid #dc3545;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.15);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border-color: #dc3545;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-color);
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: var(--medium-gray);
  font-size: 1rem;
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.small {
  max-width: 400px;
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
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 1px solid var(--border-color);
  font-size: 1.25rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: var(--medium-gray);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.modal-close:hover {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border-color: #dc3545;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input-group .form-control {
  flex: 1;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.color-preview-large {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.preview-text {
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  background-color: rgba(0,0,0,0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.text-muted {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.text-warning {
  color: var(--warning-color);
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-controls {
    flex-direction: column;
  }
  
  .colors-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .color-card {
    padding: 1.25rem;
  }
  
  .color-circle {
    width: 70px;
    height: 70px;
  }
  
  .color-title {
    font-size: 1.125rem;
  }
  
  .color-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-edit, .btn-delete {
    width: 100%;
    min-width: unset;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .color-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .color-picker {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .colors-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .color-card {
    padding: 1rem;
  }
  
  .color-circle {
    width: 60px;
    height: 60px;
  }
  
  .color-title {
    font-size: 1rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-edit, .btn-delete {
    min-width: 50px;
    padding: 0.75rem;
    border-radius: 50%;
  }
  
  .btn-add-color .btn-text,
  .btn-add-first .btn-text {
    display: none;
  }
  
  .btn-add-color, .btn-add-first {
    padding: 0.75rem;
    min-width: 50px;
    border-radius: 50%;
  }
  
  .color-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
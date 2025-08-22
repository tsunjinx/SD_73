<template>
  <div class="discount-campaigns">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Chiến dịch khuyến mãi</h1>
          <p class="page-subtitle">Tạo và quản lý các chiến dịch khuyến mãi</p>
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
          <button class="btn-export" @click="exportToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">➕</span>
            Tạo đợt giảm giá
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Filter Section -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <div class="filter-title">
            <span class="filter-icon">🎯</span>
            <h3>Tìm kiếm chiến dịch</h3>
          </div>
          <div class="filter-stats">
            {{ filteredCampaigns.length }} / {{ campaigns.length }} chiến dịch
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả chiến dịch..."
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
                <span class="label-icon">📊</span>
                Trạng thái
              </label>
              <select v-model="statusFilter" class="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="upcoming">⏰ Sắp diễn ra</option>
                <option value="active">✅ Đang diễn ra</option>
                <option value="expired">🔚 Đã kết thúc</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">💰</span>
                Loại giảm giá
              </label>
              <select v-model="typeFilter" class="form-select">
                <option value="">Tất cả loại</option>
                <option value="percentage">📊 Phần trăm (%)</option>
                <option value="fixed">💵 Số tiền cố định</option>
              </select>
            </div>
            
            <div class="filter-actions">
              <button @click="clearFilters" class="btn btn-outline">
                <span class="btn-icon">🔄</span>
                Đặt lại
              </button>
              <button @click="applyFilters" class="btn btn-primary">
                <span class="btn-icon">✨</span>
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên chiến dịch</th>
              <th>Mô tả</th>
              <th>Loại giảm giá</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(campaign, index) in filteredCampaigns" :key="campaign.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="campaign-name">
                  <strong>{{ campaign.name }}</strong>
                </div>
              </td>
              <td>
                <div class="campaign-description">
                  {{ campaign.description || 'Không có mô tả' }}
                </div>
              </td>
              <td>
                <span class="badge badge-info">
                  {{ campaign.type === 'percentage' ? '📊 Phần trăm' : '💵 Số tiền' }}
                </span>
              </td>
              <td>
                <div class="value-info">
                  <strong class="discount-value">
                    {{ campaign.type === 'percentage' ? campaign.value + '%' : formatCurrency(campaign.value) }}
                  </strong>
                  <small v-if="campaign.min_order_value" class="min-order">
                    Đơn tối thiểu: {{ formatCurrency(campaign.min_order_value) }}
                  </small>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-range">
                    📅 {{ formatDateShort(campaign.start_date) }}
                  </div>
                  <div class="date-separator">↓</div>
                  <div class="date-range">
                    📅 {{ formatDateShort(campaign.end_date) }}
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(campaign.status)">
                  {{ getStatusText(campaign.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action" @click="viewCampaign(campaign)" title="Xem chi tiết">
                    👁️
                  </button>
                  <button class="btn-action" @click="editCampaign(campaign)" title="Chỉnh sửa">
                    ✏️
                  </button>
                  <button 
                    v-if="campaign.status !== 'expired'"
                    class="btn-action"
                    @click="deleteCampaign(campaign.id)"
                    title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCampaigns.length === 0">
              <td colspan="8" class="text-center empty-state">
                <div class="empty-message">
                  <span class="empty-icon">📭</span>
                  <p>Không có dữ liệu chiến dịch</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredCampaigns.length) }} đợt giảm giá
          </div>
          <div class="pagination">
            <button class="btn-export" disabled>
              <span class="btn-icon">❮</span>
            </button>
            <span class="page-info">1</span>
            <button class="btn-export" disabled>
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
          <h3>{{ showAddModal ? 'Tạo đợt giảm giá' : 'Cập nhật đợt giảm giá' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tên đợt giảm giá *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              placeholder="Nhập tên đợt giảm giá"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Nhập mô tả đợt giảm giá"
            ></textarea>
          </div>

          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Loại giảm giá *</label>
                <select v-model="formData.type" class="form-control">
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Giá trị *</label>
                <input
                  v-model.number="formData.value"
                  type="number"
                  class="form-control"
                  :placeholder="formData.type === 'percentage' ? 'Nhập % giảm giá' : 'Nhập số tiền'"
                  :min="0"
                  :max="formData.type === 'percentage' ? 100 : undefined"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Ngày bắt đầu *</label>
                <input
                  v-model="formData.start_date"
                  type="datetime-local"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Ngày kết thúc *</label>
                <input
                  v-model="formData.end_date"
                  type="datetime-local"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Số lượng tối đa</label>
            <input
              v-model.number="formData.max_uses"
              type="number"
              class="form-control"
              placeholder="Để trống nếu không giới hạn"
              min="0"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Giá trị đơn hàng tối thiểu</label>
            <input
              v-model.number="formData.min_order_value"
              type="number"
              class="form-control"
              placeholder="Để trống nếu không yêu cầu"
              min="0"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-export" @click="closeModals">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button class="btn-export" @click="saveCampaign">
            <span class="btn-icon">💾</span>
            {{ showAddModal ? 'Tạo đợt giảm giá' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Campaign Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết đợt giảm giá</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedCampaign">
          <div class="campaign-detail">
            <div class="campaign-info">
              <h4>{{ selectedCampaign.name }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mô tả:</label>
                  <span>{{ selectedCampaign.description || 'Không có mô tả' }}</span>
                </div>
                <div class="info-item">
                  <label>Loại giảm giá:</label>
                  <span class="badge badge-info">
                    {{ selectedCampaign.type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Giá trị:</label>
                  <span class="discount-value">
                    {{ selectedCampaign.type === 'percentage' ? selectedCampaign.value + '%' : formatCurrency(selectedCampaign.value) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span class="badge" :class="getStatusClass(selectedCampaign.status)">
                    {{ getStatusText(selectedCampaign.status) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Thời gian bắt đầu:</label>
                  <span>{{ formatDate(selectedCampaign.start_date) }}</span>
                </div>
                <div class="info-item">
                  <label>Thời gian kết thúc:</label>
                  <span>{{ formatDate(selectedCampaign.end_date) }}</span>
                </div>
                <div class="info-item">
                  <label>Số lượng tối đa:</label>
                  <span>{{ selectedCampaign.max_uses || 'Không giới hạn' }}</span>
                </div>
                <div class="info-item">
                  <label>Đơn hàng tối thiểu:</label>
                  <span>{{ selectedCampaign.min_order_value ? formatCurrency(selectedCampaign.min_order_value) : 'Không yêu cầu' }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày tạo:</label>
                  <span>{{ formatDate(selectedCampaign.created_at) }}</span>
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

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const editingCampaign = ref(null)
const selectedCampaign = ref(null)

const formData = ref({
  name: '',
  description: '',
  type: 'percentage',
  value: 0,
  start_date: '',
  end_date: '',
  max_uses: null,
  min_order_value: null,
  status: 'upcoming'
})

// Mock data
const campaigns = ref([
  {
    id: 1,
    name: 'Giảm giá mùa hè',
    description: 'Giảm giá 20% cho tất cả sản phẩm mùa hè',
    type: 'percentage',
    value: 20,
    start_date: '2023-12-01T00:00',
    end_date: '2023-12-31T23:59',
    max_uses: 100,
    min_order_value: 500000,
    status: 'active',
    created_at: '2023-11-15'
  },
  {
    id: 2,
    name: 'Black Friday 2023',
    description: 'Giảm 500k cho đơn hàng trên 2 triệu',
    type: 'fixed',
    value: 500000,
    start_date: '2023-11-24T00:00',
    end_date: '2023-11-26T23:59',
    max_uses: 50,
    min_order_value: 2000000,
    status: 'expired',
    created_at: '2023-11-01'
  },
  {
    id: 3,
    name: 'Năm mới 2024',
    description: 'Giảm giá 15% chào năm mới',
    type: 'percentage',
    value: 15,
    start_date: '2024-01-01T00:00',
    end_date: '2024-01-07T23:59',
    max_uses: null,
    min_order_value: 300000,
    status: 'upcoming',
    created_at: '2023-12-20'
  }
])

// Computed
const filteredCampaigns = computed(() => {
  return campaigns.value.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || campaign.status === statusFilter.value
    const matchesType = !typeFilter.value || campaign.type === typeFilter.value
    return matchesSearch && matchesStatus && matchesType
  })
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'badge-success'
    case 'upcoming': return 'badge-warning'
    case 'expired': return 'badge-secondary'
    default: return 'badge-secondary'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Đang diễn ra'
    case 'upcoming': return 'Sắp diễn ra'
    case 'expired': return 'Đã kết thúc'
    default: return 'Không xác định'
  }
}

const viewCampaign = (campaign) => {
  selectedCampaign.value = campaign
  showDetailModal.value = true
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  formData.value = { ...campaign }
  showEditModal.value = true
}

const deleteCampaign = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa đợt giảm giá này?')) {
    const index = campaigns.value.findIndex(c => c.id === id)
    if (index > -1) {
      campaigns.value.splice(index, 1)
    }
  }
}

const activateCampaign = (id) => {
  if (confirm('Bạn có muốn kích hoạt đợt giảm giá này ngay bây giờ?')) {
    const campaign = campaigns.value.find(c => c.id === id)
    if (campaign) {
      campaign.status = 'active'
    }
  }
}

const saveCampaign = () => {
  if (!formData.value.name.trim()) {
    alert('Vui lòng nhập tên đợt giảm giá')
    return
  }
  
  if (!formData.value.value || formData.value.value <= 0) {
    alert('Vui lòng nhập giá trị giảm giá hợp lệ')
    return
  }

  if (!formData.value.start_date || !formData.value.end_date) {
    alert('Vui lòng chọn ngày bắt đầu và kết thúc')
    return
  }

  if (new Date(formData.value.start_date) >= new Date(formData.value.end_date)) {
    alert('Ngày kết thúc phải sau ngày bắt đầu')
    return
  }

  if (showAddModal.value) {
    const newCampaign = {
      id: Date.now(),
      ...formData.value,
      created_at: new Date().toISOString().split('T')[0]
    }
    campaigns.value.unshift(newCampaign)
  } else if (showEditModal.value && editingCampaign.value) {
    const index = campaigns.value.findIndex(c => c.id === editingCampaign.value.id)
    if (index > -1) {
      campaigns.value[index] = { ...editingCampaign.value, ...formData.value }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  editingCampaign.value = null
  selectedCampaign.value = null
  formData.value = {
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    start_date: '',
    end_date: '',
    max_uses: null,
    min_order_value: null,
    status: 'upcoming'
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
}

const applyFilters = () => {
  // Filters are already applied through computed property
  console.log('Filters applied')
}

const exportData = () => {
  alert('Xuất báo cáo chiến dịch khuyến mãi')
}

const exportToExcel = () => {
  try {
    const headerMapping = {
      'id': 'ID',
      'name': 'Tên chiến dịch',
      'description': 'Mô tả',
      'discount_type': 'Loại giảm giá',
      'discount_value': 'Giá trị giảm',
      'min_order_value': 'Giá trị đơn tối thiểu',
      'max_uses': 'Số lần sử dụng tối đa',
      'used_count': 'Đã sử dụng',
      'start_date': 'Ngày bắt đầu',
      'end_date': 'Ngày kết thúc',
      'status': 'Trạng thái'
    }
    
    const filteredData = filteredCampaigns.value.map(item => ({
      id: item.id || 'N/A',
      name: item.name || 'N/A',
      description: item.description || 'N/A',
      discount_type: item.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định',
      discount_value: item.discount_type === 'percentage' ? `${item.discount_value}%` : new Intl.NumberFormat('vi-VN').format(item.discount_value),
      min_order_value: item.min_order_value ? new Intl.NumberFormat('vi-VN').format(item.min_order_value) : 'Không giới hạn',
      max_uses: item.max_uses || 'Không giới hạn',
      used_count: item.used_count || 0,
      start_date: item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : 'N/A',
      end_date: item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : 'N/A',
      status: item.status === 'active' ? 'Đang diễn ra' : item.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'
    }))
    
    // In a real application, you would use a library like xlsx
    console.log('Export data:', filteredData)
    alert('Xuất Excel thành công! (Chức năng đang được phát triển)')
    return
    
    if (result && result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result ? result.message : 'Có lỗi xảy ra khi xuất file Excel'}`)
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert(`Có lỗi xảy ra khi xuất file Excel: ${error.message}`)
  }
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing discount campaigns data...')
}
</script>

<style scoped>
.discount-campaigns {
  max-width: 1400px;
  margin: 0 auto;
}

/* page-header styles are now defined in globals.css */

/* Modern Filter Section */
.filter-section {
  margin-bottom: 2rem;
}

.filter-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 10px;
}

.filter-title h3 {
  margin: 0;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
}

.filter-stats {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter-content {
  padding: 1.5rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.25rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: #ef4444;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.label-icon {
  font-size: 1rem;
}

.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
  color: #374151;
}

.form-select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-outline {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.btn-primary {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Table Styles */
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

.discount-value {
  font-weight: 600;
  color: #22c55e;
}

/* Table Content Styles */
.campaign-name {
  text-align: left;
}

.campaign-name strong {
  color: #374151;
  font-size: 0.9375rem;
}

.campaign-description {
  color: #6b7280;
  font-size: 0.875rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.min-order {
  color: #9ca3af;
  font-size: 0.75rem;
  display: block;
}

.date-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.date-range {
  color: #6b7280;
  white-space: nowrap;
}

.date-separator {
  color: #22c55e;
  font-weight: bold;
  font-size: 0.75rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-action:hover {
  transform: scale(1.1);
  background: #f3f4f6;
  border-color: #22c55e;
}

/* Empty State */
.empty-state {
  padding: 2rem !important;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.empty-message p {
  margin: 0;
  color: #6b7280;
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

/* Campaign Detail */
.campaign-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.campaign-info h4 {
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

/* Responsive Design */
@media (max-width: 1200px) {
  .discount-campaigns {
    padding: 0 1rem;
  }
}

@media (max-width: 1024px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .table th, .table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  /* page-header responsive styles are handled in globals.css */
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .table {
    font-size: 0.8125rem;
  }
  
  .table th, .table td {
    padding: 0.5rem 0.25rem;
  }
  
  /* Hide less important columns on mobile */
  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(6),
  .table td:nth-child(6) {
    display: none;
  }
}

@media (max-width: 480px) {
  .discount-campaigns {
    padding: 0 0.5rem;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
  
  .card {
    margin: 0 -0.5rem;
    border-radius: 0;
  }
}
</style>
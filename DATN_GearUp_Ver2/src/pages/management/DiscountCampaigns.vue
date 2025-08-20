<template>
  <div class="discount-campaigns">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Đợt giảm giá</h2>
      <ActionButton
        icon="add"
        variant="primary"
        size="md"
        label="Tạo đợt giảm giá"
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
            placeholder="Tìm kiếm tên đợt giảm giá..."
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
            <option value="upcoming">Sắp diễn ra</option>
            <option value="active">Đang diễn ra</option>
            <option value="expired">Đã kết thúc</option>
          </select>
          
          <select v-model="typeFilter" class="form-control">
            <option value="">Loại: Tất cả</option>
            <option value="percentage">Phần trăm</option>
            <option value="fixed">Số tiền cố định</option>
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

    <!-- Campaigns Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đợt giảm giá</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(campaign, index) in filteredCampaigns" :key="campaign.id">
              <td>{{ index + 1 }}</td>
              <td>{{ campaign.name }}</td>
              <td>
                <span class="badge badge-info">
                  {{ campaign.type === 'percentage' ? 'Phần trăm' : 'Số tiền' }}
                </span>
              </td>
              <td>
                {{ campaign.type === 'percentage' ? campaign.value + '%' : formatCurrency(campaign.value) }}
              </td>
              <td>{{ formatDate(campaign.start_date) }}</td>
              <td>{{ formatDate(campaign.end_date) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(campaign.status)">
                  {{ getStatusText(campaign.status) }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="view"
                    variant="info"
                    size="sm"
                    tooltip="Xem chi tiết"
                    @click="viewCampaign(campaign)"
                  />
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa"
                    @click="editCampaign(campaign)"
                  />
                  <ActionButton
                    v-if="campaign.status !== 'expired'"
                    icon="delete"
                    variant="danger"
                    size="sm"
                    tooltip="Xóa đợt giảm giá"
                    @click="deleteCampaign(campaign.id)"
                  />
                </ButtonGroup>
              </td>
            </tr>
            <tr v-if="filteredCampaigns.length === 0">
              <td colspan="8" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(10, filteredCampaigns.length) }} đợt giảm giá
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
          <button class="btn btn-secondary" @click="closeModals">Hủy</button>
          <button class="btn btn-primary" @click="saveCampaign">
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
import ActionButton from '@/components/ui/ActionButton.vue'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

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
</script>

<style scoped>
.discount-campaigns {
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

.discount-value {
  font-weight: 600;
  color: var(--success-color);
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
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
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
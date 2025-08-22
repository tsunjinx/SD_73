<template>
  <div class="activity-logs-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Nhật ký hoạt động</h1>
          <p class="page-subtitle">Theo dõi và quản lý nhật ký hoạt động hệ thống</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Làm mới
          </button>
          <button class="btn-export" @click="exportLogs">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-export" @click="exportLogsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo người dùng hoặc hành động..." 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
        
        <div class="filter-group">
          <select v-model="selectedAction" class="form-control">
            <option value="">Tất cả hành động</option>
            <option value="login">Đăng nhập</option>
            <option value="logout">Đăng xuất</option>
            <option value="create_order">Tạo đơn hàng</option>
            <option value="update_order">Cập nhật đơn hàng</option>
            <option value="create_product">Tạo sản phẩm</option>
            <option value="update_product">Cập nhật sản phẩm</option>
            <option value="create_customer">Tạo khách hàng</option>
            <option value="update_customer">Cập nhật khách hàng</option>
            <option value="view_report">Xem báo cáo</option>
            <option value="export_data">Xuất dữ liệu</option>
            <option value="system_backup">Sao lưu hệ thống</option>
          </select>
          
          <select v-model="selectedUser" class="form-control">
            <option value="">Tất cả người dùng</option>
            <option v-for="user in availableUsers" :key="user.id" :value="user.id">
              {{ user.ho_ten }} ({{ user.vai_tro }})
            </option>
          </select>
        </div>

        <div class="date-filters">
          <div class="date-group">
            <label>Từ ngày</label>
            <input type="date" v-model="fromDate" class="form-control">
          </div>
          <div class="date-group">
            <label>Đến ngày</label>
            <input type="date" v-model="toDate" class="form-control">
          </div>
        </div>

        <div class="time-filters">
          <button 
            v-for="timeFilter in timeFilters" 
            :key="timeFilter.value"
            :class="['time-filter-btn', { active: selectedTimeFilter === timeFilter.value }]"
            @click="applyTimeFilter(timeFilter.value)"
          >
            {{ timeFilter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Logs Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hành động</th>
              <th>Mô tả</th>
              <th>IP Address</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in filteredLogs" :key="log.id" :class="{ 'danger-row': log.hanh_dong === 'login_failed' }">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="time-info">
                  <div class="time">{{ formatTime(log.thoi_gian) }}</div>
                  <div class="date">{{ formatDate(log.thoi_gian) }}</div>
                </div>
              </td>
              <td>
                <div class="user-info">
                  <div class="user-name">{{ log.nguoi_dung.ho_ten }}</div>
                  <div class="user-role">{{ log.nguoi_dung.vai_tro }}</div>
                </div>
              </td>
              <td>
                <span :class="['action-badge', getActionClass(log.hanh_dong)]">
                  {{ getActionText(log.hanh_dong) }}
                </span>
              </td>
              <td>
                <div class="description">
                  <p>{{ log.mo_ta }}</p>
                  <button 
                    v-if="log.mo_ta.length > 100" 
                    class="btn-link" 
                    @click="viewFullLog(log)"
                  >
                    Xem thêm
                  </button>
                </div>
              </td>
              <td>
                <span class="ip-address">{{ log.ip_address }}</span>
              </td>
              <td>
                <span :class="['badge', getStatusClass(log)]">
                  {{ getStatusText(log) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ totalLogs }} log
          </div>
          <div class="pagination">
            <button 
              class="btn-export" 
              @click="previousPage" 
              :disabled="currentPage === 1"
            >
              ❮ Trước
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              class="btn-export" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              Sau ❯
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết hoạt động</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedLog">
          <div class="log-detail">
            <div class="detail-section">
              <h4>Thông tin cơ bản</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Thời gian:</label>
                  <span>{{ formatDateTime(selectedLog.thoi_gian) }}</span>
                </div>
                <div class="info-item">
                  <label>Người thực hiện:</label>
                  <span>{{ selectedLog.nguoi_dung.ho_ten }}</span>
                </div>
                <div class="info-item">
                  <label>Vai trò:</label>
                  <span>{{ selectedLog.nguoi_dung.vai_tro }}</span>
                </div>
                <div class="info-item">
                  <label>IP Address:</label>
                  <span>{{ selectedLog.ip_address }}</span>
                </div>
                <div class="info-item">
                  <label>Hành động:</label>
                  <span :class="['action-badge', getActionClass(selectedLog.hanh_dong)]">
                    {{ getActionText(selectedLog.hanh_dong) }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', getStatusClass(selectedLog)]">
                    {{ getStatusText(selectedLog) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Mô tả chi tiết</h4>
              <div class="description-full">
                <p>{{ selectedLog.mo_ta }}</p>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-export" @click="showDetailModal = false">
                <span class="btn-icon">❌</span>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Logs Confirmation Modal -->
    <div v-if="showClearModal" class="modal-overlay" @click="showClearModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa log cũ</h3>
          <button class="modal-close" @click="showClearModal = false">✕</button>
        </div>
        
        <div class="modal-body">
          <p>Bạn có muốn xóa các log cũ hơn <strong>{{ clearDays }} ngày</strong>?</p>
          <div class="form-group">
            <label for="clearDays">Số ngày giữ lại:</label>
            <input 
              type="number" 
              id="clearDays"
              v-model="clearDays"
              class="form-control"
              min="7"
              max="365"
            >
          </div>
          <p class="text-warning">⚠️ Hành động này không thể hoàn tác!</p>
          
          <div class="modal-actions">
            <button class="btn-export" @click="showClearModal = false">
              <span class="btn-icon">❌</span>
              Hủy
            </button>
            <button class="btn-export" @click="confirmClearLogs">
              <span class="btn-icon">🗑️</span>
              Xóa log cũ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { exportToExcel, formatDataForExcel } from '../../utils/excelExport.js'

// Data
const searchQuery = ref('')
const selectedAction = ref('')
const selectedUser = ref('')
const fromDate = ref('')
const toDate = ref('')
const selectedTimeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const showDetailModal = ref(false)
const showClearModal = ref(false)
const selectedLog = ref(null)
const clearDays = ref(30)

const timeFilters = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: '7days' },
  { label: '30 ngày', value: '30days' },
  { label: '90 ngày', value: '90days' }
]

// Available users for filtering
const availableUsers = ref([])

// Mock data - should match ERD nhat_ky_hoat_dong table
const activityLogs = ref([])

// Computed
const filteredLogs = computed(() => {
  let filtered = activityLogs.value

  if (searchQuery.value) {
    filtered = filtered.filter(log => 
      log.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.hanh_dong.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.mo_ta.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedAction.value) {
    filtered = filtered.filter(log => log.hanh_dong === selectedAction.value)
  }

  if (selectedUser.value) {
    filtered = filtered.filter(log => log.id_nguoi_dung === parseInt(selectedUser.value))
  }

  if (fromDate.value) {
    filtered = filtered.filter(log => 
      new Date(log.thoi_gian) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(log => 
      new Date(log.thoi_gian) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  // Sort by time descending (newest first)
  filtered = filtered.sort((a, b) => new Date(b.thoi_gian) - new Date(a.thoi_gian))

  return filtered.slice(startIndex.value, endIndex.value)
})

const totalLogs = computed(() => {
  let filtered = activityLogs.value

  if (searchQuery.value) {
    filtered = filtered.filter(log => 
      log.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.hanh_dong.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.mo_ta.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedAction.value) {
    filtered = filtered.filter(log => log.hanh_dong === selectedAction.value)
  }

  if (selectedUser.value) {
    filtered = filtered.filter(log => log.id_nguoi_dung === parseInt(selectedUser.value))
  }

  if (fromDate.value) {
    filtered = filtered.filter(log => 
      new Date(log.thoi_gian) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(log => 
      new Date(log.thoi_gian) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalLogs.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalLogs.value))

// Methods
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getActionClass = (action) => {
  const actionClasses = {
    'login': 'action-success',
    'logout': 'action-info',
    'login_failed': 'action-danger',
    'create_order': 'action-primary',
    'update_order': 'action-warning',
    'create_product': 'action-primary',
    'update_product': 'action-warning',
    'create_customer': 'action-primary',
    'update_customer': 'action-warning',
    'view_report': 'action-info',
    'export_data': 'action-secondary',
    'system_backup': 'action-success'
  }
  return actionClasses[action] || 'action-default'
}

const getActionText = (action) => {
  const actionTexts = {
    'login': 'Đăng nhập',
    'logout': 'Đăng xuất',
    'login_failed': 'Đăng nhập thất bại',
    'create_order': 'Tạo đơn hàng',
    'update_order': 'Cập nhật đơn hàng',
    'create_product': 'Tạo sản phẩm',
    'update_product': 'Cập nhật sản phẩm',
    'create_customer': 'Tạo khách hàng',
    'update_customer': 'Cập nhật khách hàng',
    'view_report': 'Xem báo cáo',
    'export_data': 'Xuất dữ liệu',
    'system_backup': 'Sao lưu hệ thống'
  }
  return actionTexts[action] || action
}

const getStatusClass = (log) => {
  if (log.hanh_dong === 'login_failed') {
    return 'badge-danger'
  } else if (log.hanh_dong.includes('create') || log.hanh_dong === 'login') {
    return 'badge-success'
  } else if (log.hanh_dong.includes('update')) {
    return 'badge-warning'
  } else {
    return 'badge-info'
  }
}

const getStatusText = (log) => {
  if (log.hanh_dong === 'login_failed') {
    return 'Thất bại'
  } else {
    return 'Thành công'
  }
}

const applyTimeFilter = (timeFilter) => {
  selectedTimeFilter.value = timeFilter
  const today = new Date()
  
  switch (timeFilter) {
    case 'today':
      fromDate.value = today.toISOString().split('T')[0]
      toDate.value = today.toISOString().split('T')[0]
      break
    case '7days':
      const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      fromDate.value = week.toISOString().split('T')[0]
      toDate.value = today.toISOString().split('T')[0]
      break
    case '30days':
      const month = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      fromDate.value = month.toISOString().split('T')[0]
      toDate.value = today.toISOString().split('T')[0]
      break
    case '90days':
      const quarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
      fromDate.value = quarter.toISOString().split('T')[0]
      toDate.value = today.toISOString().split('T')[0]
      break
    default:
      break
  }
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

const viewFullLog = (log) => {
  selectedLog.value = log
  showDetailModal.value = true
}

const exportLogs = () => {
  // Implementation for exporting logs
  alert('Xuất báo cáo nhật ký hoạt động')
}

const exportLogsToExcel = () => {
  try {
    const headerMapping = {
      thoi_gian: 'Thời gian',
      nguoi_dung: 'Người dùng',
      vai_tro: 'Vai trò',
      hanh_dong: 'Hành động',
      mo_ta: 'Mô tả',
      ip_address: 'IP Address',
      trang_thai: 'Trạng thái'
    }
    
    // Get all filtered logs, not just paginated ones
    let allFilteredLogs = activityLogs.value

    if (searchQuery.value) {
      allFilteredLogs = allFilteredLogs.filter(log => 
        log.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        log.hanh_dong.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        log.mo_ta.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    if (selectedAction.value) {
      allFilteredLogs = allFilteredLogs.filter(log => log.hanh_dong === selectedAction.value)
    }

    if (selectedUser.value) {
      allFilteredLogs = allFilteredLogs.filter(log => log.id_nguoi_dung === parseInt(selectedUser.value))
    }

    if (fromDate.value) {
      allFilteredLogs = allFilteredLogs.filter(log => 
        new Date(log.thoi_gian) >= new Date(fromDate.value)
      )
    }

    if (toDate.value) {
      allFilteredLogs = allFilteredLogs.filter(log => 
        new Date(log.thoi_gian) <= new Date(toDate.value + 'T23:59:59')
      )
    }

    // Sort by time descending (newest first)
    allFilteredLogs = allFilteredLogs.sort((a, b) => new Date(b.thoi_gian) - new Date(a.thoi_gian))
    
    const dataToExport = allFilteredLogs.map(item => ({
      thoi_gian: formatDateTime(item.thoi_gian),
      nguoi_dung: item.nguoi_dung.ho_ten,
      vai_tro: item.nguoi_dung.vai_tro,
      hanh_dong: getActionText(item.hanh_dong),
      mo_ta: item.mo_ta,
      ip_address: item.ip_address,
      trang_thai: getStatusText(item)
    }))
    
    const formattedData = formatDataForExcel(dataToExport, headerMapping)
    
    const result = exportToExcel(
      formattedData,
      'Nhat_ky_hoat_dong',
      'Nhật ký hoạt động',
      { skipHeader: false }
    )
    
    if (result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result.message}`)
    }
  } catch (error) {
    console.error('Error in exportToExcel:', error)
    alert('❌ Có lỗi xảy ra khi xuất file Excel')
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await loadActivityLogs()
    console.log('Activity logs data refreshed successfully')
  } catch (error) {
    console.error('Error refreshing activity logs data:', error)
  } finally {
    loading.value = false
  }
}

const confirmClearLogs = () => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - clearDays.value)
  
  const initialCount = activityLogs.value.length
  activityLogs.value = activityLogs.value.filter(log => 
    new Date(log.thoi_gian) >= cutoffDate
  )
  
  const deletedCount = initialCount - activityLogs.value.length
  alert(`Đã xóa ${deletedCount} log cũ hơn ${clearDays.value} ngày`)
  
  showClearModal.value = false
}

onMounted(() => {
  // Set default time filter to 7 days
  applyTimeFilter('7days')
})
</script>

<style scoped>
.activity-logs-management {
  max-width: 1800px;
  margin: 0 auto;
}

/* page-header styles are now defined in globals.css */

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-controls > div {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.date-filters {
  display: flex;
  gap: 1rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-group label {
  font-size: 0.875rem;
  color: var(--medium-gray);
  font-weight: 500;
}

.time-filters {
  display: flex;
  gap: 0.5rem;
}

.time-filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.time-filter-btn.active,
.time-filter-btn:hover {
  background-color: #4ade80;
  border-color: #4ade80;
  color: white;
}

/* Table Styles */
.table th {
  background-color: #4ade80;
  color: white;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
}

.table td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
}

.danger-row {
  background-color: rgba(220, 53, 69, 0.1);
}

.time-info {
  text-align: center;
}

.time {
  font-weight: 600;
  color: var(--secondary-color);
}

.date {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.user-info {
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: var(--secondary-color);
}

.user-role {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.action-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-primary { background-color: #007bff; color: white; }
.action-success { background-color: #28a745; color: white; }
.action-warning { background-color: #ffc107; color: #212529; }
.action-danger { background-color: #dc3545; color: white; }
.action-info { background-color: #17a2b8; color: white; }
.action-secondary { background-color: #6c757d; color: white; }
.action-default { background-color: #e9ecef; color: #495057; }

.description {
  text-align: left;
  max-width: 300px;
}

.description p {
  margin: 0;
  color: var(--secondary-color);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.btn-link {
  background: none;
  border: none;
  color: #4ade80;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
}

.ip-address {
  font-family: monospace;
  background-color: var(--light-gray);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: var(--medium-gray);
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
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

/* Log Detail */
.log-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.125rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.description-full {
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #4ade80;
}

.description-full p {
  margin: 0;
  color: var(--secondary-color);
  line-height: 1.6;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
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

/* Responsive Design */
@media (max-width: 1200px) {
  .filter-controls > div {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .date-filters {
    flex-direction: column;
  }
  
  .time-filters {
    justify-content: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* page-header responsive styles are handled in globals.css */
  
  .header-actions {
    flex-direction: column;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem;
  }
  
  .description {
    max-width: 200px;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .time-filters {
    flex-direction: column;
  }
}

/* Excel button styling */
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>
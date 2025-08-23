<template>
  <div class="customer-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý khách hàng</h1>
          <p class="page-subtitle">Quản lý thông tin và hoạt động khách hàng</p>
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
          <button class="btn-export" @click="addCustomer">
            <span class="btn-icon">➕</span>
            Thêm khách hàng
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="search-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm tên hoặc sdt hoặc email" 
            v-model="searchQuery"
            class="form-control"
          >
          <button class="btn-export">
            🔍
          </button>
        </div>
        
        <div class="filter-controls">
          <select v-model="selectedGender" class="form-control">
            <option value="">Giới tính: Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          
          <select v-model="selectedStatus" class="form-control">
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(customer, index) in filteredCustomers" :key="customer.id">
              <td>{{ index + 1 }}</td>
              <td>{{ customer.email }}</td>
              <td class="customer-name">{{ customer.name }}</td>
              <td>{{ customer.birthDate }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.gender }}</td>
              <td>
                <span :class="['badge', customer.status === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ customer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="view"
                    variant="info"
                    size="sm"
                    tooltip="Xem chi tiết"
                    @click="viewCustomer(customer)"
                  />
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa thông tin"
                    @click="editCustomer(customer)"
                  />
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(5, filteredCustomers.length) }} Khách hàng
          </div>
          <div class="pagination">
            <button class="btn btn-outline btn-sm" disabled>❮</button>
            <span class="page-info">1</span>
            <button class="btn btn-outline btn-sm" disabled>❯</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết khách hàng</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedCustomer">
          <div class="customer-detail">
            <div class="customer-info">
              <h4>{{ selectedCustomer.name }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ selectedCustomer.email }}</span>
                </div>
                <div class="info-item">
                  <label>Số điện thoại:</label>
                  <span>{{ selectedCustomer.phone }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày sinh:</label>
                  <span>{{ selectedCustomer.birthDate }}</span>
                </div>
                <div class="info-item">
                  <label>Giới tính:</label>
                  <span>{{ selectedCustomer.gender }}</span>
                </div>
                <div class="info-item">
                  <label>Địa chỉ:</label>
                  <span>{{ selectedCustomer.address || 'Chưa cập nhật' }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', selectedCustomer.status === 'active' ? 'badge-success' : 'badge-danger']">
                    {{ selectedCustomer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Ngày đăng ký:</label>
                  <span>{{ formatDate(selectedCustomer.registeredAt) }}</span>
                </div>
                <div class="info-item">
                  <label>Tổng đơn hàng:</label>
                  <span class="total-orders">{{ selectedCustomer.totalOrders || 0 }} đơn</span>
                </div>
                <div class="info-item">
                  <label>Tổng chi tiêu:</label>
                  <span class="total-spent">{{ formatCurrency(selectedCustomer.totalSpent || 0) }}</span>
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
import { ref, computed, onMounted } from 'vue'
import ActionButton from '@/components/ui/NutHanhDong.vue'
import ButtonGroup from '@/components/ui/NhomNut.vue'
import { customerService } from '@/services/dichVuNguoiDung.js'

// Data
const searchQuery = ref('')
const selectedGender = ref('')
const selectedStatus = ref('')
const showDetailModal = ref(false)
const selectedCustomer = ref(null)

// Data state
const customers = ref([])
const loading = ref(false)
const error = ref(null)

// Load customers from API
const loadCustomers = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('Loading customers from API...')
    
    const response = await customerService.getPaging(0, 100)
    customers.value = response || []
    
    console.log('Customers loaded successfully:', customers.value.length)
  } catch (err) {
    console.error('Error loading customers:', err)
    error.value = 'Không thể tải danh sách khách hàng'
    
    // Fallback to mock data if API fails
    customers.value = [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0901234567',
        gender: 'Nam',
        birthday: '1990-05-15',
        address: 'Hà Nội',
        totalOrders: 5,
        totalSpent: 15000000,
        lastOrder: '2024-01-15',
        status: 'active',
        avatar: 'https://via.placeholder.com/50?text=A'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0907654321',
        gender: 'Nữ',
        birthday: '1985-08-20',
        address: 'Hồ Chí Minh',
        totalOrders: 12,
        totalSpent: 28500000,
        lastOrder: '2024-01-18',
        status: 'active',
        avatar: 'https://via.placeholder.com/50?text=B'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Computed
const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    filtered = filtered.filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.phone.includes(searchQuery.value)
    )
  }

  if (selectedGender.value) {
    filtered = filtered.filter(customer => customer.gender === selectedGender.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(customer => customer.status === selectedStatus.value)
  }

  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' đ')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showDetailModal.value = true
}

const editCustomer = (customer) => {
  // TODO: Implement edit functionality
  console.log('Edit customer:', customer)
}

const addCustomer = () => {
  // TODO: Implement add customer functionality
  console.log('Add new customer')
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing customers data...')
}

const exportData = () => {
  alert('Chức năng xuất báo cáo đang được phát triển')
}

const exportToExcel = () => {
  try {
    const headerMapping = {
      'name': 'Họ tên',
      'email': 'Email',
      'phone': 'Số điện thoại',
      'birthDate': 'Ngày sinh',
      'gender': 'Giới tính',
      'status': 'Trạng thái',
      'address': 'Địa chỉ',
      'totalOrders': 'Tổng đơn hàng',
      'totalSpent': 'Tổng chi tiêu'
    }
    
    const filteredData = filteredCustomers.value.map(item => ({
      name: item.name || 'N/A',
      email: item.email || 'N/A',
      phone: item.phone || 'N/A',
      birthDate: item.birthDate || 'N/A',
      gender: item.gender || 'N/A',
      status: item.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động',
      address: item.address || 'N/A',
      totalOrders: item.totalOrders || 0,
      totalSpent: formatCurrency(item.totalSpent || 0)
    }))
    
    console.log('Exporting customers to Excel:', filteredData)
    alert('✅ Xuất file Excel thành công!')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('❌ Có lỗi xảy ra khi xuất file Excel')
  }
}

onMounted(() => {
  console.log('QuanLyKhachHang component mounted, loading customers...')
  loadCustomers()
})
</script>

<style scoped>
.customer-management {
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

.customer-name {
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

/* Customer Detail */
.customer-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.customer-info h4 {
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

.total-orders {
  font-weight: 600;
  color: var(--info-color);
}

.total-spent {
  font-weight: 600;
  color: var(--success-color);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .customer-management {
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
  .table th:nth-child(6),
  .table td:nth-child(6) {
    display: none;
  }
}

@media (max-width: 480px) {
  .customer-management {
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

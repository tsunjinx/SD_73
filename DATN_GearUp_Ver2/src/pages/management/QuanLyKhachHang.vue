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
            placeholder="Tìm kiếm tên, số điện thoại hoặc email" 
            v-model="searchQuery"
            class="form-control"
          >
          <button class="btn-export">🔍</button>
        </div>

        <div class="filter-controls">
          <select v-model="selectedGioiTinh" class="form-control">
            <option :value="null">Giới tính: Tất cả</option>
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>

          <select v-model="selectedDeleted" class="form-control">
            <option :value="null">Trạng thái: Tất cả</option>
            <option :value="false">Hoạt động</option>
            <option :value="true">Ngừng hoạt động</option>
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
              <td class="customer-name">{{ customer.tenKhachHang }}</td>
              <td>{{ formatDate(customer.ngaySinh) }}</td>
              <td>{{ customer.soDienThoai }}</td>
              <td>{{ customer.gioiTinh === true ? 'Nam' : customer.gioiTinh === false ? 'Nữ' : 'Chưa cập nhật' }}</td>
              <td>
                <span :class="['badge', customer.deleted === false ? 'badge-success' : 'badge-danger']">
                  {{ customer.deleted === false ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <button class="btn btn-info btn-sm" @click="viewCustomer(customer)">👁 Xem</button>
                <button class="btn btn-warning btn-sm" @click="editCustomerHandler(customer)">✏️ Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination (giả lập) -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(5, filteredCustomers.length) }} khách hàng
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
              <h4>{{ selectedCustomer.tenKhachHang }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ selectedCustomer.email }}</span>
                </div>
                <div class="info-item">
                  <label>Số điện thoại:</label>
                  <span>{{ selectedCustomer.soDienThoai }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày sinh:</label>
                  <span>{{ formatDate(selectedCustomer.ngaySinh) }}</span>
                </div>
                <div class="info-item">
                  <label>Giới tính:</label>
                  <span>
                    {{ selectedCustomer.gioiTinh === true ? 'Nam' : selectedCustomer.gioiTinh === false ? 'Nữ' : 'Chưa cập nhật' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Địa chỉ:</label>
                  <span>
                    {{ selectedCustomer.diaChiKhachHangs.length > 0
                      ? selectedCustomer.diaChiKhachHangs[0].address || selectedCustomer.diaChiKhachHangs[0].diaChi
                      : 'Chưa cập nhật' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', selectedCustomer.deleted === false ? 'badge-success' : 'badge-danger']">
                    {{ selectedCustomer.deleted === false ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Ngày đăng ký:</label>
                  <span>{{ formatDate(selectedCustomer.createAt) }}</span>
                </div>
                <div class="info-item">
                  <label>Tổng đơn hàng:</label>
                  <span class="total-orders">{{ selectedCustomer.hoaDons.length || 0 }} đơn</span>
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

    <!-- Add Customer Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Thêm khách hàng mới</h3>
          <button class="modal-close" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddCustomer">
            <div class="form-group">
              <label>Họ tên</label>
              <input type="text" v-model="newCustomer.tenKhachHang" required />
            </div>
            <div class="form-group">
              <label>Tên tài khoản</label>
              <input type="text" v-model="newCustomer.tenTaiKhoan" required />
            </div>
            <div class="form-group">
              <label>Mật khẩu</label>
              <input type="password" v-model="newCustomer.matKhau" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newCustomer.email" required />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" v-model="newCustomer.soDienThoai" required />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="newCustomer.gioiTinh" required>
                <option :value="null" disabled>Chọn giới tính</option>
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngày sinh</label>
              <input type="date" v-model="newCustomer.ngaySinh" required />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Thêm khách hàng</button>
              <button type="button" class="btn btn-secondary" @click="showAddModal = false">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div> 

    <!-- Edit Customer Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chỉnh sửa khách hàng</h3>
          <button class="modal-close" @click="showEditModal = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitEditCustomer">
            <div class="form-group">
              <label>Họ tên</label>
              <input type="text" v-model="editCustomer.tenKhachHang" required />
            </div>
            <div class="form-group">
              <label>Tên tài khoản</label>
              <input type="text" v-model="editCustomer.tenTaiKhoan" disabled />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="editCustomer.email" required />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" v-model="editCustomer.soDienThoai" required />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="editCustomer.gioiTinh" required>
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngày sinh</label>
              <input type="date" v-model="editCustomer.ngaySinh" required />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
              <button type="button" class="btn btn-secondary" @click="showEditModal = false">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div> 

  </div> 
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Trạng thái dữ liệu
const customers = ref([])
const searchQuery = ref('')
const selectedGioiTinh = ref(null)
const selectedDeleted = ref(null)
const showDetailModal = ref(false)
const selectedCustomer = ref(null)
const loading = ref(false) 
const error = ref(null) 

// Thêm khách hàng modal
const showAddModal = ref(false)
const newCustomer = ref({
  tenKhachHang: '',
  tenTaiKhoan: '',
  matKhau: '',
  email: '',
  soDienThoai: '',
  gioiTinh: null,
  ngaySinh: '',
  deleted: false,
  createAt: new Date().toISOString().split('T')[0]
})

// Sửa khách hàng modal
const showEditModal = ref(false)
const editCustomer = ref({
  id: null,
  tenKhachHang: '',
  tenTaiKhoan: '',
  email: '',
  soDienThoai: '',
  gioiTinh: null,
  ngaySinh: ''
})

// Lấy danh sách khách hàng từ backend
const fetchCustomers = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('http://localhost:8080/api/khach-hang')
    customers.value = res.data.map(c => ({
      ...c,
      totalSpent: c.totalSpent || 0,
      diaChiKhachHangs: c.diaChiKhachHangs || [],
      hoaDons: c.hoaDons || []
    }))
  } catch (err) {
    error.value = err.message
    alert('Lỗi khi tải khách hàng: ' + error.value)
  } finally {
    loading.value = false
  }
}

// Bộ lọc khách hàng
const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      (c.tenKhachHang?.toLowerCase().includes(q)) ||
      (c.email?.toLowerCase().includes(q)) ||
      (c.soDienThoai?.includes(q))
    )
  }

  if (selectedGioiTinh.value !== null) {
    filtered = filtered.filter(c => c.gioiTinh === selectedGioiTinh.value)
  }

  if (selectedDeleted.value !== null) {
    filtered = filtered.filter(c => c.deleted === selectedDeleted.value)
  }

  return filtered
})

// Format ngày
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Format tiền
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Xem chi tiết khách hàng
const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showDetailModal.value = true
}

// Mở modal thêm khách hàng
const addCustomer = () => {
  newCustomer.value = {
    tenKhachHang: '',
    tenTaiKhoan: '',
    matKhau: '',
    email: '',
    soDienThoai: '',
    gioiTinh: null,
    ngaySinh: '',
    deleted: false,
    createAt: new Date().toISOString().split('T')[0]
  }
  showAddModal.value = true
}

// Gửi dữ liệu thêm khách hàng lên server
const submitAddCustomer = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/khach-hang', newCustomer.value)
    customers.value.push(res.data)
    showAddModal.value = false
    alert('✅ Thêm khách hàng thành công!')
  } catch (err) {
    alert('❌ Lỗi khi thêm khách hàng: ' + (err.response?.data?.message || err.message))
  }
}

// Mở modal sửa khách hàng với dữ liệu hiện tại
const openEditCustomer = (customer) => {
  editCustomer.value = { ...customer }
  showEditModal.value = true
}

const editCustomerHandler = (customer) => {
  openEditCustomer(customer)
}

// Gửi request cập nhật khách hàng
const submitEditCustomer = async () => {
  try {
    const res = await axios.put(`http://localhost:8080/api/khach-hang/${editCustomer.value.id}`, editCustomer.value)
    const idx = customers.value.findIndex(c => c.id === editCustomer.value.id)
    if (idx !== -1) {
      customers.value[idx] = res.data
    }
    showEditModal.value = false
    alert('✅ Cập nhật khách hàng thành công!')
  } catch (err) {
    alert('❌ Lỗi khi cập nhật khách hàng: ' + (err.response?.data?.message || err.message))
  }
}

// Làm mới dữ liệu
const refreshData = () => {
  fetchCustomers()
}

// Giả lập export báo cáo
const exportData = () => {
  alert('Chức năng xuất báo cáo đang phát triển...')
}

// Giả lập export Excel
const exportToExcel = () => {
  alert('Chức năng xuất Excel đang phát triển...')
}

// Khởi tạo dữ liệu
onMounted(() => {
  fetchCustomers()
})

</script>
<<<<<<< HEAD
--abcccccccc
=======
>>>>>>> 65a34ad (Mô tả thay đổi của bạn)



<style scoped>
/* Form Add Customer Modal Styles */
.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--secondary-color);
}

.form-group input,
.form-group select {
  padding: 0.55rem 0.9rem;
  font-size: 1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  outline-offset: 2px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 6px var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.4rem;
}

.form-actions button {
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #fff;
}

.btn-primary:hover {
  background-color: #34c759; /* Màu xanh đậm hơn khi hover */
}

.btn-secondary {
  background-color: var(--light-gray);
  color: var(--secondary-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

/* Responsive for small devices */
@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }
}

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

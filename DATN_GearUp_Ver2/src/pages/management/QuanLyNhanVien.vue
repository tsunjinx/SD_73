<template>
  <div class="employee-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý nhân viên</h1>
          <p class="page-subtitle">Quản lý thông tin và quyền hạn nhân viên</p>
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
            Tạo nhân viên
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
            placeholder="tên hoặc sđt hoặc email" 
            v-model="searchQuery"
            class="form-control"
          >
          <button class="btn btn-primary" @click.prevent>
            <span class="btn-icon">🔍</span>
            Tìm kiếm
          </button>
        </div>
        
        <div class="filter-controls">
          <select v-model="selectedGender" class="form-control">
            <option value="">Giới tính: Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          
          <select v-model="selectedRole" class="form-control">
            <option value="">Chức vụ: Tất cả</option>
            <option value="admin">Quản lý</option>
            <option value="staff">Nhân viên</option>
          </select>
          
          <select v-model="selectedStatus" class="form-control">
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Mã NV</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in filteredEmployees" :key="employee.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="employee-avatar">
                  <img v-if="employee.anhNhanVien" :src="employee.anhNhanVien" :alt="employee.tenNhanVien">
                  <div v-else class="placeholder-avatar">👤</div>
                </div>
              </td>
              <td class="employee-code">{{ employee.id }}</td>
              <td class="employee-name">{{ employee.tenNhanVien }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.soDienThoai }}</td>
              <td>{{ employee.ngaySinh }}</td>
              <td>{{ employee.gioiTinh }}</td>
              <td>{{ employee.idQuyenHan === 2 ? 'Quản lý' : 'Nhân viên' }}</td>
              <td>
                <span :class="['badge', employee.trangThai === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ employee.trangThai === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <button class="btn-export" @click="viewEmployee(employee)">
                  <span class="btn-icon">👁️</span>
                  Xem
                </button>
                <button class="btn-export" @click="editEmployee(employee)">
                  <span class="btn-icon">✏️</span>
                  Sửa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Xem {{ Math.min(5, filteredEmployees.length) }} Nhân viên
          </div>
          <div class="pagination">
            <button class="btn btn-outline btn-sm" disabled>❮</button>
            <span class="page-info">1</span>
            <button class="btn btn-outline btn-sm" disabled>❯</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Employee Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Thông tin nhân viên</h3>
          <button class="modal-close" @click="showAddModal = false">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-sections">
            <div class="form-section">
              <h4>Thông tin chi tiết</h4>
              <div class="avatar-upload">
                <div class="avatar-preview">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar">
                  <div v-else class="placeholder-avatar large">
                    📷
                    <span>Chọn ảnh</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  @change="handleAvatarUpload" 
                  accept="image/*"
                  class="file-input"
                >
              </div>
            </div>

            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">*Số CCCD</label>
                  <input 
                    type="text" 
                    v-model="employeeForm.cccd" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">*Giới tính</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" value="Nam" v-model="employeeForm.gioiTinh">
                      <span>Nam</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" value="Nữ" v-model="employeeForm.gioiTinh">
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">*Ngày sinh</label>
                <input 
                  type="date" 
                  v-model="employeeForm.ngaySinh" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">*Email</label>
                <input 
                  type="email" 
                  v-model="employeeForm.email" 
                  class="form-control" 
                  required
                >
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">*Họ Và Tên</label>
                  <input 
                    type="text" 
                    v-model="employeeForm.tenNhanVien" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="thanhPho">*Tỉnh/thành phố</label>
                  <input
                    id="thanhPho"
                    type="text"
                    v-model="employeeForm.thanhPho"
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="quan">*Quận/huyện</label>
                  <input
                    id="quan"
                    type="text"
                    v-model="employeeForm.quan"
                    placeholder="Nhập quận/huyện"
                  />
                </div>
                <div class="form-group">
                   <label for="phuong">*Xã/phường/thị trấn</label>
                  <input
                    id="phuong"
                    type="text"
                    v-model="employeeForm.phuong"
                    placeholder="Nhập xã/phường/thị trấn"
                  />
                </div>
              </div>
               <div class="form-group">
              <label for="tenQuyenHan">*Chức vụ / Quyền hạn</label>
              <select v-model="employeeForm.idQuyenHan">
                <option :value="1">Nhân viên</option>
                <option :value="2">Quản lý</option>
              </select>

              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">*Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    v-model="employeeForm.soDienThoai" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">*Địa chỉ cụ thể</label>
                  <input 
                    type="text" 
                    v-model="employeeForm.diaChiCuThe" 
                    class="form-control" 
                    required
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showAddModal = false">
            Hủy
          </button>
          <button type="submit" class="btn btn-primary" @click="saveEmployee">
            Thêm Nhân Viên
          </button>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết nhân viên</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedEmployee">
          <div class="employee-detail">
            <div class="avatar-preview">
              <img v-if="selectedEmployee.anhNhanVien" :src="selectedEmployee.anhNhanVien" alt="Avatar">
              <div v-else class="placeholder-avatar large">👤</div>
            </div>
            <p><strong>Mã NV:</strong> {{ selectedEmployee.id }}</p>
            <p><strong>Họ và tên:</strong> {{ selectedEmployee.tenNhanVien }}</p>
            <p><strong>Email:</strong> {{ selectedEmployee.email }}</p>
            <p><strong>Số điện thoại:</strong> {{ selectedEmployee.soDienThoai }}</p>
            <p><strong>Ngày sinh:</strong> {{ selectedEmployee.ngaySinh }}</p>
            <p><strong>Giới tính:</strong> {{ selectedEmployee.gioiTinh }}</p>
            <p><strong>Chức vụ:</strong> {{ selectedEmployee.idQuyenHan === 'admin' ? 'Quản lý' : 'Nhân viên' }}</p>
            <p><strong>Trạng thái:</strong> 
              <span :class="['badge', selectedEmployee.trangThai === 'active' ? 'badge-success' : 'badge-danger']">
                {{ selectedEmployee.trangThai === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showDetailModal = false">Đóng</button>
        </div>
      </div>
    </div>

  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Map dữ liệu backend sang frontend
const mapEmployee = (raw) => ({
  id: raw.id,
  tenNhanVien: raw.tenNhanVien || 'N/A',
  email: raw.email || 'N/A',
  soDienThoai: raw.soDienThoai || 'N/A',
  ngaySinh: raw.ngaySinh || 'N/A',
  gioiTinh: raw.gioiTinh || 'N/A',
  idQuyenHan: raw.idQuyenHan || 'Nhân viên',
  trangThai: raw.trangThai || 'active',
  anhNhanVien: raw.anhNhanVien 
    ? `http://localhost:8080/images/${raw.anhNhanVien}` 
    : ''
})

const searchQuery = ref('')
const selectedGender = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedEmployee = ref(null)
const avatarPreview = ref('')

const employeeForm = ref({
  anhNhanVien: '',
  cccd: '',
  gioiTinh: '',
  ngaySinh: '',
  email: '',
  tenNhanVien: '',
  thanhPho: '',
  quan: '',
  phuong: '',
  idQuyenHan: '',
  soDienThoai: '',
  diaChiCuThe: '',
})

const employees = ref([])

const loadEmployees = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/nhanvien')
    employees.value = res.data.map(mapEmployee)
    console.log('Kết quả gọi API:', employees.value)
  } catch (error) {
    console.error('Lỗi load nhân viên:', error)
    alert('Không thể tải dữ liệu nhân viên')
  }
}

const saveEmployee = async () => {
  // Kiểm tra bắt buộc...
  if (
    !employeeForm.value.tenNhanVien || 
    !employeeForm.value.email || 
    !employeeForm.value.soDienThoai || 
    !employeeForm.value.cccd || 
    !employeeForm.value.gioiTinh || 
    !employeeForm.value.ngaySinh || 
    !employeeForm.value.thanhPho || 
    !employeeForm.value.quan ||  
    !employeeForm.value.phuong ||  
    !employeeForm.value.diaChiCuThe || 
    !employeeForm.value.idQuyenHan
  ) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  // Tạo payload gửi về backend
  const payload = {
    ...employeeForm.value,
    idQuyenHan: { id: employeeForm.value.idQuyenHan }  // <-- gửi object với id
  }

  try {
    await axios.post('http://localhost:8080/api/nhanvien', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    alert('Thêm nhân viên thành công!')
    showAddModal.value = false
    resetForm()
    await loadEmployees()
  } catch (error) {
    console.error('Lỗi thêm nhân viên:', error) 
    alert('Thêm nhân viên thất bại.') 
  }
}



const resetForm = () => {
  employeeForm.value = {
    cccd: '',
    gioiTinh: '',
    ngaySinh: '',
    email: '',
    tenNhanVien: '',
    thanhPho: '',
    quan: '',
    phuong: '',
    soDienThoai: '',
    diaChiCuThe: '',
    anhNhanVien: '',
    idQuyenHan: ''
  }
  avatarPreview.value = ''
}

const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(employee => 
      employee.tenNhanVien.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q) ||
      employee.soDienThoai.includes(q)
    )
  }

  if (selectedGender.value) {
    filtered = filtered.filter(employee => employee.gioiTinh === selectedGender.value)
  }

  if (selectedRole.value) {
    filtered = filtered.filter(employee => employee.idQuyenHan === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(employee => employee.trangThai === selectedStatus.value)
  }

  return filtered
})

const viewEmployee = (employee) => {
  selectedEmployee.value = employee
  showDetailModal.value = true
}

const editEmployee = (employee) => {
  console.log('Edit employee:', employee)
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarPreview.value = URL.createObjectURL(file)
    employeeForm.value.anhNhanVien = file  
  }
}

const refreshData = () => {
  loadEmployees()
}

const exportData = () => {
  alert('Chức năng xuất báo cáo đang được phát triển')
}

const exportToExcel = () => {
  try {
    const filteredData = filteredEmployees.value.map(item => ({
      code: item.id || 'N/A',
      name: item.tenNhanVien || 'N/A',
      email: item.email || 'N/A',
      phone: item.soDienThoai || 'N/A',
      birthDate: item.ngaySinh || 'N/A',
      gender: item.gioiTinh || 'N/A',
      role: item.idQuyenHan === 'admin' ? 'Quản lý' : 'Nhân viên',
      status: item.trangThai === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'
    }))

    console.log('Exporting employees to Excel:', filteredData)
    alert('✅ Xuất file Excel thành công!')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('❌ Có lỗi xảy ra khi xuất file Excel')
  }
}

onMounted(() => {
  loadEmployees()
})
</script>





<style scoped>
.employee-management {
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
  margin: 0;
  padding: 0;
  border: none;
  box-shadow: var(--shadow);
  border-radius: 12px;
  background: white;
}

.card-body {
  padding: 0.5rem;
  margin: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  border-spacing: 0;
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

.employee-avatar {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
}

.employee-avatar.large {
  width: 100px;
  height: 100px;
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  font-size: 1.5rem;
  flex-direction: column;
}

.placeholder-avatar.large {
  font-size: 2rem;
}

.placeholder-avatar span {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.employee-code {
  font-weight: 600;
  color: #4ade80;
}

.employee-name {
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
  max-width: 700px;
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

/* Form Sections */
.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.125rem;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border-color);
  cursor: pointer;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input {
  max-width: 200px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* Employee Detail */
.employee-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.employee-avatar-section {
  text-align: center;
}

.employee-info {
  width: 100%;
}

.employee-info h4 {
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
  .employee-management {
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
  
  .form-row {
    grid-template-columns: 1fr;
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
  .table th:nth-child(2),
  .table td:nth-child(2),
  .table th:nth-child(6),
  .table td:nth-child(6),
  .table th:nth-child(7),
  .table td:nth-child(7) {
    display: none;
  }
}

@media (max-width: 480px) {
  .employee-management {
    padding: 0 0.5rem;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
  
  /* Hide more columns on very small screens */
  .table th:nth-child(8),
  .table td:nth-child(8),
  .table th:nth-child(9),
  .table td:nth-child(9) {
    display: none;
  }
  
  .card {
    margin: 0 -0.5rem;
    border-radius: 0;
  }
}
</style>

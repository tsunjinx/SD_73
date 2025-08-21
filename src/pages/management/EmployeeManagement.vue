<template>
  <div class="employee-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-actions">
          <button class="btn-export" @click="showAddModal = true">
            <span class="btn-icon">👨‍💼</span>
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
            placeholder="tên hoặc sdt hoặc email" 
            v-model="searchQuery"
            class="form-control"
          >
          <ActionButton
            icon="search"
            variant="secondary"
            size="sm"
            tooltip="Tìm kiếm"
          />
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

    <!-- Employees Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Code</th>
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
                  <img v-if="employee.avatar" :src="employee.avatar" :alt="employee.name">
                  <div v-else class="placeholder-avatar">👤</div>
                </div>
              </td>
              <td class="employee-code">{{ employee.code }}</td>
              <td class="employee-name">{{ employee.name }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.phone }}</td>
              <td>{{ employee.birthDate }}</td>
              <td>{{ employee.gender }}</td>
              <td>{{ employee.role === 'admin' ? 'Quản lý' : 'Nhân viên' }}</td>
              <td>
                <span :class="['badge', employee.status === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ employee.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="view"
                    variant="info"
                    size="sm"
                    tooltip="Xem chi tiết"
                    @click="viewEmployee(employee)"
                  />
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa nhân viên"
                    @click="editEmployee(employee)"
                  />
                </ButtonGroup>
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
                      <input type="radio" value="Nam" v-model="employeeForm.gender">
                      <span>Nam</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" value="Nữ" v-model="employeeForm.gender">
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">*Ngày sinh</label>
                <input 
                  type="date" 
                  v-model="employeeForm.birthDate" 
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
                    v-model="employeeForm.name" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">*Tỉnh/thành phố</label>
                  <select v-model="employeeForm.province" class="form-control" required>
                    <option value="">nhập tên tỉnh</option>
                    <option value="Sơn La">Sơn La</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP HCM">TP HCM</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">*Quận/huyện</label>
                  <select v-model="employeeForm.district" class="form-control" required>
                    <option value="">nhập tên huyện</option>
                    <option value="Huyện Quỳnh Nhai">Huyện Quỳnh Nhai</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">*Xã/phường/thị trấn</label>
                  <select v-model="employeeForm.ward" class="form-control" required>
                    <option value="">nhập tên xã</option>
                    <option value="Xã Mường Giàng">Xã Mường Giàng</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">*Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    v-model="employeeForm.phone" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">*Địa chỉ cụ thể</label>
                  <input 
                    type="text" 
                    v-model="employeeForm.address" 
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
            <div class="employee-avatar-section">
              <div class="employee-avatar large">
                <img v-if="selectedEmployee.avatar" :src="selectedEmployee.avatar" :alt="selectedEmployee.name">
                <div v-else class="placeholder-avatar large">👤</div>
              </div>
            </div>
            
            <div class="employee-info">
              <h4>{{ selectedEmployee.name }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Mã nhân viên:</label>
                  <span>{{ selectedEmployee.code }}</span>
                </div>
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ selectedEmployee.email }}</span>
                </div>
                <div class="info-item">
                  <label>Số điện thoại:</label>
                  <span>{{ selectedEmployee.phone }}</span>
                </div>
                <div class="info-item">
                  <label>Ngày sinh:</label>
                  <span>{{ selectedEmployee.birthDate }}</span>
                </div>
                <div class="info-item">
                  <label>Giới tính:</label>
                  <span>{{ selectedEmployee.gender }}</span>
                </div>
                <div class="info-item">
                  <label>Chức vụ:</label>
                  <span>{{ selectedEmployee.role === 'admin' ? 'Quản lý' : 'Nhân viên' }}</span>
                </div>
                <div class="info-item">
                  <label>Trạng thái:</label>
                  <span :class="['badge', selectedEmployee.status === 'active' ? 'badge-success' : 'badge-danger']">
                    {{ selectedEmployee.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
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

// Data
const searchQuery = ref('')
const selectedGender = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedEmployee = ref(null)
const avatarPreview = ref('')

const employeeForm = ref({
  cccd: '',
  gender: '',
  birthDate: '',
  email: '',
  name: '',
  province: '',
  district: '',
  ward: '',
  phone: '',
  address: '',
  avatar: ''
})

// Mock data
const employees = ref([
  {
    id: 1,
    code: 'NV001',
    name: 'Trần Thị Lan Anh',
    email: 'tranthilananh@gearup.com',
    phone: '0912345678',
    birthDate: '15-08-1990',
    gender: 'Nữ',
    role: 'admin',
    status: 'active',
    avatar: ''
  },
  {
    id: 2,
    code: 'NV002',
    name: 'Nguyễn Đức Minh',
    email: 'nguyenducminh@gearup.com',
    phone: '0987654321',
    birthDate: '23-11-1992',
    gender: 'Nam',
    role: 'staff',
    status: 'active',
    avatar: ''
  },
  {
    id: 3,
    code: 'NV003',
    name: 'Lê Thị Thu Hà',
    email: 'lethithuha@gearup.com',
    phone: '0934567890',
    birthDate: '07-05-1995',
    gender: 'Nữ',
    role: 'staff',
    status: 'active',
    avatar: ''
  },
  {
    id: 4,
    code: 'NV004',
    name: 'Phạm Văn Đức',
    email: 'phamvanduc@gearup.com',
    phone: '0945678901',
    birthDate: '12-09-1988',
    gender: 'Nam',
    role: 'admin',
    status: 'active',
    avatar: ''
  },
  {
    id: 5,
    code: 'NV005',
    name: 'Hoàng Thị Ngọc',
    email: 'hoangthingoc@gearup.com',
    phone: '0956789012',
    birthDate: '28-02-1993',
    gender: 'Nữ',
    role: 'staff',
    status: 'inactive',
    avatar: ''
  },
  {
    id: 6,
    code: 'NV006',
    name: 'Vũ Minh Tuấn',
    email: 'vuminhtuan@gearup.com',
    phone: '0967890123',
    birthDate: '19-07-1991',
    gender: 'Nam',
    role: 'staff',
    status: 'active',
    avatar: ''
  }
])

// Computed
const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (searchQuery.value) {
    filtered = filtered.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.phone.includes(searchQuery.value)
    )
  }

  if (selectedGender.value) {
    filtered = filtered.filter(employee => employee.gender === selectedGender.value)
  }

  if (selectedRole.value) {
    filtered = filtered.filter(employee => employee.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(employee => employee.status === selectedStatus.value)
  }

  return filtered
})

// Methods
const viewEmployee = (employee) => {
  selectedEmployee.value = employee
  showDetailModal.value = true
}

const editEmployee = (employee) => {
  // TODO: Implement edit functionality
  console.log('Edit employee:', employee)
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
      employeeForm.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveEmployee = () => {
  // Validate required fields
  if (!employeeForm.value.name || !employeeForm.value.email || !employeeForm.value.phone) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  // Add new employee
  const newEmployee = {
    ...employeeForm.value,
    id: Math.max(...employees.value.map(e => e.id)) + 1,
    code: `NV${employees.value.length + 1}`,
    role: 'staff',
    status: 'active'
  }
  
  employees.value.push(newEmployee)
  
  // Reset form
  resetForm()
  showAddModal.value = false
  
  alert('Thêm nhân viên thành công!')
}

const resetForm = () => {
  employeeForm.value = {
    cccd: '',
    gender: '',
    birthDate: '',
    email: '',
    name: '',
    province: '',
    district: '',
    ward: '',
    phone: '',
    address: '',
    avatar: ''
  }
  avatarPreview.value = ''
}
</script>

<style scoped>
.employee-management {
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
  color: var(--primary-color);
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

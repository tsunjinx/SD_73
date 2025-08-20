<template>
  <div class="reviews-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Quản lý đánh giá</h2>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sản phẩm hoặc khách hàng..." 
            v-model="searchQuery"
            class="form-control"
          >
        </div>
        
        <div class="filter-group">
          <select v-model="selectedRating" class="form-control">
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          
          <select v-model="selectedStatus" class="form-control">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hiển thị</option>
            <option value="hidden">Ẩn</option>
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
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Khách hàng</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Ngày đánh giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(review, index) in filteredReviews" :key="review.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="product-info">
                  <div class="product-image">
                    <img v-if="review.san_pham.hinh_anh" :src="review.san_pham.hinh_anh" :alt="review.san_pham.ten_san_pham">
                    <div v-else class="placeholder-image">👟</div>
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ review.san_pham.ten_san_pham }}</div>
                    <div class="product-code">{{ review.san_pham.ma_san_pham }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="customer-info">
                  <div class="customer-name">{{ review.nguoi_dung.ho_ten }}</div>
                  <div class="customer-email">{{ review.nguoi_dung.email }}</div>
                </div>
              </td>
              <td>
                <div class="rating">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" 
                          :class="['star', i <= review.diem ? 'filled' : 'empty']">
                      ★
                    </span>
                  </div>
                  <div class="rating-number">{{ review.diem }}/5</div>
                </div>
              </td>
              <td>
                <div class="review-content">
                  <p>{{ truncateText(review.mo_ta, 100) }}</p>
                  <button v-if="review.mo_ta.length > 100" 
                          class="btn-link" 
                          @click="viewFullReview(review)">
                    Xem thêm
                  </button>
                </div>
              </td>
              <td>{{ formatDate(review.ngay_danh_gia) }}</td>
              <td>
                <span :class="['badge', review.trang_thai ? 'badge-success' : 'badge-warning']">
                  {{ review.trang_thai ? 'Hiển thị' : 'Ẩn' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn btn-sm btn-outline" 
                    @click="viewFullReview(review)"
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>
                  <button 
                    :class="['btn', 'btn-sm', review.trang_thai ? 'btn-warning' : 'btn-success']"
                    @click="toggleReviewStatus(review)"
                    :title="review.trang_thai ? 'Ẩn đánh giá' : 'Hiển thị đánh giá'"
                  >
                    {{ review.trang_thai ? '🙈' : '👁️' }}
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteReview(review)"
                    title="Xóa đánh giá"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ totalReviews }} đánh giá
          </div>
          <div class="pagination">
            <button 
              class="btn btn-outline btn-sm" 
              @click="previousPage" 
              :disabled="currentPage === 1"
            >
              ❮ Trước
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              class="btn btn-outline btn-sm" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              Sau ❯
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết đánh giá</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedReview">
          <div class="review-detail">
            <!-- Product Info -->
            <div class="section">
              <h4>Thông tin sản phẩm</h4>
              <div class="product-detail">
                <div class="product-image-large">
                  <img v-if="selectedReview.san_pham.hinh_anh" 
                       :src="selectedReview.san_pham.hinh_anh" 
                       :alt="selectedReview.san_pham.ten_san_pham">
                  <div v-else class="placeholder-image">👟</div>
                </div>
                <div class="product-info-detail">
                  <h5>{{ selectedReview.san_pham.ten_san_pham }}</h5>
                  <p>Mã sản phẩm: {{ selectedReview.san_pham.ma_san_pham }}</p>
                  <p>Giá: {{ formatCurrency(selectedReview.san_pham.gia_ban) }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="section">
              <h4>Thông tin khách hàng</h4>
              <div class="customer-detail">
                <div class="customer-avatar">
                  <img v-if="selectedReview.nguoi_dung.anh_dai_dien" 
                       :src="selectedReview.nguoi_dung.anh_dai_dien" 
                       :alt="selectedReview.nguoi_dung.ho_ten">
                  <div v-else class="placeholder-avatar">👤</div>
                </div>
                <div class="customer-info-detail">
                  <h5>{{ selectedReview.nguoi_dung.ho_ten }}</h5>
                  <p>Email: {{ selectedReview.nguoi_dung.email }}</p>
                  <p>Số điện thoại: {{ selectedReview.nguoi_dung.sdt }}</p>
                </div>
              </div>
            </div>

            <!-- Review Content -->
            <div class="section">
              <h4>Nội dung đánh giá</h4>
              <div class="review-content-full">
                <div class="rating-large">
                  <div class="stars-large">
                    <span v-for="i in 5" :key="i" 
                          :class="['star', i <= selectedReview.diem ? 'filled' : 'empty']">
                      ★
                    </span>
                  </div>
                  <div class="rating-text">{{ selectedReview.diem }}/5 sao</div>
                </div>
                <div class="review-text">
                  <p>{{ selectedReview.mo_ta }}</p>
                </div>
                <div class="review-meta">
                  <p><strong>Ngày đánh giá:</strong> {{ formatDateTime(selectedReview.ngay_danh_gia) }}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span :class="['badge', selectedReview.trang_thai ? 'badge-success' : 'badge-warning']">
                      {{ selectedReview.trang_thai ? 'Hiển thị' : 'Ẩn' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button 
                :class="['btn', selectedReview.trang_thai ? 'btn-warning' : 'btn-success']"
                @click="toggleReviewStatus(selectedReview)"
              >
                {{ selectedReview.trang_thai ? 'Ẩn đánh giá' : 'Hiển thị đánh giá' }}
              </button>
              <button class="btn btn-danger" @click="deleteReview(selectedReview)">
                Xóa đánh giá
              </button>
              <button class="btn btn-secondary" @click="showDetailModal = false">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="modal-close" @click="showDeleteModal = false">✕</button>
        </div>
        
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
          <p class="text-warning">⚠️ Hành động này không thể hoàn tác!</p>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showDeleteModal = false">
              Hủy
            </button>
            <button class="btn btn-danger" @click="confirmDelete">
              Xóa
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
const selectedRating = ref('')
const selectedStatus = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedReview = ref(null)
const reviewToDelete = ref(null)

// Mock data - should match ERD danh_gia table with relationships
const reviews = ref([
  {
    id: 1,
    id_san_pham: 1,
    id_nguoi_dung: 1,
    ngay_danh_gia: '2023-12-20T10:30:00Z',
    diem: 5,
    mo_ta: 'Sản phẩm rất tốt, chất lượng cao, đóng gói cẩn thận. Giao hàng nhanh. Tôi rất hài lòng với sản phẩm này và sẽ tiếp tục mua hàng tại cửa hàng.',
    trang_thai: true,
    san_pham: {
      ten_san_pham: 'Giày Nike Air Max 270',
      ma_san_pham: 'NK001',
      gia_ban: 2500000,
      hinh_anh: ''
    },
    nguoi_dung: {
      ho_ten: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      sdt: '0901234567',
      anh_dai_dien: ''
    }
  },
  {
    id: 2,
    id_san_pham: 2,
    id_nguoi_dung: 2,
    ngay_danh_gia: '2023-12-19T15:20:00Z',
    diem: 4,
    mo_ta: 'Giày đẹp, chất lượng tốt nhưng size hơi nhỏ so với mô tả. Nhìn chung vẫn ổn.',
    trang_thai: true,
    san_pham: {
      ten_san_pham: 'Giày Adidas Ultraboost 22',
      ma_san_pham: 'AD002',
      gia_ban: 3200000,
      hinh_anh: ''
    },
    nguoi_dung: {
      ho_ten: 'Trần Thị Bình',
      email: 'tranthibinh@email.com',
      sdt: '0912345678',
      anh_dai_dien: ''
    }
  },
  {
    id: 3,
    id_san_pham: 1,
    id_nguoi_dung: 3,
    ngay_danh_gia: '2023-12-18T09:45:00Z',
    diem: 3,
    mo_ta: 'Sản phẩm bình thường, không có gì đặc biệt. Giá hơi cao so với chất lượng.',
    trang_thai: false,
    san_pham: {
      ten_san_pham: 'Giày Nike Air Max 270',
      ma_san_pham: 'NK001',
      gia_ban: 2500000,
      hinh_anh: ''
    },
    nguoi_dung: {
      ho_ten: 'Lê Văn Cường',
      email: 'levancuong@email.com',
      sdt: '0923456789',
      anh_dai_dien: ''
    }
  },
  {
    id: 4,
    id_san_pham: 3,
    id_nguoi_dung: 4,
    ngay_danh_gia: '2023-12-17T14:15:00Z',
    diem: 2,
    mo_ta: 'Chất lượng không như mong đợi. Giày bị lỗi sau 1 tuần sử dụng. Rất thất vọng.',
    trang_thai: true,
    san_pham: {
      ten_san_pham: 'Giày Converse Chuck Taylor',
      ma_san_pham: 'CV003',
      gia_ban: 1800000,
      hinh_anh: ''
    },
    nguoi_dung: {
      ho_ten: 'Phạm Thị Dung',
      email: 'phamthidung@email.com',
      sdt: '0934567890',
      anh_dai_dien: ''
    }
  },
  {
    id: 5,
    id_san_pham: 4,
    id_nguoi_dung: 5,
    ngay_danh_gia: '2023-12-16T11:30:00Z',
    diem: 1,
    mo_ta: 'Sản phẩm tệ, không giống hình. Giao hàng chậm, đóng gói kém.',
    trang_thai: false,
    san_pham: {
      ten_san_pham: 'Giày Vans Old Skool',
      ma_san_pham: 'VN004',
      gia_ban: 2200000,
      hinh_anh: ''
    },
    nguoi_dung: {
      ho_ten: 'Hoàng Văn Nam',
      email: 'hoangvannam@email.com',
      sdt: '0945678901',
      anh_dai_dien: ''
    }
  }
])

// Computed
const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (searchQuery.value) {
    filtered = filtered.filter(review => 
      review.san_pham.ten_san_pham.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.mo_ta.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRating.value) {
    filtered = filtered.filter(review => review.diem === parseInt(selectedRating.value))
  }

  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active'
    filtered = filtered.filter(review => review.trang_thai === isActive)
  }

  if (fromDate.value) {
    filtered = filtered.filter(review => 
      new Date(review.ngay_danh_gia) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(review => 
      new Date(review.ngay_danh_gia) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered.slice(startIndex.value, endIndex.value)
})

const totalReviews = computed(() => {
  let filtered = reviews.value

  if (searchQuery.value) {
    filtered = filtered.filter(review => 
      review.san_pham.ten_san_pham.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.nguoi_dung.ho_ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.mo_ta.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRating.value) {
    filtered = filtered.filter(review => review.diem === parseInt(selectedRating.value))
  }

  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active'
    filtered = filtered.filter(review => review.trang_thai === isActive)
  }

  if (fromDate.value) {
    filtered = filtered.filter(review => 
      new Date(review.ngay_danh_gia) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(review => 
      new Date(review.ngay_danh_gia) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalReviews.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalReviews.value))

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' đ')
}

const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
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

const viewFullReview = (review) => {
  selectedReview.value = review
  showDetailModal.value = true
}

const toggleReviewStatus = (review) => {
  review.trang_thai = !review.trang_thai
  if (selectedReview.value && selectedReview.value.id === review.id) {
    selectedReview.value.trang_thai = review.trang_thai
  }
}

const deleteReview = (review) => {
  reviewToDelete.value = review
  showDeleteModal.value = true
}

const confirmDelete = () => {
  const index = reviews.value.findIndex(r => r.id === reviewToDelete.value.id)
  if (index !== -1) {
    reviews.value.splice(index, 1)
  }
  showDeleteModal.value = false
  showDetailModal.value = false
  reviewToDelete.value = null
}

onMounted(() => {
  // Set default dates
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  toDate.value = today.toISOString().split('T')[0]
  fromDate.value = lastMonth.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Import base styles from OrderManagement.vue */
.reviews-management {
  max-width: 1600px;
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

.filter-controls {
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

.date-group input {
  min-width: 150px;
}

/* Table Styles */
.table th {
  background-color: var(--primary-color);
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

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  font-size: 1.5rem;
}

.product-name {
  font-weight: 600;
  color: var(--secondary-color);
}

.product-code {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.customer-info {
  text-align: left;
}

.customer-name {
  font-weight: 600;
  color: var(--secondary-color);
}

.customer-email {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stars {
  display: flex;
}

.star {
  font-size: 1.2rem;
}

.star.filled {
  color: #ffc107;
}

.star.empty {
  color: #e9ecef;
}

.rating-number {
  font-size: 0.875rem;
  color: var(--medium-gray);
}

.review-content {
  text-align: left;
  max-width: 200px;
}

.review-content p {
  margin: 0;
  color: var(--secondary-color);
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
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

.modal-content.large {
  max-width: 800px;
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

/* Review Detail */
.review-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.section h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
  font-size: 1.125rem;
}

.product-detail {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.product-image-large {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-detail h5 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-color);
}

.product-info-detail p {
  margin: 0.25rem 0;
  color: var(--medium-gray);
}

.customer-detail {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.customer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.customer-avatar img {
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
  font-size: 2rem;
}

.customer-info-detail h5 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-color);
}

.customer-info-detail p {
  margin: 0.25rem 0;
  color: var(--medium-gray);
}

.review-content-full {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating-large {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stars-large {
  display: flex;
}

.stars-large .star {
  font-size: 1.5rem;
}

.rating-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--secondary-color);
}

.review-text p {
  margin: 0;
  color: var(--secondary-color);
  line-height: 1.6;
}

.review-meta p {
  margin: 0.5rem 0;
  color: var(--medium-gray);
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
@media (max-width: 1200px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .date-filters {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
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
  
  .product-detail,
  .customer-detail {
    flex-direction: column;
    text-align: center;
  }
  
  .rating-large {
    flex-direction: column;
    text-align: center;
  }
}
</style>
<template>
  <div class="comments-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Bình luận</h1>
          <p class="page-subtitle">Kiểm duyệt và quản lý bình luận từ khách hàng</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Làm mới
          </button>
          <button class="btn-export" @click="exportComments">
            <span class="btn-icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn-export" @click="exportCommentsToExcel">
            <span class="btn-icon">📗</span>
            Xuất Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card total-stat">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalComments.toLocaleString() }}</div>
          <div class="stat-label">Tổng bình luận</div>
        </div>
      </div>

      <div class="stat-card pending-stat">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ pendingComments.toLocaleString() }}</div>
          <div class="stat-label">Chờ duyệt</div>
        </div>
      </div>

      <div class="stat-card approved-stat">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ approvedComments.toLocaleString() }}</div>
          <div class="stat-label">Đã duyệt</div>
        </div>
      </div>

      <div class="stat-card rejected-stat">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ rejectedComments.toLocaleString() }}</div>
          <div class="stat-label">Đã từ chối</div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-header">
        <h3>Bộ lọc tìm kiếm</h3>
        <button class="clear-filters-btn" @click="clearAllFilters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
          Xóa bộ lọc
        </button>
      </div>
      
      <div class="filters-grid">
        <div class="filter-group">
          <label>Tìm kiếm</label>
          <div class="search-input-container">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Tìm theo sản phẩm, người dùng, nội dung..." 
              v-model="searchQuery"
              class="search-input"
            />
          </div>
        </div>

        <div class="filter-group">
          <label>Sản phẩm</label>
          <select v-model="selectedProduct" class="filter-select">
            <option value="">Tất cả sản phẩm</option>
            <option v-for="product in availableProducts" :key="product.id" :value="product.id">
              {{ product.ten_san_pham }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Trạng thái</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Từ ngày</label>
          <input type="date" v-model="fromDate" class="filter-input">
        </div>

        <div class="filter-group">
          <label>Đến ngày</label>
          <input type="date" v-model="toDate" class="filter-input">
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedComments.length > 0" class="bulk-actions-card">
      <div class="bulk-info">
        <div class="selected-count">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/>
          </svg>
          Đã chọn {{ selectedComments.length }} bình luận
        </div>
      </div>
      <div class="bulk-actions">
        <button class="bulk-btn approve" @click="bulkApprove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
          Duyệt hàng loạt
        </button>
        <button class="bulk-btn reject" @click="bulkReject">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
          Từ chối hàng loạt
        </button>
        <button class="bulk-btn clear" @click="clearSelection">
          Bỏ chọn
        </button>
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-section">
      <div class="section-header">
        <h3>Danh sách bình luận ({{ filteredComments.length }})</h3>
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'card' }" 
            @click="viewMode = 'card'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5Z"/>
            </svg>
            Thẻ
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'table' }" 
            @click="viewMode = 'table'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,5V19H21V5M7,7V9H5V7M5,13V11H7V13M5,15H7V17H5M19,17H9V15H19M19,13H9V11H19M19,9H9V7H19Z"/>
            </svg>
            Bảng
          </button>
        </div>
      </div>

      <!-- Card View -->
      <div v-if="viewMode === 'card'" class="comments-grid">
        <div v-for="comment in paginatedComments" :key="comment.id" class="comment-card">
          <div class="card-header">
            <div class="comment-select">
              <input 
                type="checkbox" 
                :value="comment.id" 
                v-model="selectedComments"
                class="comment-checkbox"
              />
            </div>
            <div class="comment-status">
              <span :class="['status-badge', getStatusClass(comment.trang_thai)]">
                {{ getStatusText(comment.trang_thai) }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <div class="product-section">
              <div class="product-image">
                <img :src="comment.san_pham.hinh_anh" :alt="comment.san_pham.ten_san_pham" />
              </div>
              <div class="product-info">
                <h4>{{ comment.san_pham.ten_san_pham }}</h4>
                <p class="product-brand">{{ comment.san_pham.thuong_hieu }}</p>
                <p class="product-price">{{ formatCurrency(comment.san_pham.gia_ban) }}</p>
              </div>
            </div>

            <div class="user-section">
              <div class="user-avatar">
                {{ comment.nguoi_dung.ho_ten.charAt(0) }}
              </div>
              <div class="user-info">
                <h5>{{ comment.nguoi_dung.ho_ten }}</h5>
                <p>{{ comment.nguoi_dung.email }}</p>
              </div>
            </div>

            <div class="comment-section">
              <p class="comment-text">{{ comment.noi_dung }}</p>
              <div class="comment-meta">
                <span class="comment-date">{{ formatDateTime(comment.ngay_binh_luan) }}</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn small primary" @click="viewComment(comment)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
              Xem
            </button>
            <button 
              v-if="comment.trang_thai === null" 
              class="action-btn small success" 
              @click="approveComment(comment)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
              </svg>
              Duyệt
            </button>
            <button 
              v-if="comment.trang_thai === null" 
              class="action-btn small danger" 
              @click="rejectComment(comment)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
              Từ chối
            </button>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input 
                  type="checkbox" 
                  :checked="selectAll" 
                  @change="toggleSelectAll"
                  class="table-checkbox"
                />
              </th>
              <th>Sản phẩm</th>
              <th>Người dùng</th>
              <th>Nội dung</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th class="actions-col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in paginatedComments" :key="comment.id">
              <td class="checkbox-col">
                <input 
                  type="checkbox" 
                  :value="comment.id" 
                  v-model="selectedComments"
                  class="table-checkbox"
                />
              </td>
              <td>
                <div class="table-product">
                  <img :src="comment.san_pham.hinh_anh" :alt="comment.san_pham.ten_san_pham" />
                  <div>
                    <div class="product-name">{{ comment.san_pham.ten_san_pham }}</div>
                    <div class="product-brand">{{ comment.san_pham.thuong_hieu }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="table-user">
                  <div class="user-name">{{ comment.nguoi_dung.ho_ten }}</div>
                  <div class="user-email">{{ comment.nguoi_dung.email }}</div>
                </div>
              </td>
              <td>
                <div class="table-comment">
                  <p>{{ truncateText(comment.noi_dung, 100) }}</p>
                  <button 
                    v-if="comment.noi_dung.length > 100" 
                    class="read-more-btn" 
                    @click="viewComment(comment)"
                  >
                    Xem thêm
                  </button>
                </div>
              </td>
              <td class="date-col">{{ formatDateTime(comment.ngay_binh_luan) }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(comment.trang_thai)]">
                  {{ getStatusText(comment.trang_thai) }}
                </span>
              </td>
              <td class="actions-col">
                <div class="table-actions">
                  <button class="action-btn small primary" @click="viewComment(comment)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                    </svg>
                  </button>
                  <button 
                    v-if="comment.trang_thai === null" 
                    class="action-btn small success" 
                    @click="approveComment(comment)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                  </button>
                  <button 
                    v-if="comment.trang_thai === null" 
                    class="action-btn small danger" 
                    @click="rejectComment(comment)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container">
        <div class="pagination-info">
          Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredComments.length }} bình luận
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            @click="previousPage" 
            :disabled="currentPage === 1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
            </svg>
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in pageNumbers" 
              :key="page" 
              class="page-btn" 
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button 
            class="pagination-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Comment Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Chi tiết bình luận</h2>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content" v-if="selectedComment">
          <div class="modal-section">
            <div class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,6H22V8H2V6M2,11H15V13H2V11M2,16H13V18H2V16Z"/>
              </svg>
              Thông tin sản phẩm
            </div>
            <div class="product-detail-card">
              <img :src="selectedComment.san_pham.hinh_anh" :alt="selectedComment.san_pham.ten_san_pham" class="detail-product-image">
              <div class="product-detail-info">
                <h3>{{ selectedComment.san_pham.ten_san_pham }}</h3>
                <p class="brand">{{ selectedComment.san_pham.thuong_hieu }}</p>
                <p class="price">{{ formatCurrency(selectedComment.san_pham.gia_ban) }}</p>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <div class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              Thông tin người dùng
            </div>
            <div class="user-detail-grid">
              <div class="detail-item">
                <label>Họ tên:</label>
                <span>{{ selectedComment.nguoi_dung.ho_ten }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ selectedComment.nguoi_dung.email }}</span>
              </div>
              <div class="detail-item">
                <label>Số điện thoại:</label>
                <span>{{ selectedComment.nguoi_dung.sdt }}</span>
              </div>
              <div class="detail-item">
                <label>Ngày bình luận:</label>
                <span>{{ formatDateTime(selectedComment.ngay_binh_luan) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <div class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9Z"/>
              </svg>
              Nội dung bình luận
            </div>
            <div class="comment-detail-content">
              <p>{{ selectedComment.noi_dung }}</p>
            </div>
            <div class="comment-status-section">
              <label>Trạng thái hiện tại:</label>
              <span :class="['status-badge', getStatusClass(selectedComment.trang_thai)]">
                {{ getStatusText(selectedComment.trang_thai) }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="selectedComment?.trang_thai === null" 
            class="action-btn success" 
            @click="approveComment(selectedComment)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
            </svg>
            Duyệt bình luận
          </button>
          <button 
            v-if="selectedComment?.trang_thai === null" 
            class="action-btn danger" 
            @click="rejectComment(selectedComment)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
            Từ chối bình luận
          </button>
          <button class="action-btn secondary" @click="closeModal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { exportToExcel, formatDataForExcel } from '../../utils/excelExport.js'

// Reactive data
const searchQuery = ref('')
const selectedProduct = ref('')
const selectedStatus = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showDetailsModal = ref(false)
const selectedComment = ref(null)
const selectedComments = ref([])
const viewMode = ref('card')

// Available products for filtering
const availableProducts = ref([])

// Mock data - ERD compliant
const comments = ref([])

// Computed properties
const filteredComments = computed(() => {
  let filtered = comments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(comment => 
      comment.san_pham.ten_san_pham.toLowerCase().includes(query) ||
      comment.nguoi_dung.ho_ten.toLowerCase().includes(query) ||
      comment.noi_dung.toLowerCase().includes(query) ||
      comment.nguoi_dung.email.toLowerCase().includes(query)
    )
  }

  if (selectedProduct.value) {
    filtered = filtered.filter(comment => comment.id_san_pham === parseInt(selectedProduct.value))
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'pending') {
      filtered = filtered.filter(comment => comment.trang_thai === null)
    } else if (selectedStatus.value === 'approved') {
      filtered = filtered.filter(comment => comment.trang_thai === true)
    } else if (selectedStatus.value === 'rejected') {
      filtered = filtered.filter(comment => comment.trang_thai === false)
    }
  }

  if (fromDate.value) {
    filtered = filtered.filter(comment => 
      new Date(comment.ngay_binh_luan) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(comment => 
      new Date(comment.ngay_binh_luan) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered
})

const totalComments = computed(() => comments.value.length)
const pendingComments = computed(() => comments.value.filter(c => c.trang_thai === null).length)
const approvedComments = computed(() => comments.value.filter(c => c.trang_thai === true).length)
const rejectedComments = computed(() => comments.value.filter(c => c.trang_thai === false).length)

const totalPages = computed(() => Math.ceil(filteredComments.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredComments.value.length))

const paginatedComments = computed(() => {
  return filteredComments.value.slice(startIndex.value, endIndex.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const selectAll = computed({
  get: () => paginatedComments.value.length > 0 && selectedComments.value.length === paginatedComments.value.length,
  set: (value) => {
    if (value) {
      selectedComments.value = paginatedComments.value.map(comment => comment.id)
    } else {
      selectedComments.value = []
    }
  }
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount)
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const getStatusClass = (status) => {
  if (status === true) return 'approved'
  if (status === false) return 'rejected'
  return 'pending'
}

const getStatusText = (status) => {
  if (status === true) return 'Đã duyệt'
  if (status === false) return 'Đã từ chối'
  return 'Chờ duyệt'
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedProduct.value = ''
  selectedStatus.value = ''
  fromDate.value = ''
  toDate.value = ''
  currentPage.value = 1
}

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
}

const clearSelection = () => {
  selectedComments.value = []
}

const viewComment = (comment) => {
  selectedComment.value = comment
  showDetailsModal.value = true
}

const closeModal = () => {
  showDetailsModal.value = false
  selectedComment.value = null
}

const approveComment = (comment) => {
  comment.trang_thai = true
  if (showDetailsModal.value) {
    closeModal()
  }
  // Simulate API call
  setTimeout(() => {
    alert(`Đã duyệt bình luận của ${comment.nguoi_dung.ho_ten}`)
  }, 100)
}

const rejectComment = (comment) => {
  if (confirm(`Bạn có chắc chắn muốn từ chối bình luận của ${comment.nguoi_dung.ho_ten}?`)) {
    comment.trang_thai = false
    if (showDetailsModal.value) {
      closeModal()
    }
    // Simulate API call
    setTimeout(() => {
      alert(`Đã từ chối bình luận của ${comment.nguoi_dung.ho_ten}`)
    }, 100)
  }
}

const bulkApprove = () => {
  if (confirm(`Bạn có chắc chắn muốn duyệt ${selectedComments.value.length} bình luận đã chọn?`)) {
    selectedComments.value.forEach(commentId => {
      const comment = comments.value.find(c => c.id === commentId)
      if (comment) {
        comment.trang_thai = true
      }
    })
    alert(`Đã duyệt ${selectedComments.value.length} bình luận`)
    selectedComments.value = []
  }
}

const bulkReject = () => {
  if (confirm(`Bạn có chắc chắn muốn từ chối ${selectedComments.value.length} bình luận đã chọn?`)) {
    selectedComments.value.forEach(commentId => {
      const comment = comments.value.find(c => c.id === commentId)
      if (comment) {
        comment.trang_thai = false
      }
    })
    alert(`Đã từ chối ${selectedComments.value.length} bình luận`)
    selectedComments.value = []
  }
}

const exportComments = () => {
  alert('Xuất báo cáo bình luận')
  // Implementation for exporting comments
}

const exportCommentsToExcel = () => {
  try {
    console.log('exportCommentsToExcel function called')
    console.log('filteredComments:', filteredComments.value)
    
    // Simple test data first
    const testData = [
      { 'ID': 1, 'Tên': 'Test 1', 'Trạng thái': 'Hoạt động' },
      { 'ID': 2, 'Tên': 'Test 2', 'Trạng thái': 'Không hoạt động' }
    ]
    
    console.log('Test data:', testData)
    
    // Test with simple data first
    const result = exportToExcel(
      testData,
      'Test_Export',
      'Test Sheet'
    )
    
    console.log('Export result:', result)
    
    if (result.success) {
      alert(`✅ ${result.message}`)
    } else {
      alert(`❌ ${result.message}`)
    }
  } catch (error) {
    console.error('Error in exportCommentsToExcel:', error)
    alert(`❌ Có lỗi xảy ra khi xuất file Excel: ${error.message}`)
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

const goToPage = (page) => {
  currentPage.value = page
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Refreshing comments data...')
}

onMounted(() => {
  // Set default date range to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  fromDate.value = thirtyDaysAgo.toISOString().split('T')[0]
  toDate.value = today.toISOString().split('T')[0]
})
</script>

<style scoped>
.comments-page {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f8fafc;
}

/* Page Header uses global styling from globals.css */

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.total-stat::before { background: linear-gradient(90deg, #4ade80, #22c55e); }
.pending-stat::before { background: linear-gradient(90deg, #f093fb, #f5576c); }
.approved-stat::before { background: linear-gradient(90deg, #4facfe, #00f2fe); }
.rejected-stat::before { background: linear-gradient(90deg, #43e97b, #38f9d7); }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.total-stat .stat-icon { background: linear-gradient(135deg, #4ade80, #22c55e); }
.pending-stat .stat-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
.approved-stat .stat-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.rejected-stat .stat-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.filter-select,
.filter-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

/* Bulk Actions */
.bulk-actions-card {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(74, 222, 128, 0.3);
}

.bulk-info .selected-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.bulk-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.bulk-btn.approve:hover { background: rgba(34, 197, 94, 0.2); }
.bulk-btn.reject:hover { background: rgba(239, 68, 68, 0.2); }

/* Comments Section */
.comments-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.toggle-btn.active {
  background: white;
  color: #4ade80;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card View */
.comments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.comment-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #4ade80;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.comment-checkbox,
.table-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  cursor: pointer;
}

.comment-checkbox:checked,
.table-checkbox:checked {
  background: #4ade80;
  border-color: #4ade80;
}

.card-content {
  padding: 1.5rem;
}

.product-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
}

.product-brand {
  margin: 0 0 0.5rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.product-price {
  margin: 0;
  color: #4ade80;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
}

.user-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.75rem;
}

.comment-section {
  margin-bottom: 1rem;
}

.comment-text {
  margin: 0 0 0.5rem 0;
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.card-actions {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #dc2626;
}

/* Export buttons use global .btn-export styling from globals.css */

/* Action Buttons */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn.small {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}

.action-btn.primary {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #4ade80;
}

.action-btn.primary:hover {
  background: #4ade80;
  color: white;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
  color: #475569;
}

.action-btn.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.action-btn.success:hover {
  background: #22c55e;
  color: white;
  transform: translateY(-1px);
}

.action-btn.danger {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.action-btn.danger:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

/* Table View */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.checkbox-col {
  width: 60px;
  text-align: center;
}

.actions-col {
  width: 120px;
}

.table-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-product img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.product-name {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.product-brand {
  color: #64748b;
  font-size: 0.75rem;
}

.table-user .user-name {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.table-user .user-email {
  color: #64748b;
  font-size: 0.75rem;
}

.table-comment {
  max-width: 300px;
}

.table-comment p {
  margin: 0 0 0.5rem 0;
  color: #374151;
  line-height: 1.4;
}

.read-more-btn {
  background: none;
  border: none;
  color: #4ade80;
  cursor: pointer;
  font-size: 0.75rem;
  text-decoration: underline;
}

.date-col {
  color: #64748b;
  font-size: 0.875rem;
  white-space: nowrap;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #4ade80;
  color: #4ade80;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.page-btn:hover {
  background: #f8fafc;
  border-color: #4ade80;
  color: #4ade80;
}

.page-btn.active {
  background: #4ade80;
  border-color: #4ade80;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-content {
  padding: 2rem;
}

.modal-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.product-detail-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.detail-product-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.product-detail-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.product-detail-info .brand {
  margin: 0 0 0.5rem 0;
  color: #64748b;
  font-size: 1rem;
}

.product-detail-info .price {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #4ade80;
}

.user-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.detail-item span {
  color: #1a202c;
  font-weight: 500;
}

.comment-detail-content {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.comment-detail-content p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
  font-size: 1rem;
}

.comment-status-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.comment-status-section label {
  font-weight: 500;
  color: #64748b;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .comments-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
  
  .filters-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .comments-page {
    padding: 1rem;
  }
  
  /* Page header responsive handled by globals.css */
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .comments-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .bulk-actions-card {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .bulk-actions {
    justify-content: center;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-actions {
    padding: 1rem;
    flex-direction: column;
  }
  
  .product-detail-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .table-container {
    border-radius: 8px;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
  
  .table-product {
    flex-direction: column;
    text-align: center;
  }
  
  .table-actions {
    flex-direction: column;
  }
  
  .comment-text {
    font-size: 0.75rem;
  }
}
</style>
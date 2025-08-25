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
    <div class="data-card">
      <div class="data-header">
        <h3>Danh sách chiến dịch ({{ filteredCampaigns.length }} chiến dịch)</h3>
        <div class="header-controls">
          <select v-model="itemsPerPage" class="filter-select">
            <option value="10">10/trang</option>
            <option value="25">25/trang</option>
            <option value="50">50/trang</option>
          </select>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Chiến dịch</th>
              <th>Cấu hình giảm giá</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(campaign, index) in paginatedCampaigns" :key="campaign.id">
              <td class="index-cell">{{ index + 1 + startIndex }}</td>
              <td>
                <div class="entity-info">
                  <div class="entity-avatar campaign-avatar">
                    {{ getCampaignInitials(campaign.name) }}
                  </div>
                  <div class="entity-details">
                    <div class="entity-name">{{ campaign.name }}</div>
                    <div class="entity-code">{{ campaign.description || 'Không có mô tả' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="campaign-info">
                  <div class="discount-type-badge" :class="campaign.type === 'percentage' ? 'type-percentage' : 'type-fixed'">
                    {{ campaign.type === 'percentage' ? 'Phần trăm' : 'Số tiền' }}
                  </div>
                  <div class="discount-value">
                    {{ campaign.type === 'percentage' ? campaign.value + '%' : formatCurrency(campaign.value) }}
                  </div>
                  <div v-if="campaign.min_order_value" class="min-order">
                    Tối thiểu: {{ formatCurrency(campaign.min_order_value) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-range">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ formatDateShort(campaign.start_date) }}
                  </div>
                  <div class="date-separator">→</div>
                  <div class="date-range">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ formatDateShort(campaign.end_date) }}
                  </div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(campaign.status)]">
                  {{ getStatusText(campaign.status) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="action-btn view" @click="viewCampaign(campaign)" title="Xem chi tiết">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="action-btn edit" @click="editCampaign(campaign)" title="Chỉnh sửa">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    v-if="campaign.status !== 'expired'"
                    class="action-btn delete"
                    @click="deleteCampaign(campaign.id)"
                    title="Xóa">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCampaigns.length === 0">
              <td colspan="6" class="text-center empty-state">
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
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ totalCampaigns }} chiến dịch
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

    <!-- Modern Step-by-Step Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modern-modal-content" @click.stop>
        <!-- Enhanced Modal Header -->
        <div class="modern-modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
              </svg>
            </div>
            <div class="header-text">
              <h3>{{ showAddModal ? 'Tạo chiến dịch khuyến mãi' : 'Cập nhật chiến dịch' }}</h3>
              <p>{{ showAddModal ? 'Tạo chiến dịch khuyến mãi mới cho cửa hàng' : 'Chỉnh sửa thông tin chiến dịch' }}</p>
            </div>
          </div>
          <button class="modern-modal-close" @click="closeModals">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Step Progress Indicator -->
        <div class="step-progress">
          <div class="progress-steps">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-circle">
                <span v-if="currentStep > 1">✓</span>
                <span v-else>1</span>
              </div>
              <span class="step-label">Thông tin cơ bản</span>
            </div>
            <div class="step-connector" :class="{ active: currentStep > 1 }"></div>
            <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-circle">
                <span v-if="currentStep > 2">✓</span>
                <span v-else>2</span>
              </div>
              <span class="step-label">Cấu hình giảm giá</span>
            </div>
            <div class="step-connector" :class="{ active: currentStep > 2 }"></div>
            <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
              <div class="step-circle">
                <span v-if="currentStep > 3">✓</span>
                <span v-else>3</span>
              </div>
              <span class="step-label">Thời gian & Điều kiện</span>
            </div>
            <div class="step-connector" :class="{ active: currentStep > 3 }"></div>
            <div class="step" :class="{ active: currentStep >= 4 }">
              <div class="step-circle">4</div>
              <span class="step-label">Xác nhận</span>
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="modern-modal-body">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="step-content">
            <div class="step-header">
              <div class="step-number">1</div>
              <div class="step-info">
                <h4>Thông tin cơ bản</h4>
                <p>Nhập tên và mô tả cho chiến dịch khuyến mãi</p>
              </div>
            </div>
            
            <div class="form-section">
              <div class="modern-form-group">
                <label class="modern-label">
                  <span class="label-text">Tên chiến dịch</span>
                  <span class="required">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="modern-input"
                  placeholder="VD: Khuyến mãi mùa hè 2024"
                  :class="{ error: errors.name }"
                />
                <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
              </div>

              <div class="modern-form-group">
                <label class="modern-label">
                  <span class="label-text">Mô tả chiến dịch</span>
                </label>
                <textarea
                  v-model="formData.description"
                  class="modern-textarea"
                  rows="4"
                  placeholder="Mô tả chi tiết về chiến dịch khuyến mãi..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Discount Configuration -->
          <div v-if="currentStep === 2" class="step-content">
            <div class="step-header">
              <div class="step-number">2</div>
              <div class="step-info">
                <h4>Cấu hình giảm giá</h4>
                <p>Thiết lập loại và giá trị giảm giá</p>
              </div>
            </div>

            <div class="form-section">
              <!-- Discount Type Selection -->
              <div class="modern-form-group">
                <label class="modern-label">
                  <span class="label-text">Loại giảm giá</span>
                  <span class="required">*</span>
                </label>
                <div class="discount-type-cards">
                  <label class="type-card" :class="{ active: formData.type === 'percentage' }">
                    <input type="radio" v-model="formData.type" value="percentage">
                    <div class="card-content">
                      <div class="card-icon">%</div>
                      <div class="card-info">
                        <h5>Phần trăm</h5>
                        <p>Giảm theo tỷ lệ %</p>
                      </div>
                    </div>
                    <div class="card-check">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>

                  <label class="type-card" :class="{ active: formData.type === 'fixed' }">
                    <input type="radio" v-model="formData.type" value="fixed">
                    <div class="card-content">
                      <div class="card-icon">₫</div>
                      <div class="card-info">
                        <h5>Số tiền cố định</h5>
                        <p>Giảm số tiền nhất định</p>
                      </div>
                    </div>
                    <div class="card-check">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Discount Value -->
              <div class="modern-form-group">
                <label class="modern-label">
                  <span class="label-text">Giá trị giảm giá</span>
                  <span class="required">*</span>
                </label>
                <div class="input-with-suffix">
                  <input
                    v-model.number="formData.value"
                    type="number"
                    class="modern-input"
                    :placeholder="formData.type === 'percentage' ? 'Nhập % giảm (1-100)' : 'Nhập số tiền giảm'"
                    :min="0"
                    :max="formData.type === 'percentage' ? 100 : undefined"
                    :class="{ error: errors.value }"
                  />
                  <span class="input-suffix">{{ formData.type === 'percentage' ? '%' : 'VNĐ' }}</span>
                </div>
                <div v-if="errors.value" class="error-message">{{ errors.value }}</div>
                <div v-if="formData.type === 'percentage' && formData.value" class="value-preview">
                  Ví dụ: Đơn hàng 1,000,000 VNĐ sẽ được giảm {{ formatCurrency(1000000 * formData.value / 100) }}
                </div>
                <div v-if="formData.type === 'fixed' && formData.value" class="value-preview">
                  Mỗi đơn hàng đủ điều kiện sẽ được giảm {{ formatCurrency(formData.value) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Time & Conditions -->
          <div v-if="currentStep === 3" class="step-content">
            <div class="step-header">
              <div class="step-number">3</div>
              <div class="step-info">
                <h4>Thời gian & Điều kiện</h4>
                <p>Thiết lập thời gian hiệu lực và điều kiện áp dụng</p>
              </div>
            </div>

            <div class="form-section">
              <div class="date-section">
                <div class="modern-form-group">
                  <label class="modern-label">
                    <span class="label-text">Thời gian bắt đầu</span>
                    <span class="required">*</span>
                  </label>
                  <input
                    v-model="formData.start_date"
                    type="datetime-local"
                    class="modern-input"
                    :class="{ error: errors.start_date }"
                  />
                  <div v-if="errors.start_date" class="error-message">{{ errors.start_date }}</div>
                </div>

                <div class="modern-form-group">
                  <label class="modern-label">
                    <span class="label-text">Thời gian kết thúc</span>
                    <span class="required">*</span>
                  </label>
                  <input
                    v-model="formData.end_date"
                    type="datetime-local"
                    class="modern-input"
                    :class="{ error: errors.end_date }"
                  />
                  <div v-if="errors.end_date" class="error-message">{{ errors.end_date }}</div>
                </div>
              </div>

              <div class="conditions-section">
                <h5>Điều kiện áp dụng</h5>
                
                <div class="modern-form-group">
                  <label class="modern-label">
                    <span class="label-text">Số lượng sử dụng tối đa</span>
                  </label>
                  <input
                    v-model.number="formData.max_uses"
                    type="number"
                    class="modern-input"
                    placeholder="Để trống nếu không giới hạn"
                    min="0"
                  />
                  <div class="help-text">Tổng số lần toàn bộ khách hàng có thể sử dụng chiến dịch này</div>
                </div>

                <div class="modern-form-group">
                  <label class="modern-label">
                    <span class="label-text">Giá trị đơn hàng tối thiểu</span>
                  </label>
                  <div class="input-with-suffix">
                    <input
                      v-model.number="formData.min_order_value"
                      type="number"
                      class="modern-input"
                      placeholder="Để trống nếu không yêu cầu"
                      min="0"
                    />
                    <span class="input-suffix">VNĐ</span>
                  </div>
                  <div class="help-text">Đơn hàng phải đạt giá trị tối thiểu này để được áp dụng chiến dịch</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Confirmation -->
          <div v-if="currentStep === 4" class="step-content">
            <div class="step-header">
              <div class="step-number">4</div>
              <div class="step-info">
                <h4>Xác nhận thông tin</h4>
                <p>Kiểm tra lại thông tin trước khi tạo chiến dịch</p>
              </div>
            </div>

            <div class="confirmation-section">
              <div class="confirmation-card">
                <div class="confirmation-header">
                  <div class="campaign-icon">🎯</div>
                  <div class="campaign-title">{{ formData.name }}</div>
                </div>

                <div class="confirmation-details">
                  <div class="detail-group">
                    <h5>Thông tin cơ bản</h5>
                    <div class="detail-item">
                      <span class="detail-label">Tên chiến dịch:</span>
                      <span class="detail-value">{{ formData.name }}</span>
                    </div>
                    <div class="detail-item" v-if="formData.description">
                      <span class="detail-label">Mô tả:</span>
                      <span class="detail-value">{{ formData.description }}</span>
                    </div>
                  </div>

                  <div class="detail-group">
                    <h5>Cấu hình giảm giá</h5>
                    <div class="detail-item">
                      <span class="detail-label">Loại giảm giá:</span>
                      <span class="detail-value">
                        <span class="badge" :class="formData.type === 'percentage' ? 'badge-percentage' : 'badge-fixed'">
                          {{ formData.type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định' }}
                        </span>
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Giá trị:</span>
                      <span class="detail-value discount-highlight">
                        {{ formData.type === 'percentage' ? formData.value + '%' : formatCurrency(formData.value) }}
                      </span>
                    </div>
                  </div>

                  <div class="detail-group">
                    <h5>Thời gian & Điều kiện</h5>
                    <div class="detail-item">
                      <span class="detail-label">Thời gian:</span>
                      <span class="detail-value">
                        {{ formatDateTime(formData.start_date) }} → {{ formatDateTime(formData.end_date) }}
                      </span>
                    </div>
                    <div class="detail-item" v-if="formData.max_uses">
                      <span class="detail-label">Số lần sử dụng tối đa:</span>
                      <span class="detail-value">{{ formData.max_uses.toLocaleString() }}</span>
                    </div>
                    <div class="detail-item" v-if="formData.min_order_value">
                      <span class="detail-label">Đơn hàng tối thiểu:</span>
                      <span class="detail-value">{{ formatCurrency(formData.min_order_value) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Modal Actions -->
        <div class="modern-modal-footer">
          <div class="footer-actions">
            <button v-if="currentStep > 1" class="btn-modern btn-back" @click="previousStep">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Quay lại
            </button>
            <button class="btn-modern btn-cancel" @click="closeModals">
              Hủy bỏ
            </button>
            <button v-if="currentStep < 4" class="btn-modern btn-next" @click="nextStep" :disabled="!canProceedToNext">
              Tiếp theo
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button v-if="currentStep === 4" class="btn-modern btn-create" @click="saveCampaign">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              {{ showAddModal ? 'Tạo chiến dịch' : 'Cập nhật chiến dịch' }}
            </button>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { dichVuDotGiamGia } from '../../services/dichVuDotGiamGia.js'
import api from '../../services/api.js'

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const editingCampaign = ref(null)
const selectedCampaign = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Step wizard data
const currentStep = ref(1)
const errors = ref({})

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

// Data from backend
const campaigns = ref([])
const loading = ref(false)

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

const totalCampaigns = computed(() => filteredCampaigns.value.length)
const totalPages = computed(() => Math.ceil(totalCampaigns.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalCampaigns.value))

const paginatedCampaigns = computed(() => {
  return filteredCampaigns.value.slice(startIndex.value, startIndex.value + itemsPerPage.value)
})

// Step wizard computed properties
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.name.trim().length > 0
    case 2:
      return formData.value.value > 0
    case 3:
      return formData.value.start_date && formData.value.end_date
    case 4:
      return true
    default:
      return false
  }
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

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Step navigation methods
const nextStep = () => {
  if (currentStep.value < 4 && canProceedToNext.value) {
    validateCurrentStep()
    if (Object.keys(errors.value).length === 0) {
      currentStep.value++
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    errors.value = {}
  }
}

const validateCurrentStep = () => {
  errors.value = {}
  
  switch (currentStep.value) {
    case 1:
      if (!formData.value.name.trim()) {
        errors.value.name = 'Tên chiến dịch không được để trống'
      }
      break
    case 2:
      if (!formData.value.value || formData.value.value <= 0) {
        errors.value.value = 'Giá trị giảm giá phải lớn hơn 0'
      }
      if (formData.value.type === 'percentage' && formData.value.value > 100) {
        errors.value.value = 'Phần trăm giảm giá không được vượt quá 100%'
      }
      break
    case 3:
      if (!formData.value.start_date) {
        errors.value.start_date = 'Vui lòng chọn ngày bắt đầu'
      }
      if (!formData.value.end_date) {
        errors.value.end_date = 'Vui lòng chọn ngày kết thúc'
      }
      if (formData.value.start_date && formData.value.end_date) {
        const startDate = new Date(formData.value.start_date)
        const endDate = new Date(formData.value.end_date)
        if (startDate >= endDate) {
          errors.value.end_date = 'Ngày kết thúc phải sau ngày bắt đầu'
        }
      }
      break
  }
}

const getCampaignInitials = (name) => {
  if (!name) return 'CD'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
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

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'status-active'
    case 'upcoming': return 'status-upcoming'
    case 'expired': return 'status-expired'
    default: return 'status-expired'
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

const deleteCampaign = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa đợt giảm giá này?')) {
    try {
      loading.value = true
      
      // Call API to delete campaign using service
      const response = await dichVuDotGiamGia.xoa(id)
      
      if (response) {
        alert('✅ Xóa chiến dịch thành công!')
        await loadCampaigns() // Reload data from server
      } else {
        throw new Error('Không nhận được phản hồi từ server')
      }
      
    } catch (error) {
      console.error('Error deleting campaign:', error)
      alert(`❌ Có lỗi xảy ra khi xóa chiến dịch: ${error.message || error}`)
    } finally {
      loading.value = false
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

const saveCampaign = async () => {
  // Final validation before saving
  validateCurrentStep()
  if (Object.keys(errors.value).length > 0) {
    alert('Vui lòng kiểm tra lại thông tin đã nhập')
    return
  }

  try {
    loading.value = true
    
    if (showAddModal.value) {
      // Create new campaign via API
      const campaignData = {
        code: `DGG${Date.now()}`, // Generate unique code
        name: formData.value.name,
        value: formData.value.value,
        startDate: formData.value.start_date,
        endDate: formData.value.end_date
      }
      
      const response = await dichVuDotGiamGia.taoMoi(campaignData)
      
      if (response && response.data) {
        alert('✅ Tạo chiến dịch thành công!')
        await loadCampaigns() // Reload data from server
        closeModals()
      } else {
        throw new Error('Không nhận được phản hồi từ server')
      }
      
    } else if (showEditModal.value && editingCampaign.value) {
      // Update existing campaign via API
      const campaignData = {
        code: editingCampaign.value.code,
        name: formData.value.name,
        value: formData.value.value,
        startDate: formData.value.start_date,
        endDate: formData.value.end_date,
        status: editingCampaign.value.status
      }
      
      const response = await dichVuDotGiamGia.capNhat(editingCampaign.value.id, campaignData)
      
      if (response && response.data) {
        alert('✅ Cập nhật chiến dịch thành công!')
        await loadCampaigns() // Reload data from server
        closeModals()
      } else {
        throw new Error('Không nhận được phản hồi từ server')
      }
    }
    
  } catch (error) {
    console.error('Error saving campaign:', error)
    alert(`❌ Có lỗi xảy ra khi lưu chiến dịch: ${error.message || error}`)
  } finally {
    loading.value = false
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  editingCampaign.value = null
  selectedCampaign.value = null
  currentStep.value = 1
  errors.value = {}
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

// API calls
const loadCampaigns = async () => {
  try {
    loading.value = true
    const response = await dichVuDotGiamGia.layTatCa()
    if (response.data && response.data.data) {
      campaigns.value = response.data.data.map(campaign => {
        const backendData = dichVuDotGiamGia.chuyenDoiDuLieu(campaign)
        // Determine campaign status based on dates
        const now = new Date()
        const startDate = new Date(backendData.startDate)
        const endDate = new Date(backendData.endDate)
        
        let status = 'upcoming'
        if (now >= startDate && now <= endDate && backendData.status) {
          status = 'active'
        } else if (now > endDate || !backendData.status) {
          status = 'expired'
        }
        
        return {
          ...backendData,
          name: backendData.name,
          description: backendData.name, // Backend doesn't have description field
          type: 'percentage', // Assuming percentage, could be enhanced later
          start_date: backendData.startDate,
          end_date: backendData.endDate,
          status
        }
      })
    }
  } catch (error) {
    console.error('Error loading campaigns:', error)
    alert('Có lỗi xảy ra khi tải dữ liệu chiến dịch')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadCampaigns()
}

// Initialize data when component mounts
onMounted(() => {
  loadCampaigns()
})
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

/* Data Card */
.data-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.index-cell {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Entity Info Styles */
.entity-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.entity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
}

.campaign-avatar {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.entity-details {
  min-width: 0;
  flex: 1;
}

.entity-name {
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.entity-code {
  font-size: 0.75rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Campaign Info Styles */
.campaign-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.discount-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.type-percentage {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.type-fixed {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.discount-value {
  font-weight: 700;
  color: #22c55e;
  font-size: 1rem;
}

.min-order {
  font-size: 0.75rem;
  color: #64748b;
}

/* Date Info Styles */
.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
}

.date-separator {
  color: #22c55e;
  font-weight: bold;
  font-size: 0.875rem;
}

/* Status Badge Styles */
.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.status-upcoming {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.status-expired {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5f9;
}

.action-btn .icon {
  width: 16px;
  height: 16px;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.edit {
  color: #f59e0b;
}

.action-btn.delete {
  color: #ef4444;
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

/* Modern Step-by-Step Modal Styles */
.modern-modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modern-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.header-text h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-text p {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.modern-modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.modern-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Step Progress Styles */
.step-progress {
  padding: 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background: #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
}

.step.completed .step-circle {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: #22c55e;
  font-weight: 600;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 1rem;
  transition: background 0.3s ease;
}

.step-connector.active {
  background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
}

/* Step Content Styles */
.modern-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.step-content {
  max-width: 600px;
  margin: 0 auto;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.step-info h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.step-info p {
  margin: 0.25rem 0 0 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Form Styles */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modern-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modern-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
  font-weight: 600;
}

.modern-input, .modern-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.modern-input:focus, .modern-textarea:focus {
  outline: none;
  border-color: #4ade80;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.modern-input.error, .modern-textarea.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Discount Type Cards */
.discount-type-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-card {
  position: relative;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-card:hover {
  border-color: #4ade80;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.15);
}

.type-card.active {
  border-color: #22c55e;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

.type-card input[type="radio"] {
  display: none;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.card-info h5 {
  margin: 0;
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
}

.card-info p {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.card-check {
  width: 20px;
  height: 20px;
  color: #22c55e;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.type-card.active .card-check {
  opacity: 1;
}

/* Input with Suffix */
.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix .modern-input {
  padding-right: 4rem;
  flex: 1;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.value-preview {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
  border-radius: 8px;
  color: #16a34a;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Date Section */
.date-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.conditions-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
}

.conditions-section h5 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-weight: 600;
  font-size: 1.125rem;
}

.help-text {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  line-height: 1.4;
}

/* Confirmation Styles */
.confirmation-section {
  display: flex;
  justify-content: center;
}

.confirmation-card {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 2px solid rgba(74, 222, 128, 0.2);
  border-radius: 16px;
  overflow: hidden;
}

.confirmation-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.campaign-icon {
  font-size: 2rem;
}

.campaign-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.confirmation-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-group h5 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.detail-value {
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: right;
}

.discount-highlight {
  color: #22c55e;
  font-size: 1rem;
  font-weight: 700;
}

.badge-percentage {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-fixed {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Modern Modal Footer */
.modern-modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.btn-modern {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-back {
  background: #6b7280;
  color: white;
}

.btn-back:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-cancel {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.btn-next {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-next:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-create {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-create:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .modern-modal-content {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .modern-modal-header {
    padding: 1.5rem;
  }
  
  .modern-modal-body {
    padding: 1.5rem;
  }
  
  .step-progress {
    padding: 1.5rem;
  }
  
  .progress-steps {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .step-connector {
    display: none;
  }
  
  .discount-type-cards {
    grid-template-columns: 1fr;
  }
  
  .date-section {
    grid-template-columns: 1fr;
  }
  
  .footer-actions {
    flex-wrap: wrap;
    justify-content: center;
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
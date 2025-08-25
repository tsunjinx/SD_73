<template>
  <div class="product-details">
    <!-- Modern Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Quản lý Chi tiết sản phẩm & Thuộc tính</h1>
          <p class="page-subtitle">Quản lý biến thể sản phẩm, thuộc tính và tồn kho tập trung</p>
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
        </div>
      </div>
    </div>

    <!-- Main Tab Navigation -->
    <div class="main-tab-navigation">
      <div class="main-tab-container">
        <button 
          v-for="tab in mainTabs" 
          :key="tab.id"
          @click="selectMainTab(tab.id)"
          :class="['main-tab-button', { active: activeMainTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ getMainTabCount(tab.id) }}</span>
        </button>
      </div>
    </div>

    <!-- Sub Tab Navigation -->
    <div class="sub-tab-navigation" v-if="getSubTabs(activeMainTab).length > 0">
      <div class="sub-tab-container">
        <button 
          v-for="subTab in getSubTabs(activeMainTab)" 
          :key="subTab.id"
          @click="activeSubTab = subTab.id"
          :class="['sub-tab-button', { active: activeSubTab === subTab.id }]"
        >
          <span class="sub-tab-icon">{{ subTab.icon }}</span>
          <span class="sub-tab-label">{{ subTab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Dynamic Tab Content -->
    <div class="tab-content">
      <!-- Product Details -->
      <div v-show="activeMainTab === 'details'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách chi tiết sản phẩm</h3>
            <button class="btn-primary" @click="activeSubTab = 'form'; isEditing = false">
              <span class="btn-icon">➕</span>
              Thêm chi tiết sản phẩm
            </button>
          </div>
          <div class="view-content">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="productDetails.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in productDetails" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteProductDetail(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} chi tiết sản phẩm</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveProductDetail(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên chi tiết sản phẩm *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên chi tiết sản phẩm"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} chi tiết sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Manufacturers -->
      <div v-show="activeMainTab === 'manufacturers'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách nhà sản xuất</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingManufacturers" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="manufacturers.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in manufacturers" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteManufacturer(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} nhà sản xuất</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveManufacturer(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên nhà sản xuất *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên nhà sản xuất"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} nhà sản xuất
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Origins -->
      <div v-show="activeMainTab === 'origins'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách xuất xứ</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingOrigins" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="origins.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in origins" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteOrigin(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} xuất xứ</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveOrigin(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên xuất xứ *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên xuất xứ"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} xuất xứ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Colors -->
      <div v-show="activeMainTab === 'colors'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách màu sắc</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingColors" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="colors.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in colors" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteColor(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} màu sắc</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveColor(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên màu sắc *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên màu sắc"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} màu sắc
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sizes -->
      <div v-show="activeMainTab === 'sizes'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách kích thước</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingSizes" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="sizes.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sizes" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteSize(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} kích thước</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveSize(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên kích thước *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên kích thước"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} kích thước
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Materials -->
      <div v-show="activeMainTab === 'materials'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách chất liệu</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingMaterials" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="materials.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in materials" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteMaterial(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} chất liệu</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveMaterial(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên chất liệu *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên chất liệu"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} chất liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Soles -->
      <div v-show="activeMainTab === 'soles'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách đế giày</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingSoles" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="soles.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in soles" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteSole(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} đế giày</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveSole(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên đế giày *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên đế giày"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} đế giày
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Cushionings -->
      <div v-show="activeMainTab === 'cushionings'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách đệm giày</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingCushionings" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="cushionings.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cushionings" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteCushioning(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} đệm giày</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveCushioning(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên đệm giày *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên đệm giày"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} đệm giày
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Weights -->
      <div v-show="activeMainTab === 'weights'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách trọng lượng</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingWeights" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="weights.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in weights" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteWeight(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} trọng lượng</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveWeight(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên trọng lượng *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên trọng lượng"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} trọng lượng
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sports -->
      <div v-show="activeMainTab === 'sports'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách môn thể thao</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingSports" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="sports.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sports" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteSport(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} môn thể thao</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveSport(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên môn thể thao *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên môn thể thao"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} môn thể thao
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Seasons -->
      <div v-show="activeMainTab === 'seasons'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách loại mùa</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingSeasons" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="seasons.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in seasons" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteSeason(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} loại mùa</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveSeason(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên loại mùa *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên loại mùa"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} loại mùa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Durabilities -->
      <div v-show="activeMainTab === 'durabilities'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách độ bền</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingDurabilities" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="durabilities.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in durabilities" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteDurability(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} độ bền</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveDurability(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên độ bền *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên độ bền"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} độ bền
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Waterproofs -->
      <div v-show="activeMainTab === 'waterproofs'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách chống nước</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingWaterproofs" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="waterproofs.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in waterproofs" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code || item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteWaterproof(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} chống nước</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveWaterproof(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tên chống nước *</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên chống nước"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} chống nước
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Images -->
      <div v-show="activeMainTab === 'images'" class="tab-panel">
        <div v-if="activeSubTab === 'table'" class="table-view">
          <div class="view-header">
            <h3>Danh sách ảnh sản phẩm</h3>
          </div>
          <div class="view-content">
            <div v-if="loadingImages" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
            <div v-else-if="productImages.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <p>Chưa có dữ liệu</p>
            </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh</th>
                    <th>Mô tả</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in productImages" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <img :src="item.url" :alt="item.description" class="table-image" />
                    </td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.type }}</td>
                    <td>
                      <span class="status-badge" :class="item.status ? 'status-active' : 'status-inactive'">
                        {{ item.status ? 'HĐ' : 'Không HĐ' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn edit-btn" @click="activeSubTab = 'form'; isEditing = true; editingItem = item" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button class="action-btn delete-btn" @click="deleteImage(item)" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="activeSubTab === 'form'" class="form-view">
          <div class="view-header">
            <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} ảnh sản phẩm</h3>
            <div class="form-actions">
              <button class="btn-secondary" @click="activeSubTab = 'table'; isEditing = false; editingItem = null">
                <span class="btn-icon">❌</span>
                Hủy
              </button>
            </div>
          </div>
          <div class="view-content">
            <form @submit.prevent="handleSaveImage(editingItem || {})" class="attribute-form">
              <div class="form-group">
                <label class="form-label">Tải lên ảnh *</label>
                <input
                  type="file"
                  accept="image/*"
                  class="form-control"
                  @change="handleSingleImageUpload"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Mô tả ảnh *</label>
                <input
                  v-model="editingItem.description"
                  type="text"
                  class="form-control"
                  placeholder="Nhập mô tả ảnh"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Loại ảnh</label>
                <select v-model="editingItem.type" class="form-control">
                  <option value="main">Ảnh chính</option>
                  <option value="gallery">Ảnh thư viện</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <span class="btn-icon">💾</span>
                  {{ isEditing ? 'Cập nhật' : 'Lưu' }} ảnh
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Legacy Filter Section (for backward compatibility) -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <div class="filter-title">
            <span class="filter-icon">👟</span>
            <h3>Tìm kiếm & Lọc chi tiết sản phẩm</h3>
          </div>
          <div class="filter-stats">
            {{ filteredDetails.length }} / {{ productDetails.length }} chi tiết sản phẩm
          </div>
        </div>
        
        <div class="filter-content">
          <div class="search-section">
            <div class="input-group">
              <span class="input-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm tên sản phẩm, màu sắc, kích thước..."
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
                <span class="label-icon">📦</span>
                Sản phẩm
              </label>
              <select v-model="selectedProduct" class="form-select">
                <option value="">Tất cả sản phẩm</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.ten_san_pham }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">🎨</span>
                Màu sắc
              </label>
              <select v-model="selectedColor" class="form-select">
                <option value="">Tất cả màu sắc</option>
                <option v-for="color in colors" :key="color.id" :value="color.id">
                  {{ color.ten_mau_sac }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">📏</span>
                Kích thước
              </label>
              <select v-model="selectedSize" class="form-select">
                <option value="">Tất cả kích thước</option>
                <option v-for="size in sizes" :key="size.id" :value="size.id">
                  {{ size.ten_kich_thuoc }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <span class="label-icon">⚡</span>
                Trạng thái
              </label>
              <select v-model="statusFilter" class="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="1">✅ Hoạt động</option>
                <option value="0">❌ Ngừng hoạt động</option>
              </select>
            </div>
            
            <div class="filter-actions">
              <button @click="clearFilters" class="btn btn-outline">
                <span class="btn-icon">🔄</span>
                Đặt lại
              </button>
              <button @click="applyFilters" class="btn btn-primary">
                <span class="btn-icon">🔍</span>
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Màu sắc</th>
              <th>Kích thước</th>
              <th>Chất liệu</th>
              <th>Môn thể thao</th>
              <th>Trọng lượng</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in paginatedDetails" :key="detail.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="product-name">
                <div class="product-info">
                  <strong>{{ detail.product?.ten_san_pham || 'N/A' }}</strong>
                  <small>{{ detail.product?.ma_san_pham || '' }}</small>
                </div>
              </td>
              <td>
                <span class="color-badge" :style="{ backgroundColor: getColorCode(detail.color?.ten_mau_sac) }">
                  {{ detail.color?.ten_mau_sac || 'N/A' }}
                </span>
              </td>
              <td class="size-info">{{ detail.size?.ten_kich_thuoc || 'N/A' }}</td>
              <td>{{ detail.material?.ten_chat_lieu || 'N/A' }}</td>
              <td>{{ detail.sport?.ten_mon_the_thao || 'N/A' }}</td>
              <td>{{ detail.weight?.ten_trong_luong || 'N/A' }}</td>
              <td class="price">{{ formatCurrency(detail.gia_ban) }}</td>
              <td>
                <span :class="['stock', { 'low-stock': detail.so_luong < 10 }]">
                  {{ detail.so_luong }}
                </span>
              </td>
              <td>
                <span class="badge" :class="detail.trang_thai ? 'badge-success' : 'badge-danger'">
                  {{ detail.trang_thai ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit-btn" @click="editDetail(detail)" title="Chỉnh sửa">
                    ✏️
                  </button>
                  <button class="action-btn view-btn" @click="viewDetail(detail)" title="Xem chi tiết">
                    👁️
                  </button>
                  <button class="action-btn delete-btn" @click="deleteDetail(detail.id)" title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedDetails.length === 0">
              <td colspan="17" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ filteredDetails.length }} chi tiết sản phẩm
          </div>
          <div class="pagination">
            <button 
              class="btn-export" 
              @click="previousPage" 
              :disabled="currentPage === 1"
            >
              <span class="btn-icon">❮</span>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              class="btn-export" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >
              <span class="btn-icon">❯</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm chi tiết sản phẩm' : 'Cập nhật chi tiết sản phẩm' }}</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Sản phẩm *</label>
              <select
                v-model="formData.id_san_pham"
                class="form-control"
                required
              >
                <option value="">Chọn sản phẩm</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.ten_san_pham }} ({{ product.ma_san_pham }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Màu sắc *</label>
              <select
                v-model="formData.id_mau_sac"
                class="form-control"
                required
              >
                <option value="">Chọn màu sắc</option>
                <option v-for="color in colors" :key="color.id" :value="color.id">
                  {{ color.ten_mau_sac }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kích thước *</label>
              <select
                v-model="formData.id_kich_thuoc"
                class="form-control"
                required
              >
                <option value="">Chọn kích thước</option>
                <option v-for="size in sizes" :key="size.id" :value="size.id">
                  {{ size.ten_kich_thuoc }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Chất liệu *</label>
              <select
                v-model="formData.id_chat_lieu"
                class="form-control"
                required
              >
                <option value="">Chọn chất liệu</option>
                <option v-for="material in materials" :key="material.id" :value="material.id">
                  {{ material.ten_chat_lieu }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Đế giày</label>
              <select v-model="formData.id_de_giay" class="form-control">
                <option value="">Chọn đế giày</option>
                <option v-for="sole in soles" :key="sole.id" :value="sole.id">
                  {{ sole.ten_de_giay }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Đệm giày</label>
              <select v-model="formData.id_dem_giay" class="form-control">
                <option value="">Chọn đệm giày</option>
                <option v-for="insole in insoles" :key="insole.id" :value="insole.id">
                  {{ insole.ten_dem_giay }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Môn thể thao</label>
              <select v-model="formData.id_mon_the_thao" class="form-control">
                <option value="">Chọn môn thể thao</option>
                <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                  {{ sport.ten_mon_the_thao }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Trọng lượng</label>
              <select v-model="formData.id_trong_luong" class="form-control">
                <option value="">Chọn trọng lượng</option>
                <option v-for="weight in weights" :key="weight.id" :value="weight.id">
                  {{ weight.ten_trong_luong }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Loại mùa</label>
              <select v-model="formData.id_loai_mua" class="form-control">
                <option value="">Chọn loại mùa</option>
                <option v-for="season in seasons" :key="season.id" :value="season.id">
                  {{ season.ten_loai_mua }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Độ bền</label>
              <select v-model="formData.id_do_ben" class="form-control">
                <option value="">Chọn độ bền</option>
                <option v-for="durability in durabilities" :key="durability.id" :value="durability.id">
                  {{ durability.ten_do_ben }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Chống nước</label>
              <select v-model="formData.id_chong_nuoc" class="form-control">
                <option value="">Chọn mức chống nước</option>
                <option v-for="waterproof in waterproofs" :key="waterproof.id" :value="waterproof.id">
                  {{ waterproof.ten_chong_nuoc }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Giá bán *</label>
              <input
                v-model="formData.gia_ban"
                type="number"
                class="form-control"
                placeholder="Nhập giá bán"
                min="0"
                step="1000"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Số lượng *</label>
              <input
                v-model="formData.so_luong"
                type="number"
                class="form-control"
                placeholder="Nhập số lượng"
                min="0"
                required
              />
            </div>

            <div class="form-group span-2">
              <label class="form-label">Trạng thái</label>
              <select v-model="formData.trang_thai" class="form-control">
                <option :value="1">Hoạt động</option>
                <option :value="0">Ngừng hoạt động</option>
              </select>
            </div>

            <div class="form-group span-2">
              <label class="form-label">Hình ảnh sản phẩm</label>
              <div class="image-upload-container">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageUpload"
                  class="form-control"
                  id="imageUpload"
                />
                <div class="image-preview-grid" v-if="selectedImages.length > 0">
                  <div v-for="(image, index) in selectedImages" :key="index" class="image-preview-item">
                    <img :src="image.url" :alt="`Preview ${index + 1}`" class="preview-image" />
                    <button type="button" @click="removeImage(index)" class="remove-image-btn">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group span-2">
              <label class="form-label">Ghi chú</label>
              <textarea
                v-model="formData.ghi_chu"
                class="form-control"
                rows="3"
                placeholder="Nhập ghi chú..."
              ></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-export" @click="closeModals">
            <span class="btn-icon">❌</span>
            Hủy
          </button>
          <button class="btn-export" @click="saveDetail">
            <span class="btn-icon">💾</span>
            {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ButtonGroup from '@/components/ui/NhomNut.vue'
import { productDetailsService } from '@/services/dichVuSanPham.js'
import { manufacturerService, colorService, sizeService, materialService } from '@/services/dichVuThuocTinh.js'

// Tab Management
const activeMainTab = ref('details')
const activeSubTab = ref('table')
const isEditing = ref(false)
const editingItem = ref(null)

const mainTabs = ref([
  { id: 'details', icon: '📦', label: 'Chi tiết sản phẩm' },
  { id: 'manufacturers', icon: '🏭', label: 'Nhà sản xuất' },
  { id: 'origins', icon: '🌍', label: 'Xuất xứ' },
  { id: 'colors', icon: '🎨', label: 'Màu sắc' },
  { id: 'sizes', icon: '📏', label: 'Kích thước' },
  { id: 'soles', icon: '👞', label: 'Đế giày' },
  { id: 'materials', icon: '🧵', label: 'Chất liệu' },
  { id: 'cushionings', icon: '🛏️', label: 'Đệm giày' },
  { id: 'weights', icon: '⚖️', label: 'Trọng lượng' },
  { id: 'sports', icon: '⚽', label: 'Môn thể thao' },
  { id: 'seasons', icon: '🌤️', label: 'Loại mùa' },
  { id: 'durabilities', icon: '💪', label: 'Độ bền' },
  { id: 'waterproofs', icon: '💧', label: 'Chống nước' },
  { id: 'images', icon: '📷', label: 'Ảnh sản phẩm' }
])

const subTabs = ref({
  details: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  manufacturers: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  origins: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  colors: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  sizes: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  soles: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  materials: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  cushionings: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  weights: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  sports: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  seasons: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sửa' }
  ],
  durabilities: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sừa' }
  ],
  waterproofs: [
    { id: 'table', icon: '📋', label: 'Danh sách' },
    { id: 'form', icon: '➕', label: 'Thêm/Sừa' }
  ],
  images: [
    { id: 'table', icon: '📋', label: 'Danh sách ảnh' },
    { id: 'form', icon: '🖼️', label: 'Quản lý ảnh' }
  ]
})

// Product Details Data
const searchQuery = ref('')
const selectedProduct = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const statusFilter = ref('')
const showAddDetailModal = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDetail = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Attributes Data
const manufacturers = ref([])
const origins = ref([])
const brands = ref([])
const colors = ref([])
const sizes = ref([])
const soles = ref([])
const materials = ref([])
const cushionings = ref([])
const weights = ref([])
const sports = ref([])
const seasons = ref([])
const durabilities = ref([])
const waterproofs = ref([])
const productImages = ref([])

// Loading states
const loading = ref(false)
const loadingManufacturers = ref(false)
const loadingOrigins = ref(false)
const loadingBrands = ref(false)
const loadingColors = ref(false)
const loadingSizes = ref(false)
const loadingSoles = ref(false)
const loadingMaterials = ref(false)
const loadingCushionings = ref(false)
const loadingWeights = ref(false)
const loadingSports = ref(false)
const loadingSeasons = ref(false)
const loadingDurabilities = ref(false)
const loadingWaterproofs = ref(false)
const loadingImages = ref(false)

// Modal states for attributes
const showAddBrandModal = ref(false)
const showAddColorModal = ref(false)
const showAddSizeModal = ref(false)
const showAddMaterialModal = ref(false)

const formData = ref({
  id_san_pham: '',
  id_mau_sac: '',
  id_kich_thuoc: '',
  id_chat_lieu: '',
  id_de_giay: '',
  id_dem_giay: '',
  id_trong_luong: '',
  id_mon_the_thao: '',
  id_loai_mua: '',
  id_do_ben: '',
  id_chong_nuoc: '',
  so_luong: 0,
  gia_ban: 0,
  trang_thai: 1,
  ghi_chu: ''
})

// Image handling
const selectedImages = ref([])
const maxImages = 5

// Data arrays (cleaned up duplicates)
const productDetails = ref([])
const products = ref([])
const insoles = ref([])

// Computed
const filteredDetails = computed(() => {
  return productDetails.value.filter(detail => {
    const matchesSearch = !searchQuery.value || 
      detail.product?.ten_san_pham?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      detail.color?.ten_mau_sac?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      detail.size?.ten_kich_thuoc?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesProduct = !selectedProduct.value || detail.id_san_pham == selectedProduct.value
    const matchesColor = !selectedColor.value || detail.id_mau_sac == selectedColor.value
    const matchesSize = !selectedSize.value || detail.id_kich_thuoc == selectedSize.value
    const matchesStatus = statusFilter.value === '' || detail.trang_thai == statusFilter.value
    
    return matchesSearch && matchesProduct && matchesColor && matchesSize && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredDetails.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredDetails.value.length))

const paginatedDetails = computed(() => {
  return filteredDetails.value.slice(startIndex.value, startIndex.value + itemsPerPage.value)
})

// Tab navigation methods
const selectMainTab = (tabId) => {
  activeMainTab.value = tabId
  // Reset to first sub tab when switching main tab
  const subTabsForTab = getSubTabs(tabId)
  if (subTabsForTab.length > 0) {
    activeSubTab.value = subTabsForTab[0].id
  }
}

const getSubTabs = (mainTabId) => {
  return subTabs.value[mainTabId] || []
}

// Tab count function
const getMainTabCount = (tabId) => {
  switch (tabId) {
    case 'details': return productDetails.value.length
    case 'manufacturers': return manufacturers.value.length
    case 'origins': return origins.value.length
    case 'brands': return brands.value.length
    case 'colors': return colors.value.length
    case 'sizes': return sizes.value.length
    case 'soles': return soles.value.length
    case 'materials': return materials.value.length
    case 'cushionings': return cushionings.value.length
    case 'weights': return weights.value.length
    case 'sports': return sports.value.length
    case 'seasons': return seasons.value.length
    case 'durabilities': return durabilities.value.length
    case 'waterproofs': return waterproofs.value.length
    case 'images': return productImages.value.length
    default: return 0
  }
}

// Data loading functions
const loadBrands = async () => {
  loadingBrands.value = true
  try {
    const response = await manufacturerService.getAll()
    brands.value = response.data || response || []
  } catch (error) {
    console.error('Error loading brands:', error)
    brands.value = []
  } finally {
    loadingBrands.value = false
  }
}

const loadColors = async () => {
  loadingColors.value = true
  try {
    const response = await colorService.getAll()
    colors.value = response.data || response || []
  } catch (error) {
    console.error('Error loading colors:', error)
    colors.value = []
  } finally {
    loadingColors.value = false
  }
}

const loadSizes = async () => {
  loadingSizes.value = true
  try {
    const response = await sizeService.getAll()
    sizes.value = response.data || response || []
  } catch (error) {
    console.error('Error loading sizes:', error)
    sizes.value = []
  } finally {
    loadingSizes.value = false
  }
}

const loadMaterials = async () => {
  loadingMaterials.value = true
  try {
    const response = await materialService.getAll()
    materials.value = response.data || response || []
  } catch (error) {
    console.error('Error loading materials:', error)
    materials.value = []
  } finally {
    loadingMaterials.value = false
  }
}

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' VND')
}

const getColorCode = (colorName) => {
  const colorMap = {
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Đỏ': '#FF0000',
    'Xanh': '#0000FF',
    'Vàng': '#FFFF00',
    'Xám': '#808080',
    'Nâu': '#8B4513',
    'Hồng': '#FFC0CB'
  }
  return colorMap[colorName] || '#E5E7EB'
}

const editDetail = (detail) => {
  editingDetail.value = detail
  formData.value = { 
    ...detail,
    id_san_pham: detail.id_san_pham,
    id_mau_sac: detail.id_mau_sac,
    id_kich_thuoc: detail.id_kich_thuoc,
    id_chat_lieu: detail.id_chat_lieu,
    id_de_giay: detail.id_de_giay,
    id_dem_giay: detail.id_dem_giay
  }
  showEditModal.value = true
}

const deleteDetail = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?')) {
    const index = productDetails.value.findIndex(d => d.id === id)
    if (index > -1) {
      productDetails.value.splice(index, 1)
    }
  }
}

const saveDetail = () => {
  if (!formData.value.id_san_pham || !formData.value.id_mau_sac || !formData.value.id_kich_thuoc) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
    return
  }

  if (showAddModal.value) {
    const newDetail = {
      ...formData.value,
      id: Date.now(),
      product: products.value.find(p => p.id == formData.value.id_san_pham),
      color: colors.value.find(c => c.id == formData.value.id_mau_sac),
      size: sizes.value.find(s => s.id == formData.value.id_kich_thuoc),
      material: materials.value.find(m => m.id == formData.value.id_chat_lieu)
    }
    productDetails.value.unshift(newDetail)
  } else if (showEditModal.value && editingDetail.value) {
    const index = productDetails.value.findIndex(d => d.id === editingDetail.value.id)
    if (index > -1) {
      productDetails.value[index] = {
        ...editingDetail.value,
        ...formData.value,
        product: products.value.find(p => p.id == formData.value.id_san_pham),
        color: colors.value.find(c => c.id == formData.value.id_mau_sac),
        size: sizes.value.find(s => s.id == formData.value.id_kich_thuoc),
        material: materials.value.find(m => m.id == formData.value.id_chat_lieu)
      }
    }
  }

  closeModals()
}

const closeModals = () => {
  showAddDetailModal.value = false
  showAddModal.value = false
  showEditModal.value = false
  showAddBrandModal.value = false
  showAddColorModal.value = false
  showAddSizeModal.value = false
  showAddMaterialModal.value = false
  editingDetail.value = null
  selectedImages.value = []
  formData.value = {
    id_san_pham: '',
    id_mau_sac: '',
    id_kich_thuoc: '',
    id_chat_lieu: '',
    id_de_giay: '',
    id_dem_giay: '',
    id_trong_luong: '',
    id_mon_the_thao: '',
    id_loai_mua: '',
    id_do_ben: '',
    id_chong_nuoc: '',
    so_luong: 0,
    gia_ban: 0,
    trang_thai: 1,
    ghi_chu: ''
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedProduct.value = ''
  selectedColor.value = ''
  selectedSize.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
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

const refreshData = async () => {
  console.log('Refreshing all data...')
  loading.value = true
  try {
    await Promise.all([
      loadBrands(),
      loadColors(), 
      loadSizes(),
      loadMaterials()
    ])
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  console.log('Exporting product details report...')
  alert('Xuất báo cáo thành công! (Chức năng đang được phát triển)')
}

const exportToExcel = () => {
  console.log('Exporting product details to Excel...')
  alert('Xuất Excel thành công! (Chức năng đang được phát triển)')
}

onMounted(async () => {
  console.log('Loading initial data...')
  loading.value = true
  
  try {
    // Load all attribute data in parallel
    await Promise.all([
      loadBrands(),
      loadColors(),
      loadSizes(), 
      loadMaterials()
    ])
    
    // Load additional data
    await loadAdditionalData()
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    loading.value = false
  }
})

// Handler methods for new tab structure
const handleSaveProductDetail = (formData) => {
  console.log('Saving product detail:', formData)
  activeSubTab.value = 'table'
}

const handleSaveManufacturer = (formData) => {
  console.log('Saving manufacturer:', formData)
  activeSubTab.value = 'table'
}

const handleSaveOrigin = (formData) => {
  console.log('Saving origin:', formData)
  activeSubTab.value = 'table'
}

const handleSaveColor = (formData) => {
  console.log('Saving color:', formData)
  activeSubTab.value = 'table'
}

const handleSaveSize = (formData) => {
  console.log('Saving size:', formData)
  activeSubTab.value = 'table'
}

const handleSaveMaterial = (formData) => {
  console.log('Saving material:', formData)
  activeSubTab.value = 'table'
}

// Additional handler methods for remaining attributes
const handleSaveSole = (formData) => {
  console.log('Saving sole:', formData)
  activeSubTab.value = 'table'
}

const handleSaveCushioning = (formData) => {
  console.log('Saving cushioning:', formData)
  activeSubTab.value = 'table'
}

const handleSaveWeight = (formData) => {
  console.log('Saving weight:', formData)
  activeSubTab.value = 'table'
}

const handleSaveSport = (formData) => {
  console.log('Saving sport:', formData)
  activeSubTab.value = 'table'
}

const handleSaveSeason = (formData) => {
  console.log('Saving season:', formData)
  activeSubTab.value = 'table'
}

const handleSaveDurability = (formData) => {
  console.log('Saving durability:', formData)
  activeSubTab.value = 'table'
}

const handleSaveWaterproof = (formData) => {
  console.log('Saving waterproof:', formData)
  activeSubTab.value = 'table'
}

const handleSaveImage = (formData) => {
  console.log('Saving image:', formData)
  activeSubTab.value = 'table'
}

// Delete methods
const deleteProductDetail = (item) => {
  if (confirm('Bạn có chắc muốn xóa chi tiết sản phẩm này?')) {
    console.log('Deleting product detail:', item)
  }
}

const deleteManufacturer = (item) => {
  if (confirm('Bạn có chắc muốn xóa nhà sản xuất này?')) {
    console.log('Deleting manufacturer:', item)
  }
}

const deleteOrigin = (item) => {
  if (confirm('Bạn có chắc muốn xóa xuất xứ này?')) {
    console.log('Deleting origin:', item)
  }
}

const deleteColor = (item) => {
  if (confirm('Bạn có chắc muốn xóa màu sắc này?')) {
    console.log('Deleting color:', item)
  }
}

const deleteSize = (item) => {
  if (confirm('Bạn có chắc muốn xóa kích thước này?')) {
    console.log('Deleting size:', item)
  }
}

const deleteSole = (item) => {
  if (confirm('Bạn có chắc muốn xóa đế giày này?')) {
    console.log('Deleting sole:', item)
  }
}

const deleteMaterial = (item) => {
  if (confirm('Bạn có chắc muốn xóa chất liệu này?')) {
    console.log('Deleting material:', item)
  }
}

const deleteCushioning = (item) => {
  if (confirm('Bạn có chắc muốn xóa đệm giày này?')) {
    console.log('Deleting cushioning:', item)
  }
}

const deleteWeight = (item) => {
  if (confirm('Bạn có chắc muốn xóa trọng lượng này?')) {
    console.log('Deleting weight:', item)
  }
}

const deleteSport = (item) => {
  if (confirm('Bạn có chắc muốn xóa môn thể thao này?')) {
    console.log('Deleting sport:', item)
  }
}

const deleteSeason = (item) => {
  if (confirm('Bạn có chắc muốn xóa loại mùa này?')) {
    console.log('Deleting season:', item)
  }
}

const deleteDurability = (item) => {
  if (confirm('Bạn có chắc muốn xóa độ bền này?')) {
    console.log('Deleting durability:', item)
  }
}

const deleteWaterproof = (item) => {
  if (confirm('Bạn có chắc muốn xóa chống nước này?')) {
    console.log('Deleting waterproof:', item)
  }
}

const deleteImage = (item) => {
  if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
    console.log('Deleting image:', item)
  }
}

// Load additional data that's not covered by the main attribute services
const loadAdditionalData = async () => {
  // Initialize all arrays as empty - no sample data
  manufacturers.value = []
  origins.value = []
  soles.value = []
  cushionings.value = []
  weights.value = []
  sports.value = []
  seasons.value = []
  durabilities.value = []
  waterproofs.value = []
  productImages.value = []
  products.value = []
  insoles.value = []
  productDetails.value = []
}

// Image handling functions
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  
  if (selectedImages.value.length + files.length > maxImages) {
    alert(`Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh`)
    return
  }
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          url: e.target.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const handleSingleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (editingItem.value) {
        editingItem.value.url = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>


<style scoped>
.product-details {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
}

/* Main Tab Styles */
.main-tab-navigation {
  background: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.main-tab-container {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  min-width: max-content;
}

.main-tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #f8f9fa;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.main-tab-button:hover {
  background: #e9ecef;
  color: #333;
}

.main-tab-button.active {
  background: #4ade80;
  color: white;
  border-color: #22c55e;
}

.main-tab-button.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Sub Tab Styles */
.sub-tab-navigation {
  background: white;
  border-top: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sub-tab-container {
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
}

.sub-tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-tab-button:hover {
  background: #f8f9fa;
  border-color: #22c55e;
}

.sub-tab-button.active {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.sub-tab-icon {
  font-size: 1rem;
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: auto;
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

.product-name {
  text-align: left;
}

.product-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.product-info small {
  color: var(--medium-gray);
  font-size: 0.75rem;
}

.color-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  border: 1px solid rgba(0,0,0,0.1);
}

.size-info {
  font-weight: 600;
  color: #4ade80;
}

.price {
  font-weight: 600;
  color: #4ade80;
}

.stock {
  font-weight: 600;
}

.stock.low-stock {
  color: var(--danger-color);
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.large {
  max-width: 1000px;
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

/* Form styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-details {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .table {
    font-size: 0.8125rem;
  }
  
  .table th, .table td {
    padding: 0.5rem 0.25rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  /* Hide less important columns on mobile */
  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(8),
  .table td:nth-child(8) {
    display: none;
  }
}

/* Dynamic Component Styles */
.table-view, .form-view {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-bottom: 1px solid #e5e7eb;
}

.view-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  text-transform: capitalize;
}

.view-content {
  padding: 2rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #4ade80;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid #22c55e;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.data-table tr:hover {
  background: #f9fafb;
}

.attribute-form {
  max-width: 600px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Tab Content Styles */
.tab-content {
  min-height: 600px;
  margin-top: 2rem;
}

.tab-content > div {
  min-height: 500px;
}

/* State Styles */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
  font-style: italic;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Data Grid for Attributes */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.item-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.item-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.1);
  transform: translateY(-2px);
}

.color-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.item-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.item-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.item-card:hover .item-actions {
  opacity: 1;
}

.btn-edit, .btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-edit {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-edit:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

/* Image Upload Styles */
.image-upload-container {
  width: 100%;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  background: var(--gray-50);
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.image-preview-item:hover {
  transform: scale(1.02);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
}

.remove-image-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

/* Button Styles */
.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: #4ade80;
  color: white;
}

.btn-primary:hover {
  background: #22c55e;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-icon {
  font-size: 1rem;
}

/* Form control styles */
.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

/* Table image styles */
.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* Form grid adjustments for new fields */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group.span-3 {
  grid-column: span 3;
}

/* Product Details Table Specific Styles */
.product-images {
  text-align: center;
}

.image-thumbnails {
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: center;
}

.thumbnail {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.more-count {
  font-size: 0.75rem;
  color: #666;
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
}

.no-image {
  color: #ccc;
  font-size: 1.2rem;
}

/* Status Badge Styles for Product Details */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Action Buttons Styles for Product Details */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background-color: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.view-btn {
  background-color: #6b7280;
  color: white;
}

.view-btn:hover {
  background-color: #4b5563;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
}

/* Table responsive adjustments */
@media (max-width: 1600px) {
  .table th:nth-child(8),
  .table td:nth-child(8),
  .table th:nth-child(9),
  .table td:nth-child(9),
  .table th:nth-child(10),
  .table td:nth-child(10) {
    display: none;
  }
}

@media (max-width: 1200px) {
  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(6),
  .table td:nth-child(6),
  .table th:nth-child(7),
  .table td:nth-child(7) {
    display: none;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
  
  .tab-icon {
    font-size: 1rem;
  }
  
  .data-grid {
    grid-template-columns: 1fr;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  /* Hide more columns on mobile */
  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(6),
  .table td:nth-child(6),
  .table th:nth-child(7),
  .table td:nth-child(7),
  .table th:nth-child(8),
  .table td:nth-child(8) {
    display: none;
  }
}
</style>
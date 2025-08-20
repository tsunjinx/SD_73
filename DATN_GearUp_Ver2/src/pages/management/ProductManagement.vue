<template>
  <div class="product-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Quản lý sản phẩm</h2>
      <ActionButton
        icon="add"
        variant="primary"
        size="md"
        label="Thêm sản phẩm"
        show-label
        @click="showAddModal = true"
      />
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="search-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
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
          <select v-model="selectedCategory" class="form-control">
            <option value="">Tất cả danh mục</option>
            <option value="giay-the-thao">Giày thể thao</option>
            <option value="giay-luoi">Giày lười</option>
            <option value="giay-cao-co">Giày cao cổ</option>
          </select>
          
          <select v-model="selectedBrand" class="form-control">
            <option value="">Tất cả thương hiệu</option>
            <option value="balenciaga">Balenciaga</option>
            <option value="converse">Converse</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
          </select>
          
          <select v-model="selectedStatus" class="form-control">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" @change="toggleSelectAll" :checked="allSelected">
              </th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <input 
                  type="checkbox" 
                  :value="product.id" 
                  v-model="selectedProducts"
                >
              </td>
              <td>
                <div class="product-image">
                  <img v-if="product.image" :src="product.image" :alt="product.name">
                  <div v-else class="placeholder-image">👟</div>
                </div>
              </td>
              <td>
                <div class="product-info">
                  <strong>{{ product.name }}</strong>
                  <p class="product-code">{{ product.code }}</p>
                </div>
              </td>
              <td>{{ product.brand }}</td>
              <td>{{ product.category }}</td>
              <td class="price">{{ formatCurrency(product.price) }}</td>
              <td>
                <span :class="['stock', { 'low-stock': product.stock < 10 }]">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span :class="['badge', product.status === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ product.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td>
                <ButtonGroup spacing="xs">
                  <ActionButton
                    icon="view"
                    variant="info"
                    size="sm"
                    tooltip="Xem chi tiết"
                    @click="viewProduct(product)"
                  />
                  <ActionButton
                    icon="edit"
                    variant="warning"
                    size="sm"
                    tooltip="Chỉnh sửa"
                    @click="editProduct(product)"
                  />
                  <ActionButton
                    icon="delete"
                    variant="danger"
                    size="sm"
                    tooltip="Xóa sản phẩm"
                    @click="deleteProduct(product)"
                  />
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            Hiển thị {{ startIndex + 1 }} - {{ endIndex }} của {{ totalProducts }} sản phẩm
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

    <!-- Modern Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="modern-modal-overlay" @click="closeModals">
      <div class="modern-modal-content" @click.stop>
        <!-- Modal Header -->
        <div class="modern-modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="header-text">
              <h2>{{ showAddModal ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm' }}</h2>
              <p>{{ showAddModal ? 'Tạo sản phẩm mới với thể loại 8-core attributes và SKU auto-generation' : 'Cập nhật thông tin sản phẩm' }}</p>
            </div>
          </div>
          <button class="modern-close-btn" @click="closeModals">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="modern-modal-body">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">📋</div>
              <h3>Thông tin cơ bản</h3>
            </div>
            <div class="section-content">
              <div class="form-grid">
                <div class="form-field">
                  <label class="modern-label">Mã sản phẩm *</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      v-model="productForm.code" 
                      class="modern-input" 
                      placeholder="Ví dụ: MSA-MZ-2024-NoIR-SP001"
                      required
                    >
                    <button type="button" class="input-addon-btn" @click="generateProductCode">
                      🔄
                    </button>
                  </div>
                  <small class="field-hint">Mã này sẽ không thể thay đổi sau khi tạo sản phẩm.</small>
                </div>

                <div class="form-field">
                  <label class="modern-label">Tên sản phẩm *</label>
                  <input 
                    type="text" 
                    v-model="productForm.name" 
                    class="modern-input" 
                    placeholder="Nhập tên sản phẩm"
                    required
                  >
                </div>

                <div class="form-field">
                  <label class="modern-label">Danh mục *</label>
                  <select v-model="productForm.category" class="modern-select" required>
                    <option value="">Chọn danh mục</option>
                    <option value="giay-the-thao">Giày thể thao</option>
                    <option value="giay-luoi">Giày lười</option>
                    <option value="giay-cao-co">Giày cao cổ</option>
                  </select>
                </div>

                <div class="form-field">
                  <label class="modern-label">Thương hiệu *</label>
                  <select v-model="productForm.brand" class="modern-select" required>
                    <option value="">Chọn thương hiệu</option>
                    <option value="balenciaga">Balenciaga</option>
                    <option value="converse">Converse</option>
                    <option value="nike">Nike</option>
                    <option value="adidas">Adidas</option>
                  </select>
                </div>

                <div class="form-field span-2">
                  <label class="modern-label">Trạng thái</label>
                  <div class="toggle-group">
                    <label class="toggle-option" :class="{ active: productForm.status === 'active' }">
                      <input 
                        type="radio" 
                        value="active" 
                        v-model="productForm.status" 
                        style="display: none"
                      >
                      <span class="toggle-indicator"></span>
                      Hoạt động
                    </label>
                    <label class="toggle-option" :class="{ active: productForm.status === 'inactive' }">
                      <input 
                        type="radio" 
                        value="inactive" 
                        v-model="productForm.status" 
                        style="display: none"
                      >
                      <span class="toggle-indicator"></span>
                      Tạm dừng
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Images Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">🖼️</div>
              <h3>Hình ảnh sản phẩm</h3>
            </div>
            <div class="section-content">
              <div class="image-upload-grid">
                <div class="image-upload-item main-image" @click="triggerImageUpload(0)">
                  <div v-if="productImages[0]" class="uploaded-image">
                    <img :src="productImages[0]" alt="Product Image">
                    <button class="remove-image" @click.stop="removeImage(0)">✕</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    <p>Thêm ảnh</p>
                    <span>Kéo và thả hoặc click để chọn</span>
                  </div>
                </div>
                
                <div v-for="index in 4" :key="index" class="image-upload-item" @click="triggerImageUpload(index)">
                  <div v-if="productImages[index]" class="uploaded-image">
                    <img :src="productImages[index]" alt="Product Image">
                    <button class="remove-image" @click.stop="removeImage(index)">✕</button>
                  </div>
                  <div v-else class="upload-placeholder small">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Thêm ảnh</span>
                  </div>
                </div>
              </div>
              <input 
                ref="imageInput" 
                type="file" 
                @change="handleImageUpload" 
                accept="image/*" 
                multiple
                style="display: none"
              >
              <div class="upload-guidelines">
                <p>Hướng dẫn tải ảnh:</p>
                <ul>
                  <li>Tối đa 5 hình ảnh</li>
                  <li>Kích thước tối đa 500KB mỗi ảnh</li>
                  <li>Định dạng JPG, PNG, WebP</li>
                  <li>Khuyến nghị: Anh trường 500x500 (1:1)</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Variant Configuration Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">⚙️</div>
              <h3>Biến thể sản phẩm</h3>
              <div class="section-badge">❓</div>
            </div>
            <div class="section-content">
              <div class="variant-tabs">
                <button 
                  v-for="tab in variantTabs" 
                  :key="tab.id"
                  :class="['variant-tab', { active: activeVariantTab === tab.id }]"
                  @click="activeVariantTab = tab.id"
                >
                  {{ tab.name }}
                </button>
              </div>

              <div class="variant-content">
                <!-- Auto Variant Creation Tab -->
                <div v-if="activeVariantTab === 'auto'" class="variant-panel">
                  <div class="auto-variant-section">
                    <h4>Tạo biến thể tự động</h4>
                    <div class="form-grid">
                      <div class="form-field">
                        <label class="modern-label">Màu sắc</label>
                        <select class="modern-select">
                          <option>Chọn màu sắc</option>
                          <option value="white">Trắng</option>
                          <option value="black">Đen</option>
                          <option value="red">Đỏ</option>
                          <option value="blue">Xanh dương</option>
                          <option value="green">Xanh lá</option>
                          <option value="yellow">Vàng</option>
                          <option value="pink">Hồng</option>
                          <option value="gray">Xám</option>
                        </select>
                      </div>
                      <div class="form-field">
                        <label class="modern-label">Kích thước</label>
                        <select class="modern-select">
                          <option>Chọn kích thước</option>
                          <option value="35">35</option>
                          <option value="36">36</option>
                          <option value="37">37</option>
                          <option value="38">38</option>
                          <option value="39">39</option>
                          <option value="40">40</option>
                          <option value="41">41</option>
                          <option value="42">42</option>
                          <option value="43">43</option>
                          <option value="44">44</option>
                          <option value="45">45</option>
                        </select>
                      </div>
                      <div class="form-field">
                        <label class="modern-label">Chất liệu</label>
                        <select class="modern-select">
                          <option>Chọn chất liệu</option>
                          <option value="leather">Da thật</option>
                          <option value="synthetic">Da tổng hợp</option>
                          <option value="canvas">Vải canvas</option>
                          <option value="mesh">Vải lưới</option>
                          <option value="suede">Da lộn</option>
                          <option value="rubber">Cao su</option>
                        </select>
                      </div>
                      <div class="form-field">
                        <label class="modern-label">Kiểu dáng</label>
                        <select class="modern-select">
                          <option>Chọn kiểu dáng</option>
                          <option value="low-top">Cổ thấp</option>
                          <option value="mid-top">Cổ vừa</option>
                          <option value="high-top">Cổ cao</option>
                          <option value="slip-on">Giày lười</option>
                          <option value="sneaker">Sneaker</option>
                          <option value="boot">Boot</option>
                        </select>
                      </div>
                    </div>
                    <button class="create-variant-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Tạo biến thể
                    </button>
                    <small class="variant-note">Gói bán sẽ được tạo theo những gì đã chọn và tạo đủ chỉnh thành giá bản đĩa</small>
                  </div>
                </div>

                <!-- Basic Info Tab -->
                <div v-if="activeVariantTab === 'basic'" class="variant-panel">
                  <div class="form-grid">
                    <div class="form-field">
                      <label class="modern-label">Giá bán *</label>
                      <input 
                        type="number" 
                        v-model="productForm.price" 
                        class="modern-input" 
                        min="0"
                        required
                      >
                    </div>
                    <div class="form-field">
                      <label class="modern-label">Số lượng *</label>
                      <input 
                        type="number" 
                        v-model="productForm.stock" 
                        class="modern-input" 
                        min="0"
                        required
                      >
                    </div>
                    <div class="form-field span-2">
                      <label class="modern-label">Mô tả sản phẩm</label>
                      <textarea 
                        v-model="productForm.description" 
                        class="modern-textarea" 
                        rows="4"
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="modern-modal-footer">
          <button type="button" class="btn-secondary" @click="closeModals">
            Hủy bỏ
          </button>
          <button type="button" class="btn-primary" @click="saveProduct">
            {{ showAddModal ? 'Tạo biến thể' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết sản phẩm</h3>
          <button class="modal-close" @click="showDetailModal = false">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedProduct">
          <div class="product-detail">
            <div class="product-detail-image">
              <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name">
              <div v-else class="placeholder-image large">👟</div>
            </div>
            
            <div class="product-detail-info">
              <h4>{{ selectedProduct.name }}</h4>
              <p><strong>Mã sản phẩm:</strong> {{ selectedProduct.code }}</p>
              <p><strong>Thương hiệu:</strong> {{ selectedProduct.brand }}</p>
              <p><strong>Danh mục:</strong> {{ selectedProduct.category }}</p>
              <p><strong>Giá bán:</strong> {{ formatCurrency(selectedProduct.price) }}</p>
              <p><strong>Số lượng tồn kho:</strong> {{ selectedProduct.stock }}</p>
              <p><strong>Trạng thái:</strong> 
                <span :class="['badge', selectedProduct.status === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ selectedProduct.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </p>
              <div class="description">
                <strong>Mô tả:</strong>
                <p>{{ selectedProduct.description || 'Chưa có mô tả' }}</p>
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
import ActionButton from '@/components/ui/ActionButton.vue'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

// Data
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const selectedStatus = ref('')
const selectedProducts = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectedProduct = ref(null)
const imagePreview = ref('')

// Modern UI state
const productImages = ref([])
const variantTabs = ref([
  { id: 'auto', name: 'Tạo biến thể tự động' },
  { id: 'basic', name: 'Thông tin cơ bản' }
])
const activeVariantTab = ref('auto')
const imageInput = ref(null)

const productForm = ref({
  id: null,
  name: '',
  code: '',
  brand: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  image: '',
  status: 'active'
})

// Mock data
const products = ref([
  {
    id: 1,
    name: 'Balen Grey 2023',
    code: 'PD12',
    brand: 'Balenciaga',
    category: 'Giày lười',
    price: 550000,
    stock: 18,
    status: 'active',
    description: 'Giày lười cao cấp với chất liệu da thật',
    image: ''
  },
  {
    id: 2,
    name: 'Converse Venom',
    code: 'PD13',
    brand: 'Converse',
    category: 'Giày thể thao',
    price: 950000,
    stock: 15,
    status: 'active',
    description: 'Giày thể thao phong cách street style',
    image: ''
  },
  {
    id: 3,
    name: 'Kkkk Xanh dương',
    code: 'PD11',
    brand: 'Converse',
    category: 'Giày cao cổ',
    price: 100000,
    stock: 5,
    status: 'active',
    description: 'Giày cao cổ màu xanh dương',
    image: ''
  },
  {
    id: 4,
    name: 'Nike Air Max',
    code: 'PD14',
    brand: 'Nike',
    category: 'Giày thể thao',
    price: 1200000,
    stock: 25,
    status: 'active',
    description: 'Giày thể thao Nike Air Max chính hãng',
    image: ''
  },
  {
    id: 5,
    name: 'Adidas Ultraboost',
    code: 'PD15',
    brand: 'Adidas',
    category: 'Giày thể thao',
    price: 1500000,
    stock: 0,
    status: 'inactive',
    description: 'Giày chạy bộ Adidas Ultraboost',
    image: ''
  }
])

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  if (selectedBrand.value) {
    filtered = filtered.filter(product => product.brand.toLowerCase() === selectedBrand.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(product => product.status === selectedStatus.value)
  }

  return filtered.slice(startIndex.value, endIndex.value)
})

const totalProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  if (selectedBrand.value) {
    filtered = filtered.filter(product => product.brand.toLowerCase() === selectedBrand.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(product => product.status === selectedStatus.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalProducts.value))

const allSelected = computed(() => {
  return filteredProducts.value.length > 0 && 
         filteredProducts.value.every(product => selectedProducts.value.includes(product.id))
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount).replace('₫', ' VND')
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedProducts.value = []
  } else {
    selectedProducts.value = filteredProducts.value.map(product => product.id)
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

const viewProduct = (product) => {
  selectedProduct.value = product
  showDetailModal.value = true
}

const editProduct = (product) => {
  productForm.value = { ...product }
  imagePreview.value = product.image || ''
  showEditModal.value = true
}

const deleteProduct = (product) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
    const index = products.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const resetForm = () => {
  productForm.value = {
    id: null,
    name: '',
    code: '',
    brand: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    status: 'active'
  }
  imagePreview.value = ''
  productImages.value = []
  activeVariantTab.value = 'auto'
}


const saveProduct = () => {
  if (showAddModal.value) {
    // Add new product
    const newProduct = {
      ...productForm.value,
      id: Math.max(...products.value.map(p => p.id)) + 1
    }
    products.value.push(newProduct)
  } else if (showEditModal.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === productForm.value.id)
    if (index > -1) {
      products.value[index] = { ...productForm.value }
    }
  }
  
  closeModals()
}

// Modern UI methods
const generateProductCode = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  productForm.value.code = `MSA-MZ-2024-${random}-SP${timestamp}`
}

const triggerImageUpload = (index) => {
  if (imageInput.value) {
    imageInput.value.dataset.index = index
    imageInput.value.click()
  }
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  const index = parseInt(event.target.dataset.index || '0')
  
  files.forEach((file, i) => {
    if (file && (index + i) < 5) {
      const reader = new FileReader()
      reader.onload = (e) => {
        productImages.value[index + i] = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index) => {
  productImages.value[index] = null
}

onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
.product-management {
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
.table {
  margin: 0;
  width: 100%;
  border-collapse: collapse;
  background-color: white;
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

.product-image {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
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

.placeholder-image.large {
  width: 200px;
  height: 200px;
  font-size: 3rem;
}

.product-info {
  text-align: left;
}

.product-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.product-code {
  color: var(--medium-gray);
  font-size: 0.875rem;
  margin: 0;
}

.price {
  font-weight: 600;
  color: var(--primary-color);
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content.large {
  max-width: 800px;
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

/* Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border-color);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Detail */
.product-detail {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
}

.product-detail-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border-color);
}

.product-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-detail-info h4 {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
}

.product-detail-info p {
  margin: 0.5rem 0;
}

.description {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.description p {
  color: var(--medium-gray);
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-management {
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
  
  .product-detail {
    grid-template-columns: 1fr;
    text-align: center;
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
  
  .table {
    font-size: 0.8125rem;
  }
  
  .table th, .table td {
    padding: 0.5rem 0.25rem;
  }
  
  /* Hide less important columns on mobile */
  .table th:nth-child(2),
  .table td:nth-child(2),
  .table th:nth-child(5),
  .table td:nth-child(5) {
    display: none;
  }
}

@media (max-width: 480px) {
  .product-management {
    padding: 0 0.5rem;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
  
  /* Hide more columns on very small screens */
  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(7),
  .table td:nth-child(7) {
    display: none;
  }
  
  .card {
    margin: 0 -0.5rem;
    border-radius: 0;
  }
}

/* Modern Modal Styles */
.modern-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modern-modal-content {
  background: #ffffff;
  border-radius: 16px;
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
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-text h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.header-text p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
}

.modern-close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.modern-close-btn:hover {
  background: #e2e8f0;
  color: #334155;
  transform: scale(1.05);
}

.modern-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem 2rem 2rem;
}

.modern-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 2rem;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.section-icon {
  font-size: 1.25rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  flex: 1;
}

.section-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  cursor: help;
}

.section-content {
  padding: 1.5rem;
}

/* Form Grid and Fields */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.span-2 {
  grid-column: span 2;
}

.modern-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-input, .modern-select, .modern-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #ffffff;
}

.modern-input:focus, .modern-select:focus, .modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group .modern-input {
  flex: 1;
}

.input-addon-btn {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.input-addon-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.field-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Toggle Group */
.toggle-group {
  display: flex;
  gap: 1rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

.toggle-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.toggle-indicator {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.toggle-option.active .toggle-indicator {
  border-color: #3b82f6;
  background: #3b82f6;
}

.toggle-option.active .toggle-indicator::after {
  content: '';
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Image Upload Grid */
.image-upload-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-upload-item {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.image-upload-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.image-upload-item.main-image {
  grid-row: span 2;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-align: center;
  padding: 1rem;
}

.upload-placeholder.small {
  padding: 0.5rem;
}

.upload-placeholder p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.upload-placeholder span {
  font-size: 0.75rem;
  color: #9ca3af;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0;
  transition: all 0.2s ease;
}

.uploaded-image:hover .remove-image {
  opacity: 1;
}

.remove-image:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.upload-guidelines {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.upload-guidelines p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.upload-guidelines ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Variant Configuration */
.variant-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.variant-tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.variant-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.variant-tab:hover:not(.active) {
  color: #374151;
}

.variant-panel {
  min-height: 300px;
}

.auto-variant-section h4 {
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.create-variant-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.create-variant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.variant-note {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Modal Footer Buttons */
.btn-secondary, .btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive Design for Modern Modal */
@media (max-width: 768px) {
  .modern-modal-overlay {
    padding: 1rem;
  }
  
  .modern-modal-content {
    max-width: 100%;
  }
  
  .modern-modal-header,
  .modern-modal-body,
  .modern-modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .image-upload-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .image-upload-item.main-image {
    grid-column: span 2;
    grid-row: span 1;
  }
  
  .variant-tabs {
    flex-direction: column;
  }
  
  .variant-tab {
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    border-right: 2px solid transparent;
  }
  
  .variant-tab.active {
    border-bottom-color: #e5e7eb;
    border-right-color: #3b82f6;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .modern-modal-footer {
    flex-direction: column-reverse;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>

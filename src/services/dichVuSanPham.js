// Product Management Service (ERD: san_pham, bien_the_san_pham, hinh_anh_san_pham)
import { createCRUDService } from './api.js'
import api from './api.js'

// Base CRUD operations for products - Updated for Spring Boot
const baseProductService = createCRUDService('/san-pham-management')

export const productService = {
  ...baseProductService,
  
  // Get all products
  getProducts: (params = {}) => {
    return api.get('/san-pham-management/playlist', { params })
  },
  
  // Get products with pagination
  getProductsPaging: (page = 0, size = 10) => {
    return api.get('/san-pham-management/paging', { params: { page, size } })
  },
  
  // Get products by manufacturer (nha san xuat)
  getByManufacturer: (id_nha_san_xuat, params = {}) => {
    return api.get(`/san-pham-management/by-manufacturer/${id_nha_san_xuat}`, { params })
  },
  
  // Get products by origin (xuat xu)
  getByOrigin: (id_xuat_xu, params = {}) => {
    return api.get(`/san-pham-management/by-origin/${id_xuat_xu}`, { params })
  },
  
  // Search products
  search: (query, params = {}) => {
    return api.get('/san-pham-management/search', { 
      params: { q: query, ...params } 
    })
  },
  
  // Get product details by ID
  getProductDetails: (id) => {
    return api.get(`/san-pham-management/detail/${id}`)
  },
  
  // Create new product
  create: (productData) => {
    return api.post('/san-pham-management/add', productData)
  },
  
  // Update product
  update: (id, productData) => {
    return api.put(`/san-pham-management/update/${id}`, productData)
  },
  
  // Delete product
  delete: (id) => {
    return api.delete(`/san-pham-management/delete/${id}`)
  },
  
  // Update product price
  updatePrice: (id, gia_ban, gia_khuyen_mai = null) => {
    return api.patch(`/products/${id}/price`, { 
      gia_ban, 
      gia_khuyen_mai 
    })
  },
  
  // Get product statistics
  getStatistics: () => {
    return api.get('/products/statistics')
  },
  
  // Get best selling products
  getBestSelling: (params = {}) => {
    return api.get('/products/best-selling', { params })
  },
  
  // Get low stock products
  getLowStock: (threshold = 10) => {
    return api.get('/products/low-stock', { 
      params: { threshold } 
    })
  },
  
  // Export products
  export: (format = 'excel', params = {}) => {
    return api.get(`/products/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Import products
  import: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Clone product
  clone: (id) => {
    return api.post(`/products/${id}/clone`)
  }
}

// Product Details Service (chi_tiet_san_pham) - Spring Boot endpoints
export const productDetailsService = {
  // Get all product details
  getAll: (params = {}) => {
    return api.get('/chi-tiet-san-pham-management/playlist', { params })
  },
  
  // Get with pagination
  getPaging: (page = 0, size = 10) => {
    return api.get('/chi-tiet-san-pham-management/paging', { params: { page, size } })
  },

  // Get product detail by ID
  getById: (id) => {
    return api.get(`/chi-tiet-san-pham-management/detail/${id}`)
  },

  // Get product details with joined data (product, color, size, material, etc.)
  getAllWithRelations: (params = {}) => {
    return api.get('/product-details/full', { params })
  },

  // Get details for a specific product
  getByProduct: (id_san_pham, params = {}) => {
    return api.get(`/products/${id_san_pham}/details`, { params })
  },

  // Create new product detail
  create: (detailData) => {
    return api.post('/chi-tiet-san-pham-management/add', detailData)
  },

  // Update product detail
  update: (id, detailData) => {
    return api.put(`/chi-tiet-san-pham-management/update/${id}`, detailData)
  },

  // Delete product detail
  delete: (id) => {
    return api.delete(`/chi-tiet-san-pham-management/delete/${id}`)
  },

  // Update stock quantity
  updateStock: (id, so_luong, action = 'set') => {
    return api.patch(`/product-details/${id}/stock`, { 
      so_luong, 
      action // 'set', 'add', 'subtract'
    })
  },

  // Update price
  updatePrice: (id, gia_ban) => {
    return api.patch(`/product-details/${id}/price`, { gia_ban })
  },

  // Bulk update stock for multiple details
  bulkUpdateStock: (updates) => {
    return api.patch('/product-details/bulk/stock', { updates })
  },

  // Bulk update price for multiple details  
  bulkUpdatePrice: (updates) => {
    return api.patch('/product-details/bulk/price', { updates })
  },

  // Get low stock details
  getLowStock: (threshold = 10) => {
    return api.get('/product-details/low-stock', { 
      params: { threshold } 
    })
  },

  // Get details by multiple filters
  getFiltered: (filters = {}) => {
    return api.get('/product-details/filter', { params: filters })
  },

  // Export product details
  export: (format = 'excel', params = {}) => {
    return api.get(`/product-details/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },

  // Get statistics for product details
  getStatistics: () => {
    return api.get('/product-details/statistics')
  }
}

// Product Variants Service (bien_the_san_pham) - Legacy support
export const productVariantService = {
  // Get variants for a product
  getByProduct: (id_san_pham) => {
    return api.get(`/products/${id_san_pham}/variants`)
  },
  
  // Create product variant
  create: (variantData) => {
    return api.post('/product-variants', variantData)
  },
  
  // Update variant
  update: (id, variantData) => {
    return api.put(`/product-variants/${id}`, variantData)
  },
  
  // Delete variant
  delete: (id) => {
    return api.delete(`/product-variants/${id}`)
  },
  
  // Get variant by color and size
  getByColorSize: (id_san_pham, id_mau_sac, id_kich_thuoc) => {
    return api.get(`/product-variants/find`, {
      params: { id_san_pham, id_mau_sac, id_kich_thuoc }
    })
  },
  
  // Update variant stock
  updateStock: (id, so_luong, action = 'set') => {
    return api.patch(`/product-variants/${id}/stock`, { 
      so_luong, 
      action 
    })
  },
  
  // Update variant price
  updatePrice: (id, gia_ban, gia_khuyen_mai = null) => {
    return api.patch(`/product-variants/${id}/price`, { 
      gia_ban, 
      gia_khuyen_mai 
    })
  },
  
  // Upload variant image
  uploadImage: (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return api.post(`/product-variants/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Product Images Service (anh_san_pham) - Spring Boot endpoints
export const productImageService = {
  // Get all images
  getAll: () => {
    return api.get('/anh-san-pham-management/playlist')
  },
  
  // Get images with pagination
  getPaging: (page = 0, size = 10) => {
    return api.get('/anh-san-pham-management/paging', { params: { page, size } })
  },
  
  // Get image by ID
  getById: (id) => {
    return api.get(`/anh-san-pham-management/detail/${id}`)
  },
  
  // Create new image
  create: (imageData) => {
    return api.post('/anh-san-pham-management/add', imageData)
  },
  
  // Update image
  update: (id, imageData) => {
    return api.put(`/anh-san-pham-management/update/${id}`, imageData)
  },
  
  // Upload multiple images
  uploadMultiple: (id_san_pham, imageFiles) => {
    const formData = new FormData()
    imageFiles.forEach((file, index) => {
      formData.append('images', file)
    })
    formData.append('id_san_pham', id_san_pham)
    
    return api.post('/product-images/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Update image order
  updateOrder: (id, thu_tu) => {
    return api.patch(`/product-images/${id}/order`, { thu_tu })
  },
  
  // Delete image
  delete: (id) => {
    return api.delete(`/anh-san-pham-management/delete/${id}`)
  },
  
  // Set as primary image
  setPrimary: (id) => {
    return api.patch(`/product-images/${id}/primary`)
  },
  
  // Reorder images
  reorder: (id_san_pham, imageOrder) => {
    return api.put(`/products/${id_san_pham}/images/reorder`, {
      image_order: imageOrder
    })
  }
}

export default productService
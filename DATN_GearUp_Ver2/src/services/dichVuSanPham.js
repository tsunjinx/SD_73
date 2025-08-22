// Product Management Service (ERD: san_pham, bien_the_san_pham, hinh_anh_san_pham)
import { createCRUDService } from './api.js'
import api from './api.js'

// Base CRUD operations for products
const baseProductService = createCRUDService('/products')

export const productService = {
  ...baseProductService,
  
  // Get products with filters
  getProducts: (params = {}) => {
    return api.get('/products', { params })
  },
  
  // Get products by category
  getByCategory: (id_danh_muc, params = {}) => {
    return api.get(`/products/category/${id_danh_muc}`, { params })
  },
  
  // Get products by brand
  getByBrand: (id_thuong_hieu, params = {}) => {
    return api.get(`/products/brand/${id_thuong_hieu}`, { params })
  },
  
  // Search products
  search: (query, params = {}) => {
    return api.get('/products/search', { 
      params: { q: query, ...params } 
    })
  },
  
  // Get product with variants and images
  getProductDetails: (id) => {
    return api.get(`/products/${id}/details`)
  },
  
  // Update product stock
  updateStock: (id, so_luong, action = 'set') => {
    return api.patch(`/products/${id}/stock`, { 
      so_luong, 
      action 
    })
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

// Product Details Service (chi_tiet_san_pham) - Complete CRUD operations
export const productDetailsService = {
  // Get all product details with full information
  getAll: (params = {}) => {
    return api.get('/product-details', { params })
  },

  // Get product detail by ID
  getById: (id) => {
    return api.get(`/product-details/${id}`)
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
    return api.post('/product-details', detailData)
  },

  // Update product detail
  update: (id, detailData) => {
    return api.put(`/product-details/${id}`, detailData)
  },

  // Delete product detail
  delete: (id) => {
    return api.delete(`/product-details/${id}`)
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

// Product Images Service (hinh_anh_san_pham)
export const productImageService = {
  // Get images for a product
  getByProduct: (id_san_pham) => {
    return api.get(`/products/${id_san_pham}/images`)
  },
  
  // Upload single image
  uploadSingle: (id_san_pham, imageFile, thu_tu = 0) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('id_san_pham', id_san_pham)
    formData.append('thu_tu', thu_tu)
    
    return api.post('/product-images/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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
    return api.delete(`/product-images/${id}`)
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
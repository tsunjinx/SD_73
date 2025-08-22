// Product Attributes Service (ERD: danh_muc, thuong_hieu, mau_sac, kich_thuoc)
import { createCRUDService } from './api.js'
import api from './api.js'

// Category Service (danh_muc)
const baseCategoryService = createCRUDService('/categories')

export const categoryService = {
  ...baseCategoryService,
  
  // Get category tree with hierarchy
  getTree: () => {
    return api.get('/categories/tree')
  },
  
  // Get root categories (no parent)
  getRootCategories: () => {
    return api.get('/categories/root')
  },
  
  // Get child categories
  getChildren: (id_cha) => {
    return api.get(`/categories/${id_cha}/children`)
  },
  
  // Get category path (breadcrumb)
  getPath: (id) => {
    return api.get(`/categories/${id}/path`)
  },
  
  // Move category to different parent
  move: (id, id_cha_moi) => {
    return api.patch(`/categories/${id}/move`, { id_cha: id_cha_moi })
  },
  
  // Update category position
  updatePosition: (id, vi_tri) => {
    return api.patch(`/categories/${id}/position`, { vi_tri })
  },
  
  // Get categories with product count
  getCategoriesWithProductCount: () => {
    return api.get('/categories/with-product-count')
  },
  
  // Search categories
  search: (query) => {
    return api.get('/categories/search', { 
      params: { q: query } 
    })
  },
  
  // Get category statistics
  getStatistics: (id) => {
    return api.get(`/categories/${id}/statistics`)
  }
}

// Brand Service (thuong_hieu)
const baseBrandService = createCRUDService('/brands')

export const brandService = {
  ...baseBrandService,
  
  // Upload brand logo
  uploadLogo: (id, logoFile) => {
    const formData = new FormData()
    formData.append('logo', logoFile)
    
    return api.post(`/brands/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Get brands with product count
  getBrandsWithProductCount: () => {
    return api.get('/brands/with-product-count')
  },
  
  // Search brands
  search: (query) => {
    return api.get('/brands/search', { 
      params: { q: query } 
    })
  },
  
  // Get popular brands
  getPopular: (limit = 10) => {
    return api.get('/brands/popular', { 
      params: { limit } 
    })
  },
  
  // Get brand statistics
  getStatistics: (id) => {
    return api.get(`/brands/${id}/statistics`)
  },
  
  // Export brands
  export: (format = 'excel') => {
    return api.get(`/brands/export/${format}`, {
      responseType: 'blob'
    })
  }
}

// Color Service (mau_sac)
const baseColorService = createCRUDService('/colors')

export const colorService = {
  ...baseColorService,
  
  // Get colors with hex codes
  getAllWithHex: () => {
    return api.get('/colors/with-hex')
  },
  
  // Search colors by name
  searchByName: (query) => {
    return api.get('/colors/search', { 
      params: { q: query } 
    })
  },
  
  // Get colors by hex range
  getByHexRange: (startHex, endHex) => {
    return api.get('/colors/hex-range', {
      params: { start: startHex, end: endHex }
    })
  },
  
  // Get popular colors (most used in products)
  getPopular: (limit = 10) => {
    return api.get('/colors/popular', { 
      params: { limit } 
    })
  },
  
  // Validate hex color code
  validateHex: (ma_mau) => {
    return api.post('/colors/validate-hex', { ma_mau })
  },
  
  // Get color statistics
  getStatistics: (id) => {
    return api.get(`/colors/${id}/statistics`)
  },
  
  // Import colors from palette
  importFromPalette: (paletteFile) => {
    const formData = new FormData()
    formData.append('palette', paletteFile)
    
    return api.post('/colors/import-palette', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Size Service (kich_thuoc)
const baseSizeService = createCRUDService('/sizes')

export const sizeService = {
  ...baseSizeService,
  
  // Get sizes by category
  getByCategory: (categoryType) => {
    return api.get(`/sizes/category/${categoryType}`)
  },
  
  // Search sizes
  search: (query) => {
    return api.get('/sizes/search', { 
      params: { q: query } 
    })
  },
  
  // Get size chart
  getSizeChart: (brandId = null, categoryId = null) => {
    return api.get('/sizes/chart', {
      params: { brand_id: brandId, category_id: categoryId }
    })
  },
  
  // Get popular sizes
  getPopular: (limit = 10) => {
    return api.get('/sizes/popular', { 
      params: { limit } 
    })
  },
  
  // Create size range (S, M, L, XL, etc.)
  createRange: (rangeData) => {
    return api.post('/sizes/create-range', rangeData)
  },
  
  // Get size statistics
  getStatistics: (id) => {
    return api.get(`/sizes/${id}/statistics`)
  },
  
  // Import size chart
  importChart: (chartFile) => {
    const formData = new FormData()
    formData.append('chart', chartFile)
    
    return api.post('/sizes/import-chart', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Export size data
  export: (format = 'excel') => {
    return api.get(`/sizes/export/${format}`, {
      responseType: 'blob'
    })
  }
}

// Combined attribute service for convenience
export const attributeService = {
  categories: categoryService,
  brands: brandService,
  colors: colorService,
  sizes: sizeService,
  
  // Get all attributes for product creation
  getAllForProduct: () => {
    return Promise.all([
      categoryService.getAll(),
      brandService.getAll(),
      colorService.getAll(),
      sizeService.getAll()
    ]).then(([categories, brands, colors, sizes]) => ({
      categories,
      brands,
      colors,
      sizes
    }))
  },
  
  // Search across all attributes
  searchAll: (query) => {
    return Promise.all([
      categoryService.search(query),
      brandService.search(query),
      colorService.searchByName(query),
      sizeService.search(query)
    ]).then(([categories, brands, colors, sizes]) => ({
      categories,
      brands,
      colors,
      sizes
    }))
  }
}

export default attributeService
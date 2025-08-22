// Customer Engagement Service (ERD: gio_hang, yeu_thich, danh_gia, binh_luan)
import { createCRUDService } from './api.js'
import api from './api.js'

// Cart Service (gio_hang)
const baseCartService = createCRUDService('/cart')

export const cartService = {
  // Get user's cart
  getUserCart: (id_nguoi_dung) => {
    return api.get(`/users/${id_nguoi_dung}/cart`)
  },
  
  // Add item to cart
  addItem: (id_nguoi_dung, itemData) => {
    return api.post(`/users/${id_nguoi_dung}/cart/items`, itemData)
  },
  
  // Update cart item quantity
  updateItem: (id, so_luong) => {
    return api.patch(`/cart/${id}`, { so_luong })
  },
  
  // Remove item from cart
  removeItem: (id) => {
    return api.delete(`/cart/${id}`)
  },
  
  // Clear user's cart
  clearCart: (id_nguoi_dung) => {
    return api.delete(`/users/${id_nguoi_dung}/cart`)
  },
  
  // Get cart total
  getCartTotal: (id_nguoi_dung) => {
    return api.get(`/users/${id_nguoi_dung}/cart/total`)
  },
  
  // Get abandoned carts
  getAbandonedCarts: (days = 7, params = {}) => {
    return api.get('/cart/abandoned', { 
      params: { days, ...params } 
    })
  },
  
  // Send abandoned cart reminder
  sendAbandonedCartReminder: (id_nguoi_dung) => {
    return api.post(`/users/${id_nguoi_dung}/cart/reminder`)
  },
  
  // Get cart statistics
  getStatistics: (period = 'month') => {
    return api.get('/cart/statistics', { 
      params: { period } 
    })
  },
  
  // Merge guest cart with user cart
  mergeGuestCart: (id_nguoi_dung, guestCartItems) => {
    return api.post(`/users/${id_nguoi_dung}/cart/merge`, {
      guest_items: guestCartItems
    })
  }
}

// Favorites/Wishlist Service (yeu_thich)
const baseFavoritesService = createCRUDService('/favorites')

export const favoritesService = {
  ...baseFavoritesService,
  
  // Get user's favorites
  getUserFavorites: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/favorites`, { params })
  },
  
  // Add product to favorites
  addToFavorites: (id_nguoi_dung, id_san_pham) => {
    return api.post(`/users/${id_nguoi_dung}/favorites`, { id_san_pham })
  },
  
  // Remove from favorites
  removeFromFavorites: (id_nguoi_dung, id_san_pham) => {
    return api.delete(`/users/${id_nguoi_dung}/favorites/${id_san_pham}`)
  },
  
  // Check if product is in favorites
  isFavorite: (id_nguoi_dung, id_san_pham) => {
    return api.get(`/users/${id_nguoi_dung}/favorites/${id_san_pham}/check`)
  },
  
  // Get most favorited products
  getMostFavorited: (params = {}) => {
    return api.get('/favorites/most-favorited', { params })
  },
  
  // Get favorites statistics
  getStatistics: (period = 'month') => {
    return api.get('/favorites/statistics', { 
      params: { period } 
    })
  },
  
  // Get trending products (recently favorited)
  getTrending: (days = 7, limit = 10) => {
    return api.get('/favorites/trending', {
      params: { days, limit }
    })
  },
  
  // Export user favorites
  exportUserFavorites: (id_nguoi_dung, format = 'excel') => {
    return api.get(`/users/${id_nguoi_dung}/favorites/export/${format}`, {
      responseType: 'blob'
    })
  }
}

// Reviews Service (danh_gia)
const baseReviewsService = createCRUDService('/reviews')

export const reviewsService = {
  ...baseReviewsService,
  
  // Get reviews by product
  getByProduct: (id_san_pham, params = {}) => {
    return api.get(`/products/${id_san_pham}/reviews`, { params })
  },
  
  // Get reviews by user
  getByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/reviews`, { params })
  },
  
  // Create review
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData)
  },
  
  // Update review
  updateReview: (id, reviewData) => {
    return api.put(`/reviews/${id}`, reviewData)
  },
  
  // Delete review
  deleteReview: (id) => {
    return api.delete(`/reviews/${id}`)
  },
  
  // Get product rating summary
  getProductRatingSummary: (id_san_pham) => {
    return api.get(`/products/${id_san_pham}/rating-summary`)
  },
  
  // Get reviews pending moderation
  getPendingModeration: (params = {}) => {
    return api.get('/reviews/pending-moderation', { params })
  },
  
  // Approve review
  approveReview: (id) => {
    return api.patch(`/reviews/${id}/approve`)
  },
  
  // Reject review
  rejectReview: (id, reason = '') => {
    return api.patch(`/reviews/${id}/reject`, { reason })
  },
  
  // Get reviews statistics
  getStatistics: (period = 'month') => {
    return api.get('/reviews/statistics', { 
      params: { period } 
    })
  },
  
  // Get top rated products
  getTopRatedProducts: (limit = 10, min_reviews = 5) => {
    return api.get('/reviews/top-rated-products', {
      params: { limit, min_reviews }
    })
  },
  
  // Flag review as inappropriate
  flagReview: (id, reason) => {
    return api.post(`/reviews/${id}/flag`, { reason })
  }
}

// Comments Service (binh_luan)
const baseCommentsService = createCRUDService('/comments')

export const commentsService = {
  ...baseCommentsService,
  
  // Get comments by product
  getByProduct: (id_san_pham, params = {}) => {
    return api.get(`/products/${id_san_pham}/comments`, { params })
  },
  
  // Get comments by user
  getByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/comments`, { params })
  },
  
  // Create comment
  createComment: (commentData) => {
    return api.post('/comments', commentData)
  },
  
  // Update comment
  updateComment: (id, noi_dung) => {
    return api.put(`/comments/${id}`, { noi_dung })
  },
  
  // Delete comment
  deleteComment: (id) => {
    return api.delete(`/comments/${id}`)
  },
  
  // Get comments pending moderation
  getPendingModeration: (params = {}) => {
    return api.get('/comments/pending-moderation', { params })
  },
  
  // Approve comment
  approveComment: (id) => {
    return api.patch(`/comments/${id}/approve`)
  },
  
  // Reject comment
  rejectComment: (id, reason = '') => {
    return api.patch(`/comments/${id}/reject`, { reason })
  },
  
  // Get comments statistics
  getStatistics: (period = 'month') => {
    return api.get('/comments/statistics', { 
      params: { period } 
    })
  },
  
  // Get recent comments
  getRecent: (limit = 10) => {
    return api.get('/comments/recent', { 
      params: { limit } 
    })
  },
  
  // Flag comment as inappropriate
  flagComment: (id, reason) => {
    return api.post(`/comments/${id}/flag`, { reason })
  },
  
  // Bulk moderate comments
  bulkModerate: (comment_ids, action) => {
    return api.post('/comments/bulk-moderate', {
      comment_ids,
      action
    })
  }
}

// Combined engagement service
export const engagementService = {
  cart: cartService,
  favorites: favoritesService,
  reviews: reviewsService,
  comments: commentsService,
  
  // Get user engagement summary
  getUserEngagementSummary: (id_nguoi_dung) => {
    return Promise.all([
      cartService.getUserCart(id_nguoi_dung),
      favoritesService.getUserFavorites(id_nguoi_dung),
      reviewsService.getByUser(id_nguoi_dung),
      commentsService.getByUser(id_nguoi_dung)
    ]).then(([cart, favorites, reviews, comments]) => ({
      cart,
      favorites,
      reviews,
      comments
    }))
  },
  
  // Get product engagement data
  getProductEngagement: (id_san_pham) => {
    return Promise.all([
      favoritesService.getByProduct?.(id_san_pham) || Promise.resolve([]),
      reviewsService.getByProduct(id_san_pham),
      commentsService.getByProduct(id_san_pham)
    ]).then(([favorites, reviews, comments]) => ({
      favorites,
      reviews,
      comments
    }))
  },
  
  // Get engagement dashboard data
  getDashboardData: () => {
    return Promise.all([
      cartService.getStatistics('month'),
      favoritesService.getStatistics('month'),
      reviewsService.getStatistics('month'),
      commentsService.getStatistics('month')
    ]).then(([cartStats, favoritesStats, reviewsStats, commentsStats]) => ({
      cart: cartStats,
      favorites: favoritesStats,
      reviews: reviewsStats,
      comments: commentsStats
    }))
  }
}

export default engagementService
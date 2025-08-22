// Communication Service (ERD: thong_bao, lien_he)
import { createCRUDService } from './api.js'
import api from './api.js'

// Notifications Service (thong_bao)
const baseNotificationService = createCRUDService('/notifications')

export const notificationService = {
  ...baseNotificationService,
  
  // Get notifications by user
  getByUser: (id_nguoi_dung, params = {}) => {
    return api.get(`/users/${id_nguoi_dung}/notifications`, { params })
  },
  
  // Get unread notifications
  getUnreadByUser: (id_nguoi_dung) => {
    return api.get(`/users/${id_nguoi_dung}/notifications/unread`)
  },
  
  // Get notifications by type
  getByType: (loai, params = {}) => {
    return api.get(`/notifications/type/${loai}`, { params })
  },
  
  // Create notification
  createNotification: (notificationData) => {
    return api.post('/notifications', notificationData)
  },
  
  // Send notification to user
  sendToUser: (id_nguoi_dung, notificationData) => {
    return api.post(`/users/${id_nguoi_dung}/notifications`, notificationData)
  },
  
  // Send notification to multiple users
  sendToUsers: (user_ids, notificationData) => {
    return api.post('/notifications/send-to-users', {
      user_ids,
      ...notificationData
    })
  },
  
  // Send notification to all users
  sendToAll: (notificationData, criteria = {}) => {
    return api.post('/notifications/send-to-all', {
      ...notificationData,
      criteria
    })
  },
  
  // Mark notification as read
  markAsRead: (id) => {
    return api.patch(`/notifications/${id}/read`)
  },
  
  // Mark all user notifications as read
  markAllAsRead: (id_nguoi_dung) => {
    return api.patch(`/users/${id_nguoi_dung}/notifications/mark-all-read`)
  },
  
  // Delete notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`)
  },
  
  // Get notification statistics
  getStatistics: (period = 'month') => {
    return api.get('/notifications/statistics', { 
      params: { period } 
    })
  },
  
  // Get notification templates
  getTemplates: () => {
    return api.get('/notifications/templates')
  },
  
  // Create notification template
  createTemplate: (templateData) => {
    return api.post('/notifications/templates', templateData)
  },
  
  // Send bulk notifications
  sendBulkNotifications: (notifications) => {
    return api.post('/notifications/bulk-send', { notifications })
  },
  
  // Schedule notification
  scheduleNotification: (notificationData, scheduled_at) => {
    return api.post('/notifications/schedule', {
      ...notificationData,
      scheduled_at
    })
  },
  
  // Cancel scheduled notification
  cancelScheduled: (id) => {
    return api.delete(`/notifications/scheduled/${id}`)
  },
  
  // Get user notification preferences
  getUserPreferences: (id_nguoi_dung) => {
    return api.get(`/users/${id_nguoi_dung}/notification-preferences`)
  },
  
  // Update user notification preferences
  updateUserPreferences: (id_nguoi_dung, preferences) => {
    return api.put(`/users/${id_nguoi_dung}/notification-preferences`, preferences)
  }
}

// Contact Management Service (lien_he)
const baseContactService = createCRUDService('/contacts')

export const contactService = {
  ...baseContactService,
  
  // Get contacts by status
  getByStatus: (trang_thai, params = {}) => {
    return api.get(`/contacts/status/${trang_thai}`, { params })
  },
  
  // Create contact inquiry
  createInquiry: (contactData) => {
    return api.post('/contacts/inquiry', contactData)
  },
  
  // Update contact status
  updateStatus: (id, trang_thai, response = '') => {
    return api.patch(`/contacts/${id}/status`, { 
      trang_thai, 
      response 
    })
  },
  
  // Assign contact to staff
  assignToStaff: (id, staff_id) => {
    return api.patch(`/contacts/${id}/assign`, { staff_id })
  },
  
  // Reply to contact
  replyToContact: (id, reply_content, send_email = true) => {
    return api.post(`/contacts/${id}/reply`, {
      reply_content,
      send_email
    })
  },
  
  // Get pending contacts
  getPending: (params = {}) => {
    return api.get('/contacts/pending', { params })
  },
  
  // Get contacts assigned to staff
  getAssignedToStaff: (staff_id, params = {}) => {
    return api.get(`/contacts/assigned/${staff_id}`, { params })
  },
  
  // Close contact inquiry
  closeInquiry: (id, resolution_note = '') => {
    return api.patch(`/contacts/${id}/close`, { resolution_note })
  },
  
  // Reopen contact inquiry
  reopenInquiry: (id, reason = '') => {
    return api.patch(`/contacts/${id}/reopen`, { reason })
  },
  
  // Get contact statistics
  getStatistics: (period = 'month') => {
    return api.get('/contacts/statistics', { 
      params: { period } 
    })
  },
  
  // Get contact response times
  getResponseTimes: (period = 'month') => {
    return api.get('/contacts/response-times', { 
      params: { period } 
    })
  },
  
  // Export contacts
  export: (format = 'excel', params = {}) => {
    return api.get(`/contacts/export/${format}`, { 
      params,
      responseType: 'blob' 
    })
  },
  
  // Get contact categories/types
  getCategories: () => {
    return api.get('/contacts/categories')
  },
  
  // Create contact category
  createCategory: (categoryData) => {
    return api.post('/contacts/categories', categoryData)
  },
  
  // Get contacts by category
  getByCategory: (category, params = {}) => {
    return api.get(`/contacts/category/${category}`, { params })
  },
  
  // Send follow-up email
  sendFollowUp: (id, follow_up_content) => {
    return api.post(`/contacts/${id}/follow-up`, { follow_up_content })
  },
  
  // Archive old contacts
  archiveOld: (days = 365) => {
    return api.post('/contacts/archive-old', { days })
  }
}

// Email Service (for sending various types of emails)
export const emailService = {
  // Send order confirmation email
  sendOrderConfirmation: (id_hoa_don, email_data = {}) => {
    return api.post(`/emails/order-confirmation/${id_hoa_don}`, email_data)
  },
  
  // Send welcome email
  sendWelcomeEmail: (id_nguoi_dung) => {
    return api.post(`/emails/welcome/${id_nguoi_dung}`)
  },
  
  // Send password reset email
  sendPasswordReset: (email) => {
    return api.post('/emails/password-reset', { email })
  },
  
  // Send promotional email
  sendPromotionalEmail: (email_data) => {
    return api.post('/emails/promotional', email_data)
  },
  
  // Send newsletter
  sendNewsletter: (newsletter_data) => {
    return api.post('/emails/newsletter', newsletter_data)
  },
  
  // Get email templates
  getTemplates: () => {
    return api.get('/emails/templates')
  },
  
  // Create email template
  createTemplate: (templateData) => {
    return api.post('/emails/templates', templateData)
  },
  
  // Send custom email
  sendCustomEmail: (recipients, subject, content, template_id = null) => {
    return api.post('/emails/custom', {
      recipients,
      subject,
      content,
      template_id
    })
  },
  
  // Get email statistics
  getStatistics: (period = 'month') => {
    return api.get('/emails/statistics', { 
      params: { period } 
    })
  }
}

// SMS Service (for sending SMS notifications)
export const smsService = {
  // Send SMS to user
  sendToUser: (id_nguoi_dung, message) => {
    return api.post(`/sms/user/${id_nguoi_dung}`, { message })
  },
  
  // Send SMS to phone number
  sendToPhone: (phone_number, message) => {
    return api.post('/sms/send', { phone_number, message })
  },
  
  // Send order status SMS
  sendOrderStatus: (id_hoa_don, status) => {
    return api.post(`/sms/order-status/${id_hoa_don}`, { status })
  },
  
  // Send bulk SMS
  sendBulkSMS: (recipients, message) => {
    return api.post('/sms/bulk', { recipients, message })
  },
  
  // Get SMS statistics
  getStatistics: (period = 'month') => {
    return api.get('/sms/statistics', { 
      params: { period } 
    })
  }
}

// Combined communication service
export const communicationService = {
  notifications: notificationService,
  contacts: contactService,
  emails: emailService,
  sms: smsService,
  
  // Get communication dashboard data
  getDashboardData: () => {
    return Promise.all([
      notificationService.getStatistics('month'),
      contactService.getStatistics('month'),
      emailService.getStatistics('month'),
      smsService.getStatistics('month')
    ]).then(([notificationStats, contactStats, emailStats, smsStats]) => ({
      notifications: notificationStats,
      contacts: contactStats,
      emails: emailStats,
      sms: smsStats
    }))
  },
  
  // Send multi-channel notification
  sendMultiChannel: (recipients, message, channels = ['email', 'sms', 'notification']) => {
    return api.post('/communication/multi-channel', {
      recipients,
      message,
      channels
    })
  }
}

export default communicationService
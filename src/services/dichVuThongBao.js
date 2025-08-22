// Global notification service for triggering notifications across the app
import { ref } from 'vue'

// Global instance to be shared across the app
let globalNotificationInstance = null

export const setGlobalNotificationInstance = (instance) => {
  globalNotificationInstance = instance
}

export const getGlobalNotificationInstance = () => {
  return globalNotificationInstance
}

// Helper functions to trigger notifications from anywhere in the app
export const triggerOrderNotification = (orderId, action = 'created') => {
  if (globalNotificationInstance) {
    globalNotificationInstance.createOrderNotification(orderId, action)
  }
}

export const triggerProductNotification = (productName, action = 'created') => {
  if (globalNotificationInstance) {
    globalNotificationInstance.createProductNotification(productName, action)
  }
}

export const triggerCustomerNotification = (customerName, action = 'registered') => {
  if (globalNotificationInstance) {
    globalNotificationInstance.createCustomerNotification(customerName, action)
  }
}

export const triggerSystemNotification = (message, type = 'report') => {
  if (globalNotificationInstance) {
    globalNotificationInstance.createSystemNotification(message, type)
  }
}

export const triggerCustomNotification = (notification) => {
  if (globalNotificationInstance) {
    globalNotificationInstance.addNotification(notification)
  }
}

// Event-based notifications for common actions
export const notifyOrderCreated = (orderId) => triggerOrderNotification(orderId, 'created')
export const notifyOrderUpdated = (orderId) => triggerOrderNotification(orderId, 'updated')
export const notifyOrderCompleted = (orderId) => triggerOrderNotification(orderId, 'completed')
export const notifyOrderCancelled = (orderId) => triggerOrderNotification(orderId, 'cancelled')

export const notifyProductCreated = (productName) => triggerProductNotification(productName, 'created')
export const notifyProductUpdated = (productName) => triggerProductNotification(productName, 'updated')
export const notifyLowStock = (productName) => triggerProductNotification(productName, 'low_stock')
export const notifyOutOfStock = (productName) => triggerProductNotification(productName, 'out_of_stock')

export const notifyCustomerRegistered = (customerName) => triggerCustomerNotification(customerName, 'registered')
export const notifyCustomerReview = (customerName) => triggerCustomerNotification(customerName, 'review')
export const notifyCustomerComplaint = (customerName) => triggerCustomerNotification(customerName, 'complaint')

export const notifySystemReport = (message) => triggerSystemNotification(message, 'report')
export const notifySystemBackup = (message) => triggerSystemNotification(message, 'backup')
export const notifySystemMaintenance = (message) => triggerSystemNotification(message, 'maintenance')

// No demo notifications - all notifications must be triggered by actual user actions
// Composable thông báo (notifications): quản lý danh sách, đếm chưa đọc, polling định kỳ và lưu/khôi phục từ localStorage.
import { shallowRef, ref, computed, onUnmounted } from 'vue'

const STORAGE_KEY = 'gearup-notifications'

export function useNotifications() {
  const notifications = shallowRef([])
  const pollingId = ref(null)

  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        notifications.value = parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) }))
      }
    } catch {}
  }

  const saveToStorage = () => {
    try {
      const toSave = notifications.value.map(n => ({
        ...n,
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {}
  }

  const seedIfEmpty = () => {
    // No seed notifications - start completely clean
    // Only real user actions will create notifications
  }

  // Add notification manually based on frontend actions
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      timestamp: new Date(),
      isRead: false,
      ...notification
    }
    
    notifications.value = [newNotification, ...notifications.value]
    saveToStorage()
  }

  // Predefined notification templates for different actions
  const createOrderNotification = (orderId, action = 'created') => {
    const templates = {
      created: {
        title: 'Đơn hàng mới',
        message: `Đơn hàng #${orderId} vừa được tạo`,
        icon: '🛒',
        type: 'order'
      },
      updated: {
        title: 'Cập nhật đơn hàng',
        message: `Đơn hàng #${orderId} đã được cập nhật`,
        icon: '📝',
        type: 'order'
      },
      completed: {
        title: 'Hoàn thành đơn hàng',
        message: `Đơn hàng #${orderId} đã hoàn thành`,
        icon: '✅',
        type: 'order'
      },
      cancelled: {
        title: 'Hủy đơn hàng',
        message: `Đơn hàng #${orderId} đã bị hủy`,
        icon: '❌',
        type: 'order'
      }
    }
    
    if (templates[action]) {
      addNotification(templates[action])
    }
  }

  const createProductNotification = (productName, action = 'created') => {
    const templates = {
      created: {
        title: 'Sản phẩm mới',
        message: `Sản phẩm "${productName}" vừa được thêm`,
        icon: '📦',
        type: 'inventory'
      },
      updated: {
        title: 'Cập nhật sản phẩm',
        message: `Sản phẩm "${productName}" đã được cập nhật`,
        icon: '🔄',
        type: 'inventory'
      },
      low_stock: {
        title: 'Cảnh báo tồn kho',
        message: `Sản phẩm "${productName}" sắp hết hàng`,
        icon: '⚠️',
        type: 'inventory'
      },
      out_of_stock: {
        title: 'Hết hàng',
        message: `Sản phẩm "${productName}" đã hết hàng`,
        icon: '🚫',
        type: 'inventory'
      }
    }
    
    if (templates[action]) {
      addNotification(templates[action])
    }
  }

  const createCustomerNotification = (customerName, action = 'registered') => {
    const templates = {
      registered: {
        title: 'Khách hàng mới',
        message: `${customerName} vừa đăng ký tài khoản`,
        icon: '👥',
        type: 'customer'
      },
      review: {
        title: 'Đánh giá mới',
        message: `${customerName} vừa để lại đánh giá`,
        icon: '⭐',
        type: 'review'
      },
      complaint: {
        title: 'Khiếu nại mới',
        message: `${customerName} gửi khiếu nại`,
        icon: '📞',
        type: 'customer'
      }
    }
    
    if (templates[action]) {
      addNotification(templates[action])
    }
  }

  const createSystemNotification = (message, type = 'report') => {
    const templates = {
      report: {
        title: 'Báo cáo hệ thống',
        message,
        icon: '📊',
        type: 'report'
      },
      backup: {
        title: 'Sao lưu dữ liệu',
        message,
        icon: '💾',
        type: 'report'
      },
      maintenance: {
        title: 'Bảo trì hệ thống',
        message,
        icon: '🔧',
        type: 'report'
      }
    }
    
    if (templates[type]) {
      addNotification(templates[type])
    }
  }

  const startPolling = () => {
    // Only load from storage and seed if empty, no more automatic polling
    loadFromStorage()
    seedIfEmpty()
  }

  const stopPolling = () => {
    if (pollingId.value) {
      clearInterval(pollingId.value)
      pollingId.value = null
    }
  }

  const markAsRead = id => {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifications.value[idx] = { ...notifications.value[idx], isRead: true }
      notifications.value = [...notifications.value]
      saveToStorage()
    }
  }

  const markAllAsRead = () => {
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    saveToStorage()
  }

  const clearAllNotifications = () => {
    notifications.value = []
    saveToStorage()
  }

  onUnmounted(stopPolling)

  return {
    notifications,
    unreadCount,
    startPolling,
    stopPolling,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    addNotification,
    createOrderNotification,
    createProductNotification,
    createCustomerNotification,
    createSystemNotification
  }
}
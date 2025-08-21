# Hướng dẫn sử dụng Notification System

## Cách sử dụng trong các component

### 1. Import các function cần thiết

```javascript
import { 
  notifyOrderCreated,
  notifyOrderUpdated, 
  notifyOrderCompleted,
  notifyOrderCancelled,
  notifyProductCreated,
  notifyProductUpdated,
  notifyLowStock,
  notifyOutOfStock,
  notifyCustomerRegistered,
  notifyCustomerReview,
  notifyCustomerComplaint,
  notifySystemReport,
  triggerCustomNotification
} from '../services/notificationService.js'
```

### 2. Sử dụng trong các hành động

#### Quản lý Đơn hàng
```javascript
// Khi tạo đơn hàng mới
const createOrder = async (orderData) => {
  const result = await orderService.create(orderData)
  notifyOrderCreated(result.id)
}

// Khi cập nhật đơn hàng
const updateOrderStatus = async (orderId, status) => {
  await orderService.updateStatus(orderId, status)
  
  if (status === 'completed') {
    notifyOrderCompleted(orderId)
  } else if (status === 'cancelled') {
    notifyOrderCancelled(orderId)
  } else {
    notifyOrderUpdated(orderId)
  }
}
```

#### Quản lý Sản phẩm
```javascript
// Khi thêm sản phẩm mới
const createProduct = async (productData) => {
  const result = await productService.create(productData)
  notifyProductCreated(result.name)
}

// Khi cập nhật sản phẩm
const updateProduct = async (productId, productData) => {
  await productService.update(productId, productData)
  notifyProductUpdated(productData.name)
}

// Cảnh báo tồn kho
const checkInventory = (product) => {
  if (product.stock === 0) {
    notifyOutOfStock(product.name)
  } else if (product.stock <= 5) {
    notifyLowStock(product.name)
  }
}
```

#### Quản lý Khách hàng
```javascript
// Khách hàng đăng ký mới
const registerCustomer = async (customerData) => {
  const result = await customerService.register(customerData)
  notifyCustomerRegistered(result.name)
}

// Khách hàng để lại đánh giá
const submitReview = async (reviewData) => {
  await reviewService.create(reviewData)
  notifyCustomerReview(reviewData.customerName)
}

// Khách hàng gửi khiếu nại
const submitComplaint = async (complaintData) => {
  await complaintService.create(complaintData)
  notifyCustomerComplaint(complaintData.customerName)
}
```

#### Báo cáo Hệ thống
```javascript
// Báo cáo tự động
const generateReport = async (reportType) => {
  const report = await reportService.generate(reportType)
  notifySystemReport(`Báo cáo ${reportType} đã được tạo thành công`)
}
```

#### Notification tùy chỉnh
```javascript
// Tạo notification hoàn toàn tùy chỉnh
const customAction = () => {
  triggerCustomNotification({
    title: 'Tùy chỉnh',
    message: 'Đây là thông báo tùy chỉnh',
    icon: '🎉',
    type: 'order' // hoặc 'inventory', 'customer', 'review', 'report'
  })
}
```

### 3. Ví dụ thực tế trong component

```vue
<template>
  <div>
    <button @click="handleCreateOrder">Tạo đơn hàng</button>
    <button @click="handleUpdateStock">Cập nhật kho</button>
    <button @click="handleCustomNotification">Thông báo tùy chỉnh</button>
  </div>
</template>

<script setup>
import { 
  notifyOrderCreated,
  notifyLowStock,
  triggerCustomNotification
} from '../services/notificationService.js'

const handleCreateOrder = () => {
  // Logic tạo đơn hàng...
  const orderId = 'DH123456'
  notifyOrderCreated(orderId)
}

const handleUpdateStock = () => {
  // Logic cập nhật kho...
  const productName = 'Giày Nike Air Max'
  notifyLowStock(productName)
}

const handleCustomNotification = () => {
  triggerCustomNotification({
    title: 'Backup hoàn tất',
    message: 'Hệ thống đã backup dữ liệu thành công',
    icon: '💾',
    type: 'report'
  })
}
</script>
```

## Các loại notification có sẵn

### Đơn hàng (Order)
- `notifyOrderCreated(orderId)` - Đơn hàng mới
- `notifyOrderUpdated(orderId)` - Cập nhật đơn hàng  
- `notifyOrderCompleted(orderId)` - Hoàn thành đơn hàng
- `notifyOrderCancelled(orderId)` - Hủy đơn hàng

### Sản phẩm (Product/Inventory)
- `notifyProductCreated(productName)` - Sản phẩm mới
- `notifyProductUpdated(productName)` - Cập nhật sản phẩm
- `notifyLowStock(productName)` - Cảnh báo tồn kho thấp
- `notifyOutOfStock(productName)` - Hết hàng

### Khách hàng (Customer)
- `notifyCustomerRegistered(customerName)` - Khách hàng mới
- `notifyCustomerReview(customerName)` - Đánh giá mới
- `notifyCustomerComplaint(customerName)` - Khiếu nại

### Hệ thống (System)
- `notifySystemReport(message)` - Báo cáo hệ thống
- `notifySystemBackup(message)` - Sao lưu dữ liệu
- `notifySystemMaintenance(message)` - Bảo trì hệ thống

### Tùy chỉnh
- `triggerCustomNotification(notification)` - Notification hoàn toàn tùy chỉnh

## Nguyên tắc sử dụng

⚠️ **QUAN TRỌNG**: Chỉ trigger notification khi có thay đổi thực sự!

### Khi NÊN trigger notification:
- ✅ Sau khi API call thành công
- ✅ Khi có thay đổi dữ liệu thực tế
- ✅ Khi user thực hiện hành động quan trọng
- ✅ Khi có sự kiện cần user biết ngay

### Khi KHÔNG nên trigger notification:
- ❌ Khi chỉ validate form
- ❌ Khi chưa call API
- ❌ Khi load trang lần đầu
- ❌ Khi user đang nhập liệu

### Ví dụ đúng:
```javascript
const createOrder = async (orderData) => {
  try {
    const result = await orderService.create(orderData)
    // ✅ Chỉ trigger sau khi API thành công
    notifyOrderCreated(result.id)
  } catch (error) {
    // ❌ Không trigger notification cho error
    console.error(error)
  }
}
```

### Ví dụ sai:
```javascript
const handleSubmit = () => {
  // ❌ Trigger trước khi xử lý
  notifyOrderCreated('123')
  
  // Process logic...
}
```

## Lưu ý kỹ thuật

1. Notifications sẽ tự động lưu vào localStorage
2. Có thể đánh dấu đã đọc từng notification hoặc tất cả
3. Có thể lọc notifications theo loại
4. Notifications sẽ hiển thị ngay lập tức với animation
5. Hệ thống bắt đầu hoàn toàn sạch - không có notification mẫu
import api from './api.js'

const BASE_URL = '/phieu-giam-gia-ca-nhan'

export const dichVuPhieuGiamGiaCaNhan = {
  // Get all user vouchers
  async layTatCaPhieuGiamGiaCaNhan() {
    try {
      const response = await api.get(`${BASE_URL}/playlist`)
      return {
        success: true,
        data: response || [],
        message: 'Tải dữ liệu thành công'
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || 'Lỗi khi tải danh sách phiếu giảm giá cá nhân'
      }
    }
  },

  // Get user vouchers with pagination
  async layPhieuGiamGiaCaNhanPhanTrang(page = 0, size = 10) {
    try {
      const response = await api.get(`${BASE_URL}/paging`, {
        params: { page, size }
      })
      return {
        success: true,
        data: response || { content: [], totalElements: 0 },
        message: 'Tải dữ liệu thành công'
      }
    } catch (error) {
      return {
        success: false,
        data: { content: [], totalElements: 0 },
        message: error.message || 'Lỗi khi tải dữ liệu phân trang'
      }
    }
  },

  // Search user vouchers with filters
  async timKiemPhieuGiamGiaCaNhan(page = 0, size = 10, filters = {}) {
    try {
      const params = {
        page,
        size,
        ...filters
      }
      
      const response = await api.get(`${BASE_URL}/search`, { params })
      return {
        success: response.data.success,
        data: response.data.data || { content: [], totalElements: 0 },
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: { content: [], totalElements: 0 },
        message: error.response?.data?.message || 'Lỗi khi tìm kiếm'
      }
    }
  },

  // Get user voucher by ID
  async layPhieuGiamGiaCaNhanTheoId(id) {
    try {
      const response = await api.get(`${BASE_URL}/detail/${id}`)
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi tải chi tiết phiếu giảm giá'
      }
    }
  },

  // Get user vouchers by customer ID
  async layPhieuGiamGiaCaNhanTheoKhachHang(khachHangId) {
    try {
      const response = await api.get(`${BASE_URL}/by-khach-hang/${khachHangId}`)
      return {
        success: response.data.success,
        data: response.data.data || [],
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Lỗi khi tải phiếu giảm giá của khách hàng'
      }
    }
  },

  // Get active user vouchers by customer ID
  async layPhieuGiamGiaCaNhanHieuLucTheoKhachHang(khachHangId) {
    try {
      const response = await api.get(`${BASE_URL}/active-by-khach-hang/${khachHangId}`)
      return {
        success: response.data.success,
        data: response.data.data || [],
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Lỗi khi tải phiếu giảm giá hiệu lực'
      }
    }
  },

  // Assign vouchers to customers
  async phanPhoiPhieuGiamGia(request) {
    try {
      const response = await api.post(`${BASE_URL}/assign`, request)
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi phân phối phiếu giảm giá'
      }
    }
  },

  // Update user voucher
  async capNhatPhieuGiamGiaCaNhan(id, request) {
    try {
      const response = await api.put(`${BASE_URL}/update/${id}`, request)
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi cập nhật phiếu giảm giá'
      }
    }
  },

  // Revoke user voucher
  async thuHoiPhieuGiamGia(id) {
    try {
      const response = await api.put(`${BASE_URL}/revoke/${id}`)
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi thu hồi phiếu giảm giá'
      }
    }
  },

  // Delete user voucher
  async xoaPhieuGiamGiaCaNhan(id) {
    try {
      const response = await api.delete(`${BASE_URL}/delete/${id}`)
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi xóa phiếu giảm giá'
      }
    }
  },

  // Get statistics summary
  async layThongKeTongQuan() {
    try {
      const response = await api.get(`${BASE_URL}/stats/summary`)
      return {
        success: response.data.success,
        data: response.data.data || {
          totalVouchers: 0,
          unusedVouchers: 0,
          usedVouchers: 0,
          expiredVouchers: 0
        },
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        data: {
          totalVouchers: 0,
          unusedVouchers: 0,
          usedVouchers: 0,
          expiredVouchers: 0
        },
        message: error.response?.data?.message || 'Lỗi khi tải thống kê'
      }
    }
  }
}

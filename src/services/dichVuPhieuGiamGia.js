import api from './api.js'

const BASE_URL = '/phieu-giam-gia-management'

export const dichVuPhieuGiamGia = {
  // Get all coupons
  layTatCa: async () => {
    const response = await api.get(`${BASE_URL}/playlist`)
    return response || []
  },

  // Wrapper method for compatibility
  layTatCaPhieuGiamGia: async () => {
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
        message: error.message || 'Lỗi khi tải danh sách phiếu giảm giá'
      }
    }
  },

  // Get paginated coupons
  layPhanTrang: async (page = 0, size = 10) => {
    const response = await api.get(`${BASE_URL}/paging`, {
      params: { page, size }
    })
    return response || {}
  },

  // Get coupon detail by ID
  layChiTiet: async (id) => {
    const response = await api.get(`${BASE_URL}/detail/${id}`)
    return response || null
  },

  // Create new coupon
  taoMoi: async (duLieu) => {
    const payload = {
      maPhieuGiamGia: duLieu.code,
      tenPhieuGiamGia: duLieu.name,
      loaiPhieuGiamGia: duLieu.type === 'public',
      giaTriGiamGia: duLieu.value,
      soTienToiDa: duLieu.maxDiscount || null,
      hoaDonToiThieu: duLieu.minOrderAmount || 0,
      soLuongDung: duLieu.quantity,
      ngayBatDau: duLieu.startDate,
      ngayKetThuc: duLieu.endDate,
      trangThai: true,
      moTa: duLieu.description || null
    }
    const response = await api.post(`${BASE_URL}/add`, payload)
    return response
  },

  // Update coupon
  capNhat: async (id, duLieu) => {
    const payload = {
      maPhieuGiamGia: duLieu.code,
      tenPhieuGiamGia: duLieu.name,
      loaiPhieuGiamGia: duLieu.type === 'public',
      giaTriGiamGia: duLieu.value,
      soTienToiDa: duLieu.maxDiscount || null,
      hoaDonToiThieu: duLieu.minOrderAmount || 0,
      soLuongDung: duLieu.quantity,
      ngayBatDau: duLieu.startDate,
      ngayKetThuc: duLieu.endDate,
      trangThai: duLieu.status !== false,
      moTa: duLieu.description || null
    }
    const response = await api.put(`${BASE_URL}/update/${id}`, payload)
    return response
  },

  // Delete coupon
  xoa: async (id) => {
    const response = await api.delete(`${BASE_URL}/delete/${id}`)
    return response
  },

  // Get active vouchers
  layVoucherHoatDong: async () => {
    const response = await api.get(`${BASE_URL}/active-vouchers`)
    return response || []
  },

  // Transform backend data to frontend format
  chuyenDoiDuLieu: (backendData) => {
    // Determine discount type based on value
    // If value > 100, it's likely a fixed amount (in VND)
    // If value <= 100, it's likely a percentage
    const isPercentage = backendData.giaTriGiamGia <= 100
    
    return {
      id: backendData.id,
      code: backendData.maPhieuGiamGia,
      name: backendData.tenPhieuGiamGia,
      type: backendData.loaiPhieuGiamGia ? 'public' : 'private',
      discountType: isPercentage ? 'percent' : 'fixed',
      value: backendData.giaTriGiamGia,
      maxDiscount: backendData.soTienToiDa,
      minOrderAmount: backendData.hoaDonToiThieu,
      quantity: backendData.soLuongDung,
      startDate: backendData.ngayBatDau,
      endDate: backendData.ngayKetThuc,
      status: backendData.trangThai,
      description: backendData.moTa,
      used: 0 // This would need to be calculated from usage data
    }
  },

  // Transform frontend data to backend format
  chuyenDoiDuLieuGui: (frontendData) => {
    return {
      maPhieuGiamGia: frontendData.code,
      tenPhieuGiamGia: frontendData.name,
      loaiPhieuGiamGia: frontendData.type === 'public',
      giaTriGiamGia: frontendData.value,
      soTienToiDa: frontendData.maxDiscount,
      hoaDonToiThieu: frontendData.minOrderAmount,
      soLuongDung: frontendData.quantity,
      ngayBatDau: frontendData.startDate,
      ngayKetThuc: frontendData.endDate,
      trangThai: frontendData.status !== false,
      moTa: frontendData.description
    }
  }
}

export default dichVuPhieuGiamGia
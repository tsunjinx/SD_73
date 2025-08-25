import api from './api.js'

const BASE_URL = '/dot-giam-gia-management'

export const dichVuDotGiamGia = {
  // Get all discount campaigns
  layTatCa: () => {
    return api.get(`${BASE_URL}/playlist`)
  },

  // Get paginated discount campaigns
  layPhanTrang: (page = 0, size = 10) => {
    return api.get(`${BASE_URL}/paging`, {
      params: { page, size }
    })
  },

  // Get discount campaign detail by ID
  layChiTiet: (id) => {
    return api.get(`${BASE_URL}/detail/${id}`)
  },

  // Create new discount campaign
  taoMoi: (duLieu) => {
    const payload = {
      maDotGiamGia: duLieu.code,
      tenDotGiamGia: duLieu.name,
      giaTriGiamGia: duLieu.value,
      ngayBatDau: duLieu.startDate,
      ngayKetThuc: duLieu.endDate,
      trangThai: true
    }
    return api.post(`${BASE_URL}/add`, payload)
  },

  // Update discount campaign
  capNhat: (id, duLieu) => {
    const payload = {
      maDotGiamGia: duLieu.code,
      tenDotGiamGia: duLieu.name,
      giaTriGiamGia: duLieu.value,
      ngayBatDau: duLieu.startDate,
      ngayKetThuc: duLieu.endDate,
      trangThai: duLieu.status !== false
    }
    return api.put(`${BASE_URL}/update/${id}`, payload)
  },

  // Delete discount campaign
  xoa: (id) => {
    return api.delete(`${BASE_URL}/delete/${id}`)
  },

  // Transform backend data to frontend format
  chuyenDoiDuLieu: (backendData) => {
    return {
      id: backendData.id,
      code: backendData.maDotGiamGia,
      name: backendData.tenDotGiamGia,
      value: backendData.giaTriGiamGia,
      startDate: backendData.ngayBatDau,
      endDate: backendData.ngayKetThuc,
      status: backendData.trangThai
    }
  },

  // Transform frontend data to backend format
  chuyenDoiDuLieuGui: (frontendData) => {
    return {
      maDotGiamGia: frontendData.code,
      tenDotGiamGia: frontendData.name,
      giaTriGiamGia: frontendData.value,
      ngayBatDau: frontendData.startDate,
      ngayKetThuc: frontendData.endDate,
      trangThai: frontendData.status !== false
    }
  }
}

export default dichVuDotGiamGia
const express = require('express')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query
    const offset = (page - 1) * limit

    let whereConditions = ['deleted = 0']
    const request = pool.request()

    if (search) {
      whereConditions.push('(ten_phieu_giam_gia LIKE @search OR ma_phieu_giam_gia LIKE @search)')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    if (status !== undefined) {
      whereConditions.push('trang_thai = @status')
      request.input('status', sql.Bit, status)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        *,
        CASE 
          WHEN GETDATE() < ngay_bat_dau THEN N'Chưa bắt đầu'
          WHEN GETDATE() > ngay_ket_thuc THEN N'Đã hết hạn'
          WHEN trang_thai = 0 THEN N'Tạm dừng'
          ELSE N'Đang hoạt động'
        END as trang_thai_text
      FROM phieu_giam_gia 
      WHERE ${whereClause}
      ORDER BY ngay_bat_dau DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)
    if (status !== undefined) countRequest.input('status', sql.Bit, status)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM phieu_giam_gia 
      WHERE ${whereClause}
    `

    const countResult = await countRequest.query(countQuery)
    const total = countResult.recordset[0].total

    res.json({
      data: result.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get coupons error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/active', async (req, res) => {
  try {
    const request = pool.request()
    
    const query = `
      SELECT * FROM phieu_giam_gia 
      WHERE deleted = 0 
        AND trang_thai = 1 
        AND GETDATE() BETWEEN ngay_bat_dau AND ngay_ket_thuc
        AND so_luong_dung > 0
      ORDER BY ngay_ket_thuc ASC
    `

    const result = await request.query(query)
    res.json(result.recordset)

  } catch (error) {
    console.error('Get active coupons error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const couponQuery = `
      SELECT 
        *,
        CASE 
          WHEN GETDATE() < ngay_bat_dau THEN N'Chưa bắt đầu'
          WHEN GETDATE() > ngay_ket_thuc THEN N'Đã hết hạn'
          WHEN trang_thai = 0 THEN N'Tạm dừng'
          ELSE N'Đang hoạt động'
        END as trang_thai_text
      FROM phieu_giam_gia 
      WHERE id = @id AND deleted = 0
    `

    const couponResult = await request.query(couponQuery)

    if (couponResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Phiếu giảm giá không tồn tại' })
    }

    const usageQuery = `
      SELECT 
        COUNT(*) as so_luong_da_dung,
        COUNT(CASE WHEN hd.trang_thai = 1 THEN 1 END) as so_don_thanh_cong
      FROM hoa_don hd
      WHERE hd.id_phieu_giam_gia = @id AND hd.deleted = 0
    `

    const usageResult = await request.query(usageQuery)

    res.json({
      ...couponResult.recordset[0],
      thong_ke_su_dung: usageResult.recordset[0]
    })

  } catch (error) {
    console.error('Get coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { 
      ten_phieu_giam_gia,
      loai_phieu_giam_gia,
      gia_tri_giam_gia,
      so_tien_toi_da,
      hoa_don_toi_thieu,
      so_luong_dung,
      ngay_bat_dau,
      ngay_ket_thuc,
      mo_ta
    } = req.body

    if (!ten_phieu_giam_gia || !gia_tri_giam_gia || !ngay_bat_dau || !ngay_ket_thuc) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    if (new Date(ngay_ket_thuc) <= new Date(ngay_bat_dau)) {
      return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' })
    }

    const request = pool.request()
    request.input('ten_phieu_giam_gia', sql.NVarChar, ten_phieu_giam_gia)
    request.input('loai_phieu_giam_gia', sql.Bit, loai_phieu_giam_gia || 0)
    request.input('gia_tri_giam_gia', sql.Decimal, gia_tri_giam_gia)
    request.input('so_tien_toi_da', sql.Decimal, so_tien_toi_da || null)
    request.input('hoa_don_toi_thieu', sql.Decimal, hoa_don_toi_thieu || 0)
    request.input('so_luong_dung', sql.Int, so_luong_dung || 1)
    request.input('ngay_bat_dau', sql.Date, ngay_bat_dau)
    request.input('ngay_ket_thuc', sql.Date, ngay_ket_thuc)
    request.input('mo_ta', sql.NVarChar, mo_ta || null)

    const result = await request.query(`
      INSERT INTO phieu_giam_gia 
      (ten_phieu_giam_gia, loai_phieu_giam_gia, gia_tri_giam_gia, so_tien_toi_da, 
       hoa_don_toi_thieu, so_luong_dung, ngay_bat_dau, ngay_ket_thuc, mo_ta)
      OUTPUT INSERTED.id
      VALUES 
      (@ten_phieu_giam_gia, @loai_phieu_giam_gia, @gia_tri_giam_gia, @so_tien_toi_da,
       @hoa_don_toi_thieu, @so_luong_dung, @ngay_bat_dau, @ngay_ket_thuc, @mo_ta)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo phiếu giảm giá thành công' 
    })

  } catch (error) {
    console.error('Create coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      ten_phieu_giam_gia,
      loai_phieu_giam_gia,
      gia_tri_giam_gia,
      so_tien_toi_da,
      hoa_don_toi_thieu,
      so_luong_dung,
      ngay_bat_dau,
      ngay_ket_thuc,
      mo_ta
    } = req.body

    if (new Date(ngay_ket_thuc) <= new Date(ngay_bat_dau)) {
      return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' })
    }

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('ten_phieu_giam_gia', sql.NVarChar, ten_phieu_giam_gia)
    request.input('loai_phieu_giam_gia', sql.Bit, loai_phieu_giam_gia)
    request.input('gia_tri_giam_gia', sql.Decimal, gia_tri_giam_gia)
    request.input('so_tien_toi_da', sql.Decimal, so_tien_toi_da || null)
    request.input('hoa_don_toi_thieu', sql.Decimal, hoa_don_toi_thieu || 0)
    request.input('so_luong_dung', sql.Int, so_luong_dung)
    request.input('ngay_bat_dau', sql.Date, ngay_bat_dau)
    request.input('ngay_ket_thuc', sql.Date, ngay_ket_thuc)
    request.input('mo_ta', sql.NVarChar, mo_ta || null)

    await request.query(`
      UPDATE phieu_giam_gia 
      SET 
        ten_phieu_giam_gia = @ten_phieu_giam_gia,
        loai_phieu_giam_gia = @loai_phieu_giam_gia,
        gia_tri_giam_gia = @gia_tri_giam_gia,
        so_tien_toi_da = @so_tien_toi_da,
        hoa_don_toi_thieu = @hoa_don_toi_thieu,
        so_luong_dung = @so_luong_dung,
        ngay_bat_dau = @ngay_bat_dau,
        ngay_ket_thuc = @ngay_ket_thuc,
        mo_ta = @mo_ta
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật phiếu giảm giá thành công' })

  } catch (error) {
    console.error('Update coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { trang_thai } = req.body

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('trang_thai', sql.Bit, trang_thai)

    await request.query(`
      UPDATE phieu_giam_gia 
      SET trang_thai = @trang_thai 
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật trạng thái phiếu giảm giá thành công' })

  } catch (error) {
    console.error('Update coupon status error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const checkUsageRequest = pool.request()
    checkUsageRequest.input('id', sql.Int, id)

    const usageResult = await checkUsageRequest.query(`
      SELECT COUNT(*) as count FROM hoa_don 
      WHERE id_phieu_giam_gia = @id AND deleted = 0
    `)

    if (usageResult.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Không thể xóa phiếu giảm giá đã được sử dụng' })
    }

    await request.query(`
      UPDATE phieu_giam_gia 
      SET deleted = 1 
      WHERE id = @id
    `)

    res.json({ message: 'Xóa phiếu giảm giá thành công' })

  } catch (error) {
    console.error('Delete coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/validate', async (req, res) => {
  try {
    const { ma_phieu_giam_gia, tong_tien } = req.body

    if (!ma_phieu_giam_gia || !tong_tien) {
      return res.status(400).json({ message: 'Thiếu thông tin để kiểm tra' })
    }

    const request = pool.request()
    request.input('ma_phieu_giam_gia', sql.VarChar, ma_phieu_giam_gia)

    const couponResult = await request.query(`
      SELECT * FROM phieu_giam_gia 
      WHERE ma_phieu_giam_gia = @ma_phieu_giam_gia 
        AND deleted = 0 
        AND trang_thai = 1
        AND GETDATE() BETWEEN ngay_bat_dau AND ngay_ket_thuc
        AND so_luong_dung > 0
    `)

    if (couponResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' })
    }

    const coupon = couponResult.recordset[0]

    if (tong_tien < coupon.hoa_don_toi_thieu) {
      return res.status(400).json({ 
        message: `Đơn hàng tối thiểu ${coupon.hoa_don_toi_thieu.toLocaleString()}đ để sử dụng mã này` 
      })
    }

    let giam_gia = 0
    if (coupon.loai_phieu_giam_gia === 0) {
      giam_gia = Math.min((tong_tien * coupon.gia_tri_giam_gia / 100), coupon.so_tien_toi_da || tong_tien)
    } else {
      giam_gia = Math.min(coupon.gia_tri_giam_gia, tong_tien)
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        ten_phieu_giam_gia: coupon.ten_phieu_giam_gia,
        loai_phieu_giam_gia: coupon.loai_phieu_giam_gia,
        gia_tri_giam_gia: coupon.gia_tri_giam_gia,
        giam_gia: giam_gia,
        tong_sau_giam: tong_tien - giam_gia
      }
    })

  } catch (error) {
    console.error('Validate coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/:id/distribute', async (req, res) => {
  try {
    const { id } = req.params
    const { customer_ids } = req.body

    if (!customer_ids || customer_ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách khách hàng không được trống' })
    }

    const checkCouponRequest = pool.request()
    checkCouponRequest.input('id', sql.Int, id)

    const couponResult = await checkCouponRequest.query(`
      SELECT * FROM phieu_giam_gia 
      WHERE id = @id AND deleted = 0
    `)

    if (couponResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Phiếu giảm giá không tồn tại' })
    }

    const coupon = couponResult.recordset[0]

    for (const customerId of customer_ids) {
      const request = pool.request()
      request.input('id_khach_hang', sql.Int, customerId)
      request.input('id_phieu_giam_gia', sql.Int, id)
      request.input('ten_phieu_giam_gia_ca_nhan', sql.NVarChar, coupon.ten_phieu_giam_gia)
      request.input('ngay_nhan', sql.Date, new Date())
      request.input('ngay_het_han', sql.Date, coupon.ngay_ket_thuc)

      await request.query(`
        INSERT INTO phieu_giam_gia_ca_nhan 
        (id_khach_hang, id_phieu_giam_gia, ten_phieu_giam_gia_ca_nhan, ngay_nhan, ngay_het_han)
        VALUES 
        (@id_khach_hang, @id_phieu_giam_gia, @ten_phieu_giam_gia_ca_nhan, @ngay_nhan, @ngay_het_han)
      `)
    }

    res.json({ message: 'Phát phiếu giảm giá thành công' })

  } catch (error) {
    console.error('Distribute coupon error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
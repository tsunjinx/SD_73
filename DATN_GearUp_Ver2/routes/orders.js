const express = require('express')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status, 
      customer_id,
      date_from,
      date_to 
    } = req.query
    
    const offset = (page - 1) * limit

    let whereConditions = ['hd.deleted = 0']
    const request = pool.request()

    if (search) {
      whereConditions.push('(hd.ma_hoa_don LIKE @search OR hd.ten_khach_hang LIKE @search)')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    if (status !== undefined) {
      whereConditions.push('hd.trang_thai = @status')
      request.input('status', sql.Bit, status)
    }

    if (customer_id) {
      whereConditions.push('hd.id_khach_hang = @customer_id')
      request.input('customer_id', sql.Int, customer_id)
    }

    if (date_from) {
      whereConditions.push('hd.ngay_tao >= @date_from')
      request.input('date_from', sql.Date, date_from)
    }

    if (date_to) {
      whereConditions.push('hd.ngay_tao <= @date_to')
      request.input('date_to', sql.Date, date_to)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        hd.*,
        kh.ten_khach_hang as khach_hang,
        nv.ten_nhan_vien as nhan_vien,
        pgg.ten_phieu_giam_gia,
        (SELECT COUNT(*) FROM hoa_don_chi_tiet WHERE id_hoa_don = hd.id AND deleted = 0) as so_san_pham
      FROM hoa_don hd
      LEFT JOIN khach_hang kh ON hd.id_khach_hang = kh.id
      LEFT JOIN nhan_vien nv ON hd.id_nhan_vien = nv.id
      LEFT JOIN phieu_giam_gia pgg ON hd.id_phieu_giam_gia = pgg.id
      WHERE ${whereClause}
      ORDER BY hd.ngay_tao DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)
    if (status !== undefined) countRequest.input('status', sql.Bit, status)
    if (customer_id) countRequest.input('customer_id', sql.Int, customer_id)
    if (date_from) countRequest.input('date_from', sql.Date, date_from)
    if (date_to) countRequest.input('date_to', sql.Date, date_to)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM hoa_don hd
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
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const orderQuery = `
      SELECT 
        hd.*,
        kh.ten_khach_hang as khach_hang,
        kh.email as email_khach_hang,
        kh.so_dien_thoai as sdt_khach_hang,
        nv.ten_nhan_vien as nhan_vien,
        pgg.ten_phieu_giam_gia,
        pgg.gia_tri_giam_gia,
        pgg.loai_phieu_giam_gia
      FROM hoa_don hd
      LEFT JOIN khach_hang kh ON hd.id_khach_hang = kh.id
      LEFT JOIN nhan_vien nv ON hd.id_nhan_vien = nv.id
      LEFT JOIN phieu_giam_gia pgg ON hd.id_phieu_giam_gia = pgg.id
      WHERE hd.id = @id AND hd.deleted = 0
    `

    const orderResult = await request.query(orderQuery)

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Hóa đơn không tồn tại' })
    }

    const detailsQuery = `
      SELECT 
        hdct.*,
        sp.ten_san_pham,
        sp.ma_san_pham,
        ms.ten_mau_sac,
        kt.ten_kich_thuoc,
        (SELECT TOP 1 asp.duong_dan_anh 
         FROM chi_tiet_san_pham_anh ctspa 
         JOIN anh_san_pham asp ON ctspa.id_anh_san_pham = asp.id 
         WHERE ctspa.id_chi_tiet_san_pham = hdct.id_chi_tiet_san_pham) as hinh_anh
      FROM hoa_don_chi_tiet hdct
      JOIN chi_tiet_san_pham ctsp ON hdct.id_chi_tiet_san_pham = ctsp.id
      JOIN san_pham sp ON ctsp.id_san_pham = sp.id
      LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
      LEFT JOIN kich_thuoc kt ON ctsp.id_kich_thuoc = kt.id
      WHERE hdct.id_hoa_don = @id AND hdct.deleted = 0
    `

    const detailsResult = await request.query(detailsQuery)

    const paymentQuery = `
      SELECT 
        htttt.*,
        pttt.ten_phuong_thuc_thanh_toan
      FROM hinh_thuc_thanh_toan htttt
      JOIN phuong_thuc_thanh_toan pttt ON htttt.id_phuong_thuc_thanh_toan = pttt.id
      WHERE htttt.id_hoa_don = @id AND htttt.deleted = 0
    `

    const paymentResult = await request.query(paymentQuery)

    const statusQuery = `
      SELECT 
        ttdh.*,
        ttdh_info.ten_trang_thai_don_hang
      FROM thong_tin_don_hang ttdh
      JOIN trang_thai_don_hang ttdh_info ON ttdh.id_trang_thai_don_hang = ttdh_info.id
      WHERE ttdh.id_hoa_don = @id AND ttdh.deleted = 0
      ORDER BY ttdh.thoi_gian ASC
    `

    const statusResult = await request.query(statusQuery)

    res.json({
      ...orderResult.recordset[0],
      chi_tiet: detailsResult.recordset,
      thanh_toan: paymentResult.recordset,
      lich_su_trang_thai: statusResult.recordset
    })

  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  const transaction = new sql.Transaction(pool)
  
  try {
    await transaction.begin()

    const {
      id_khach_hang,
      id_phieu_giam_gia,
      id_nhan_vien,
      ten_hoa_don,
      loai_don,
      phi_van_chuyen,
      ghi_chu,
      ten_khach_hang,
      dia_chi_khach_hang,
      so_dien_thoai_khach_hang,
      email_khach_hang,
      chi_tiet,
      thanh_toan,
      create_by
    } = req.body

    if (!id_khach_hang || !chi_tiet || chi_tiet.length === 0) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    let tong_tien = 0
    chi_tiet.forEach(item => {
      tong_tien += item.so_luong * item.gia_ban
    })

    let giam_gia = 0
    if (id_phieu_giam_gia) {
      const couponRequest = new sql.Request(transaction)
      couponRequest.input('id', sql.Int, id_phieu_giam_gia)
      
      const couponResult = await couponRequest.query(`
        SELECT * FROM phieu_giam_gia 
        WHERE id = @id AND deleted = 0 AND trang_thai = 1
      `)

      if (couponResult.recordset.length > 0) {
        const coupon = couponResult.recordset[0]
        if (coupon.loai_phieu_giam_gia === 0) {
          giam_gia = Math.min((tong_tien * coupon.gia_tri_giam_gia / 100), coupon.so_tien_toi_da || tong_tien)
        } else {
          giam_gia = Math.min(coupon.gia_tri_giam_gia, tong_tien)
        }
      }
    }

    const tong_tien_sau_giam = tong_tien - giam_gia + (phi_van_chuyen || 0)

    const orderRequest = new sql.Request(transaction)
    orderRequest.input('id_khach_hang', sql.Int, id_khach_hang)
    orderRequest.input('id_phieu_giam_gia', sql.Int, id_phieu_giam_gia || null)
    orderRequest.input('id_nhan_vien', sql.Int, id_nhan_vien || null)
    orderRequest.input('ten_hoa_don', sql.NVarChar, ten_hoa_don || null)
    orderRequest.input('loai_don', sql.Bit, loai_don || 0)
    orderRequest.input('phi_van_chuyen', sql.Decimal, phi_van_chuyen || 0)
    orderRequest.input('tong_tien', sql.Decimal, tong_tien)
    orderRequest.input('tong_tien_sau_giam', sql.Decimal, tong_tien_sau_giam)
    orderRequest.input('ghi_chu', sql.NVarChar, ghi_chu || null)
    orderRequest.input('ten_khach_hang', sql.NVarChar, ten_khach_hang)
    orderRequest.input('dia_chi_khach_hang', sql.NVarChar, dia_chi_khach_hang || null)
    orderRequest.input('so_dien_thoai_khach_hang', sql.VarChar, so_dien_thoai_khach_hang || null)
    orderRequest.input('email_khach_hang', sql.VarChar, email_khach_hang || null)
    orderRequest.input('ngay_tao', sql.Date, new Date())
    orderRequest.input('create_by', sql.Int, create_by || null)

    const orderResult = await orderRequest.query(`
      INSERT INTO hoa_don 
      (id_khach_hang, id_phieu_giam_gia, id_nhan_vien, ten_hoa_don, loai_don, 
       phi_van_chuyen, tong_tien, tong_tien_sau_giam, ghi_chu, ten_khach_hang, 
       dia_chi_khach_hang, so_dien_thoai_khach_hang, email_khach_hang, 
       ngay_tao, create_by)
      OUTPUT INSERTED.id
      VALUES 
      (@id_khach_hang, @id_phieu_giam_gia, @id_nhan_vien, @ten_hoa_don, @loai_don,
       @phi_van_chuyen, @tong_tien, @tong_tien_sau_giam, @ghi_chu, @ten_khach_hang,
       @dia_chi_khach_hang, @so_dien_thoai_khach_hang, @email_khach_hang,
       @ngay_tao, @create_by)
    `)

    const orderId = orderResult.recordset[0].id

    for (const item of chi_tiet) {
      const detailRequest = new sql.Request(transaction)
      detailRequest.input('id_hoa_don', sql.Int, orderId)
      detailRequest.input('id_chi_tiet_san_pham', sql.Int, item.id_chi_tiet_san_pham)
      detailRequest.input('so_luong', sql.Int, item.so_luong)
      detailRequest.input('gia_ban', sql.Decimal, item.gia_ban)
      detailRequest.input('thanh_tien', sql.Decimal, item.so_luong * item.gia_ban)

      await detailRequest.query(`
        INSERT INTO hoa_don_chi_tiet 
        (id_hoa_don, id_chi_tiet_san_pham, so_luong, gia_ban, thanh_tien)
        VALUES 
        (@id_hoa_don, @id_chi_tiet_san_pham, @so_luong, @gia_ban, @thanh_tien)
      `)

      const updateStockRequest = new sql.Request(transaction)
      updateStockRequest.input('id', sql.Int, item.id_chi_tiet_san_pham)
      updateStockRequest.input('so_luong', sql.Int, item.so_luong)

      await updateStockRequest.query(`
        UPDATE chi_tiet_san_pham 
        SET so_luong = so_luong - @so_luong 
        WHERE id = @id
      `)
    }

    if (thanh_toan && thanh_toan.length > 0) {
      for (const payment of thanh_toan) {
        const paymentRequest = new sql.Request(transaction)
        paymentRequest.input('id_hoa_don', sql.Int, orderId)
        paymentRequest.input('id_phuong_thuc_thanh_toan', sql.Int, payment.id_phuong_thuc_thanh_toan)
        paymentRequest.input('tien_chuyen_khoan', sql.Decimal, payment.tien_chuyen_khoan || 0)
        paymentRequest.input('tien_mat', sql.Decimal, payment.tien_mat || 0)

        await paymentRequest.query(`
          INSERT INTO hinh_thuc_thanh_toan 
          (id_hoa_don, id_phuong_thuc_thanh_toan, tien_chuyen_khoan, tien_mat)
          VALUES 
          (@id_hoa_don, @id_phuong_thuc_thanh_toan, @tien_chuyen_khoan, @tien_mat)
        `)
      }
    }

    await transaction.commit()

    res.status(201).json({ 
      id: orderId,
      message: 'Tạo hóa đơn thành công' 
    })

  } catch (error) {
    await transaction.rollback()
    console.error('Create order error:', error)
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
      UPDATE hoa_don 
      SET trang_thai = @trang_thai 
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật trạng thái hóa đơn thành công' })

  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/statistics/overview', async (req, res) => {
  try {
    const { date_from, date_to } = req.query
    const request = pool.request()

    let dateFilter = ''
    if (date_from && date_to) {
      dateFilter = 'AND ngay_tao BETWEEN @date_from AND @date_to'
      request.input('date_from', sql.Date, date_from)
      request.input('date_to', sql.Date, date_to)
    }

    const query = `
      SELECT 
        COUNT(*) as tong_don_hang,
        COUNT(CASE WHEN trang_thai = 1 THEN 1 END) as don_thanh_cong,
        COUNT(CASE WHEN trang_thai = 0 THEN 1 END) as don_huy,
        ISNULL(SUM(tong_tien_sau_giam), 0) as tong_doanh_thu,
        ISNULL(AVG(tong_tien_sau_giam), 0) as gia_tri_trung_binh
      FROM hoa_don 
      WHERE deleted = 0 ${dateFilter}
    `

    const result = await request.query(query)
    res.json(result.recordset[0])

  } catch (error) {
    console.error('Get order statistics error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
const express = require('express')
const bcrypt = require('bcryptjs')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const offset = (page - 1) * limit

    let whereConditions = ['deleted = 0']
    const request = pool.request()

    if (search) {
      whereConditions.push('(ten_khach_hang LIKE @search OR ten_tai_khoan LIKE @search OR email LIKE @search OR so_dien_thoai LIKE @search)')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        id, ma_khach_hang, ten_khach_hang, ten_tai_khoan, email, 
        so_dien_thoai, gioi_tinh, ngay_sinh, create_at
      FROM khach_hang 
      WHERE ${whereClause}
      ORDER BY create_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM khach_hang 
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
    console.error('Get customers error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const customerQuery = `
      SELECT 
        id, ma_khach_hang, ten_khach_hang, ten_tai_khoan, email, 
        so_dien_thoai, gioi_tinh, ngay_sinh, create_at
      FROM khach_hang 
      WHERE id = @id AND deleted = 0
    `

    const customerResult = await request.query(customerQuery)

    if (customerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Khách hàng không tồn tại' })
    }

    const addressQuery = `
      SELECT * FROM dia_chi_khach_hang 
      WHERE id_khach_hang = @id AND deleted = 0
    `

    const addressResult = await request.query(addressQuery)

    const orderStatsQuery = `
      SELECT 
        COUNT(*) as tong_don_hang,
        ISNULL(SUM(tong_tien_sau_giam), 0) as tong_chi_tieu,
        COUNT(CASE WHEN trang_thai = 1 THEN 1 END) as don_thanh_cong
      FROM hoa_don 
      WHERE id_khach_hang = @id AND deleted = 0
    `

    const orderStatsResult = await request.query(orderStatsQuery)

    res.json({
      ...customerResult.recordset[0],
      dia_chi: addressResult.recordset,
      thong_ke: orderStatsResult.recordset[0]
    })

  } catch (error) {
    console.error('Get customer error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { 
      ten_khach_hang, 
      ten_tai_khoan, 
      mat_khau, 
      email, 
      so_dien_thoai, 
      gioi_tinh, 
      ngay_sinh,
      create_by 
    } = req.body

    if (!ten_khach_hang || !ten_tai_khoan || !mat_khau || !email) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const checkRequest = pool.request()
    checkRequest.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    checkRequest.input('email', sql.VarChar, email)

    const existingUser = await checkRequest.query(`
      SELECT COUNT(*) as count FROM khach_hang 
      WHERE (ten_tai_khoan = @ten_tai_khoan OR email = @email) AND deleted = 0
    `)

    if (existingUser.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tài khoản hoặc email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10)

    const request = pool.request()
    request.input('ten_khach_hang', sql.NVarChar, ten_khach_hang)
    request.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    request.input('mat_khau', sql.VarChar, hashedPassword)
    request.input('email', sql.VarChar, email)
    request.input('so_dien_thoai', sql.VarChar, so_dien_thoai || null)
    request.input('gioi_tinh', sql.Bit, gioi_tinh || null)
    request.input('ngay_sinh', sql.Date, ngay_sinh || null)
    request.input('create_by', sql.Int, create_by || null)
    request.input('create_at', sql.Date, new Date())

    const result = await request.query(`
      INSERT INTO khach_hang 
      (ten_khach_hang, ten_tai_khoan, mat_khau, email, so_dien_thoai, 
       gioi_tinh, ngay_sinh, create_by, create_at)
      OUTPUT INSERTED.id
      VALUES 
      (@ten_khach_hang, @ten_tai_khoan, @mat_khau, @email, @so_dien_thoai,
       @gioi_tinh, @ngay_sinh, @create_by, @create_at)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo khách hàng thành công' 
    })

  } catch (error) {
    console.error('Create customer error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      ten_khach_hang, 
      email, 
      so_dien_thoai, 
      gioi_tinh, 
      ngay_sinh,
      update_by 
    } = req.body

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('ten_khach_hang', sql.NVarChar, ten_khach_hang)
    request.input('email', sql.VarChar, email)
    request.input('so_dien_thoai', sql.VarChar, so_dien_thoai || null)
    request.input('gioi_tinh', sql.Bit, gioi_tinh || null)
    request.input('ngay_sinh', sql.Date, ngay_sinh || null)
    request.input('update_by', sql.Int, update_by || null)
    request.input('update_at', sql.Date, new Date())

    const checkEmailRequest = pool.request()
    checkEmailRequest.input('email', sql.VarChar, email)
    checkEmailRequest.input('id', sql.Int, id)

    const existingEmail = await checkEmailRequest.query(`
      SELECT COUNT(*) as count FROM khach_hang 
      WHERE email = @email AND id != @id AND deleted = 0
    `)

    if (existingEmail.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    await request.query(`
      UPDATE khach_hang 
      SET 
        ten_khach_hang = @ten_khach_hang,
        email = @email,
        so_dien_thoai = @so_dien_thoai,
        gioi_tinh = @gioi_tinh,
        ngay_sinh = @ngay_sinh,
        update_by = @update_by,
        update_at = @update_at
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật khách hàng thành công' })

  } catch (error) {
    console.error('Update customer error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    await request.query(`
      UPDATE khach_hang 
      SET deleted = 1 
      WHERE id = @id
    `)

    res.json({ message: 'Xóa khách hàng thành công' })

  } catch (error) {
    console.error('Delete customer error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      ten_dia_chi, 
      thanh_pho, 
      quan, 
      phuong, 
      dia_chi_cu_the 
    } = req.body

    if (!ten_dia_chi || !thanh_pho || !quan || !phuong || !dia_chi_cu_the) {
      return res.status(400).json({ message: 'Thiếu thông tin địa chỉ' })
    }

    const request = pool.request()
    request.input('id_khach_hang', sql.Int, id)
    request.input('ten_dia_chi', sql.NVarChar, ten_dia_chi)
    request.input('thanh_pho', sql.NVarChar, thanh_pho)
    request.input('quan', sql.NVarChar, quan)
    request.input('phuong', sql.VarChar, phuong)
    request.input('dia_chi_cu_the', sql.VarChar, dia_chi_cu_the)

    const result = await request.query(`
      INSERT INTO dia_chi_khach_hang 
      (id_khach_hang, ten_dia_chi, thanh_pho, quan, phuong, dia_chi_cu_the)
      OUTPUT INSERTED.id
      VALUES 
      (@id_khach_hang, @ten_dia_chi, @thanh_pho, @quan, @phuong, @dia_chi_cu_the)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Thêm địa chỉ thành công' 
    })

  } catch (error) {
    console.error('Add customer address error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const request = pool.request()
    request.input('id_khach_hang', sql.Int, id)
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const query = `
      SELECT 
        hd.*,
        (SELECT COUNT(*) FROM hoa_don_chi_tiet WHERE id_hoa_don = hd.id AND deleted = 0) as so_san_pham
      FROM hoa_don hd
      WHERE hd.id_khach_hang = @id_khach_hang AND hd.deleted = 0
      ORDER BY hd.ngay_tao DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    countRequest.input('id_khach_hang', sql.Int, id)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM hoa_don 
      WHERE id_khach_hang = @id_khach_hang AND deleted = 0
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
    console.error('Get customer orders error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params
    const { mat_khau_cu, mat_khau_moi } = req.body

    if (!mat_khau_cu || !mat_khau_moi) {
      return res.status(400).json({ message: 'Thiếu thông tin mật khẩu' })
    }

    const request = pool.request()
    request.input('id', sql.Int, id)

    const customerResult = await request.query(`
      SELECT mat_khau FROM khach_hang 
      WHERE id = @id AND deleted = 0
    `)

    if (customerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Khách hàng không tồn tại' })
    }

    const isValidPassword = await bcrypt.compare(mat_khau_cu, customerResult.recordset[0].mat_khau)

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' })
    }

    const hashedNewPassword = await bcrypt.hash(mat_khau_moi, 10)

    const updateRequest = pool.request()
    updateRequest.input('id', sql.Int, id)
    updateRequest.input('mat_khau_moi', sql.VarChar, hashedNewPassword)

    await updateRequest.query(`
      UPDATE khach_hang 
      SET mat_khau = @mat_khau_moi 
      WHERE id = @id
    `)

    res.json({ message: 'Đổi mật khẩu thành công' })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
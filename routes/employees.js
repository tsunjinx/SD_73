const express = require('express')
const bcrypt = require('bcryptjs')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query
    const offset = (page - 1) * limit

    let whereConditions = ['nv.deleted = 0']
    const request = pool.request()

    if (search) {
      whereConditions.push('(nv.ten_nhan_vien LIKE @search OR nv.ten_tai_khoan LIKE @search OR nv.email LIKE @search)')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    if (role) {
      whereConditions.push('nv.id_quyen_han = @role')
      request.input('role', sql.Int, role)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        nv.id, nv.ma_nhan_vien, nv.ten_nhan_vien, nv.ten_tai_khoan, 
        nv.email, nv.so_dien_thoai, nv.ngay_sinh, nv.trang_thai, 
        nv.create_at, qh.ten_quyen_han
      FROM nhan_vien nv
      LEFT JOIN quyen_han qh ON nv.id_quyen_han = qh.id
      WHERE ${whereClause}
      ORDER BY nv.create_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)
    if (role) countRequest.input('role', sql.Int, role)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM nhan_vien nv
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
    console.error('Get employees error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/roles', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM quyen_han 
      WHERE deleted = 0 
      ORDER BY ten_quyen_han
    `)

    res.json(result.recordset)

  } catch (error) {
    console.error('Get roles error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const query = `
      SELECT 
        nv.id, nv.ma_nhan_vien, nv.ten_nhan_vien, nv.ten_tai_khoan, 
        nv.email, nv.so_dien_thoai, nv.anh_nha_vien, nv.ngay_sinh, 
        nv.ghi_chu, nv.thanh_pho, nv.quan, nv.phuong, nv.dia_chi_cu_the, 
        nv.cccd, nv.trang_thai, nv.create_at, qh.ten_quyen_han, nv.id_quyen_han
      FROM nhan_vien nv
      LEFT JOIN quyen_han qh ON nv.id_quyen_han = qh.id
      WHERE nv.id = @id AND nv.deleted = 0
    `

    const result = await request.query(query)

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' })
    }

    res.json(result.recordset[0])

  } catch (error) {
    console.error('Get employee error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { 
      id_quyen_han,
      ten_nhan_vien, 
      ten_tai_khoan, 
      mat_khau, 
      email, 
      so_dien_thoai, 
      anh_nha_vien,
      ngay_sinh,
      ghi_chu,
      thanh_pho,
      quan,
      phuong,
      dia_chi_cu_the,
      cccd,
      create_by 
    } = req.body

    if (!id_quyen_han || !ten_nhan_vien || !ten_tai_khoan || !mat_khau || !email) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const checkRequest = pool.request()
    checkRequest.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    checkRequest.input('email', sql.VarChar, email)

    const existingUser = await checkRequest.query(`
      SELECT COUNT(*) as count FROM nhan_vien 
      WHERE (ten_tai_khoan = @ten_tai_khoan OR email = @email) AND deleted = 0
    `)

    if (existingUser.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tài khoản hoặc email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10)

    const request = pool.request()
    request.input('id_quyen_han', sql.Int, id_quyen_han)
    request.input('ten_nhan_vien', sql.NVarChar, ten_nhan_vien)
    request.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    request.input('mat_khau', sql.VarChar, hashedPassword)
    request.input('email', sql.VarChar, email)
    request.input('so_dien_thoai', sql.VarChar, so_dien_thoai || null)
    request.input('anh_nha_vien', sql.VarChar, anh_nha_vien || null)
    request.input('ngay_sinh', sql.Date, ngay_sinh || null)
    request.input('ghi_chu', sql.NVarChar, ghi_chu || null)
    request.input('thanh_pho', sql.NVarChar, thanh_pho || null)
    request.input('quan', sql.NVarChar, quan || null)
    request.input('phuong', sql.VarChar, phuong || null)
    request.input('dia_chi_cu_the', sql.VarChar, dia_chi_cu_the || null)
    request.input('cccd', sql.VarChar, cccd || null)
    request.input('create_by', sql.Int, create_by || null)
    request.input('create_at', sql.Date, new Date())

    const result = await request.query(`
      INSERT INTO nhan_vien 
      (id_quyen_han, ten_nhan_vien, ten_tai_khoan, mat_khau, email, so_dien_thoai, 
       anh_nha_vien, ngay_sinh, ghi_chu, thanh_pho, quan, phuong, dia_chi_cu_the, 
       cccd, create_by, create_at)
      OUTPUT INSERTED.id
      VALUES 
      (@id_quyen_han, @ten_nhan_vien, @ten_tai_khoan, @mat_khau, @email, @so_dien_thoai,
       @anh_nha_vien, @ngay_sinh, @ghi_chu, @thanh_pho, @quan, @phuong, @dia_chi_cu_the,
       @cccd, @create_by, @create_at)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo nhân viên thành công' 
    })

  } catch (error) {
    console.error('Create employee error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      id_quyen_han,
      ten_nhan_vien, 
      email, 
      so_dien_thoai, 
      anh_nha_vien,
      ngay_sinh,
      ghi_chu,
      thanh_pho,
      quan,
      phuong,
      dia_chi_cu_the,
      cccd,
      update_by 
    } = req.body

    const checkEmailRequest = pool.request()
    checkEmailRequest.input('email', sql.VarChar, email)
    checkEmailRequest.input('id', sql.Int, id)

    const existingEmail = await checkEmailRequest.query(`
      SELECT COUNT(*) as count FROM nhan_vien 
      WHERE email = @email AND id != @id AND deleted = 0
    `)

    if (existingEmail.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('id_quyen_han', sql.Int, id_quyen_han)
    request.input('ten_nhan_vien', sql.NVarChar, ten_nhan_vien)
    request.input('email', sql.VarChar, email)
    request.input('so_dien_thoai', sql.VarChar, so_dien_thoai || null)
    request.input('anh_nha_vien', sql.VarChar, anh_nha_vien || null)
    request.input('ngay_sinh', sql.Date, ngay_sinh || null)
    request.input('ghi_chu', sql.NVarChar, ghi_chu || null)
    request.input('thanh_pho', sql.NVarChar, thanh_pho || null)
    request.input('quan', sql.NVarChar, quan || null)
    request.input('phuong', sql.VarChar, phuong || null)
    request.input('dia_chi_cu_the', sql.VarChar, dia_chi_cu_the || null)
    request.input('cccd', sql.VarChar, cccd || null)
    request.input('update_by', sql.Int, update_by || null)
    request.input('update_at', sql.Date, new Date())

    await request.query(`
      UPDATE nhan_vien 
      SET 
        id_quyen_han = @id_quyen_han,
        ten_nhan_vien = @ten_nhan_vien,
        email = @email,
        so_dien_thoai = @so_dien_thoai,
        anh_nha_vien = @anh_nha_vien,
        ngay_sinh = @ngay_sinh,
        ghi_chu = @ghi_chu,
        thanh_pho = @thanh_pho,
        quan = @quan,
        phuong = @phuong,
        dia_chi_cu_the = @dia_chi_cu_the,
        cccd = @cccd,
        update_by = @update_by,
        update_at = @update_at
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật nhân viên thành công' })

  } catch (error) {
    console.error('Update employee error:', error)
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
      UPDATE nhan_vien 
      SET trang_thai = @trang_thai 
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật trạng thái nhân viên thành công' })

  } catch (error) {
    console.error('Update employee status error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    await request.query(`
      UPDATE nhan_vien 
      SET deleted = 1 
      WHERE id = @id
    `)

    res.json({ message: 'Xóa nhân viên thành công' })

  } catch (error) {
    console.error('Delete employee error:', error)
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

    const employeeResult = await request.query(`
      SELECT mat_khau FROM nhan_vien 
      WHERE id = @id AND deleted = 0
    `)

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' })
    }

    const isValidPassword = await bcrypt.compare(mat_khau_cu, employeeResult.recordset[0].mat_khau)

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' })
    }

    const hashedNewPassword = await bcrypt.hash(mat_khau_moi, 10)

    const updateRequest = pool.request()
    updateRequest.input('id', sql.Int, id)
    updateRequest.input('mat_khau_moi', sql.VarChar, hashedNewPassword)

    await updateRequest.query(`
      UPDATE nhan_vien 
      SET mat_khau = @mat_khau_moi 
      WHERE id = @id
    `)

    res.json({ message: 'Đổi mật khẩu thành công' })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/roles', async (req, res) => {
  try {
    const { ten_quyen_han } = req.body

    if (!ten_quyen_han) {
      return res.status(400).json({ message: 'Tên quyền hạn là bắt buộc' })
    }

    const request = pool.request()
    request.input('ten_quyen_han', sql.NVarChar, ten_quyen_han)

    const result = await request.query(`
      INSERT INTO quyen_han (ten_quyen_han)
      OUTPUT INSERTED.id
      VALUES (@ten_quyen_han)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo quyền hạn thành công' 
    })

  } catch (error) {
    console.error('Create role error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
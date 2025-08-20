const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

router.post('/login', async (req, res) => {
  try {
    const { tai_khoan, mat_khau } = req.body

    if (!tai_khoan || !mat_khau) {
      return res.status(400).json({ message: 'Tài khoản và mật khẩu là bắt buộc' })
    }

    const request = pool.request()
    request.input('tai_khoan', sql.VarChar, tai_khoan)
    
    const employeeResult = await request.query(`
      SELECT nv.*, qh.ten_quyen_han 
      FROM nhan_vien nv 
      JOIN quyen_han qh ON nv.id_quyen_han = qh.id 
      WHERE nv.ten_tai_khoan = @tai_khoan AND nv.deleted = 0 AND nv.trang_thai = 1
    `)

    if (employeeResult.recordset.length === 0) {
      const customerRequest = pool.request()
      customerRequest.input('tai_khoan', sql.VarChar, tai_khoan)
      
      const customerResult = await customerRequest.query(`
        SELECT * FROM khach_hang 
        WHERE ten_tai_khoan = @tai_khoan AND deleted = 0
      `)

      if (customerResult.recordset.length === 0) {
        return res.status(401).json({ message: 'Tài khoản không tồn tại' })
      }

      const customer = customerResult.recordset[0]
      const isValidPassword = await bcrypt.compare(mat_khau, customer.mat_khau)

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Mật khẩu không đúng' })
      }

      const token = jwt.sign(
        { 
          id: customer.id, 
          tai_khoan: customer.ten_tai_khoan,
          loai_nguoi_dung: 'khach_hang'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.json({
        token,
        user: {
          id: customer.id,
          tai_khoan: customer.ten_tai_khoan,
          ho_ten: customer.ten_khach_hang,
          email: customer.email,
          loai_nguoi_dung: 'khach_hang'
        }
      })
    }

    const employee = employeeResult.recordset[0]
    const isValidPassword = await bcrypt.compare(mat_khau, employee.mat_khau)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' })
    }

    const token = jwt.sign(
      { 
        id: employee.id, 
        tai_khoan: employee.ten_tai_khoan,
        loai_nguoi_dung: 'nhan_vien',
        quyen_han: employee.ten_quyen_han
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: employee.id,
        tai_khoan: employee.ten_tai_khoan,
        ho_ten: employee.ten_nhan_vien,
        email: employee.email,
        loai_nguoi_dung: 'nhan_vien',
        quyen_han: employee.ten_quyen_han
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { 
      ten_tai_khoan, 
      mat_khau, 
      ten_khach_hang, 
      email, 
      so_dien_thoai, 
      gioi_tinh, 
      ngay_sinh 
    } = req.body

    if (!ten_tai_khoan || !mat_khau || !ten_khach_hang || !email) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const request = pool.request()
    request.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    request.input('email', sql.VarChar, email)

    const existingUser = await request.query(`
      SELECT COUNT(*) as count FROM khach_hang 
      WHERE (ten_tai_khoan = @ten_tai_khoan OR email = @email) AND deleted = 0
    `)

    if (existingUser.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tài khoản hoặc email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10)

    const insertRequest = pool.request()
    insertRequest.input('ten_tai_khoan', sql.VarChar, ten_tai_khoan)
    insertRequest.input('mat_khau', sql.VarChar, hashedPassword)
    insertRequest.input('ten_khach_hang', sql.NVarChar, ten_khach_hang)
    insertRequest.input('email', sql.VarChar, email)
    insertRequest.input('so_dien_thoai', sql.VarChar, so_dien_thoai || null)
    insertRequest.input('gioi_tinh', sql.Bit, gioi_tinh || null)
    insertRequest.input('ngay_sinh', sql.Date, ngay_sinh || null)
    insertRequest.input('create_at', sql.Date, new Date())

    await insertRequest.query(`
      INSERT INTO khach_hang 
      (ten_tai_khoan, mat_khau, ten_khach_hang, email, so_dien_thoai, gioi_tinh, ngay_sinh, create_at)
      VALUES 
      (@ten_tai_khoan, @mat_khau, @ten_khach_hang, @email, @so_dien_thoai, @gioi_tinh, @ngay_sinh, @create_at)
    `)

    res.status(201).json({ message: 'Đăng ký thành công' })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Token không tồn tại' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (decoded.loai_nguoi_dung === 'khach_hang') {
      const request = pool.request()
      request.input('id', sql.Int, decoded.id)
      
      const result = await request.query(`
        SELECT id, ten_tai_khoan, ten_khach_hang, email, so_dien_thoai, gioi_tinh, ngay_sinh
        FROM khach_hang 
        WHERE id = @id AND deleted = 0
      `)

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
      }

      const user = result.recordset[0]
      res.json({
        id: user.id,
        tai_khoan: user.ten_tai_khoan,
        ho_ten: user.ten_khach_hang,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        gioi_tinh: user.gioi_tinh,
        ngay_sinh: user.ngay_sinh,
        loai_nguoi_dung: 'khach_hang'
      })
    } else {
      const request = pool.request()
      request.input('id', sql.Int, decoded.id)
      
      const result = await request.query(`
        SELECT nv.*, qh.ten_quyen_han 
        FROM nhan_vien nv 
        JOIN quyen_han qh ON nv.id_quyen_han = qh.id 
        WHERE nv.id = @id AND nv.deleted = 0
      `)

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
      }

      const user = result.recordset[0]
      res.json({
        id: user.id,
        tai_khoan: user.ten_tai_khoan,
        ho_ten: user.ten_nhan_vien,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        quyen_han: user.ten_quyen_han,
        loai_nguoi_dung: 'nhan_vien'
      })
    }

  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Đăng xuất thành công' })
})

module.exports = router
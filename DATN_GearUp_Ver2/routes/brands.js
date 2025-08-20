const express = require('express')
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
      whereConditions.push('ten_nha_san_xuat LIKE @search')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        nsx.*,
        (SELECT COUNT(*) FROM san_pham WHERE id_nha_san_xuat = nsx.id AND deleted = 0) as so_san_pham
      FROM nha_san_xuat nsx
      WHERE ${whereClause}
      ORDER BY ten_nha_san_xuat
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM nha_san_xuat 
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
    console.error('Get brands error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const brandQuery = `
      SELECT 
        nsx.*,
        (SELECT COUNT(*) FROM san_pham WHERE id_nha_san_xuat = nsx.id AND deleted = 0) as so_san_pham
      FROM nha_san_xuat nsx
      WHERE nsx.id = @id AND nsx.deleted = 0
    `

    const result = await request.query(brandQuery)

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Nhà sản xuất không tồn tại' })
    }

    res.json(result.recordset[0])

  } catch (error) {
    console.error('Get brand error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { ten_nha_san_xuat } = req.body

    if (!ten_nha_san_xuat) {
      return res.status(400).json({ message: 'Tên nhà sản xuất là bắt buộc' })
    }

    const checkRequest = pool.request()
    checkRequest.input('ten_nha_san_xuat', sql.NVarChar, ten_nha_san_xuat)

    const existingBrand = await checkRequest.query(`
      SELECT COUNT(*) as count FROM nha_san_xuat 
      WHERE ten_nha_san_xuat = @ten_nha_san_xuat AND deleted = 0
    `)

    if (existingBrand.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tên nhà sản xuất đã tồn tại' })
    }

    const request = pool.request()
    request.input('ten_nha_san_xuat', sql.NVarChar, ten_nha_san_xuat)

    const result = await request.query(`
      INSERT INTO nha_san_xuat (ten_nha_san_xuat)
      OUTPUT INSERTED.id
      VALUES (@ten_nha_san_xuat)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo nhà sản xuất thành công' 
    })

  } catch (error) {
    console.error('Create brand error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ten_nha_san_xuat } = req.body

    if (!ten_nha_san_xuat) {
      return res.status(400).json({ message: 'Tên nhà sản xuất là bắt buộc' })
    }

    const checkRequest = pool.request()
    checkRequest.input('ten_nha_san_xuat', sql.NVarChar, ten_nha_san_xuat)
    checkRequest.input('id', sql.Int, id)

    const existingBrand = await checkRequest.query(`
      SELECT COUNT(*) as count FROM nha_san_xuat 
      WHERE ten_nha_san_xuat = @ten_nha_san_xuat AND id != @id AND deleted = 0
    `)

    if (existingBrand.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tên nhà sản xuất đã tồn tại' })
    }

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('ten_nha_san_xuat', sql.NVarChar, ten_nha_san_xuat)

    const result = await request.query(`
      UPDATE nha_san_xuat 
      SET ten_nha_san_xuat = @ten_nha_san_xuat 
      WHERE id = @id AND deleted = 0
    `)

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Nhà sản xuất không tồn tại' })
    }

    res.json({ message: 'Cập nhật nhà sản xuất thành công' })

  } catch (error) {
    console.error('Update brand error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const checkProductsRequest = pool.request()
    checkProductsRequest.input('id', sql.Int, id)

    const productsResult = await checkProductsRequest.query(`
      SELECT COUNT(*) as count FROM san_pham 
      WHERE id_nha_san_xuat = @id AND deleted = 0
    `)

    if (productsResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa nhà sản xuất vì đang có sản phẩm sử dụng' 
      })
    }

    const request = pool.request()
    request.input('id', sql.Int, id)

    const result = await request.query(`
      UPDATE nha_san_xuat 
      SET deleted = 1 
      WHERE id = @id
    `)

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Nhà sản xuất không tồn tại' })
    }

    res.json({ message: 'Xóa nhà sản xuất thành công' })

  } catch (error) {
    console.error('Delete brand error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const request = pool.request()
    request.input('id_nha_san_xuat', sql.Int, id)
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const query = `
      SELECT 
        sp.*,
        xx.ten_xuat_xu,
        MIN(ctsp.gia_ban) as gia_min,
        MAX(ctsp.gia_ban) as gia_max,
        SUM(ctsp.so_luong) as tong_so_luong
      FROM san_pham sp
      LEFT JOIN xuat_xu xx ON sp.id_xuat_xu = xx.id
      LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham AND ctsp.deleted = 0
      WHERE sp.id_nha_san_xuat = @id_nha_san_xuat AND sp.deleted = 0
      GROUP BY sp.id, sp.ma_san_pham, sp.ten_san_pham, sp.create_at, xx.ten_xuat_xu
      ORDER BY sp.create_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    countRequest.input('id_nha_san_xuat', sql.Int, id)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM san_pham 
      WHERE id_nha_san_xuat = @id_nha_san_xuat AND deleted = 0
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
    console.error('Get brand products error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
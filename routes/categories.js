const express = require('express')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/brands', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM nha_san_xuat 
      WHERE deleted = 0 
      ORDER BY ten_nha_san_xuat
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get brands error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/origins', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM xuat_xu 
      WHERE deleted = 0 
      ORDER BY ten_xuat_xu
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get origins error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/colors', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM mau_sac 
      WHERE deleted = 0 
      ORDER BY ten_mau_sac
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get colors error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/sizes', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM kich_thuoc 
      WHERE deleted = 0 
      ORDER BY CAST(ten_kich_thuoc AS INT)
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get sizes error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/sole-types', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM de_giay 
      WHERE deleted = 0 
      ORDER BY ten_de_giay
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get sole types error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/materials', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM chat_lieu 
      WHERE deleted = 0 
      ORDER BY ten_chat_lieu
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get materials error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/insoles', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM dem_giay 
      WHERE deleted = 0 
      ORDER BY ten_dem_giay
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get insoles error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/weights', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM trong_luong 
      WHERE deleted = 0 
      ORDER BY ten_trong_luong
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get weights error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/sports', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM mon_the_thao 
      WHERE deleted = 0 
      ORDER BY ten_mon_the_thao
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get sports error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/seasons', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM loai_mua 
      WHERE deleted = 0 
      ORDER BY ten_loai_mua
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get seasons error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/durability', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM do_ben 
      WHERE deleted = 0 
      ORDER BY ten_do_ben
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get durability error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/waterproof', async (req, res) => {
  try {
    const request = pool.request()
    const result = await request.query(`
      SELECT * FROM chong_nuoc 
      WHERE deleted = 0 
      ORDER BY ten_chong_nuoc
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error('Get waterproof error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/brands', async (req, res) => {
  try {
    const { ten_nha_san_xuat } = req.body

    if (!ten_nha_san_xuat) {
      return res.status(400).json({ message: 'Tên nhà sản xuất là bắt buộc' })
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

router.post('/origins', async (req, res) => {
  try {
    const { ten_xuat_xu } = req.body

    if (!ten_xuat_xu) {
      return res.status(400).json({ message: 'Tên xuất xứ là bắt buộc' })
    }

    const request = pool.request()
    request.input('ten_xuat_xu', sql.NVarChar, ten_xuat_xu)

    const result = await request.query(`
      INSERT INTO xuat_xu (ten_xuat_xu)
      OUTPUT INSERTED.id
      VALUES (@ten_xuat_xu)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo xuất xứ thành công' 
    })

  } catch (error) {
    console.error('Create origin error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/colors', async (req, res) => {
  try {
    const { ten_mau_sac } = req.body

    if (!ten_mau_sac) {
      return res.status(400).json({ message: 'Tên màu sắc là bắt buộc' })
    }

    const request = pool.request()
    request.input('ten_mau_sac', sql.NVarChar, ten_mau_sac)

    const result = await request.query(`
      INSERT INTO mau_sac (ten_mau_sac)
      OUTPUT INSERTED.id
      VALUES (@ten_mau_sac)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo màu sắc thành công' 
    })

  } catch (error) {
    console.error('Create color error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/sizes', async (req, res) => {
  try {
    const { ten_kich_thuoc } = req.body

    if (!ten_kich_thuoc) {
      return res.status(400).json({ message: 'Tên kích thước là bắt buộc' })
    }

    const request = pool.request()
    request.input('ten_kich_thuoc', sql.NVarChar, ten_kich_thuoc)

    const result = await request.query(`
      INSERT INTO kich_thuoc (ten_kich_thuoc)
      OUTPUT INSERTED.id
      VALUES (@ten_kich_thuoc)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo kích thước thành công' 
    })

  } catch (error) {
    console.error('Create size error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
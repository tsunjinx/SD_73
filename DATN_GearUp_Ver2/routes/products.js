const express = require('express')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, brand, minPrice, maxPrice } = req.query
    const offset = (page - 1) * limit

    let whereConditions = ['sp.deleted = 0']
    const request = pool.request()

    if (search) {
      whereConditions.push('sp.ten_san_pham LIKE @search')
      request.input('search', sql.NVarChar, `%${search}%`)
    }

    if (category) {
      whereConditions.push('sp.id_nha_san_xuat = @category')
      request.input('category', sql.Int, category)
    }

    if (brand) {
      whereConditions.push('sp.id_xuat_xu = @brand')
      request.input('brand', sql.Int, brand)
    }

    if (minPrice) {
      whereConditions.push('ctsp.gia_ban >= @minPrice')
      request.input('minPrice', sql.Decimal, minPrice)
    }

    if (maxPrice) {
      whereConditions.push('ctsp.gia_ban <= @maxPrice')
      request.input('maxPrice', sql.Decimal, maxPrice)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT 
        sp.id,
        sp.ma_san_pham,
        sp.ten_san_pham,
        nsx.ten_nha_san_xuat,
        xx.ten_xuat_xu,
        MIN(ctsp.gia_ban) as gia_min,
        MAX(ctsp.gia_ban) as gia_max,
        SUM(ctsp.so_luong) as tong_so_luong,
        sp.create_at,
        (SELECT TOP 1 asp.duong_dan_anh 
         FROM chi_tiet_san_pham_anh ctspa 
         JOIN anh_san_pham asp ON ctspa.id_anh_san_pham = asp.id 
         WHERE ctspa.id_chi_tiet_san_pham IN (
           SELECT id FROM chi_tiet_san_pham WHERE id_san_pham = sp.id AND deleted = 0
         ) AND asp.deleted = 0) as hinh_anh
      FROM san_pham sp
      LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
      LEFT JOIN xuat_xu xx ON sp.id_xuat_xu = xx.id
      LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham AND ctsp.deleted = 0
      WHERE ${whereClause}
      GROUP BY sp.id, sp.ma_san_pham, sp.ten_san_pham, nsx.ten_nha_san_xuat, xx.ten_xuat_xu, sp.create_at
      ORDER BY sp.create_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (search) countRequest.input('search', sql.NVarChar, `%${search}%`)
    if (category) countRequest.input('category', sql.Int, category)
    if (brand) countRequest.input('brand', sql.Int, brand)
    if (minPrice) countRequest.input('minPrice', sql.Decimal, minPrice)
    if (maxPrice) countRequest.input('maxPrice', sql.Decimal, maxPrice)

    const countQuery = `
      SELECT COUNT(DISTINCT sp.id) as total
      FROM san_pham sp
      LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham AND ctsp.deleted = 0
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
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const productQuery = `
      SELECT 
        sp.*,
        nsx.ten_nha_san_xuat,
        xx.ten_xuat_xu
      FROM san_pham sp
      LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
      LEFT JOIN xuat_xu xx ON sp.id_xuat_xu = xx.id
      WHERE sp.id = @id AND sp.deleted = 0
    `

    const productResult = await request.query(productQuery)

    if (productResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    const variantsQuery = `
      SELECT 
        ctsp.*,
        ms.ten_mau_sac,
        kt.ten_kich_thuoc,
        dg.ten_de_giay,
        cl.ten_chat_lieu,
        dem.ten_dem_giay,
        tl.ten_trong_luong,
        mtt.ten_mon_the_thao,
        lm.ten_loai_mua,
        db.ten_do_ben,
        cn.ten_chong_nuoc
      FROM chi_tiet_san_pham ctsp
      LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
      LEFT JOIN kich_thuoc kt ON ctsp.id_kich_thuoc = kt.id
      LEFT JOIN de_giay dg ON ctsp.id_de_giay = dg.id
      LEFT JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id
      LEFT JOIN dem_giay dem ON ctsp.id_dem_giay = dem.id
      LEFT JOIN trong_luong tl ON ctsp.id_trong_luong = tl.id
      LEFT JOIN mon_the_thao mtt ON ctsp.id_mon_the_thao = mtt.id
      LEFT JOIN loai_mua lm ON ctsp.id_loai_mua = lm.id
      LEFT JOIN do_ben db ON ctsp.id_do_ben = db.id
      LEFT JOIN chong_nuoc cn ON ctsp.id_chong_nuoc = cn.id
      WHERE ctsp.id_san_pham = @id AND ctsp.deleted = 0
    `

    const variantsResult = await request.query(variantsQuery)

    const imagesQuery = `
      SELECT 
        asp.id,
        asp.duong_dan_anh,
        asp.loai_anh,
        asp.mo_ta,
        ctsp.id as variant_id
      FROM chi_tiet_san_pham_anh ctspa
      JOIN anh_san_pham asp ON ctspa.id_anh_san_pham = asp.id
      JOIN chi_tiet_san_pham ctsp ON ctspa.id_chi_tiet_san_pham = ctsp.id
      WHERE ctsp.id_san_pham = @id AND asp.deleted = 0 AND ctsp.deleted = 0
    `

    const imagesResult = await request.query(imagesQuery)

    res.json({
      ...productResult.recordset[0],
      variants: variantsResult.recordset,
      images: imagesResult.recordset
    })

  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { 
      id_nha_san_xuat, 
      id_xuat_xu, 
      ten_san_pham, 
      create_by 
    } = req.body

    if (!id_nha_san_xuat || !id_xuat_xu || !ten_san_pham) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const request = pool.request()
    request.input('id_nha_san_xuat', sql.Int, id_nha_san_xuat)
    request.input('id_xuat_xu', sql.Int, id_xuat_xu)
    request.input('ten_san_pham', sql.NVarChar, ten_san_pham)
    request.input('create_by', sql.Int, create_by || null)
    request.input('create_at', sql.Date, new Date())

    const result = await request.query(`
      INSERT INTO san_pham 
      (id_nha_san_xuat, id_xuat_xu, ten_san_pham, create_by, create_at)
      OUTPUT INSERTED.id
      VALUES 
      (@id_nha_san_xuat, @id_xuat_xu, @ten_san_pham, @create_by, @create_at)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo sản phẩm thành công' 
    })

  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      id_nha_san_xuat, 
      id_xuat_xu, 
      ten_san_pham, 
      update_by 
    } = req.body

    const request = pool.request()
    request.input('id', sql.Int, id)
    request.input('id_nha_san_xuat', sql.Int, id_nha_san_xuat)
    request.input('id_xuat_xu', sql.Int, id_xuat_xu)
    request.input('ten_san_pham', sql.NVarChar, ten_san_pham)
    request.input('update_by', sql.Int, update_by || null)
    request.input('update_at', sql.Date, new Date())

    await request.query(`
      UPDATE san_pham 
      SET 
        id_nha_san_xuat = @id_nha_san_xuat,
        id_xuat_xu = @id_xuat_xu,
        ten_san_pham = @ten_san_pham,
        update_by = @update_by,
        update_at = @update_at
      WHERE id = @id AND deleted = 0
    `)

    res.json({ message: 'Cập nhật sản phẩm thành công' })

  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    await request.query(`
      UPDATE san_pham 
      SET deleted = 1 
      WHERE id = @id
    `)

    res.json({ message: 'Xóa sản phẩm thành công' })

  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/:id/variants', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id_san_pham', sql.Int, id)

    const query = `
      SELECT 
        ctsp.*,
        ms.ten_mau_sac,
        kt.ten_kich_thuoc,
        dg.ten_de_giay,
        cl.ten_chat_lieu,
        dem.ten_dem_giay,
        tl.ten_trong_luong,
        mtt.ten_mon_the_thao,
        lm.ten_loai_mua,
        db.ten_do_ben,
        cn.ten_chong_nuoc
      FROM chi_tiet_san_pham ctsp
      LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
      LEFT JOIN kich_thuoc kt ON ctsp.id_kich_thuoc = kt.id
      LEFT JOIN de_giay dg ON ctsp.id_de_giay = dg.id
      LEFT JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id
      LEFT JOIN dem_giay dem ON ctsp.id_dem_giay = dem.id
      LEFT JOIN trong_luong tl ON ctsp.id_trong_luong = tl.id
      LEFT JOIN mon_the_thao mtt ON ctsp.id_mon_the_thao = mtt.id
      LEFT JOIN loai_mua lm ON ctsp.id_loai_mua = lm.id
      LEFT JOIN do_ben db ON ctsp.id_do_ben = db.id
      LEFT JOIN chong_nuoc cn ON ctsp.id_chong_nuoc = cn.id
      WHERE ctsp.id_san_pham = @id_san_pham AND ctsp.deleted = 0
    `

    const result = await request.query(query)
    res.json(result.recordset)

  } catch (error) {
    console.error('Get product variants error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/:id/variants', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      id_mau_sac,
      id_kich_thuoc,
      id_de_giay,
      id_chat_lieu,
      id_dem_giay,
      id_trong_luong,
      id_mon_the_thao,
      id_loai_mua,
      id_do_ben,
      id_chong_nuoc,
      so_luong,
      gia_ban,
      ghi_chu,
      create_by
    } = req.body

    const request = pool.request()
    request.input('id_san_pham', sql.Int, id)
    request.input('id_mau_sac', sql.Int, id_mau_sac)
    request.input('id_kich_thuoc', sql.Int, id_kich_thuoc)
    request.input('id_de_giay', sql.Int, id_de_giay)
    request.input('id_chat_lieu', sql.Int, id_chat_lieu)
    request.input('id_dem_giay', sql.Int, id_dem_giay)
    request.input('id_trong_luong', sql.Int, id_trong_luong)
    request.input('id_mon_the_thao', sql.Int, id_mon_the_thao)
    request.input('id_loai_mua', sql.Int, id_loai_mua)
    request.input('id_do_ben', sql.Int, id_do_ben)
    request.input('id_chong_nuoc', sql.Int, id_chong_nuoc)
    request.input('so_luong', sql.Int, so_luong || 0)
    request.input('gia_ban', sql.Decimal, gia_ban)
    request.input('ghi_chu', sql.NVarChar, ghi_chu || null)
    request.input('create_by', sql.Int, create_by || null)
    request.input('create_at', sql.Date, new Date())

    const result = await request.query(`
      INSERT INTO chi_tiet_san_pham 
      (id_san_pham, id_mau_sac, id_kich_thuoc, id_de_giay, id_chat_lieu, 
       id_dem_giay, id_trong_luong, id_mon_the_thao, id_loai_mua, id_do_ben, 
       id_chong_nuoc, so_luong, gia_ban, ghi_chu, create_by, create_at)
      OUTPUT INSERTED.id
      VALUES 
      (@id_san_pham, @id_mau_sac, @id_kich_thuoc, @id_de_giay, @id_chat_lieu,
       @id_dem_giay, @id_trong_luong, @id_mon_the_thao, @id_loai_mua, @id_do_ben,
       @id_chong_nuoc, @so_luong, @gia_ban, @ghi_chu, @create_by, @create_at)
    `)

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Tạo biến thể sản phẩm thành công' 
    })

  } catch (error) {
    console.error('Create product variant error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
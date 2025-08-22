const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sql = require('mssql')
const { pool } = require('../server')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'uploads'
    const uploadPath = path.join('public', folder)
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Chỉ cho phép tải lên file ảnh (jpeg, jpg, png, gif, webp)'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được tải lên' })
    }

    const folder = req.body.folder || 'uploads'
    const filePath = `/${folder}/${req.file.filename}`
    const mo_ta = req.body.mo_ta || req.file.originalname

    const request = pool.request()
    request.input('duong_dan_anh', sql.VarChar, filePath)
    request.input('loai_anh', sql.VarChar, 'Main')
    request.input('mo_ta', sql.NVarChar, mo_ta)

    const result = await request.query(`
      INSERT INTO anh_san_pham (duong_dan_anh, loai_anh, mo_ta)
      OUTPUT INSERTED.id
      VALUES (@duong_dan_anh, @loai_anh, @mo_ta)
    `)

    res.json({
      id: result.recordset[0].id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: filePath,
      url: `${req.protocol}://${req.get('host')}${filePath}`
    })

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    console.error('Upload single file error:', error)
    res.status(500).json({ message: error.message || 'Lỗi server' })
  }
})

router.post('/multiple', upload.array('files', 10), async (req, res) => {
  const uploadedFiles = []
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Không có file được tải lên' })
    }

    const folder = req.body.folder || 'uploads'

    for (const file of req.files) {
      const filePath = `/${folder}/${file.filename}`
      const mo_ta = req.body.mo_ta || file.originalname

      const request = pool.request()
      request.input('duong_dan_anh', sql.VarChar, filePath)
      request.input('loai_anh', sql.VarChar, 'Main')
      request.input('mo_ta', sql.NVarChar, mo_ta)

      const result = await request.query(`
        INSERT INTO anh_san_pham (duong_dan_anh, loai_anh, mo_ta)
        OUTPUT INSERTED.id
        VALUES (@duong_dan_anh, @loai_anh, @mo_ta)
      `)

      uploadedFiles.push({
        id: result.recordset[0].id,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`
      })
    }

    res.json({
      files: uploadedFiles,
      count: uploadedFiles.length
    })

  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      })
    }
    console.error('Upload multiple files error:', error)
    res.status(500).json({ message: error.message || 'Lỗi server' })
  }
})

router.delete('/image/:id', async (req, res) => {
  try {
    const { id } = req.params
    const request = pool.request()
    request.input('id', sql.Int, id)

    const imageResult = await request.query(`
      SELECT duong_dan_anh FROM anh_san_pham 
      WHERE id = @id AND deleted = 0
    `)

    if (imageResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Ảnh không tồn tại' })
    }

    const imagePath = imageResult.recordset[0].duong_dan_anh
    const fullPath = path.join('public', imagePath)

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }

    await request.query(`
      UPDATE anh_san_pham 
      SET deleted = 1 
      WHERE id = @id
    `)

    res.json({ message: 'Xóa ảnh thành công' })

  } catch (error) {
    console.error('Delete image error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/images', async (req, res) => {
  try {
    const { page = 1, limit = 20, folder } = req.query
    const offset = (page - 1) * limit

    let whereConditions = ['deleted = 0']
    const request = pool.request()

    if (folder) {
      whereConditions.push('duong_dan_anh LIKE @folder')
      request.input('folder', sql.VarChar, `/${folder}/%`)
    }

    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, parseInt(limit))

    const whereClause = whereConditions.join(' AND ')

    const query = `
      SELECT * FROM anh_san_pham 
      WHERE ${whereClause}
      ORDER BY id DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `

    const result = await request.query(query)

    const countRequest = pool.request()
    if (folder) countRequest.input('folder', sql.VarChar, `/${folder}/%`)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM anh_san_pham 
      WHERE ${whereClause}
    `

    const countResult = await countRequest.query(countQuery)
    const total = countResult.recordset[0].total

    res.json({
      data: result.recordset.map(image => ({
        ...image,
        url: `${req.protocol}://${req.get('host')}${image.duong_dan_anh}`
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get images error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/product/:productId/variant/:variantId', upload.array('images', 5), async (req, res) => {
  const transaction = new sql.Transaction(pool)
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Không có file được tải lên' })
    }

    await transaction.begin()

    const { productId, variantId } = req.params
    const folder = 'products'
    const uploadedImages = []

    for (const file of req.files) {
      const filePath = `/${folder}/${file.filename}`
      
      const imageRequest = new sql.Request(transaction)
      imageRequest.input('duong_dan_anh', sql.VarChar, filePath)
      imageRequest.input('loai_anh', sql.VarChar, 'Product')
      imageRequest.input('mo_ta', sql.NVarChar, file.originalname)

      const imageResult = await imageRequest.query(`
        INSERT INTO anh_san_pham (duong_dan_anh, loai_anh, mo_ta)
        OUTPUT INSERTED.id
        VALUES (@duong_dan_anh, @loai_anh, @mo_ta)
      `)

      const imageId = imageResult.recordset[0].id

      const linkRequest = new sql.Request(transaction)
      linkRequest.input('id_chi_tiet_san_pham', sql.Int, variantId)
      linkRequest.input('id_anh_san_pham', sql.Int, imageId)

      await linkRequest.query(`
        INSERT INTO chi_tiet_san_pham_anh (id_chi_tiet_san_pham, id_anh_san_pham)
        VALUES (@id_chi_tiet_san_pham, @id_anh_san_pham)
      `)

      uploadedImages.push({
        id: imageId,
        filename: file.filename,
        originalname: file.originalname,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`
      })
    }

    await transaction.commit()

    res.json({
      productId: parseInt(productId),
      variantId: parseInt(variantId),
      images: uploadedImages,
      count: uploadedImages.length
    })

  } catch (error) {
    await transaction.rollback()
    
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      })
    }
    
    console.error('Upload product images error:', error)
    res.status(500).json({ message: error.message || 'Lỗi server' })
  }
})

module.exports = router
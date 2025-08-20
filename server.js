const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const sql = require('mssql')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'GearUp',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

let pool

const connectDB = async () => {
  try {
    pool = await sql.connect(config)
    console.log('Connected to SQL Server')
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}

connectDB()

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const brandRoutes = require('./routes/brands')
const customerRoutes = require('./routes/customers')
const employeeRoutes = require('./routes/employees')
const orderRoutes = require('./routes/orders')
const couponRoutes = require('./routes/coupons')
const uploadRoutes = require('./routes/upload')

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GearUp API is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = { pool }
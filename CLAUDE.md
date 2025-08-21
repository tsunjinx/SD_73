# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
DATN GearUp Ver2 is a full-stack e-commerce management system for a sporting goods store. It consists of a Vue.js 3 frontend with a Node.js/Express backend using SQL Server as the database.

## Development Commands

### Frontend (Vue.js + Vite)
- `npm run dev` - Start development server (frontend only)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (Node.js + Express)
- `npm run server` - Start production server
- `npm run dev:server` - Start development server with nodemon

### Full Development
Run both frontend and backend simultaneously:
1. Terminal 1: `npm run dev` (frontend)
2. Terminal 2: `npm run dev:server` (backend)

## Architecture

### Backend Structure
- **server.js**: Main Express server with SQL Server connection
- **routes/**: API route handlers organized by feature
  - auth.js, products.js, categories.js, brands.js, customers.js, employees.js, orders.js, coupons.js, upload.js
- **Database**: SQL Server with Vietnamese field names (nguoi_dung, san_pham, hoa_don, etc.)
- **Authentication**: JWT tokens with bcrypt password hashing

### Frontend Structure
- **Vue 3 + Composition API**: Modern Vue.js setup
- **Vue Router**: Client-side routing with history mode
- **Axios**: HTTP client with interceptors for auth tokens
- **Services Layer**: Organized API calls in src/services/
  - api.js (base configuration), authStore.js, productService.js, etc.
- **Pages**: Organized by functionality in src/pages/
  - management/ (CRUD operations)
  - products/ (product attributes)
  - sales/ (POS system)

### Database Schema
Vietnamese naming convention:
- nguoi_dung (users), nhan_vien (employees), khach_hang (customers)
- san_pham (products), danh_muc (categories), thuong_hieu (brands)
- hoa_don (orders), gio_hang (cart), thanh_toan (payments)

### API Configuration
- Default backend URL: `http://localhost:8080/api` (configurable via VITE_API_BASE_URL)
- Authentication: Bearer token in Authorization header
- Error handling: Automatic token refresh and redirect to login on 401

### Key Features
- Multi-role authentication (admin, staff, customer)
- Product management with variants, colors, sizes
- Order processing and POS system
- Inventory management
- Customer engagement (cart, favorites, reviews)
- Discount campaigns and coupons
- Analytics and activity logging

## File Upload
Uses multer for file handling with support for single/multiple file uploads to organized folders.

## State Management
Uses Vue 3 Composition API with reactive stores in services/ directory rather than Vuex/Pinia.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
DATN GearUp Ver2 is a full-stack e-commerce management system for a sporting goods store. It consists of a Vue.js 3 frontend with a Spring Boot backend using SQL Server as the database.

## Development Commands

### Frontend (Vue.js + Vite)
- `npm run dev` - Start development server (frontend only) (No need to run the project because when working with the project the user is already run it)
- `npm run build` - Build for production
- `npm run preview` - Preview production build


### Backend (Spring Boot + Maven)
The backend is located in a separate project at `/Users/s0icodocslashdot/code/BE_SP/`
- `./mvnw spring-boot:run` - Start Spring Boot application (No need to run)
- `./mvnw clean install` - Build the project


### Full Development
Run both frontend and backend simultaneously:
1. Terminal 1: `npm run dev` (frontend in DATN_GearUp_Ver2)
2. Terminal 2: `./mvnw spring-boot:run` (backend in BE_SP)

## Architecture

### Backend Structure (Spring Boot - BE_SP)
- **Spring Boot 3**: RESTful API with JPA/Hibernate
- **SQL Server Database**: Vietnamese field names (phieu_giam_gia, dot_giam_gia, san_pham, etc.)
- **Controllers**: API endpoints organized by feature
  - PhieuGiamGiaController, DotGiamGiaController, SanPhamController, etc.
- **Services**: Business logic layer
- **Repositories**: JPA repositories for data access
- **Entities**: JPA entities matching database schema
- **DTOs**: Request/Response models for API communication

### Frontend Structure (Vue.js 3)
- **Vue 3 + Composition API**: Modern Vue.js setup
- **Vue Router**: Client-side routing with history mode
- **Axios**: HTTP client with interceptors for auth tokens
- **Services Layer**: Organized API calls in src/services/
  - api.js (base configuration), dichVuPhieuGiamGia.js, dichVuDotGiamGia.js, etc.
- **Pages**: Organized by functionality in src/pages/
  - management/ (CRUD operations - PhieuGiamGia.vue, CampainGiamGia.vue, etc.)
  - products/ (product attributes)
  - sales/ (POS system)

### Database Schema (SQL Server - GearUp database)
Vietnamese naming convention:
- **Discount/Coupon Tables**: phieu_giam_gia, dot_giam_gia, chi_tiet_dot_giam_gia
- **Product Tables**: san_pham, chi_tiet_san_pham, mau_sac, kich_thuoc, chat_lieu
- **User Tables**: khach_hang, nhan_vien, dia_chi_khach_hang
- **Order Tables**: hoa_don, hoa_don_chi_tiet, thong_tin_don_hang

### API Configuration
- **Backend URL**: `http://localhost:8080/api` (configurable via VITE_API_BASE_URL)
- **Authentication**: Bearer token in Authorization header
- **Error handling**: Automatic token refresh and redirect to login on 401
- **Response Format**: Spring Boot ResponseObject wrapper with data/message structure

### Key API Endpoints
- **Coupons**: `/api/phieu-giam-gia-management/*`
- **Discount Campaigns**: `/api/dot-giam-gia-management/*`
- **Products**: `/api/san-pham-management/*`
- **Customers**: `/api/khach-hang-management/*`

### Key Features
- Multi-role authentication (admin, staff, customer)
- Product management with variants, colors, sizes
- Order processing and POS system
- Inventory management
- Customer engagement (cart, favorites, reviews)
- **Discount Management**:
  - Phiếu giảm giá (Coupon vouchers) - individual discount codes
  - Đợt giảm giá (Discount campaigns) - bulk discount periods
- Analytics and activity logging

## Data Flow
1. **Frontend** (Vue.js) makes HTTP requests via service layer
2. **API Services** (dichVuPhieuGiamGia.js, etc.) transform data between frontend/backend formats
3. **Backend Controllers** receive requests and delegate to services
4. **Backend Services** implement business logic
5. **Repositories** handle database operations via JPA
6. **SQL Server Database** stores data with Vietnamese field names

## File Structure
```
DATN_GearUp_Ver2/           # Frontend (Vue.js)
├── src/
│   ├── pages/management/   # Management pages
│   ├── services/          # API services
│   └── ...
└── ...

BE_SP/                     # Backend (Spring Boot)
├── src/main/java/org/example/be_sp/
│   ├── controller/        # REST controllers
│   ├── service/          # Business services
│   ├── repository/       # Data repositories
│   ├── entity/           # JPA entities
│   └── model/            # DTOs (request/response)
└── ...
```

## State Management
Uses Vue 3 Composition API with reactive stores in services/ directory rather than Vuex/Pinia.

## Development Notes
- Backend uses Vietnamese database field names but exposes camelCase DTOs
- Frontend services handle data transformation between formats
- All CRUD operations follow REST conventions
- Error handling implemented at both frontend and backend levels

## User Customization
After done the job, create a markdown summary file so when the next session comes the other agents can rely on it to know whats the changes before
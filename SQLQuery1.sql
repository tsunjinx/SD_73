create database GearUp
go
use GearUp
go
create table xuat_xu(
	id int identity(1,1) primary key,
	ma_xuat_xu AS 'XX' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_xuat_xu nvarchar(255),
	deleted bit default 0,
)
go
create table nha_san_xuat(
	id int identity(1,1) primary key,
	ma_nha_san_xuat AS 'NSX' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_nha_san_xuat nvarchar(255),
	deleted bit default 0,
)
go
create table san_pham(
	id int identity(1,1) primary key,
	id_nha_san_xuat int not null,
	id_xuat_xu int not null,
	ma_san_pham AS 'SP' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_san_pham nvarchar(255),
	deleted bit default 0,
	create_at date null,
	create_by int null,
	update_at date null,
	update_by int null,
	foreign key(id_nha_san_xuat) references nha_san_xuat(id),
	foreign key(id_xuat_xu) references xuat_xu(id)
)
go
create table anh_san_pham(
	id int identity(1,1) primary key,
	duong_dan_anh varchar(255),
	loai_anh varchar(10),
	mo_ta nvarchar(255),
	deleted bit default 0,
)
go
create table mau_sac(
	id int identity(1,1) primary key,
	ma_mau_sac AS 'MS' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_mau_sac nvarchar(255),
	deleted bit default 0,
)
go
create table kich_thuoc(
	id int identity(1,1) primary key,
	ma_kich_thuoc AS 'KT' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_kich_thuoc nvarchar(255),
	deleted bit default 0,
)
go
create table de_giay(
	id int identity(1,1) primary key,
	ma_de_giay AS 'DG' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_de_giay nvarchar(255),
	deleted bit default 0,
)
go
create table chat_lieu(
	id int identity(1,1) primary key,
	ma_chat_lieu AS 'CL' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_chat_lieu nvarchar(255),
	deleted bit default 0,
)
go
create table dem_giay(
	id int identity(1,1) primary key,
	ma_dem_giay AS 'ĐG' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_dem_giay nvarchar(255),
	deleted bit default 0,
)
go
create table trong_luong(
	id int identity(1,1) primary key,
	ma_trong_luong AS 'TL' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_trong_luong nvarchar(255),
	deleted bit default 0,
)
go
create table mon_the_thao(
	id int identity(1,1) primary key,
	ma_mon_the_thao AS 'MTT' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_mon_the_thao nvarchar(255),
	deleted bit default 0,
)
go
create table loai_mua(
	id int identity(1,1) primary key,
	ma_loai_mua AS 'LM' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_loai_mua nvarchar(255),
	deleted bit default 0,
)
go
create table do_ben(
	id int identity(1,1) primary key,
	ma_do_ben AS 'DB' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_do_ben nvarchar(255),
	deleted bit default 0,
)
go
create table chong_nuoc(
	id int identity(1,1) primary key,
	ma_chong_nuoc AS 'CN' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_chong_nuoc nvarchar(255),
	deleted bit default 0,
)
go
create table dot_giam_gia(
	id int identity(1,1) primary key,
	ma_dot_giam_gia AS 'DGG' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_dot_giam_gia nvarchar(255),
	gia_tri_giam_gia int CHECK (gia_tri_giam_gia >= 0),
	ngay_bat_dau date,
	ngay_ket_thuc date,
	trang_thai bit default 1,
	deleted bit default 0,
	CHECK (ngay_ket_thuc > ngay_bat_dau)
)
go
create table chi_tiet_san_pham(
	id int identity(1,1) primary key,
	id_san_pham int not null,
	id_mau_sac int not null,
	id_kich_thuoc int not null,
	id_de_giay int not null,
	id_chat_lieu int not null,
	id_dem_giay int not null,
	id_trong_luong int not null,
	id_mon_the_thao int not null,
	id_loai_mua int not null,
	id_do_ben int not null,
	id_chong_nuoc int not null,
	so_luong int default 0 CHECK (so_luong >= 0),
	gia_ban decimal(18,2) CHECK (gia_ban >= 0),
	trang_thai bit default 1,
	ghi_chu nvarchar(255),
	deleted bit default 0,
	create_at date null,
	create_by int null,
	update_at date null,
	update_by int null,
	foreign key(id_san_pham) references san_pham(id),
	foreign key(id_mau_sac) references mau_sac(id),
	foreign key(id_kich_thuoc) references kich_thuoc(id),
	foreign key(id_de_giay) references de_giay(id),
	foreign key(id_chat_lieu) references chat_lieu(id),
	foreign key(id_dem_giay) references dem_giay(id),
	foreign key(id_trong_luong) references trong_luong(id),
	foreign key(id_mon_the_thao) references mon_the_thao(id),
	foreign key(id_loai_mua) references loai_mua(id),
	foreign key(id_do_ben) references do_ben(id),
	foreign key(id_chong_nuoc) references chong_nuoc(id)
)
go
create table chi_tiet_san_pham_anh(
	id int identity(1,1) primary key,
	id_chi_tiet_san_pham int not null,
	id_anh_san_pham int not null,
	deleted bit default 0,
	foreign key(id_chi_tiet_san_pham) references chi_tiet_san_pham(id),
	foreign key(id_anh_san_pham) references anh_san_pham(id)
)
go
create table chi_tiet_dot_giam_gia(
	id int identity(1,1) primary key,
	id_dot_giam_gia int not null,
	id_chi_tiet_san_pham int not null,
	deleted bit default 0,
	foreign key(id_dot_giam_gia) references dot_giam_gia(id),
	foreign key(id_chi_tiet_san_pham) references chi_tiet_san_pham(id)
)
go
create table quyen_han(
	id int identity(1,1) primary key,
	ma_quyen_han AS 'QH' + RIGHT('0' + CAST(ID AS VARCHAR(1)), 1) PERSISTED,
	ten_quyen_han nvarchar(255),
	deleted bit default 0,
)
go
create table nhan_vien(
	id int identity(1,1) primary key,
	id_quyen_han int not null,
	ma_nhan_vien AS 'NV' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_nhan_vien nvarchar(255),
	ten_tai_khoan varchar(255) unique,
	mat_khau varchar(255),
	email varchar(255) unique,
	so_dien_thoai varchar(12),
	anh_nha_vien varchar(255),
	ngay_sinh date,
	ghi_chu nvarchar(255),
	thanh_pho nvarchar(255),
	quan nvarchar(255),
	phuong varchar(255),
	dia_chi_cu_the varchar(255),
	cccd varchar(20),
	trang_thai bit default 1,
	deleted bit default 0,
	create_at date null,
	create_by int null,
	update_at date null,
	update_by int null,
	foreign key(id_quyen_han) references quyen_han(id)
)
go
create table khach_hang(
	id int identity(1,1) primary key,
	ma_khach_hang AS 'KH' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_khach_hang nvarchar(255),
	ten_tai_khoan varchar(255) unique,
	mat_khau varchar(255),
	email varchar(255) unique,
	so_dien_thoai varchar(12),
	gioi_tinh bit, -- 0: Nữ, 1: Nam
	ngay_sinh date,
	deleted bit default 0,
	create_at date null,
	create_by int null,
	update_at date null,
	update_by int null
)
go
create table dia_chi_khach_hang(
	id int identity(1,1) primary key,
	id_khach_hang int not null,
	ma_dia_chi AS 'DC' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_dia_chi nvarchar(255),
	thanh_pho nvarchar(255),
	quan nvarchar(255),
	phuong varchar(255),
	dia_chi_cu_the varchar(255),
	deleted bit default 0,
	foreign key(id_khach_hang) references khach_hang(id)
)
go
create table phieu_giam_gia(
	id int identity(1,1) primary key,
	ma_phieu_giam_gia AS 'PGG' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_phieu_giam_gia nvarchar(255),
	loai_phieu_giam_gia bit default 0, -- 0: Giảm giá theo phần trăm, 1: Giảm giá theo số tiền
	gia_tri_giam_gia decimal(18,2) CHECK (gia_tri_giam_gia >= 0),
	so_tien_toi_da decimal(18,2) CHECK (so_tien_toi_da >= 0),
	hoa_don_toi_thieu decimal(18,2) CHECK (hoa_don_toi_thieu >= 0),
	so_luong_dung int CHECK (so_luong_dung >= 0),
	ngay_bat_dau date,
	ngay_ket_thuc date,
	trang_thai bit default 1,
	mo_ta nvarchar(255),
	deleted bit default 0,
	CHECK (ngay_ket_thuc > ngay_bat_dau)
)
go
create table phieu_giam_gia_ca_nhan(
	id int identity(1,1) primary key,
	id_khach_hang int not null,
	id_phieu_giam_gia int not null,
	ma_phieu_giam_gia_ca_nhan AS 'PGGCN' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_phieu_giam_gia_ca_nhan nvarchar(255),
	ngay_nhan date,
	ngay_het_han date,
	trang_thai bit default 1,
	deleted bit default 0,
	foreign key(id_khach_hang) references khach_hang(id),
	foreign key(id_phieu_giam_gia) references phieu_giam_gia(id),
	CHECK (ngay_het_han > ngay_nhan)
)
go
create table hoa_don(
	id int identity(1,1) primary key,
	id_khach_hang int not null,
	id_phieu_giam_gia int null,
	id_nhan_vien int null,
	ma_hoa_don AS 'HD' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_hoa_don nvarchar(255),
	loai_don bit default 0, -- 0: Đơn hàng trực tuyến, 1: Đơn hàng tại cửa hàng
	phi_van_chuyen decimal(18,2) CHECK (phi_van_chuyen >= 0),
	tong_tien decimal(18,2) CHECK (tong_tien >= 0),
	tong_tien_sau_giam decimal(18,2) CHECK (tong_tien_sau_giam >= 0),
	ghi_chu nvarchar(255),
	ten_khach_hang nvarchar(255),
	dia_chi_khach_hang nvarchar(255),
	so_dien_thoai_khach_hang varchar(12),
	email_khach_hang varchar(255),
	ngay_tao date,
	ngay_thanh_toan date,
	trang_thai bit default 1,
	deleted bit default 0,
	create_at date null,
	create_by int null,
	update_at date null,
	update_by int null,
	foreign key(id_khach_hang) references khach_hang(id),
	foreign key(id_phieu_giam_gia) references phieu_giam_gia(id),
	foreign key(id_nhan_vien) references nhan_vien(id),
	CHECK (ngay_thanh_toan >= ngay_tao),
	CHECK (tong_tien_sau_giam <= tong_tien)
)
go
create table hoa_don_chi_tiet(
	id int identity(1,1) primary key,
	id_hoa_don int not null,
	id_chi_tiet_san_pham int not null,
	ma_hoa_don_chi_tiet AS 'HDCT' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	so_luong int default 0 CHECK (so_luong >= 0),
	gia_ban decimal(18,2) CHECK (gia_ban >= 0),
	thanh_tien decimal(18,2) CHECK (thanh_tien >= 0),
	trang_thai bit default 1,
	ghi_chu nvarchar(255),
	deleted bit default 0,
	foreign key(id_hoa_don) references hoa_don(id),
	foreign key(id_chi_tiet_san_pham) references chi_tiet_san_pham(id)
)
go
create table phuong_thuc_thanh_toan(
	id int identity(1,1) primary key,
	ma_phuong_thuc_thanh_toan AS 'PTTT' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_phuong_thuc_thanh_toan nvarchar(255),
	trang_thai bit default 1,
	deleted bit default 0
)
go
create table hinh_thuc_thanh_toan(
	id int identity(1,1) primary key,
	id_hoa_don int not null,
	id_phuong_thuc_thanh_toan int not null,
	ma_hinh_thuc_thanh_toan AS 'HTTT' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	tien_chuyen_khoan decimal(18,2) CHECK (tien_chuyen_khoan >= 0),
	tien_mat decimal(18,2) CHECK (tien_mat >= 0),
	deleted bit default 0,
	foreign key(id_hoa_don) references hoa_don(id),
	foreign key(id_phuong_thuc_thanh_toan) references phuong_thuc_thanh_toan(id)
)
go
create table trang_thai_don_hang(
	id int identity(1,1) primary key,
	ma_trang_thai_don_hang AS 'TTDH' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	ten_trang_thai_don_hang nvarchar(255),
	deleted bit default 0
)
go
create table thong_tin_don_hang(
	id int identity(1,1) primary key,
	id_hoa_don int not null,
	id_trang_thai_don_hang int not null,
	ma_thong_tin_don_hang AS 'TTDH' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED,
	thoi_gian datetime,
	ghi_chu nvarchar(255),
	deleted bit default 0,
	foreign key(id_hoa_don) references hoa_don(id),
	foreign key(id_trang_thai_don_hang) references trang_thai_don_hang(id)
)
go
INSERT INTO xuat_xu (ten_xuat_xu, deleted) VALUES
(N'Việt Nam', 0),
(N'Trung Quốc', 0),
(N'Nhật Bản', 0),
(N'Mỹ', 0),
(N'Đức', 0),
(N'Hàn Quốc', 0),
(N'Ý', 0),
(N'Thái Lan', 0),
(N'Pháp', 0),
(N'Indonesia', 0);
go

INSERT INTO nha_san_xuat (ten_nha_san_xuat, deleted) VALUES
(N'Nike', 0),
(N'Adidas', 0),
(N'Puma', 0),
(N'New Balance', 0),
(N'Asics', 0),
(N'Reebok', 0),
(N'Under Armour', 0),
(N'Mizuno', 0),
(N'Salomon', 0),
(N'Anta', 0);
go

INSERT INTO san_pham (id_nha_san_xuat, id_xuat_xu, ten_san_pham, deleted, create_at, create_by, update_at, update_by) VALUES
(1, 1, N'Giày Nike Air Max', 0, '2025-01-01', NULL, '2025-01-01', NULL),
(2, 2, N'Giày Adidas Ultraboost', 0, '2025-01-02', NULL, '2025-01-02', NULL),
(3, 3, N'Giày Puma RS-X', 0, '2025-01-03', NULL, '2025-01-03', NULL),
(4, 4, N'Giày New Balance 990', 0, '2025-01-04', NULL, '2025-01-04', NULL),
(5, 5, N'Giày Asics Gel-Kayano', 0, '2025-01-05', NULL, '2025-01-05', NULL),
(6, 6, N'Giày Reebok Classic', 0, '2025-01-06', NULL, '2025-01-06', NULL),
(7, 7, N'Giày Under Armour HOVR', 0, '2025-01-07', NULL, '2025-01-07', NULL),
(8, 8, N'Giày Mizuno Wave', 0, '2025-01-08', NULL, '2025-01-08', NULL),
(9, 9, N'Giày Salomon Trail', 0, '2025-01-09', NULL, '2025-01-09', NULL),
(10, 10, N'Giày Anta Running', 0, '2025-01-10', NULL, '2025-01-10', NULL);
go

INSERT INTO anh_san_pham (duong_dan_anh, loai_anh, mo_ta, deleted) VALUES
('/images/nike_air_max.jpg', 'Main', N'Ảnh chính Nike', 0),
('/images/adidas_ub.jpg', 'Main', N'Ảnh chính Adidas', 0),
('/images/puma_rsx.jpg', 'Main', N'Ảnh chính Puma', 0),
('/images/nb_990.jpg', 'Main', N'Ảnh chính New Balance', 0),
('/images/asics_gel.jpg', 'Main', N'Ảnh chính Asics', 0),
('/images/reebok_cl.jpg', 'Main', N'Ảnh chính Reebok', 0),
('/images/ua_hovr.jpg', 'Main', N'Ảnh chính Under Armour', 0),
('/images/mizuno_wave.jpg', 'Main', N'Ảnh chính Mizuno', 0),
('/images/salomon_tr.jpg', 'Main', N'Ảnh chính Salomon', 0),
('/images/anta_run.jpg', 'Main', N'Ảnh chính Anta', 0);
go

INSERT INTO mau_sac (ten_mau_sac, deleted) VALUES
(N'Đen', 0),
(N'Trắng', 0),
(N'Đỏ', 0),
(N'Xanh dương', 0),
(N'Vàng', 0),
(N'Xám', 0),
(N'Hồng', 0),
(N'Xanh lá', 0),
(N'Cam', 0),
(N'Tím', 0);
go

INSERT INTO kich_thuoc (ten_kich_thuoc, deleted) VALUES
(N'36', 0),
(N'37', 0),
(N'38', 0),
(N'39', 0),
(N'40', 0),
(N'41', 0),
(N'42', 0),
(N'43', 0),
(N'44', 0),
(N'45', 0);
go

INSERT INTO de_giay (ten_de_giay, deleted) VALUES
(N'Cao su', 0),
(N'EVA', 0),
(N'PU', 0),
(N'TPU', 0),
(N'Phylon', 0),
(N'Cao su tổng hợp', 0),
(N'EVA đúc', 0),
(N'Cao su tự nhiên', 0),
(N'Gel', 0),
(N'Foam', 0);
go

INSERT INTO chat_lieu (ten_chat_lieu, deleted) VALUES
(N'Da thật', 0),
(N'Vải lưới', 0),
(N'Da lộn', 0),
(N'Vải tổng hợp', 0),
(N'Da nhân tạo', 0),
(N'Vải canvas', 0),
(N'Cao su', 0),
(N'Nhựa', 0),
(N'Vải dệt', 0),
(N'Polyester', 0);
go

INSERT INTO dem_giay (ten_dem_giay, deleted) VALUES
(N'EVA', 0),
(N'Gel', 0),
(N'Memory Foam', 0),
(N'PU', 0),
(N'Ortholite', 0),
(N'Cao su', 0),
(N'Vải', 0),
(N'TPU', 0),
(N'Phylon', 0),
(N'Latex', 0);
go

INSERT INTO trong_luong (ten_trong_luong, deleted) VALUES
(N'200g', 0),
(N'250g', 0),
(N'300g', 0),
(N'350g', 0),
(N'400g', 0),
(N'450g', 0),
(N'500g', 0),
(N'550g', 0),
(N'600g', 0),
(N'650g', 0);
go

INSERT INTO mon_the_thao (ten_mon_the_thao, deleted) VALUES
(N'Chạy bộ', 0),
(N'Bóng đá', 0),
(N'Bóng rổ', 0),
(N'Cầu lông', 0),
(N'Tennis', 0),
(N'Đi bộ', 0),
(N'Tập gym', 0),
(N'Leo núi', 0),
(N'Bóng chuyền', 0),
(N'Yoga', 0);
go

INSERT INTO loai_mua (ten_loai_mua, deleted) VALUES
(N'Mùa xuân', 0),
(N'Mùa hạ', 0),
(N'Mùa thu', 0),
(N'Mùa đông', 0),
(N'Tất cả các mùa', 0),
(N'Mưa nhẹ', 0),
(N'Mưa lớn', 0),
(N'Khô ráo', 0),
(N'Nắng nóng', 0),
(N'Lạnh giá', 0);
go

INSERT INTO do_ben (ten_do_ben, deleted) VALUES
(N'Cao', 0),
(N'Trung bình', 0),
(N'Thấp', 0),
(N'Rất cao', 0),
(N'Bình thường', 0),
(N'Đặc biệt cao', 0),
(N'Trên trung bình', 0),
(N'Dưới trung bình', 0),
(N'Cực kỳ bền', 0),
(N'Tạm ổn', 0);
go

INSERT INTO chong_nuoc (ten_chong_nuoc, deleted) VALUES
(N'Không chống nước', 0),
(N'Chống nước nhẹ', 0),
(N'Chống nước tốt', 0),
(N'Chống nước hoàn toàn', 0),
(N'IPX4', 0),
(N'IPX5', 0),
(N'IPX6', 0),
(N'IPX7', 0),
(N'IPX8', 0),
(N'Chống thấm cơ bản', 0);
go

INSERT INTO dot_giam_gia (ten_dot_giam_gia, gia_tri_giam_gia, ngay_bat_dau, ngay_ket_thuc, trang_thai, deleted) VALUES
(N'Khuyến mãi Tết 2025', 20, '2025-01-15', '2025-02-15', 1, 0),
(N'Black Friday 2025', 30, '2025-11-25', '2025-11-30', 1, 0),
(N'Giảm giá hè 2025', 15, '2025-06-01', '2025-06-30', 1, 0),
(N'Sale 11/11', 25, '2025-11-01', '2025-11-11', 1, 0);
go
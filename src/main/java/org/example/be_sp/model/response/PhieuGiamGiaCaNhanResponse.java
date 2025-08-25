package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PhieuGiamGiaCaNhanResponse {
    
    private Integer id;
    private String maPhieuGiamGiaCaNhan;
    private String tenPhieuGiamGiaCaNhan;
    private LocalDate ngayNhan;
    private LocalDate ngayHetHan;
    private Boolean trangThai;
    
    // Customer information
    private Integer idKhachHang;
    private String maKhachHang;
    private String tenKhachHang;
    private String email;
    private String soDienThoai;
    
    // Voucher information
    private Integer idPhieuGiamGia;
    private String maPhieuGiamGia;
    private String tenPhieuGiamGia;
    private Boolean loaiPhieuGiamGia; // true = percentage, false = fixed amount
    private BigDecimal giaTriGiamGia;
    private BigDecimal soTienToiDa;
    private BigDecimal hoaDonToiThieu;
    private String moTa;
    private LocalDate ngayBatDauVoucher;
    private LocalDate ngayKetThucVoucher;
    
    // Status information
    private String trangThaiText;
    private Boolean isExpired;
    private Boolean isUsed;
}

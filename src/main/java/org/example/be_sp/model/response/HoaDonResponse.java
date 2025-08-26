package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.HoaDon;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonResponse {
    private Integer id;
    private String maKhachHang;
    private String tenKhachHang;
    private String email;
    private String soDienThoai;
    private String maPhieuGiamGia;
    private String tenPhieuGiamGia;
    private Boolean loaiPhieuGiamGia;
    private BigDecimal giaTriGiamGia;
    private BigDecimal soTienToiDa;
    private String tenNhanVien;
    private String tenHoaDon;
    private Boolean loaiDon;
    private BigDecimal phiVanChuyen;
    private BigDecimal tongTien;
    private BigDecimal tongTienSauGiam;
    private String ghiChu;
    private String tenNguoiNhan;
    private String diaChiNhanHang;
    private String soDienThoaiNguoiNhan;
    private String emailNguoiNhan;
    private LocalDate ngayTao;
    private LocalDate ngayThanhToan;
    private Boolean trangThai;
    private Boolean deleted;
    private LocalDate createAt;
    private Integer createBy;
    private LocalDate updateAt;
    private Integer updateBy;


    public HoaDonResponse(HoaDon hd) {
        this.id = hd.getId();
        this.maKhachHang = hd.getIdKhachHang().getMaKhachHang();
        this.tenKhachHang = hd.getIdKhachHang().getTenKhachHang();
        this.email = hd.getIdKhachHang().getEmail();
        this.soDienThoai = hd.getIdKhachHang().getSoDienThoai();
        this.maPhieuGiamGia = hd.getIdPhieuGiamGia().getMaPhieuGiamGia();
        this.tenPhieuGiamGia = hd.getIdPhieuGiamGia().getTenPhieuGiamGia();
        this.loaiPhieuGiamGia = hd.getIdPhieuGiamGia().getLoaiPhieuGiamGia();
        this.giaTriGiamGia = hd.getIdPhieuGiamGia().getGiaTriGiamGia();
        this.soTienToiDa = hd.getIdPhieuGiamGia().getSoTienToiDa();
        this.tenNhanVien = hd.getIdNhanVien().getTenNhanVien();
        this.tenHoaDon = hd.getTenHoaDon();
        this.loaiDon = hd.getLoaiDon();
        this.phiVanChuyen = hd.getPhiVanChuyen();
        this.tongTien = hd.getTongTien();
        this.tongTienSauGiam = hd.getTongTienSauGiam();
        this.ghiChu = hd.getGhiChu();
        this.tenNguoiNhan = hd.getTenNguoiNhan();
        this.diaChiNhanHang = hd.getDiaChiNguoiNhan();
        this.soDienThoaiNguoiNhan = hd.getSoDienThoaiNguoiNhan();
        this.emailNguoiNhan = hd.getEmailNguoiNhan();
        this.ngayTao = hd.getNgayTao();
        this.ngayThanhToan = hd.getNgayThanhToan();
        this.trangThai = hd.getTrangThai();
        this.deleted = hd.getDeleted();
        this.createAt = hd.getCreateAt();
        this.createBy = hd.getCreateBy();
        this.updateAt = hd.getUpdateAt();
        this.updateBy = hd.getUpdateBy();
    }
}

package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.HoaDonChiTiet;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class HoaDonChiTietResponse {
    private Integer id;

    private String idmaKhachHang;

    private String idtenKhachHang;

    private String idmaPhieuGiamGia;

    private String idtenPhieuGiamGia;

    private String idmaNhanVien;

    private String idtenNhanVien;

    private String maHoaDon;

    private String tenHoaDon;

    private Boolean loaiDon;

    private BigDecimal phiVanChuyen;

    private BigDecimal tongTien;

    private BigDecimal tongTienSauGiam;

    private String tenNguoiNhan;

    private String diaChiNguoiNhan;

    private String sdtNguoiNhan;

    private String emailNguoiNhan;

    private String maSanPham;

    private String tenSanPham;

    private String maMauSac;

    private String tenMauSac;

    private String maKichThuoc;

    private String tenKichThuoc;

    private String maDeGiay;

    private String tenDeGiay;

    private String maChatLieu;

    private String tenChatLieu;

    private String maDemGiay;

    private String tenDemGiay;

    private String maTrongLuong;

    private String tenTrongLuong;

    private String maMonTheThao;

    private String tenMonTheThao;

    private String maLoaiMua;

    private String tenLoaiMua;

    private String maDoBen;

    private String tenDoBen;

    private String maChongNuoc;

    private String tenChongNuoc;

    private Integer soLuong;

    private BigDecimal giaBan;

    private String maHoaDonChiTiet;

    private BigDecimal thanhTien;

    private Boolean trangThai;

    private String ghiChu;

    private Boolean deleted;

    public HoaDonChiTietResponse(HoaDonChiTiet d) {
        this.id = d.getId();
        this.idmaKhachHang = d.getIdHoaDon().getIdKhachHang().getMaKhachHang();
        this.idtenKhachHang = d.getIdHoaDon().getIdKhachHang().getTenKhachHang();
        this.idmaPhieuGiamGia = d.getIdHoaDon().getIdPhieuGiamGia().getMaPhieuGiamGia();
        this.idtenPhieuGiamGia = d.getIdHoaDon().getIdPhieuGiamGia().getTenPhieuGiamGia();
        this.idmaNhanVien = d.getIdHoaDon().getIdNhanVien().getMaNhanVien();
        this.idtenNhanVien = d.getIdHoaDon().getIdNhanVien().getTenNhanVien();
        this.maHoaDon = d.getIdHoaDon().getMaHoaDon();
        this.tenHoaDon = d.getIdHoaDon().getTenHoaDon();
        this.loaiDon = d.getIdHoaDon().getLoaiDon();
        this.phiVanChuyen = d.getIdHoaDon().getPhiVanChuyen();
        this.tongTien = d.getIdHoaDon().getTongTien();
        this.tongTienSauGiam = d.getIdHoaDon().getTongTienSauGiam();
        this.tenNguoiNhan = d.getIdHoaDon().getTenNguoiNhan();
        this.diaChiNguoiNhan = d.getIdHoaDon().getDiaChiNguoiNhan();
        this.sdtNguoiNhan = d.getIdHoaDon().getSoDienThoaiNguoiNhan();
        this.emailNguoiNhan = d.getIdHoaDon().getEmailNguoiNhan();
        this.maSanPham = d.getIdChiTietSanPham().getIdSanPham().getMaSanPham();
        this.tenSanPham = d.getIdChiTietSanPham().getIdSanPham().getTenSanPham();
        this.maMauSac = d.getIdChiTietSanPham().getIdMauSac().getMaMauSac();
        this.tenMauSac = d.getIdChiTietSanPham().getIdMauSac().getTenMauSac();
        this.maKichThuoc = d.getIdChiTietSanPham().getIdKichThuoc().getMaKichThuoc();
        this.tenKichThuoc = d.getIdChiTietSanPham().getIdKichThuoc().getTenKichThuoc();
        this.maDeGiay = d.getIdChiTietSanPham().getIdDeGiay().getMaDeGiay();
        this.tenDeGiay = d.getIdChiTietSanPham().getIdDeGiay().getTenDeGiay();
        this.maChatLieu = d.getIdChiTietSanPham().getIdChatLieu().getMaChatLieu();
        this.tenChatLieu = d.getIdChiTietSanPham().getIdChatLieu().getTenChatLieu();
        this.maDemGiay = d.getIdChiTietSanPham().getIdDemGiay().getMaDemGiay();
        this.tenDemGiay = d.getIdChiTietSanPham().getIdDemGiay().getTenDemGiay();
        this.maTrongLuong = d.getIdChiTietSanPham().getIdTrongLuong().getMaTrongLuong();
        this.tenTrongLuong = d.getIdChiTietSanPham().getIdTrongLuong().getTenTrongLuong();
        this.maMonTheThao = d.getIdChiTietSanPham().getIdMonTheThao().getMaMonTheThao();
        this.tenMonTheThao = d.getIdChiTietSanPham().getIdMonTheThao().getTenMonTheThao();
        this.maLoaiMua = d.getIdChiTietSanPham().getIdLoaiMua().getMaLoaiMua();
        this.tenLoaiMua = d.getIdChiTietSanPham().getIdLoaiMua().getTenLoaiMua();
        this.maDoBen = d.getIdChiTietSanPham().getIdDoBen().getMaDoBen();
        this.tenDoBen = d.getIdChiTietSanPham().getIdDoBen().getTenDoBen();
        this.maChongNuoc = d.getIdChiTietSanPham().getIdChongNuoc().getMaChongNuoc();
        this.tenChongNuoc = d.getIdChiTietSanPham().getIdChongNuoc().getTenChongNuoc();
        this.soLuong = d.getSoLuong();
        this.giaBan = d.getGiaBan();
        this.maHoaDonChiTiet = d.getMaHoaDonChiTiet();
        this.thanhTien = d.getThanhTien();
        this.trangThai = d.getTrangThai();
        this.ghiChu = d.getGhiChu();
        this.deleted = d.getDeleted();
    }
}

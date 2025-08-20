package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.ChiTietSanPham;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamResponse {
    Integer id;
    String maSanPham;
    String tenSanPham;
    String tenNhaSanXuat;
    String tenXuatXu;
    String tenMauSac;
    String tenKichThuoc;
    String tenDeGiay;
    String tenChatLieu;
    String tenDemGiay;
    String tenTrongLuong;
    String tenMonTheThao;
    String tenLoaiMua;
    String tenDoBen;
    String tenChongNuoc;
    Integer soLuong;
    BigDecimal giaBan;
    Boolean trangThai;
    String ghiChu;
    Boolean deleted;
    LocalDate createAt;
    Integer createBy;
    LocalDate updateAt;
    Integer updateBy;

    public ChiTietSanPhamResponse(ChiTietSanPham s) {
        this.id = s.getId();
        this.maSanPham = s.getIdSanPham().getMaSanPham();
        this.tenSanPham = s.getIdSanPham().getTenSanPham();
        this.tenNhaSanXuat = s.getIdSanPham().getIdNhaSanXuat().getTenNhaSanXuat();
        this.tenXuatXu = s.getIdSanPham().getIdXuatXu().getTenXuatXu();
        this.tenMauSac = s.getIdMauSac().getTenMauSac();
        this.tenKichThuoc = s.getIdKichThuoc().getTenKichThuoc();
        this.tenDeGiay = s.getIdDeGiay().getTenDeGiay();
        this.tenChatLieu = s.getIdChatLieu().getTenChatLieu();
        this.tenDemGiay = s.getIdDemGiay().getTenDemGiay();
        this.tenTrongLuong = s.getIdTrongLuong().getTenTrongLuong();
        this.tenMonTheThao = s.getIdMonTheThao().getTenMonTheThao();
        this.tenLoaiMua = s.getIdLoaiMua().getTenLoaiMua();
        this.tenDoBen = s.getIdDoBen().getTenDoBen();
        this.tenChongNuoc = s.getIdChongNuoc().getTenChongNuoc();
        this.soLuong = s.getSoLuong();
        this.giaBan = s.getGiaBan();
        this.trangThai = s.getTrangThai();
        this.ghiChu = s.getGhiChu();
        this.deleted = s.getDeleted();
        this.createAt = s.getCreateAt();
        this.createBy = s.getCreateBy();
        this.updateAt = s.getUpdateAt();
        this.updateBy = s.getUpdateBy();
    }
}

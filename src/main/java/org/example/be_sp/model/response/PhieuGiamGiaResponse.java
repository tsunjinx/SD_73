package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PhieuGiamGiaResponse {
    private Integer id;
    private String maPhieuGiamGia;
    private String tenPhieuGiamGia;
    private Boolean loaiPhieuGiamGia; // 0 = percentage, 1 = fixed amount
    private BigDecimal giaTriGiamGia;
    private BigDecimal soTienToiDa;
    private BigDecimal hoaDonToiThieu;
    private Integer soLuongDung;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private Boolean trangThai;
    private String moTa;
    private String trangThaiText;
    
    public String getTrangThaiText() {
        if (trangThai == null) return "Không xác định";
        LocalDate now = LocalDate.now();
        if (ngayBatDau != null && now.isBefore(ngayBatDau)) {
            return "Sắp diễn ra";
        } else if (ngayKetThuc != null && now.isAfter(ngayKetThuc)) {
            return "Hết hạn";
        } else if (trangThai) {
            return "Đang diễn ra";
        } else {
            return "Tạm dừng";
        }
    }
}
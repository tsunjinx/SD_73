package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.HinhThucThanhToan;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class HinhThucThanhToanReponse {
    private Integer id;

    private String maHoaDon;

    private String tenHoaDon;

    private String tenPhuongThucThanhToan;

    private String maHinhThucThanhToan;

    private BigDecimal tienChuyenKhoan;

    private BigDecimal tienMat;

    private Boolean deleted;

    public HinhThucThanhToanReponse(HinhThucThanhToan httt) {
        this.id = httt.getId();
        this.maHoaDon = httt.getIdHoaDon().getMaHoaDon();
        this.tenHoaDon = httt.getIdHoaDon().getTenHoaDon();
        this.tenPhuongThucThanhToan = httt.getIdPhuongThucThanhToan().getTenPhuongThucThanhToan();
        this.maHinhThucThanhToan = httt.getMaHinhThucThanhToan();
        this.tienChuyenKhoan = httt.getTienChuyenKhoan();
        this.tienMat = httt.getTienMat();
        this.deleted = httt.getDeleted();
    }
}

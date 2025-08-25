package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.SanPham;

@Getter
@Setter
@NoArgsConstructor
public class SanPhamResponse {
    private Integer id;

    private String maSanPham;

    private String tenSanPham;

    private String maNhaSanXuat;

    private String tenNhaSanXuat;

    private String maXuatXu;

    private String tenXuatXu;

    private Boolean deleted;

    public SanPhamResponse(SanPham sp) {
        this.id = sp.getId();
        this.maSanPham = sp.getMaSanPham();
        this.tenSanPham = sp.getTenSanPham();
        this.maNhaSanXuat = sp.getIdNhaSanXuat().getMaNhaSanXuat();
        this.tenNhaSanXuat = sp.getIdNhaSanXuat().getTenNhaSanXuat();
        this.maXuatXu = sp.getIdXuatXu().getMaXuatXu();
        this.tenXuatXu = sp.getIdXuatXu().getTenXuatXu();
        this.deleted = sp.getDeleted();
    }


}

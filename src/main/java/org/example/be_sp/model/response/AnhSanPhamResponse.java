package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.example.be_sp.entity.AnhSanPham;

@Getter
@Setter
@NoArgsConstructor
public class AnhSanPhamResponse {
    Integer id;
    String duongDanAnh;
    String loaiAnh;
    String moTa;
    Boolean deleted;

    public AnhSanPhamResponse(AnhSanPham data) {
        this.id = data.getId();
        this.duongDanAnh = data.getDuongDanAnh();
        this.loaiAnh = data.getLoaiAnh();
        this.moTa = data.getMoTa();
        this.deleted = data.getDeleted();
    }
}

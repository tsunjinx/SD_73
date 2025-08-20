package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.ChiTietSanPhamAnh;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamAnhResponse {
    Integer idChiTietSanPham;
    Integer idAnhSanPham;
    Boolean deleted;

    public ChiTietSanPhamAnhResponse(ChiTietSanPhamAnh d) {
        this.idChiTietSanPham = d.getIdChiTietSanPham().getId();
        this.idAnhSanPham = d.getIdAnhSanPham().getId();
        this.deleted = d.getDeleted();
    }
}

package org.example.be_sp.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamAnhRequest {
    Integer idChiTietSanPham;
    Integer idAnhSanPham;
    Boolean deleted;
}

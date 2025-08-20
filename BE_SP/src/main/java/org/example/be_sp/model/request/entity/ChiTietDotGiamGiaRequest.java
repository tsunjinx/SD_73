package org.example.be_sp.model.request.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietDotGiamGiaRequest {
    Integer idDotGiamGia;
    Integer idChiTietSanPham;
    Boolean deleted;
}

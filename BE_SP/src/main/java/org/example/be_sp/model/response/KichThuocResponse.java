package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.KichThuoc;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KichThuocResponse {
    Integer id;
    String maKichThuoc;
    String tenKichThuoc;
    Boolean deleted;

    public KichThuocResponse(KichThuoc data) {
        this.id = data.getId();
        this.maKichThuoc = data.getMaKichThuoc();
        this.tenKichThuoc = data.getTenKichThuoc();
        this.deleted = data.getDeleted();
    }
}

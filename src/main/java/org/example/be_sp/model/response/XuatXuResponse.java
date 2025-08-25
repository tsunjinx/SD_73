package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.XuatXu;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class XuatXuResponse {
    Integer id;
    String maXuatXu;
    String tenXuatXu;
    Boolean deleted;

    public XuatXuResponse(XuatXu d) {
        this.id = d.getId();
        this.maXuatXu = d.getMaXuatXu();
        this.tenXuatXu = d.getTenXuatXu();
        this.deleted = d.getDeleted();
    }
}

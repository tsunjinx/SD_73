package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.DemGiay;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DemGiayResponse {
    Integer id;
    String maDemGiay;
    String tenDemGiay;
    Boolean deleted;

    public DemGiayResponse(DemGiay d) {
        this.id = d.getId();
        this.maDemGiay = d.getMaDemGiay();
        this.tenDemGiay = d.getTenDemGiay();
        this.deleted = d.getDeleted();
    }
}

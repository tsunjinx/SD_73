package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.DeGiay;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeGiayResponse {
    private Integer id;
    private String maDeGiay;
    private String tenDeGiay;
    private Boolean deleted;

    public DeGiayResponse(DeGiay data) {
        this.id = data.getId();
        this.maDeGiay = data.getMaDeGiay();
        this.tenDeGiay = data.getTenDeGiay();
        this.deleted = data.getDeleted();
    }
}

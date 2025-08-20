package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.ChongNuoc;

@Getter
@Setter
@NoArgsConstructor
public class ChongNuocResponse {
    private Integer id;

    private String tenChongNuoc;

    private String maChongNuoc;

    private Boolean deleted;

    public ChongNuocResponse(ChongNuoc data) {
        this.id = data.getId();
        this.tenChongNuoc = data.getTenChongNuoc();
        this.maChongNuoc = data.getMaChongNuoc();
        this.deleted = data.getDeleted();
    }
}

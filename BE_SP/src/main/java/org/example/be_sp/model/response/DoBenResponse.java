package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.DoBen;

@Getter
@Setter
@NoArgsConstructor
public class DoBenResponse {
    private Integer id;

    private String maDoBen;

    private String tenDoBen;

    private Boolean deleted;

    public DoBenResponse(DoBen data) {
        this.id = data.getId();
        this.maDoBen = data.getMaDoBen();
        this.tenDoBen = data.getTenDoBen();
        this.deleted = data.getDeleted();
    }
}

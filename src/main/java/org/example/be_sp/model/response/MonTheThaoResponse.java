package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.MonTheThao;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonTheThaoResponse {
    Integer id;
    String maMonTheThao;
    String tenMonTheThao;
    Boolean deleted;

    public MonTheThaoResponse(MonTheThao d) {
        this.id = d.getId();
        this.maMonTheThao = d.getMaMonTheThao();
        this.tenMonTheThao = d.getTenMonTheThao();
        this.deleted = d.getDeleted();
    }
}

package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.MauSac;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MauSacResponse {
    Integer id;
    String maMauSac;
    String tenMauSac;
    Boolean deleted;

    public MauSacResponse(MauSac data) {
        this.id = data.getId();
        this.maMauSac = data.getMaMauSac();
        this.tenMauSac = data.getTenMauSac();
        this.deleted = data.getDeleted();
    }
}

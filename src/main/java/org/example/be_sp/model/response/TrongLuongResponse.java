package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.TrongLuong;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrongLuongResponse {
    Integer id;
    String maTrongLuong;
    String tenTrongLuong;
    Boolean deleted;

    public TrongLuongResponse(TrongLuong d) {
        this.id = d.getId();
        this.maTrongLuong = d.getMaTrongLuong();
        this.tenTrongLuong = d.getTenTrongLuong();
        this.deleted = d.getDeleted();
    }
}

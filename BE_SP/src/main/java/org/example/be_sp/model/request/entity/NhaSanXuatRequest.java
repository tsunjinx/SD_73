package org.example.be_sp.model.request.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NhaSanXuatRequest {
    private String tenNhaSanXuat;
    private Boolean deleted;

}

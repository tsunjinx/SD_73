package org.example.be_sp.model.request.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrongLuongRequest {
    String tenTrongLuong;
    Boolean deleted;
}

package org.example.be_sp.model.request.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DemGiayRequest {
    String tenDemGiay;
    Boolean deleted;
}

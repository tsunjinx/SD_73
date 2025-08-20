package org.example.be_sp.service;

import org.example.be_sp.entity.DemGiay;
import org.example.be_sp.model.request.DemGiayRequest;
import org.example.be_sp.model.response.DemGiayResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class DemGiayService extends GenericCrudService<DemGiay, Integer, DemGiayResponse, DemGiayRequest> {

    public DemGiayService(Class<DemGiay> entity, Class<DemGiayResponse> demGiayResponseClass, Class<DemGiayRequest> demGiayRequestClass, JpaRepository<DemGiay, Integer> repository) {
        super(entity, demGiayResponseClass, demGiayRequestClass, repository);
    }
}

package org.example.be_sp.service;

import org.example.be_sp.entity.DeGiay;
import org.example.be_sp.model.request.DeGiayRequest;
import org.example.be_sp.model.response.DeGiayResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class DeGiayService extends GenericCrudService<DeGiay, Integer, DeGiayResponse, DeGiayRequest> {
    public DeGiayService(Class<DeGiay> entity, Class<DeGiayResponse> deGiayResponseClass, Class<DeGiayRequest> deGiayRequestClass, JpaRepository<DeGiay, Integer> repository) {
        super(entity, deGiayResponseClass, deGiayRequestClass, repository);
    }
}

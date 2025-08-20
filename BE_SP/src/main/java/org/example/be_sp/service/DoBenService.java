package org.example.be_sp.service;

import org.example.be_sp.entity.DoBen;
import org.example.be_sp.model.request.DobenRequest;
import org.example.be_sp.model.response.DoBenResponse;
import org.example.be_sp.repository.DoBenRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class DoBenService extends GenericCrudService<DoBen, Integer, DoBenResponse, DobenRequest> {
    @Autowired
    private DoBenRepository doBenRepository;

    public DoBenService(Class<DoBen> entity, Class<DoBenResponse> doBenResponseClass, Class<DobenRequest> dobenRequestClass, JpaRepository<DoBen, Integer> doBenRepository) {
        super(entity, doBenResponseClass, dobenRequestClass, doBenRepository);
    }
}

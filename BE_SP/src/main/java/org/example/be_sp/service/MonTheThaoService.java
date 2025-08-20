package org.example.be_sp.service;

import org.example.be_sp.entity.MonTheThao;
import org.example.be_sp.model.request.entity.MonTheThaoRequest;
import org.example.be_sp.model.response.MonTheThaoResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class MonTheThaoService extends GenericCrudService<MonTheThao, Integer, MonTheThaoResponse, MonTheThaoRequest> {
    public MonTheThaoService(Class<MonTheThao> entity, Class<MonTheThaoResponse> monTheThaoResponseClass, Class<MonTheThaoRequest> monTheThaoRequestClass, JpaRepository<MonTheThao, Integer> repository) {
        super(entity, monTheThaoResponseClass, monTheThaoRequestClass, repository);
    }
}

package org.example.be_sp.service;

import org.example.be_sp.entity.KichThuoc;
import org.example.be_sp.model.request.KichThuocRequest;
import org.example.be_sp.model.response.KichThuocResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class KichThuocService extends GenericCrudService<KichThuoc, Integer, KichThuocResponse, KichThuocRequest> {

    public KichThuocService(Class<KichThuoc> entity, Class<KichThuocResponse> kichThuocResponseClass, Class<KichThuocRequest> kichThuocRequestClass, JpaRepository<KichThuoc, Integer> repository) {
        super(entity, kichThuocResponseClass, kichThuocRequestClass, repository);
    }
}

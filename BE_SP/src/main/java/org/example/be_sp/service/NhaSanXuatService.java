package org.example.be_sp.service;

import org.example.be_sp.entity.NhaSanXuat;
import org.example.be_sp.model.request.NhaSanXuatRequest;
import org.example.be_sp.model.response.NhaSanXuatResponse;
import org.example.be_sp.repository.NhaSanXuatRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class NhaSanXuatService extends GenericCrudService<NhaSanXuat, Integer, NhaSanXuatResponse, NhaSanXuatRequest> {
    @Autowired
    private NhaSanXuatRepository nhaSanXuatRepository;
    public NhaSanXuatService(Class<NhaSanXuat> entity, Class<NhaSanXuatResponse> nhaSanXuatResponseClass, Class<NhaSanXuatRequest> nhaSanXuatRequestClass, JpaRepository<NhaSanXuat, Integer> nhaSanXuatRepository) {
        super(entity, nhaSanXuatResponseClass, nhaSanXuatRequestClass, nhaSanXuatRepository);
    }

}

package org.example.be_sp.service;

import org.example.be_sp.entity.XuatXu;
import org.example.be_sp.model.request.entity.XuatXuRequest;
import org.example.be_sp.model.response.XuatXuResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class XuatXuService extends GenericCrudService<XuatXu, Integer, XuatXuResponse, XuatXuRequest> {
    public XuatXuService(Class<XuatXu> entity, Class<XuatXuResponse> xuatXuResponseClass, Class<XuatXuRequest> xuatXuRequestClass, JpaRepository<XuatXu, Integer> repository) {
        super(entity, xuatXuResponseClass, xuatXuRequestClass, repository);
    }
}

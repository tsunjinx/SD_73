package org.example.be_sp.service;

import org.example.be_sp.entity.DotGiamGia;
import org.example.be_sp.model.request.entity.DotGiamGiaRequest;
import org.example.be_sp.model.response.DotGiamGiaResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class DotGiamGiaService extends GenericCrudService<DotGiamGia, Integer, DotGiamGiaResponse, DotGiamGiaRequest> {
    public DotGiamGiaService(Class<DotGiamGia> entity, Class<DotGiamGiaResponse> dotGiamGiaResponseClass, Class<DotGiamGiaRequest> dotGiamGiaRequestClass, JpaRepository<DotGiamGia, Integer> repository) {
        super(entity, dotGiamGiaResponseClass, dotGiamGiaRequestClass, repository);
    }
}

package org.example.be_sp.service;

import org.example.be_sp.entity.LoaiMua;
import org.example.be_sp.model.request.entity.LoaiMuaRequest;
import org.example.be_sp.model.response.LoaiMuaResponse;
import org.example.be_sp.repository.LoaiMuaRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class LoaiMuaService extends GenericCrudService<LoaiMua, Integer, LoaiMuaResponse, LoaiMuaRequest> {
    @Autowired
    private LoaiMuaRepository loaiMuaRepository;

    public LoaiMuaService(Class<LoaiMua> entity, Class<LoaiMuaResponse> loaiMuaResponseClass, Class<LoaiMuaRequest> loaiMuaRequestClass, JpaRepository<LoaiMua, Integer> loaiMuaRepository) {
        super(entity, loaiMuaResponseClass, loaiMuaRequestClass, loaiMuaRepository);
    }
}

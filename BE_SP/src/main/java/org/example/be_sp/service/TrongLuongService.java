package org.example.be_sp.service;

import org.example.be_sp.entity.TrongLuong;
import org.example.be_sp.model.request.TrongLuongRequest;
import org.example.be_sp.model.response.TrongLuongResponse;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class TrongLuongService extends GenericCrudService<TrongLuong, Integer, TrongLuongResponse, TrongLuongRequest> {
    public TrongLuongService(Class<TrongLuong> entity, Class<TrongLuongResponse> trongLuongResponseClass, Class<TrongLuongRequest> trongLuongRequestClass, JpaRepository<TrongLuong, Integer> repository) {
        super(entity, trongLuongResponseClass, trongLuongRequestClass, repository);
    }
}

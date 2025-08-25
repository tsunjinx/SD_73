package org.example.be_sp.service;

import org.example.be_sp.entity.PhieuGiamGia;
import org.example.be_sp.model.request.PhieuGiamGiaRequest;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.model.response.PhieuGiamGiaResponse;
import org.example.be_sp.repository.PhieuGiamGiaRepository;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhieuGiamGiaService {
    
    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;
    
    public List<PhieuGiamGiaResponse> getAll() {
        List<PhieuGiamGia> list = phieuGiamGiaRepository.findAllActive();
        return list.stream()
                .map(item -> MapperUtils.map(item, PhieuGiamGiaResponse.class))
                .collect(Collectors.toList());
    }
    
    public PagingResponse<PhieuGiamGiaResponse> paging(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhieuGiamGia> pageData = phieuGiamGiaRepository.findAllActive(pageable);
        
        Page<PhieuGiamGiaResponse> responsePage = pageData.map(item -> MapperUtils.map(item, PhieuGiamGiaResponse.class));
        
        return new PagingResponse<>(responsePage, page);
    }
    
    public PhieuGiamGiaResponse getById(Integer id) {
        PhieuGiamGia entity = phieuGiamGiaRepository.findActiveById(id);
        if (entity == null) {
            throw new RuntimeException("Không tìm thấy phiếu giảm giá với id: " + id);
        }
        return MapperUtils.map(entity, PhieuGiamGiaResponse.class);
    }
    
    public void add(PhieuGiamGiaRequest request) {
        PhieuGiamGia entity = MapperUtils.map(request, PhieuGiamGia.class);
        entity.setDeleted(false);
        entity.setTrangThai(true);
        phieuGiamGiaRepository.save(entity);
    }
    
    public void update(Integer id, PhieuGiamGiaRequest request) {
        PhieuGiamGia existing = phieuGiamGiaRepository.findActiveById(id);
        if (existing == null) {
            throw new RuntimeException("Không tìm thấy phiếu giảm giá với id: " + id);
        }
        
        MapperUtils.mapToExisting(request, existing);
        phieuGiamGiaRepository.save(existing);
    }
    
    public void delete(Integer id) {
        PhieuGiamGia existing = phieuGiamGiaRepository.findActiveById(id);
        if (existing == null) {
            throw new RuntimeException("Không tìm thấy phiếu giảm giá với id: " + id);
        }
        
        existing.setDeleted(true);
        phieuGiamGiaRepository.save(existing);
    }
    
    public List<PhieuGiamGiaResponse> getActiveVouchers() {
        LocalDate currentDate = LocalDate.now();
        List<PhieuGiamGia> list = phieuGiamGiaRepository.findActiveVouchers(currentDate);
        return list.stream()
                .map(item -> MapperUtils.map(item, PhieuGiamGiaResponse.class))
                .collect(Collectors.toList());
    }
}
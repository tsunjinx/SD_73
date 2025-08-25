package org.example.be_sp.service;

import org.example.be_sp.entity.ChiTietSanPhamAnh;
import org.example.be_sp.model.request.ChiTietSanPhamAnhRequest;
import org.example.be_sp.model.response.ChiTietSanPhamAnhResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.AnhSanPhamRepository;
import org.example.be_sp.repository.ChiTietAnhSanPhamRepository;
import org.example.be_sp.repository.ChiTietSanPhamRepository;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietSanPhamAnhService {
    @Autowired
    ChiTietAnhSanPhamRepository repository;
    @Autowired
    ChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    AnhSanPhamRepository anhSanPhamRepository;

    public List<ChiTietSanPhamAnhResponse> getAll(){
        return repository.findAll().stream().map(ChiTietSanPhamAnhResponse::new).toList();
    }

    public ChiTietSanPhamAnhResponse getById(Integer id){
        return repository.findById(id)
                .map(ChiTietSanPhamAnhResponse::new)
                .orElseThrow(() -> new RuntimeException("ChiTietSanPhamAnh not found with id: " + id));
    }

    public PagingResponse<ChiTietSanPhamAnhResponse> paging(Integer page, Integer size) {
        return new PagingResponse<>(repository.findAll(PageRequest.of(page, size)).map(ChiTietSanPhamAnhResponse::new), page);
    }

    public void add(ChiTietSanPhamAnhRequest chiTietSanPhamAnhResponse) {
        ChiTietSanPhamAnh e = MapperUtils.map(chiTietSanPhamAnhResponse, ChiTietSanPhamAnh.class);
        e.setIdChiTietSanPham(chiTietSanPhamRepository.findChiTietSanPhamById(chiTietSanPhamAnhResponse.getIdChiTietSanPham()));
        e.setIdAnhSanPham(anhSanPhamRepository.findAnhSanPhamById(chiTietSanPhamAnhResponse.getIdAnhSanPham()));
        repository.save(e);
    }

    public void update(Integer id, ChiTietSanPhamAnhRequest chiTietSanPhamAnhResponse) {
        ChiTietSanPhamAnh existing = MapperUtils.map(chiTietSanPhamAnhResponse, ChiTietSanPhamAnh.class);
        existing.setId(id);
        existing.setIdChiTietSanPham(chiTietSanPhamRepository.findChiTietSanPhamById(chiTietSanPhamAnhResponse.getIdChiTietSanPham()));
        existing.setIdAnhSanPham(anhSanPhamRepository.findAnhSanPhamById(chiTietSanPhamAnhResponse.getIdAnhSanPham()));
        repository.save(existing);
    }
}

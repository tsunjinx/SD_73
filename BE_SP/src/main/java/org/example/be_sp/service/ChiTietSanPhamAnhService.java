package org.example.be_sp.service;

import org.example.be_sp.model.response.ChiTietSanPhamAnhResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.ChiTietAnhSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietSanPhamAnhService {
    @Autowired
    ChiTietAnhSanPhamRepository repository;

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


}

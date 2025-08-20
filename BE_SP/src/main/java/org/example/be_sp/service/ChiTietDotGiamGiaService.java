package org.example.be_sp.service;

import org.example.be_sp.entity.ChiTietDotGiamGia;
import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.request.entity.ChiTietDotGiamGiaRequest;
import org.example.be_sp.model.response.ChiTietDotGiamGiaResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.ChiTietDotGiamGiaRepository;
import org.example.be_sp.repository.ChiTietSanPhamRepository;
import org.example.be_sp.repository.DotGiamGiaRepository;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietDotGiamGiaService {
    @Autowired
    ChiTietDotGiamGiaRepository repository;
    @Autowired
    DotGiamGiaRepository dotGiamGiaRepository;
    @Autowired
    ChiTietSanPhamRepository chiTietSanPhamRepository;

    public List<ChiTietDotGiamGiaResponse> getAll(){
        return repository.findAll().stream().map(ChiTietDotGiamGiaResponse::new).toList();
    }

    public PagingResponse<ChiTietDotGiamGiaResponse> paging(int page, int size) {
        return new PagingResponse<>(repository.findAll(PageRequest.of(page, size)).map(ChiTietDotGiamGiaResponse::new), page);
    }

    public ChiTietDotGiamGiaResponse getById(Integer id) {
        return repository.findById(id).map(ChiTietDotGiamGiaResponse::new).orElseThrow(()-> new ApiException("Chi tiết đợt giảm giá không tồn tại","404"));
    }

    public void add(ChiTietDotGiamGiaRequest chiTietDotGiamGiaResponse) {
        ChiTietDotGiamGia e = MapperUtils.map(chiTietDotGiamGiaResponse, ChiTietDotGiamGia.class);
        e.setIdChiTietSanPham(chiTietSanPhamRepository.findChiTietSanPhamById(chiTietDotGiamGiaResponse.getIdChiTietSanPham()));
        e.setIdDotGiamGia(dotGiamGiaRepository.findDotGiamGiaById(chiTietDotGiamGiaResponse.getIdDotGiamGia()));
        repository.save(e);
    }

    public void update(Integer id, ChiTietDotGiamGiaRequest chiTietDotGiamGiaResponse) {
        ChiTietDotGiamGia e = MapperUtils.map(chiTietDotGiamGiaResponse, ChiTietDotGiamGia.class);
        e.setId(id);
        e.setIdChiTietSanPham(chiTietSanPhamRepository.findChiTietSanPhamById(chiTietDotGiamGiaResponse.getIdChiTietSanPham()));
        e.setIdDotGiamGia(dotGiamGiaRepository.findDotGiamGiaById(chiTietDotGiamGiaResponse.getIdDotGiamGia()));
        repository.save(e);
    }
}

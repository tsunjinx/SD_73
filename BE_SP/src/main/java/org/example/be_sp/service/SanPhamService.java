package org.example.be_sp.service;

import org.example.be_sp.entity.SanPham;
import org.example.be_sp.model.request.SanPhamRequest;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.model.response.SanPhamResponse;
import org.example.be_sp.repository.NhaSanXuatRepository;
import org.example.be_sp.repository.SanPhamRepository;
import org.example.be_sp.repository.XuatXuRepository;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamService{
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private NhaSanXuatRepository nhaSanXuatService;
    @Autowired
    private XuatXuRepository xuatXuService;

    public List<SanPhamResponse> getAll() {
        return sanPhamRepository.findAll().stream()
                .map(SanPhamResponse::new)
                .toList();
    }
    public PagingResponse<SanPhamResponse> paging(Integer no, Integer size) {
        Pageable page = PageRequest.of(no,size);
        return new PagingResponse<>(sanPhamRepository.findAll(page).map(SanPhamResponse::new),no);
    }
    public SanPhamResponse getById(Integer id) {
        SanPham sanPham = sanPhamRepository.findSanPhamById(id);
        return new SanPhamResponse(sanPham);
    }
    public void add(SanPhamRequest sanPhamRequest) {
        SanPham sp = MapperUtils.map(sanPhamRequest, SanPham.class);
        sp.setIdXuatXu(xuatXuService.findXuatXuById(sanPhamRequest.getIdNhaSanXuat()));
        sp.setIdNhaSanXuat(nhaSanXuatService.findNhaSanXuatById(sanPhamRequest.getIdXuatXu()));
        sanPhamRepository.save(sp);

    }
    public void update(SanPhamRequest sanPhamRequest, Integer id) {
        SanPham existing = sanPhamRepository.findSanPhamById((id));
        MapperUtils.mapToExisting(sanPhamRequest, existing);
        existing.setIdXuatXu(xuatXuService.findXuatXuById(sanPhamRequest.getIdNhaSanXuat()));
        existing.setIdNhaSanXuat(nhaSanXuatService.findNhaSanXuatById(sanPhamRequest.getIdXuatXu()));
        sanPhamRepository.save(existing);
    }

}

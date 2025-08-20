package org.example.be_sp.service;

import org.example.be_sp.entity.ChiTietSanPham;
import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.request.entity.ChiTietSanPhamRequest;
import org.example.be_sp.model.response.ChiTietSanPhamResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.*;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietSanPhamService {
    @Autowired
    ChiTietSanPhamRepository repository;
    @Autowired
    SanPhamRepository sanPham;
    @Autowired
    MauSacRepository mauSac;
    @Autowired
    KichThuocRepository kichThuoc;
    @Autowired
    DeGiayRepository deGiay;
    @Autowired
    ChatLieuRepository chatLieu;
    @Autowired
    DemGiayRepository demGiay;
    @Autowired
    TrongLuongRepository trongLuong;
    @Autowired
    MonTheThaoRepository monTheThao;
    @Autowired
    LoaiMuaRepository loaiMua;
    @Autowired
    DoBenRepository doBen;
    @Autowired
    ChongNuocRepository chongNuoc;

    public List<ChiTietSanPhamResponse> getAll() {
        return repository.findAll().stream().map(ChiTietSanPhamResponse::new).toList();
    }

    public ChiTietSanPhamResponse getById(Integer id) {
        return repository.findById(id).map(ChiTietSanPhamResponse::new).orElseThrow(() -> new ApiException("Chi tiết sản phẩm không tồn tại", "404"));
    }

    public PagingResponse<ChiTietSanPhamResponse> paging(Integer page, Integer size) {
        return new PagingResponse<>(repository.findAll(PageRequest.of(page, size)).map(ChiTietSanPhamResponse::new), page);
    }

    public void add(ChiTietSanPhamRequest request) {
        ChiTietSanPham c = MapperUtils.map(request, ChiTietSanPham.class);
        c.setIdSanPham(sanPham.findSanPhamById(request.getIdSanPham()));
        c.setIdMauSac(mauSac.findMauSacById(request.getIdMauSac()));
        c.setIdKichThuoc(kichThuoc.findKichThuocById(request.getIdKichThuoc()));
        c.setIdDeGiay(deGiay.findDeGiayById(request.getIdDeGiay()));
        c.setIdChatLieu(chatLieu.findChatLieuById(request.getIdChatLieu()));
        c.setIdDemGiay(demGiay.findDemGiayById(request.getIdDemGiay()));
        c.setIdTrongLuong(trongLuong.findTrongLuongById(request.getIdTrongLuong()));
        c.setIdMonTheThao(monTheThao.findMonTheThaoById(request.getIdMonTheThao()));
        c.setIdLoaiMua(loaiMua.findLoaiMuaById(request.getIdLoaiMua()));
        c.setIdDoBen(doBen.findDoBenById(request.getIdDoBen()));
        c.setIdChongNuoc(chongNuoc.findChongNuocById(request.getIdChongNuoc()));
        repository.save(c);
    }

    public void update(ChiTietSanPhamRequest request, Integer id) {
        ChiTietSanPham e = MapperUtils.map(request, ChiTietSanPham.class);
        e.setId(id);
        e.setIdSanPham(sanPham.findSanPhamById(request.getIdSanPham()));
        e.setIdMauSac(mauSac.findMauSacById(request.getIdMauSac()));
        e.setIdKichThuoc(kichThuoc.findKichThuocById(request.getIdKichThuoc()));
        e.setIdDeGiay(deGiay.findDeGiayById(request.getIdDeGiay()));
        e.setIdChatLieu(chatLieu.findChatLieuById(request.getIdChatLieu()));
        e.setIdDemGiay(demGiay.findDemGiayById(request.getIdDemGiay()));
        e.setIdTrongLuong(trongLuong.findTrongLuongById(request.getIdTrongLuong()));
        e.setIdMonTheThao(monTheThao.findMonTheThaoById(request.getIdMonTheThao()));
        e.setIdLoaiMua(loaiMua.findLoaiMuaById(request.getIdLoaiMua()));
        e.setIdDoBen(doBen.findDoBenById(request.getIdDoBen()));
        e.setIdChongNuoc(chongNuoc.findChongNuocById(request.getIdChongNuoc()));
        repository.save(e);
    }
}

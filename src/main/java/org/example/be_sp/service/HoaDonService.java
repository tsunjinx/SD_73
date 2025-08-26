package org.example.be_sp.service;

import org.example.be_sp.entity.HoaDon;
import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.request.BanHangTaiQuayRequest;
import org.example.be_sp.model.response.HoaDonResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.HoaDonRepository;
import org.example.be_sp.repository.KhachHangRepository;
import org.example.be_sp.repository.NhanVienRepository;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    NhanVienRepository nhanVienRepository;
    @Autowired
    PhieuGiamGiaService phieuGiamGiaService;


    public List<HoaDonResponse> getAll() {
        return hoaDonRepository.findAll().stream().map(HoaDonResponse::new).toList();
    }
    public PagingResponse<HoaDonResponse> phanTrang(Integer no, Integer size) {
        Pageable page = PageRequest.of(no, size);
        return new PagingResponse<>(hoaDonRepository.findAll(page).map(HoaDonResponse::new), no);
    }

    public HoaDonResponse getByid(Integer id) {
        HoaDon hoaDon = hoaDonRepository.findById(id).orElseThrow(() -> new ApiException("Không tìm thấy hóa đơn","404"));
        return new HoaDonResponse(hoaDon);
    }
    public void add(BanHangTaiQuayRequest request) {
        HoaDon hd = MapperUtils.map(request, HoaDon.class);
        hd.setIdKhachHang(khachHangRepository.findKhachHangById(request.getIdKhachHang()));
        hd.setIdPhieuGiamGia(phieuGiamGiaService.getById(request.getIdPhieuGiamGia()));
        hd.setIdNhanVien(nhanVienRepository.getById(request.getIdNhanVien()));
        hoaDonRepository.save(hd);
    }
    public void update(Integer id, BanHangTaiQuayRequest request) {
        HoaDon hd = hoaDonRepository.findById(id).orElseThrow(() -> new ApiException("Không tìm thấy hóa đơn","404"));
        MapperUtils.mapToExisting(request, hd);
        hd.setIdKhachHang(khachHangRepository.findKhachHangById(request.getIdKhachHang()));
        hd.setIdPhieuGiamGia(phieuGiamGiaService.getById(request.getIdPhieuGiamGia()));
        hd.setIdNhanVien(nhanVienRepository.getById(request.getIdNhanVien()));
        hoaDonRepository.save(hd);
    }
    public void delete(Integer id) {
        HoaDon hd = hoaDonRepository.findById(id).orElseThrow(() -> new ApiException("Không tìm thấy hóa đơn","404"));
        hd.setDeleted(true);
        hoaDonRepository.save(hd);
    }

}

package org.example.be_sp.service;

import org.example.be_sp.entity.KhachHang;
import org.example.be_sp.entity.PhieuGiamGia;
import org.example.be_sp.entity.PhieuGiamGiaCaNhan;
import org.example.be_sp.model.request.PhieuGiamGiaCaNhanRequest;
import org.example.be_sp.model.response.PhieuGiamGiaCaNhanResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.KhachHangRepository;
import org.example.be_sp.repository.PhieuGiamGiaRepository;
import org.example.be_sp.repository.PhieuGiamGiaCaNhanRepository;
import org.example.be_sp.util.GenericCrudService;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhieuGiamGiaCaNhanService {

    @Autowired
    private PhieuGiamGiaCaNhanRepository phieuGiamGiaCaNhanRepository;

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    public List<PhieuGiamGiaCaNhanResponse> getAll() {
        List<PhieuGiamGiaCaNhan> entities = phieuGiamGiaCaNhanRepository.findAllActive();
        return entities.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public PagingResponse<PhieuGiamGiaCaNhanResponse> paging(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhieuGiamGiaCaNhan> entityPage = phieuGiamGiaCaNhanRepository.findAllActive(pageable);
        Page<PhieuGiamGiaCaNhanResponse> responsePage = entityPage.map(this::convertToResponse);
        return new PagingResponse<>(responsePage, page);
    }

    public Page<PhieuGiamGiaCaNhanResponse> findWithFilters(Integer khachHangId, Integer phieuGiamGiaId, 
                                                           Boolean trangThai, Pageable pageable) {
        Page<PhieuGiamGiaCaNhan> entityPage = phieuGiamGiaCaNhanRepository
                .findWithFilters(khachHangId, phieuGiamGiaId, trangThai, pageable);
        List<PhieuGiamGiaCaNhanResponse> responseList = entityPage.getContent()
                .stream().map(this::convertToResponse).collect(Collectors.toList());
        return new PageImpl<>(responseList, pageable, entityPage.getTotalElements());
    }

    public PhieuGiamGiaCaNhanResponse getById(Integer id) {
        PhieuGiamGiaCaNhan entity = phieuGiamGiaCaNhanRepository.findActiveById(id);
        return entity != null ? convertToResponse(entity) : null;
    }

    public List<PhieuGiamGiaCaNhanResponse> getByKhachHangId(Integer khachHangId) {
        List<PhieuGiamGiaCaNhan> entities = phieuGiamGiaCaNhanRepository.findByKhachHangId(khachHangId);
        return entities.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<PhieuGiamGiaCaNhanResponse> getActiveUserVouchersByKhachHang(Integer khachHangId) {
        LocalDate currentDate = LocalDate.now();
        List<PhieuGiamGiaCaNhan> entities = phieuGiamGiaCaNhanRepository
                .findActiveUserVouchersByKhachHang(khachHangId, currentDate);
        return entities.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void add(PhieuGiamGiaCaNhanRequest request) {
        if ("bulk".equals(request.getAssignmentType())) {
            assignVouchersBulk(request);
        } else {
            assignVouchersIndividual(request);
        }
    }

    private void assignVouchersIndividual(PhieuGiamGiaCaNhanRequest request) {
        PhieuGiamGia voucher = phieuGiamGiaRepository.findActiveById(request.getIdPhieuGiamGia());
        if (voucher == null) {
            throw new RuntimeException("Phiếu giảm giá không tồn tại");
        }

        if (request.getIdKhachHangList() != null && !request.getIdKhachHangList().isEmpty()) {
            for (Integer khachHangId : request.getIdKhachHangList()) {
                createUserVoucher(khachHangId, request.getIdPhieuGiamGia(), voucher);
            }
        } else if (request.getIdKhachHang() != null) {
            createUserVoucher(request.getIdKhachHang(), request.getIdPhieuGiamGia(), voucher);
        }
    }

    private void assignVouchersBulk(PhieuGiamGiaCaNhanRequest request) {
        PhieuGiamGia voucher = phieuGiamGiaRepository.findActiveById(request.getIdPhieuGiamGia());
        if (voucher == null) {
            throw new RuntimeException("Phiếu giảm giá không tồn tại");
        }

        List<KhachHang> targetCustomers = getCustomersByCriteria(request.getBulkCriteria());
        for (KhachHang customer : targetCustomers) {
            createUserVoucher(customer.getId(), request.getIdPhieuGiamGia(), voucher);
        }
    }

    private List<KhachHang> getCustomersByCriteria(String criteria) {
        // This would need to be implemented based on your business logic
        // For now, returning all active customers
        switch (criteria) {
            case "all":
                return khachHangRepository.findAll().stream()
                        .filter(kh -> !kh.getDeleted())
                        .collect(Collectors.toList());
            case "new":
                // Customers created in the last 30 days
                LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
                return khachHangRepository.findAll().stream()
                        .filter(kh -> !kh.getDeleted() && 
                               kh.getCreateAt() != null && 
                               kh.getCreateAt().isAfter(thirtyDaysAgo))
                        .collect(Collectors.toList());
            case "vip":
                // This would need specific VIP logic - for now returning empty list
                return new ArrayList<>();
            default:
                return new ArrayList<>();
        }
    }

    private void createUserVoucher(Integer khachHangId, Integer phieuGiamGiaId, PhieuGiamGia voucher) {
        KhachHang customer = khachHangRepository.findById(khachHangId).orElse(null);
        if (customer == null || customer.getDeleted()) {
            throw new RuntimeException("Khách hàng không tồn tại");
        }

        PhieuGiamGiaCaNhan userVoucher = new PhieuGiamGiaCaNhan();
        userVoucher.setIdKhachHang(customer);
        userVoucher.setIdPhieuGiamGia(voucher);
        userVoucher.setTenPhieuGiamGiaCaNhan(voucher.getTenPhieuGiamGia());
        userVoucher.setNgayNhan(LocalDate.now());
        userVoucher.setNgayHetHan(voucher.getNgayKetThuc());
        userVoucher.setTrangThai(true);
        userVoucher.setDeleted(false);

        phieuGiamGiaCaNhanRepository.save(userVoucher);
    }

    @Transactional
    public void update(Integer id, PhieuGiamGiaCaNhanRequest request) {
        PhieuGiamGiaCaNhan entity = phieuGiamGiaCaNhanRepository.findActiveById(id);
        if (entity == null) {
            throw new RuntimeException("Phiếu giảm giá cá nhân không tồn tại");
        }

        if (request.getTenPhieuGiamGiaCaNhan() != null) {
            entity.setTenPhieuGiamGiaCaNhan(request.getTenPhieuGiamGiaCaNhan());
        }
        if (request.getNgayHetHan() != null) {
            entity.setNgayHetHan(request.getNgayHetHan());
        }
        if (request.getTrangThai() != null) {
            entity.setTrangThai(request.getTrangThai());
        }

        phieuGiamGiaCaNhanRepository.save(entity);
    }

    @Transactional
    public void delete(Integer id) {
        PhieuGiamGiaCaNhan entity = phieuGiamGiaCaNhanRepository.findActiveById(id);
        if (entity == null) {
            throw new RuntimeException("Phiếu giảm giá cá nhân không tồn tại");
        }

        entity.setDeleted(true);
        phieuGiamGiaCaNhanRepository.save(entity);
    }

    @Transactional
    public void revokeVoucher(Integer id) {
        PhieuGiamGiaCaNhan entity = phieuGiamGiaCaNhanRepository.findActiveById(id);
        if (entity == null) {
            throw new RuntimeException("Phiếu giảm giá cá nhân không tồn tại");
        }

        entity.setTrangThai(false);
        phieuGiamGiaCaNhanRepository.save(entity);
    }

    private PhieuGiamGiaCaNhanResponse convertToResponse(PhieuGiamGiaCaNhan entity) {
        PhieuGiamGiaCaNhanResponse response = new PhieuGiamGiaCaNhanResponse();
        
        // Basic info
        response.setId(entity.getId());
        response.setMaPhieuGiamGiaCaNhan(entity.getMaPhieuGiamGiaCaNhan());
        response.setTenPhieuGiamGiaCaNhan(entity.getTenPhieuGiamGiaCaNhan());
        response.setNgayNhan(entity.getNgayNhan());
        response.setNgayHetHan(entity.getNgayHetHan());
        response.setTrangThai(entity.getTrangThai());
        
        // Customer info
        if (entity.getIdKhachHang() != null) {
            response.setIdKhachHang(entity.getIdKhachHang().getId());
            response.setMaKhachHang(entity.getIdKhachHang().getMaKhachHang());
            response.setTenKhachHang(entity.getIdKhachHang().getTenKhachHang());
            response.setEmail(entity.getIdKhachHang().getEmail());
            response.setSoDienThoai(entity.getIdKhachHang().getSoDienThoai());
        }
        
        // Voucher info
        if (entity.getIdPhieuGiamGia() != null) {
            response.setIdPhieuGiamGia(entity.getIdPhieuGiamGia().getId());
            response.setMaPhieuGiamGia(entity.getIdPhieuGiamGia().getMaPhieuGiamGia());
            response.setTenPhieuGiamGia(entity.getIdPhieuGiamGia().getTenPhieuGiamGia());
            response.setLoaiPhieuGiamGia(entity.getIdPhieuGiamGia().getLoaiPhieuGiamGia());
            response.setGiaTriGiamGia(entity.getIdPhieuGiamGia().getGiaTriGiamGia());
            response.setSoTienToiDa(entity.getIdPhieuGiamGia().getSoTienToiDa());
            response.setHoaDonToiThieu(entity.getIdPhieuGiamGia().getHoaDonToiThieu());
            response.setMoTa(entity.getIdPhieuGiamGia().getMoTa());
            response.setNgayBatDauVoucher(entity.getIdPhieuGiamGia().getNgayBatDau());
            response.setNgayKetThucVoucher(entity.getIdPhieuGiamGia().getNgayKetThuc());
        }
        
        // Status info
        LocalDate currentDate = LocalDate.now();
        response.setIsExpired(entity.getNgayHetHan() != null && entity.getNgayHetHan().isBefore(currentDate));
        response.setIsUsed(!entity.getTrangThai());
        
        if (response.getIsUsed()) {
            response.setTrangThaiText("Đã sử dụng");
        } else if (response.getIsExpired()) {
            response.setTrangThaiText("Hết hạn");
        } else {
            response.setTrangThaiText("Chưa sử dụng");
        }
        
        return response;
    }
}

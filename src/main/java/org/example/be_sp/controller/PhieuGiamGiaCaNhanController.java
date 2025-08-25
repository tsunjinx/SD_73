package org.example.be_sp.controller;

import org.example.be_sp.model.request.PhieuGiamGiaCaNhanRequest;
import org.example.be_sp.model.response.PhieuGiamGiaCaNhanResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.PhieuGiamGiaCaNhanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phieu-giam-gia-ca-nhan")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class PhieuGiamGiaCaNhanController {

    @Autowired
    private PhieuGiamGiaCaNhanService phieuGiamGiaCaNhanService;

    @GetMapping("/playlist")
    public ResponseObject<List<PhieuGiamGiaCaNhanResponse>> getAll() {
        return new ResponseObject<>(phieuGiamGiaCaNhanService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<PagingResponse<PhieuGiamGiaCaNhanResponse>> paging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return new ResponseObject<>(phieuGiamGiaCaNhanService.paging(page, size));
    }

    @GetMapping("/search")
    public ResponseObject<Page<PhieuGiamGiaCaNhanResponse>> search(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer khachHangId,
            @RequestParam(required = false) Integer phieuGiamGiaId,
            @RequestParam(required = false) Boolean trangThai) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PhieuGiamGiaCaNhanResponse> result = phieuGiamGiaCaNhanService
                .findWithFilters(khachHangId, phieuGiamGiaId, trangThai, pageable);
        return new ResponseObject<>(result);
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<PhieuGiamGiaCaNhanResponse> detail(@PathVariable Integer id) {
        return new ResponseObject<>(phieuGiamGiaCaNhanService.getById(id));
    }

    @GetMapping("/by-khach-hang/{khachHangId}")
    public ResponseObject<List<PhieuGiamGiaCaNhanResponse>> getByKhachHang(@PathVariable Integer khachHangId) {
        return new ResponseObject<>(phieuGiamGiaCaNhanService.getByKhachHangId(khachHangId));
    }

    @GetMapping("/active-by-khach-hang/{khachHangId}")
    public ResponseObject<List<PhieuGiamGiaCaNhanResponse>> getActiveByKhachHang(@PathVariable Integer khachHangId) {
        return new ResponseObject<>(phieuGiamGiaCaNhanService.getActiveUserVouchersByKhachHang(khachHangId));
    }

    @PostMapping("/assign")
    public ResponseObject<?> assignVouchers(@RequestBody PhieuGiamGiaCaNhanRequest request) {
        try {
            phieuGiamGiaCaNhanService.add(request);
            
            String message;
            if ("bulk".equals(request.getAssignmentType())) {
                message = "Phân phối voucher hàng loạt thành công";
            } else {
                int customerCount = request.getIdKhachHangList() != null ? 
                    request.getIdKhachHangList().size() : 1;
                message = "Đã phân phối voucher cho " + customerCount + " khách hàng";
            }
            
            return new ResponseObject<>(null, message);
        } catch (Exception e) {
            return ResponseObject.error("Lỗi khi phân phối voucher: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@PathVariable Integer id, @RequestBody PhieuGiamGiaCaNhanRequest request) {
        try {
            phieuGiamGiaCaNhanService.update(id, request);
            return new ResponseObject<>(null, "Cập nhật phiếu giảm giá cá nhân thành công");
        } catch (Exception e) {
            return ResponseObject.error("Lỗi khi cập nhật: " + e.getMessage());
        }
    }

    @PutMapping("/revoke/{id}")
    public ResponseObject<?> revokeVoucher(@PathVariable Integer id) {
        try {
            phieuGiamGiaCaNhanService.revokeVoucher(id);
            return new ResponseObject<>(null, "Thu hồi voucher thành công");
        } catch (Exception e) {
            return ResponseObject.error("Lỗi khi thu hồi voucher: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseObject<?> delete(@PathVariable Integer id) {
        try {
            phieuGiamGiaCaNhanService.delete(id);
            return new ResponseObject<>(null, "Xóa phiếu giảm giá cá nhân thành công");
        } catch (Exception e) {
            return ResponseObject.error("Lỗi khi xóa: " + e.getMessage());
        }
    }

    // Statistics endpoints
    @GetMapping("/stats/summary")
    public ResponseObject<?> getStatsSummary() {
        try {
            List<PhieuGiamGiaCaNhanResponse> allVouchers = phieuGiamGiaCaNhanService.getAll();
            
            long total = allVouchers.size();
            long unused = allVouchers.stream().filter(v -> !v.getIsUsed() && !v.getIsExpired()).count();
            long used = allVouchers.stream().filter(v -> v.getIsUsed()).count();
            long expired = allVouchers.stream().filter(v -> v.getIsExpired()).count();
            
            return new ResponseObject<>(new Object() {
                public final long totalVouchers = total;
                public final long unusedVouchers = unused;
                public final long usedVouchers = used;
                public final long expiredVouchers = expired;
            });
        } catch (Exception e) {
            return ResponseObject.error("Lỗi khi lấy thống kê: " + e.getMessage());
        }
    }
}

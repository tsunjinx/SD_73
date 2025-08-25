package org.example.be_sp.controller;

import org.example.be_sp.model.request.PhieuGiamGiaRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.PhieuGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phieu-giam-gia-management")
public class PhieuGiamGiaController {
    
    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(phieuGiamGiaService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "10") int size) {
        return new ResponseObject<>(phieuGiamGiaService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(phieuGiamGiaService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody PhieuGiamGiaRequest request) {
        phieuGiamGiaService.add(request);
        return new ResponseObject<>(null, "Thêm phiếu giảm giá thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody PhieuGiamGiaRequest request, @PathVariable Integer id) {
        phieuGiamGiaService.update(id, request);
        return new ResponseObject<>(null, "Cập nhật phiếu giảm giá thành công");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseObject<?> delete(@PathVariable Integer id) {
        phieuGiamGiaService.delete(id);
        return new ResponseObject<>(null, "Xóa phiếu giảm giá thành công");
    }
    
    @GetMapping("/active-vouchers")
    public ResponseObject<?> getActiveVouchers() {
        return new ResponseObject<>(phieuGiamGiaService.getActiveVouchers());
    }
}
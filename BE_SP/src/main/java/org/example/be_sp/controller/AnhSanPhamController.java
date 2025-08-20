package org.example.be_sp.controller;

import jakarta.validation.Valid;
import org.example.be_sp.model.request.entity.AnhSanPhamRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.AnhSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anh-san-pham-management")
@CrossOrigin(origins = "*")
public class AnhSanPhamController {
    @Autowired
    AnhSanPhamService anhSanPhamService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(anhSanPhamService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return new ResponseObject<>(anhSanPhamService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable int id) {
        return new ResponseObject<>(anhSanPhamService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody @Valid AnhSanPhamRequest anhSanPhamRequest) {
        anhSanPhamService.add(anhSanPhamRequest);
        return new ResponseObject<>(null,"Thêm ảnh sản phẩm thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody @Valid AnhSanPhamRequest anhSanPhamRequest, @PathVariable int id) {
        anhSanPhamService.update(id, anhSanPhamRequest);
        return new ResponseObject<>(null, "Cập nhật ảnh sản phẩm thành công");
    }
}

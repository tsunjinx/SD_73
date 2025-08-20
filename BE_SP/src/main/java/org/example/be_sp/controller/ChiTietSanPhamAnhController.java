package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.ChiTietSanPhamAnhRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.ChiTietSanPhamAnhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chi-tiet-san-pham-anh-management")
@CrossOrigin(origins = "*")
public class ChiTietSanPhamAnhController {
    @Autowired
    ChiTietSanPhamAnhService service;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(service.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(service.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(service.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody ChiTietSanPhamAnhRequest request) {
        service.add(request);
        return new ResponseObject<>(null, "Thêm thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody ChiTietSanPhamAnhRequest request, @PathVariable Integer id) {
        service.update(id, request);
        return new ResponseObject<>(null, "Cập nhật thành công");
    }
}

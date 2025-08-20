package org.example.be_sp.controller;

import org.example.be_sp.model.request.SanPhamRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/san-pham-management")
public class SanPhamController {
    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(sanPhamService.getAll(), "Hien thi thanh cong");
    }
    @GetMapping("/paging")
    public ResponseObject<?> getAllPaging(@RequestParam(defaultValue = "0") Integer page,@RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(sanPhamService.paging(page, size), "Hien thi thanh cong");
    }
    @GetMapping("/detail/{id}")
    public ResponseObject<?> getById(@PathVariable Integer id) {
        return new ResponseObject<>(sanPhamService.getById(id), "Hien thi thanh cong");
    }
    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody SanPhamRequest request) {
        sanPhamService.add(request);
        return new ResponseObject<>(null, "Them moi thanh cong");
    }
    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@PathVariable Integer id, @RequestBody SanPhamRequest request) {
        sanPhamService.update(request, id);
        return new ResponseObject<>(null, "Cap nhat thanh cong");
    }
}

package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.NhaSanXuatRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.NhaSanXuatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nha-san-xuat-management")
public class NhaSanXuatController {
    @Autowired
    NhaSanXuatService nhaSanXuatService;
    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(nhaSanXuatService.getAll(),"Hien thi thanh cong");
    }
    @GetMapping("/paging")
    public ResponseObject<?> getAllPaging(@RequestParam(defaultValue = "0") Integer page,@RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(nhaSanXuatService.paging(page, size), "Hien thi thanh cong");
    }
    @GetMapping("/detail/{id}")
    public ResponseObject<?> getById(@PathVariable Integer id) {
        return new ResponseObject<>(nhaSanXuatService.getById(id), "Hien thi thanh cong");
    }
    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody NhaSanXuatRequest request) {
        nhaSanXuatService.add(request);
        return new ResponseObject<>(null, "Them moi thanh cong");
    }
    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@PathVariable Integer id, @RequestBody NhaSanXuatRequest request) {
        nhaSanXuatService.update(id, request);
        return new ResponseObject<>(null, "Cap nhat thanh cong");
    }
}

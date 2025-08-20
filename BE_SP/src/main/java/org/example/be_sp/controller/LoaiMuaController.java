package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.LoaiMuaRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.LoaiMuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loai-mua-management")
@CrossOrigin(origins = "*")
public class LoaiMuaController {
    @Autowired
    private LoaiMuaService loaiMuaService;
    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(loaiMuaService.getAll());
    }
    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page,@RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(loaiMuaService.paging(page, size));
    }
    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(loaiMuaService.getById(id));
    }
    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody LoaiMuaRequest loaiMuaRequest) {
        loaiMuaService.add(loaiMuaRequest);
        return new ResponseObject<>(null, "Thêm loại mua thành công");
    }
    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody LoaiMuaRequest loaiMuaRequest, @PathVariable Integer id) {
        loaiMuaService.update(id, loaiMuaRequest);
        return new ResponseObject<>(null, "Cập nhật loại mua thành công");
    }
}

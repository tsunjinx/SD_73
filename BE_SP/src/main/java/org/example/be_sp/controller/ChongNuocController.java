package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.ChongNuocRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.ChongNuocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/chong-nuoc-management")
public class ChongNuocController {
    @Autowired
    private ChongNuocService chongNuocService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(chongNuocService.getAll(),"Danh sách chống nước");
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(chongNuocService.paging(page, size),"Danh sách chống nước phân trang");
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(chongNuocService.getById(id),"Chi tiết sản phẩm id: "+id);
    }
    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody ChongNuocRequest chongNuocRequest) {
        chongNuocService.add(chongNuocRequest);
        return new ResponseObject<>("Thêm thành công");
    }
    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@PathVariable("id") Integer id,@RequestBody ChongNuocRequest chongNuocRequest) {
        chongNuocService.update(id,chongNuocRequest);
        return new ResponseObject<>("Cập nhật thành công");
    }
}

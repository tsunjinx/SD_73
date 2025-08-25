package org.example.be_sp.controller;

import org.example.be_sp.model.request.KichThuocRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.KichThuocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kich-thuoc-management")
@CrossOrigin(origins = "*")
public class KichThuocController {
    @Autowired
    KichThuocService kichThuocService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(kichThuocService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page,
                                    @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(kichThuocService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(kichThuocService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody KichThuocRequest kichThuocRequest) {
        kichThuocService.add(kichThuocRequest);
        return new ResponseObject<>(null,"Thêm kích thước thành công");
    }
}

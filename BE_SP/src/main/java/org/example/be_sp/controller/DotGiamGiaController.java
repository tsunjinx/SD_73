package org.example.be_sp.controller;

import org.example.be_sp.model.request.DotGiamGiaRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.DotGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dot-giam-gia-management")
public class DotGiamGiaController {
    @Autowired
    DotGiamGiaService dotGiamGiaService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(dotGiamGiaService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "10") int size) {
        return new ResponseObject<>(dotGiamGiaService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(dotGiamGiaService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody DotGiamGiaRequest request) {
        dotGiamGiaService.add(request);
        return new ResponseObject<>(null,"Thêm đợt giảm giá thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody DotGiamGiaRequest request, @PathVariable Integer id) {
        dotGiamGiaService.update(id, request);
        return new ResponseObject<>(null, "Cập nhật đợt giảm giá thành công");
    }
}

package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.DeGiayRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.DeGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/de-giay-management")
@CrossOrigin(origins = "*")
public class DeGiayController {
    @Autowired
    DeGiayService deGiayService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(deGiayService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(deGiayService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(deGiayService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody DeGiayRequest deGiayRequest) {
        deGiayService.add(deGiayRequest);
        return new ResponseObject<>(null,"Thêm đế giày thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody DeGiayRequest deGiayRequest, @PathVariable Integer id) {
        deGiayService.update(id, deGiayRequest);
        return new ResponseObject<>(null,"Cập nhật đế giày thành công");
    }
}

package org.example.be_sp.controller;

import org.example.be_sp.model.request.entity.DemGiayRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.DemGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dem-giay-management")
@CrossOrigin(origins = "*")
public class DemGiayController {
    @Autowired
    DemGiayService demGiayService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(demGiayService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(demGiayService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(demGiayService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody DemGiayRequest demGiayRequest) {
        demGiayService.add(demGiayRequest);
        return new ResponseObject<>(null,"Thêm đệm giày thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody DemGiayRequest demGiayRequest, @PathVariable Integer id) {
        demGiayService.update(id, demGiayRequest);
        return new ResponseObject<>(null, "Cập nhật đệm giày thành công");

    }
}

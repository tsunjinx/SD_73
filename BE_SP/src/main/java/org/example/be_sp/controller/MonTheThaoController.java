package org.example.be_sp.controller;

import org.example.be_sp.model.request.MonTheThaoRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.MonTheThaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mon-the-thao-management")
@CrossOrigin(origins = "*")
public class MonTheThaoController {
    @Autowired
    MonTheThaoService monTheThaoService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(monTheThaoService.getAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(monTheThaoService.paging(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(monTheThaoService.getById(id));
    }

    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody MonTheThaoRequest monTheThaoRequest) {
        monTheThaoService.add(monTheThaoRequest);
        return new ResponseObject<>(null, "Thêm mới thành công");
    }

    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody MonTheThaoRequest monTheThaoRequest, @PathVariable Integer id) {
        monTheThaoService.update(id, monTheThaoRequest);
        return new ResponseObject<>(null, "Cập nhật thành công");
    }
}

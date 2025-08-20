package org.example.be_sp.controller;

import org.example.be_sp.model.request.DobenRequest;
import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.DoBenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/do-ben-management")
@CrossOrigin(origins = "*")
public class DoBenController{
    @Autowired
    private DoBenService doBenService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(doBenService.getAll());
    }
    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        return new ResponseObject<>(doBenService.paging(page, size));
    }
    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable Integer id) {
        return new ResponseObject<>(doBenService.getById(id));
    }
    @PostMapping("/add")
    public ResponseObject<?> add(@RequestBody DobenRequest doBenRequest) {
        doBenService.add(doBenRequest);
        return new ResponseObject<>(null, "Thêm độ bền thành công");
    }
    @PutMapping("/update/{id}")
    public ResponseObject<?> update(@RequestBody DobenRequest doBenRequest, @PathVariable Integer id) {
        doBenService.update(id, doBenRequest);
        return new ResponseObject<>(null, "Cập nhật độ bền thành công");
    }
}

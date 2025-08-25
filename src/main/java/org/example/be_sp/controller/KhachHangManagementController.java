package org.example.be_sp.controller;

import org.example.be_sp.model.response.ResponseObject;
import org.example.be_sp.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khach-hang-management")
@CrossOrigin(origins = "http://localhost:5173")
public class KhachHangManagementController {
    
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/playlist")
    public ResponseObject<?> getAll() {
        return new ResponseObject<>(khachHangService.findAll());
    }

    @GetMapping("/paging")
    public ResponseObject<?> paging(@RequestParam(defaultValue = "0") int page, 
                                   @RequestParam(defaultValue = "10") int size) {
        // For now, return all customers - you can implement pagination later
        return new ResponseObject<>(khachHangService.findAll());
    }

    @GetMapping("/detail/{id}")
    public ResponseObject<?> detail(@PathVariable int id) {
        return new ResponseObject<>(khachHangService.findById(id));
    }
}
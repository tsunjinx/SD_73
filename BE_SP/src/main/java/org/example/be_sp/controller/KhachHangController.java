package org.example.be_sp.controller;

import org.example.be_sp.entity.KhachHang;
import org.example.be_sp.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    public ResponseEntity<List<KhachHang>> getAll() {
        return ResponseEntity.ok(khachHangService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(khachHangService.findById(id));
    }

    @PostMapping
    public ResponseEntity<KhachHang> create(@RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.save(khachHang));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> update(@PathVariable Integer id, @RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.update(id, khachHang));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khachHangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
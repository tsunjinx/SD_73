package org.example.be_sp.controller;

import org.example.be_sp.entity.NhanVien;
import org.example.be_sp.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "*")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    // Lấy danh sách tất cả nhân viên
    @GetMapping
    public ResponseEntity<List<NhanVien>> getAllNhanVien() {
        return ResponseEntity.ok(nhanVienService.getAllNhanVien());
    }

    // Lấy nhân viên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> getNhanVienById(@PathVariable Integer id) {
        NhanVien nv = nhanVienService.getNhanVienById(id);
        return (nv != null) ? ResponseEntity.ok(nv) : ResponseEntity.notFound().build();
    }

    // Lấy nhân viên theo email
    @GetMapping("/email/{email}")
    public ResponseEntity<NhanVien> getNhanVienByEmail(@PathVariable String email) {
        NhanVien nv = nhanVienService.getNhanVienByEmail(email);
        return (nv != null) ? ResponseEntity.ok(nv) : ResponseEntity.notFound().build();
    }

    // Lấy nhân viên theo tên tài khoản
    @GetMapping("/taikhoan/{tenTaiKhoan}")
    public ResponseEntity<NhanVien> getNhanVienByTenTaiKhoan(@PathVariable String tenTaiKhoan) {
        NhanVien nv = nhanVienService.getNhanVienByTenTaiKhoan(tenTaiKhoan);
        return (nv != null) ? ResponseEntity.ok(nv) : ResponseEntity.notFound().build();
    }

    // Thêm nhân viên
    @PostMapping
    public ResponseEntity<NhanVien> createNhanVien(@RequestBody NhanVien nhanVien) {
        if (nhanVienService.existsByEmail(nhanVien.getEmail())) {
            return ResponseEntity.badRequest().body(null); // Email đã tồn tại
        }
        if (nhanVienService.existsByTenTaiKhoan(nhanVien.getTenTaiKhoan())) {
            return ResponseEntity.badRequest().body(null); // Tài khoản đã tồn tại
        }
        return ResponseEntity.ok(nhanVienService.saveNhanVien(nhanVien));
    }

    // Cập nhật nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<NhanVien> updateNhanVien(@PathVariable Integer id, @RequestBody NhanVien nhanVien) {
        NhanVien existing = nhanVienService.getNhanVienById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        nhanVien.setId(id); // Đảm bảo update đúng ID
        return ResponseEntity.ok(nhanVienService.saveNhanVien(nhanVien));
    }

    // Xóa nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNhanVien(@PathVariable Integer id) {
        NhanVien existing = nhanVienService.getNhanVienById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        nhanVienService.deleteNhanVien(id);
        return ResponseEntity.noContent().build();
    }
}

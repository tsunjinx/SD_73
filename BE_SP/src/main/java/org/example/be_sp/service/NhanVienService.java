package org.example.be_sp.service;

import org.example.be_sp.entity.NhanVien;
import org.example.be_sp.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    // Lấy tất cả nhân viên
    public List<NhanVien> getAllNhanVien() {
        return nhanVienRepository.findAll();
    }

    // Tìm nhân viên theo ID
    public NhanVien getNhanVienById(Integer id) {
        return nhanVienRepository.findById(id).orElse(null);
    }

    // Tìm nhân viên theo email
    public NhanVien getNhanVienByEmail(String email) {
        return nhanVienRepository.findByEmail(email);
    }

    // Tìm nhân viên theo tên tài khoản
    public NhanVien getNhanVienByTenTaiKhoan(String tenTaiKhoan) {
        return nhanVienRepository.findByTenTaiKhoan(tenTaiKhoan);
    }

    // Thêm hoặc cập nhật nhân viên
    public NhanVien saveNhanVien(NhanVien nhanVien) {
        return nhanVienRepository.save(nhanVien);
    }

    // Xóa nhân viên
    public void deleteNhanVien(Integer id) {
        nhanVienRepository.deleteById(id);
    }

    // Kiểm tra tồn tại theo email
    public boolean existsByEmail(String email) {
        return nhanVienRepository.existsByEmail(email);
    }

    // Kiểm tra tồn tại theo tên tài khoản
    public boolean existsByTenTaiKhoan(String tenTaiKhoan) {
        return nhanVienRepository.existsByTenTaiKhoan(tenTaiKhoan);
    }

}

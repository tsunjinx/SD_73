package org.example.be_sp.service;

import org.example.be_sp.entity.KhachHang;
import org.example.be_sp.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    public List<KhachHang> findAll() {
        return khachHangRepository.findAll();
    }

    public KhachHang findById(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với id: " + id));
    }

    public KhachHang save(KhachHang kh) {
        // Kiểm tra trùng email
        if (khachHangRepository.findByEmail(kh.getEmail()) != null) {
            throw new RuntimeException("Email đã tồn tại: " + kh.getEmail());
        }
        // Kiểm tra trùng tên tài khoản
        if (khachHangRepository.findByTenTaiKhoan(kh.getTenTaiKhoan()) != null) {
            throw new RuntimeException("Tên tài khoản đã tồn tại: " + kh.getTenTaiKhoan());
        }
        return khachHangRepository.save(kh);
    }

    public KhachHang update(Integer id, KhachHang kh) {
        KhachHang old = findById(id);

        // Nếu email mới khác email cũ thì phải check trùng
        if (!old.getEmail().equals(kh.getEmail())
                && khachHangRepository.findByEmail(kh.getEmail()) != null) {
            throw new RuntimeException("Email đã tồn tại: " + kh.getEmail());
        }

        // Nếu tên tài khoản mới khác tên cũ thì phải check trùng
        if (!old.getTenTaiKhoan().equals(kh.getTenTaiKhoan())
                && khachHangRepository.findByTenTaiKhoan(kh.getTenTaiKhoan()) != null) {
            throw new RuntimeException("Tên tài khoản đã tồn tại: " + kh.getTenTaiKhoan());
        }

        old.setTenKhachHang(kh.getTenKhachHang());
        old.setTenTaiKhoan(kh.getTenTaiKhoan());
        old.setMatKhau(kh.getMatKhau());
        old.setEmail(kh.getEmail());
        old.setSoDienThoai(kh.getSoDienThoai());
        old.setGioiTinh(kh.getGioiTinh());
        old.setNgaySinh(kh.getNgaySinh());
        old.setDeleted(kh.getDeleted());
        old.setUpdateAt(kh.getUpdateAt());
        old.setUpdateBy(kh.getUpdateBy());
        return khachHangRepository.save(old);
    }

    public void delete(Integer id) {
        KhachHang kh = findById(id);
        kh.setDeleted(true); // xóa mềm
        khachHangRepository.save(kh);
    }
}


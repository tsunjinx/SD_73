package org.example.be_sp.repository;

import org.example.be_sp.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {

    NhanVien findByEmail(String email);

    NhanVien findByTenTaiKhoan(String tenTaiKhoan);

    boolean existsByEmail(String email);

    boolean existsByTenTaiKhoan(String tenTaiKhoan);
}

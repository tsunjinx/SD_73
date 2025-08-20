package org.example.be_sp.repository;

import org.example.be_sp.entity.ChiTietSanPhamAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietAnhSanPhamRepository extends JpaRepository<ChiTietSanPhamAnh, Integer> {
}

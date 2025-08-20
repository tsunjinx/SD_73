package org.example.be_sp.repository;

import org.example.be_sp.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    SanPham findSanPhamById(Integer id);
}

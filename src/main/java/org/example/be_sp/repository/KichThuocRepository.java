package org.example.be_sp.repository;

import org.example.be_sp.entity.KichThuoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KichThuocRepository extends JpaRepository<KichThuoc, Integer> {
    KichThuoc findKichThuocById(Integer id);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.NhaSanXuat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhaSanXuatRepository extends JpaRepository<NhaSanXuat, Integer> {
    NhaSanXuat findNhaSanXuatById(Integer id);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    HoaDon getById(Integer id);

    List<HoaDon> deleted(Boolean deleted);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.LoaiMua;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiMuaRepository extends JpaRepository<LoaiMua, Integer> {
    LoaiMua findLoaiMuaById(Integer id);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.ChongNuoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChongNuocRepository extends JpaRepository<ChongNuoc, Integer> {
    ChongNuoc findChongNuocById(Integer id);
}

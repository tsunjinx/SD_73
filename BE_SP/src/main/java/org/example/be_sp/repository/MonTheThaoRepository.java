package org.example.be_sp.repository;

import org.example.be_sp.entity.MonTheThao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonTheThaoRepository extends JpaRepository<MonTheThao, Integer> {
    MonTheThao findMonTheThaoById(Integer id);
}

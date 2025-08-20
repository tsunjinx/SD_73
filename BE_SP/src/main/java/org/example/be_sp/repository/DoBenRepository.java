package org.example.be_sp.repository;

import org.example.be_sp.entity.DoBen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoBenRepository extends JpaRepository<DoBen, Integer> {
    DoBen findDoBenById(Integer id);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.DeGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeGiayRepository extends JpaRepository<DeGiay, Integer> {
    DeGiay findDeGiayById(Integer id);
}

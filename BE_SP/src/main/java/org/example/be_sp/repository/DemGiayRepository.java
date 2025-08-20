package org.example.be_sp.repository;

import org.example.be_sp.entity.DemGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemGiayRepository extends JpaRepository<DemGiay, Integer> {
    DemGiay findDemGiayById(Integer id);
}

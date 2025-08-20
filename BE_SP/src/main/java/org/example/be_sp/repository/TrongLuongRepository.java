package org.example.be_sp.repository;

import org.example.be_sp.entity.TrongLuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrongLuongRepository extends JpaRepository<TrongLuong, Integer> {
    TrongLuong findTrongLuongById(Integer id);
}

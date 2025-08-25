package org.example.be_sp.repository;

import org.example.be_sp.entity.XuatXu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface XuatXuRepository extends JpaRepository<XuatXu, Integer> {
    XuatXu findXuatXuById(Integer id);
}

package org.example.be_sp.repository;

import org.example.be_sp.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia, Integer> {
    
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.deleted = false ORDER BY p.id DESC")
    List<PhieuGiamGia> findAllActive();
    
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.deleted = false ORDER BY p.id DESC")
    Page<PhieuGiamGia> findAllActive(Pageable pageable);
    
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.id = :id AND p.deleted = false")
    PhieuGiamGia findActiveById(@Param("id") Integer id);
    
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.maPhieuGiamGia = :maPhieu AND p.deleted = false")
    PhieuGiamGia findByMaPhieuGiamGia(@Param("maPhieu") String maPhieu);
    
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.trangThai = true AND p.deleted = false " +
           "AND p.ngayBatDau <= :currentDate AND p.ngayKetThuc >= :currentDate")
    List<PhieuGiamGia> findActiveVouchers(@Param("currentDate") LocalDate currentDate);
}
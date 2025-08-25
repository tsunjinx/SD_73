package org.example.be_sp.repository;

import org.example.be_sp.entity.PhieuGiamGiaCaNhan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PhieuGiamGiaCaNhanRepository extends JpaRepository<PhieuGiamGiaCaNhan, Integer> {
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.deleted = false ORDER BY p.id DESC")
    List<PhieuGiamGiaCaNhan> findAllActive();
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.deleted = false ORDER BY p.id DESC")
    Page<PhieuGiamGiaCaNhan> findAllActive(Pageable pageable);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.id = :id AND p.deleted = false")
    PhieuGiamGiaCaNhan findActiveById(@Param("id") Integer id);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.idKhachHang.id = :khachHangId AND p.deleted = false")
    List<PhieuGiamGiaCaNhan> findByKhachHangId(@Param("khachHangId") Integer khachHangId);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.idPhieuGiamGia.id = :phieuGiamGiaId AND p.deleted = false")
    List<PhieuGiamGiaCaNhan> findByPhieuGiamGiaId(@Param("phieuGiamGiaId") Integer phieuGiamGiaId);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.trangThai = true AND p.deleted = false " +
           "AND p.ngayHetHan >= :currentDate")
    List<PhieuGiamGiaCaNhan> findActiveUserVouchers(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.idKhachHang.id = :khachHangId " +
           "AND p.trangThai = true AND p.deleted = false " +
           "AND p.ngayHetHan >= :currentDate")
    List<PhieuGiamGiaCaNhan> findActiveUserVouchersByKhachHang(@Param("khachHangId") Integer khachHangId, 
                                                               @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p " +
           "JOIN p.idKhachHang kh " +
           "JOIN p.idPhieuGiamGia pgg " +
           "WHERE p.deleted = false " +
           "AND (:khachHangId IS NULL OR kh.id = :khachHangId) " +
           "AND (:phieuGiamGiaId IS NULL OR pgg.id = :phieuGiamGiaId) " +
           "AND (:trangThai IS NULL OR p.trangThai = :trangThai) " +
           "ORDER BY p.id DESC")
    Page<PhieuGiamGiaCaNhan> findWithFilters(@Param("khachHangId") Integer khachHangId,
                                            @Param("phieuGiamGiaId") Integer phieuGiamGiaId,
                                            @Param("trangThai") Boolean trangThai,
                                            Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM PhieuGiamGiaCaNhan p WHERE p.idPhieuGiamGia.id = :phieuGiamGiaId AND p.deleted = false")
    Long countByPhieuGiamGiaId(@Param("phieuGiamGiaId") Integer phieuGiamGiaId);
    
    @Query("SELECT p FROM PhieuGiamGiaCaNhan p WHERE p.maPhieuGiamGiaCaNhan = :maPhieu AND p.deleted = false")
    PhieuGiamGiaCaNhan findByMaPhieuGiamGiaCaNhan(@Param("maPhieu") String maPhieu);
}

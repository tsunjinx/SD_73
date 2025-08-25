package org.example.be_sp.model.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class PhieuGiamGiaCaNhanRequest {
    
    private Integer idKhachHang;
    private Integer idPhieuGiamGia;
    private String tenPhieuGiamGiaCaNhan;
    private LocalDate ngayNhan;
    private LocalDate ngayHetHan;
    private Boolean trangThai;
    
    // For bulk assignment
    private List<Integer> idKhachHangList;
    private String assignmentType; // "individual" or "bulk"
    private String bulkCriteria; // "all", "new", "vip"
}

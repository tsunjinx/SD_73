package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "phieu_giam_gia_ca_nhan")
public class PhieuGiamGiaCaNhan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_khach_hang", nullable = false)
    private KhachHang idKhachHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_phieu_giam_gia", nullable = false)
    private PhieuGiamGia idPhieuGiamGia;

    @ColumnDefault("'PGGCN'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_phieu_giam_gia_ca_nhan", length = 10, insertable = false, updatable = false)
    private String maPhieuGiamGiaCaNhan;

    @Nationalized
    @Column(name = "ten_phieu_giam_gia_ca_nhan")
    private String tenPhieuGiamGiaCaNhan;

    @Column(name = "ngay_nhan")
    private LocalDate ngayNhan;

    @Column(name = "ngay_het_han")
    private LocalDate ngayHetHan;

    @ColumnDefault("1")
    @Column(name = "trang_thai")
    private Boolean trangThai;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

}
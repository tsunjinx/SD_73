package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "dia_chi_khach_hang")
public class DiaChiKhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_khach_hang", nullable = false)
    private KhachHang idKhachHang;

    @ColumnDefault("'DC'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_dia_chi", length = 7)
    private String maDiaChi;

    @Nationalized
    @Column(name = "ten_dia_chi")
    private String tenDiaChi;

    @Nationalized
    @Column(name = "thanh_pho")
    private String thanhPho;

    @Nationalized
    @Column(name = "quan")
    private String quan;

    @Column(name = "phuong")
    private String phuong;

    @Column(name = "dia_chi_cu_the")
    private String diaChiCuThe;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

}
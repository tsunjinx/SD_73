package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "dot_giam_gia")
public class DotGiamGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'DGG'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_dot_giam_gia", length = 8)
    private String maDotGiamGia;

    @Nationalized
    @Column(name = "ten_dot_giam_gia")
    private String tenDotGiamGia;

    @Column(name = "gia_tri_giam_gia")
    private Integer giaTriGiamGia;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @ColumnDefault("1")
    @Column(name = "trang_thai")
    private Boolean trangThai;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idDotGiamGia")
    private Set<ChiTietDotGiamGia> chiTietDotGiamGias = new LinkedHashSet<>();

}
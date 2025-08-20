package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "anh_san_pham")
public class AnhSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "duong_dan_anh")
    private String duongDanAnh;

    @Column(name = "loai_anh", length = 10)
    private String loaiAnh;

    @Nationalized
    @Column(name = "mo_ta")
    private String moTa;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idAnhSanPham")
    private Set<ChiTietSanPhamAnh> chiTietSanPhamAnhs = new LinkedHashSet<>();

}
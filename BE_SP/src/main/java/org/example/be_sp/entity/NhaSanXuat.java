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
@Table(name = "nha_san_xuat")
public class NhaSanXuat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'NSX'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_nha_san_xuat", length = 8)
    private String maNhaSanXuat;

    @Nationalized
    @Column(name = "ten_nha_san_xuat")
    private String tenNhaSanXuat;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idNhaSanXuat")
    private Set<SanPham> sanPhams = new LinkedHashSet<>();

}
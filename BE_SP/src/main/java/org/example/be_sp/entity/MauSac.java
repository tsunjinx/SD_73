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
@Table(name = "mau_sac")
public class MauSac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'MS'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_mau_sac", length = 7)
    private String maMauSac;

    @Nationalized
    @Column(name = "ten_mau_sac")
    private String tenMauSac;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idMauSac")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
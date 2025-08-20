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
@Table(name = "mon_the_thao")
public class MonTheThao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'MTT'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_mon_the_thao", length = 8)
    private String maMonTheThao;

    @Nationalized
    @Column(name = "ten_mon_the_thao")
    private String tenMonTheThao;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idMonTheThao")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
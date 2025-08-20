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
@Table(name = "dem_giay")
public class DemGiay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'ÐG'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_dem_giay", length = 7)
    private String maDemGiay;

    @Nationalized
    @Column(name = "ten_dem_giay")
    private String tenDemGiay;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idDemGiay")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
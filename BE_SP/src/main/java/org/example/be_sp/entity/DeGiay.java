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
@Table(name = "de_giay")
public class DeGiay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'DG'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_de_giay", length = 7)
    private String maDeGiay;

    @Nationalized
    @Column(name = "ten_de_giay")
    private String tenDeGiay;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idDeGiay")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
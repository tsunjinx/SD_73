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
@Table(name = "do_ben")
public class DoBen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'DB'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_do_ben", length = 7)
    private String maDoBen;

    @Nationalized
    @Column(name = "ten_do_ben")
    private String tenDoBen;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idDoBen")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
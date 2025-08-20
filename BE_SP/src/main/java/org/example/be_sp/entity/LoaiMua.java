package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "loai_mua")
public class LoaiMua {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'LM'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Generated(GenerationTime.ALWAYS)
    @Column(name = "ma_loai_mua", length = 7)
    private String maLoaiMua;

    @Nationalized
    @Column(name = "ten_loai_mua")
    private String tenLoaiMua;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idLoaiMua")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
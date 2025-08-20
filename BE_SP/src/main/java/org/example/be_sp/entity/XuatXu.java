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
@Table(name = "xuat_xu")
public class XuatXu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'XX'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_xuat_xu", length = 7)
    private String maXuatXu;

    @Nationalized
    @Column(name = "ten_xuat_xu")
    private String tenXuatXu;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idXuatXu")
    private Set<SanPham> sanPhams = new LinkedHashSet<>();

}
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
@Table(name = "phuong_thuc_thanh_toan")
public class PhuongThucThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'PTTT'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_phuong_thuc_thanh_toan", length = 9)
    private String maPhuongThucThanhToan;

    @Nationalized
    @Column(name = "ten_phuong_thuc_thanh_toan")
    private String tenPhuongThucThanhToan;

    @ColumnDefault("1")
    @Column(name = "trang_thai")
    private Boolean trangThai;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idPhuongThucThanhToan")
    private Set<HinhThucThanhToan> hinhThucThanhToans = new LinkedHashSet<>();

}
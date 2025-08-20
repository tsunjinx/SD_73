package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "san_pham")
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_nha_san_xuat", nullable = false)
    private NhaSanXuat idNhaSanXuat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_xuat_xu", nullable = false)
    private XuatXu idXuatXu;

    @ColumnDefault("'SP'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_san_pham", length = 7)
    private String maSanPham;

    @Nationalized
    @Column(name = "ten_san_pham")
    private String tenSanPham;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "create_at")
    private LocalDate createAt;

    @Column(name = "create_by")
    private Integer createBy;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "update_by")
    private Integer updateBy;

    @OneToMany(mappedBy = "idSanPham")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
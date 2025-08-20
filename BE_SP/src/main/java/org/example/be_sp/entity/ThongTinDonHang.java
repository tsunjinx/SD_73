package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "thong_tin_don_hang")
public class ThongTinDonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_hoa_don", nullable = false)
    private HoaDon idHoaDon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_trang_thai_don_hang", nullable = false)
    private TrangThaiDonHang idTrangThaiDonHang;

    @ColumnDefault("'TTDH'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_thong_tin_don_hang", length = 9)
    private String maThongTinDonHang;

    @Column(name = "thoi_gian")
    private Instant thoiGian;

    @Nationalized
    @Column(name = "ghi_chu")
    private String ghiChu;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

}
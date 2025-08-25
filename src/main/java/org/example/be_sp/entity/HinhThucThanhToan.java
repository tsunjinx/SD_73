package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "hinh_thuc_thanh_toan")
public class HinhThucThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_hoa_don", nullable = false)
    private HoaDon idHoaDon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_phuong_thuc_thanh_toan", nullable = false)
    private PhuongThucThanhToan idPhuongThucThanhToan;

    @ColumnDefault("'HTTT'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_hinh_thuc_thanh_toan", length = 9)
    private String maHinhThucThanhToan;

    @Column(name = "tien_chuyen_khoan", precision = 18, scale = 2)
    private BigDecimal tienChuyenKhoan;

    @Column(name = "tien_mat", precision = 18, scale = 2)
    private BigDecimal tienMat;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

}
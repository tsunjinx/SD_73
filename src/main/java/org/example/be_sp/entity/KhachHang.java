package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "khach_hang")
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'KH'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_khach_hang", insertable = false, updatable = false)
    private String maKhachHang;

    @Nationalized
    @Column(name = "ten_khach_hang")
    private String tenKhachHang;

    @Column(name = "ten_tai_khoan")
    private String tenTaiKhoan;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "email")
    private String email;

    @Column(name = "so_dien_thoai", length = 12)
    private String soDienThoai;

    @Column(name = "gioi_tinh")
    private Boolean gioiTinh;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

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

    @OneToMany(mappedBy = "idKhachHang")
    @JsonIgnore
    private Set<DiaChiKhachHang> diaChiKhachHangs = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idKhachHang")
    @JsonIgnore
    private Set<HoaDon> hoaDons = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idKhachHang")
    @JsonIgnore
    private Set<PhieuGiamGiaCaNhan> phieuGiamGiaCaNhans = new LinkedHashSet<>();

}
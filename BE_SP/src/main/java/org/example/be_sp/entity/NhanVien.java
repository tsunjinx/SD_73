package org.example.be_sp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "nhan_vien")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_quyen_han", nullable = false)
    private QuyenHan idQuyenHan;

    @ColumnDefault("'NV'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Column(name = "ma_nhan_vien", insertable = false, updatable = false)
    private String maNhanVien;

    @Nationalized
    @Column(name = "ten_nhan_vien")
    private String tenNhanVien;

    @Column(name = "ten_tai_khoan")
    private String tenTaiKhoan;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "email")
    private String email;

    @Column(name = "so_dien_thoai", length = 12)
    private String soDienThoai;

    @Column(name = "anh_nha_vien")
    private String anhNhaVien;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Nationalized
    @Column(name = "ghi_chu")
    private String ghiChu;

    @Nationalized
    @Column(name = "thanh_pho")
    private String thanhPho;

    @Nationalized
    @Column(name = "quan")
    private String quan;

    @Column(name = "phuong")
    private String phuong;

    @Column(name = "dia_chi_cu_the")
    private String diaChiCuThe;

    @Column(name = "cccd", length = 20)
    private String cccd;

    @ColumnDefault("1")
    @Column(name = "trang_thai")
    private Boolean trangThai;

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

    @OneToMany(mappedBy = "idNhanVien")
    private Set<HoaDon> hoaDons = new LinkedHashSet<>();

}
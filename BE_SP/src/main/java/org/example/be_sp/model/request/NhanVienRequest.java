package org.example.be_sp.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienRequest {
    private Integer id;
    private String maNhanVien;
    private String tenNhanVien;
    private String tenTaiKhoan;
    private String matKhau;
    private String email;
    private String soDienThoai;
    private String anhNhanVien;
    private LocalDate ngaySinh;
    private String chucVu;
    private Integer idQuyenHan; // chỉ để nhận id thôi
}

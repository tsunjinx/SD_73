package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private Integer id;
    private String maKhachHang;
    private String tenKhachHang;
    private String tenTaiKhoan;
    private String email;
    private String soDienThoai;
    private Boolean gioiTinh;
    private LocalDate ngaySinh;
    private LocalDate createAt;
    private String createBy;
    private LocalDate updateAt;
    private String updateBy;
    private Boolean deleted;
}

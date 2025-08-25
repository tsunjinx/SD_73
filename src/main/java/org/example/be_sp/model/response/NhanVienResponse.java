package org.example.be_sp.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienResponse {
    private Integer id;
    private String tenNhanVien;
    private String email;
    private String tenTaiKhoan;
    private Boolean gioiTinh;
    private String soDienThoai;
    private String diaChi;

    private Integer idQuyenHan;   // thêm id quyền hạn
    private String tenQuyenHan;   // thêm tên quyền hạn
}

package org.example.be_sp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "quyen_han")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuyenHan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "ma_quyen_han", length = 3)
    private String maQuyenHan;

    @Nationalized
    @Column(name = "ten_quyen_han")
    private String tenQuyenHan;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idQuyenHan")
    @JsonIgnore
    private Set<NhanVien> nhanViens = new LinkedHashSet<>();

}
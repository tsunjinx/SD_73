package org.example.be_sp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "chat_lieu")
public class ChatLieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("'CL'+right('00000'+CONVERT([varchar](5), [ID]), 5)")
    @Generated(GenerationTime.ALWAYS)
    @Column(name = "ma_chat_lieu", length = 7)
    private String maChatLieu;

    @Nationalized
    @Column(name = "ten_chat_lieu")
    private String tenChatLieu;

    @ColumnDefault("0")
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "idChatLieu")
    private Set<ChiTietSanPham> chiTietSanPhams = new LinkedHashSet<>();

}
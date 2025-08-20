package org.example.be_sp.model.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.be_sp.entity.ChatLieu;

@Getter
@Setter
@NoArgsConstructor
public class ChatLieuResponse {
    private Integer id;

    private String maChatLieu;

    private String tenChatLieu;

    private Boolean deleted;

    public ChatLieuResponse(ChatLieu data) {
        this.id = data.getId();
        this.maChatLieu = data.getMaChatLieu();
        this.tenChatLieu = data.getTenChatLieu();
        this.deleted = data.getDeleted();
    }
}

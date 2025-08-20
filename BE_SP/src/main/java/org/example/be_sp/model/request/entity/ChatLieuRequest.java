package org.example.be_sp.model.request.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatLieuRequest {
    private String tenChatLieu;
    private Boolean deleted;

}

package org.example.be_sp.service;

import org.example.be_sp.entity.ChatLieu;
import org.example.be_sp.model.request.entity.ChatLieuRequest;
import org.example.be_sp.model.response.ChatLieuResponse;
import org.example.be_sp.repository.ChatLieuRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ChatLieuService extends GenericCrudService<ChatLieu, Integer, ChatLieuResponse, ChatLieuRequest> {
    @Autowired
    private ChatLieuRepository chatLieuRepository;


    public ChatLieuService(Class<ChatLieu> entity, Class<ChatLieuResponse> chatLieuResponseClass, Class<ChatLieuRequest> chatLieuRequestClass, JpaRepository<ChatLieu, Integer> chatLieuRepository) {
        super(entity, chatLieuResponseClass, chatLieuRequestClass, chatLieuRepository);
    }
}
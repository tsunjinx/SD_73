package org.example.be_sp.repository;

import org.example.be_sp.entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer> {
    ChatLieu findChatLieuById(Integer id);
}

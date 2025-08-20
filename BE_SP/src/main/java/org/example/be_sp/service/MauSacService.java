package org.example.be_sp.service;

import org.example.be_sp.entity.MauSac;
import org.example.be_sp.model.request.MauSacRequest;
import org.example.be_sp.model.response.MauSacResponse;
import org.example.be_sp.repository.MauSacRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class MauSacService extends GenericCrudService<MauSac, Integer , MauSacResponse, MauSacRequest> {
    @Autowired
    MauSacRepository mauSacRepository;

    public MauSacService(Class<MauSac> entity, Class<MauSacResponse> mauSacResponseClass, Class<MauSacRequest> mauSacRequestClass, JpaRepository<MauSac, Integer> repository) {
        super(entity, mauSacResponseClass, mauSacRequestClass, repository);
    }
}

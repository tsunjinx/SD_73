package org.example.be_sp.service;

import org.example.be_sp.entity.QuyenHan;
import org.example.be_sp.model.request.QuyenHanRequest;
import org.example.be_sp.model.response.QuyenHanResponse;
import org.example.be_sp.repository.QuyenHanRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuyenHanService extends GenericCrudService<QuyenHan, Integer, QuyenHanResponse, QuyenHanRequest> {
    @Autowired
    private QuyenHanRepository quyenHangrepository;
    
    @Autowired
    public QuyenHanService(QuyenHanRepository repository) {
        super(QuyenHan.class, QuyenHanResponse.class, QuyenHanRequest.class, repository);
        this.quyenHangrepository = repository;
    }

    public void updateStatus(Integer id){
        QuyenHan e = quyenHangrepository.findById(id).orElseThrow(()-> new RuntimeException("Khong tim thay quyen han"));
        e.setDeleted(true);
        quyenHangrepository.save(e);
    }
}

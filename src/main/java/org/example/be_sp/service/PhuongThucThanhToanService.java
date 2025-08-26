package org.example.be_sp.service;

import org.example.be_sp.entity.PhuongThucThanhToan;
import org.example.be_sp.model.request.PhuongThucThanhToanRequest;
import org.example.be_sp.model.response.PhuongThucThanhToanResponse;
import org.example.be_sp.repository.PhuongThucThanhToanRepository;
import org.example.be_sp.util.GenericCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhuongThucThanhToanService extends GenericCrudService<PhuongThucThanhToan, Integer, PhuongThucThanhToanResponse, PhuongThucThanhToanRequest> {
    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;
    
    @Autowired
    public PhuongThucThanhToanService(PhuongThucThanhToanRepository repository) {
        super(PhuongThucThanhToan.class, PhuongThucThanhToanResponse.class, PhuongThucThanhToanRequest.class, repository);
        this.phuongThucThanhToanRepository = repository;
    }
    public void updateStatus(Integer id) {
        PhuongThucThanhToan phuongThucThanhToan = phuongThucThanhToanRepository.findById(id).orElseThrow(() -> new RuntimeException("Phương thức thanh toán không tồn tại"));
        phuongThucThanhToan.setDeleted(true);
        phuongThucThanhToanRepository.save(phuongThucThanhToan);
    }

}

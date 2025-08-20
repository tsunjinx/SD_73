package org.example.be_sp.service;

import org.example.be_sp.entity.AnhSanPham;
import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.request.entity.AnhSanPhamRequest;
import org.example.be_sp.model.response.AnhSanPhamResponse;
import org.example.be_sp.model.response.PagingResponse;
import org.example.be_sp.repository.AnhSanPhamRepository;
import org.example.be_sp.util.GenericCrudService;
import org.example.be_sp.util.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnhSanPhamService extends GenericCrudService<AnhSanPham, Integer, AnhSanPhamResponse, AnhSanPhamRequest> {
    @Autowired
    private AnhSanPhamRepository anhSanPhamRepository;

    public AnhSanPhamService(Class<AnhSanPham> entity, Class<AnhSanPhamResponse> anhSanPhamResponseClass, Class<AnhSanPhamRequest> anhSanPhamRequestClass, JpaRepository<AnhSanPham, Integer> anhSanPhamRepository) {
        super(entity, anhSanPhamResponseClass, anhSanPhamRequestClass, anhSanPhamRepository);
    }

    public List<AnhSanPhamResponse> getAllAnhSanPham() {
        return anhSanPhamRepository.findAllByDeletedFalse(false).stream().map(AnhSanPhamResponse::new).toList();
    }

    public PagingResponse<AnhSanPhamResponse> pagingAnhSanPham(int page, int size) {
        return new PagingResponse<>(anhSanPhamRepository.findAll(PageRequest.of(page, size)), page);
    }

    public AnhSanPhamResponse getAnhSanPhamById(int id) {
        return anhSanPhamRepository.findById(id).map(AnhSanPhamResponse::new).orElseThrow(() -> new ApiException("Không tìm thấy ảnh sản phẩm với id: " + id, "404"));
    }

    public void deleteAnhSanPhamById(int id) {
        if (!anhSanPhamRepository.existsById(id)) {
            throw new ApiException("Không tìm thấy ảnh sản phẩm với id: " + id, "404");
        }
        anhSanPhamRepository.deleteById(id);
    }

    public void addAnhSanPham(AnhSanPhamRequest anhSanPhamRequest) {
        AnhSanPham anhSanPham = MapperUtils.map(anhSanPhamRequest, AnhSanPham.class);
        anhSanPhamRepository.save(anhSanPham);
    }

    public void updateAnhSanPham(AnhSanPhamRequest anhSanPhamRequest, int id) {
        AnhSanPham existing = anhSanPhamRepository.findById(id).orElseThrow(() -> new ApiException("Không tìm thấy ảnh sản phẩm với id: " + id, "404"));
        MapperUtils.mapToExisting(anhSanPhamRequest, existing);
        anhSanPhamRepository.save(existing);
    }
}

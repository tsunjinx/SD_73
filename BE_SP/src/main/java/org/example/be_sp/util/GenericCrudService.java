package org.example.be_sp.util;

import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.response.PagingResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.stream.Collectors;

public class GenericCrudService<E, ID, response,request> {
    private final Class<E> entity;
    private final Class<response> responseClass;
    private final JpaRepository<E, ID> repository;

    public GenericCrudService(Class<E> entity, Class<response> responseClass, Class<request> requestClass, JpaRepository<E, ID> repository) {
        this.entity = entity;
        this.responseClass = responseClass;
        this.repository = repository;
    }


    public List<response> getAll() {
        return repository.findAll().stream()
                .map(e -> MapperUtils.map(e, responseClass))
                .collect(Collectors.toList());
    }

    public PagingResponse<response> paging(int page, int size) {
        if (page < 0 || size <= 0) {
            throw new ApiException("Invalid paging parameters", "400");
        }
        return new PagingResponse<>(repository.findAll(PageRequest.of(page, size)).map(e -> MapperUtils.map(e, responseClass)), page);
    }

    public response getById(ID id) {
        return MapperUtils.map(repository.findById(id).orElseThrow(() -> new ApiException("Entity with id " + id + " does not exist", "404")), responseClass);
    }

    public void add(request request) {
        E entity = MapperUtils.map(request, this.entity);
        repository.save(entity);
    }

    public void update(ID id, request request) {
        E entity = MapperUtils.map(request, this.entity);
        if (!repository.existsById(id)) {
            throw new ApiException("Entity with id " + id + " does not exist", "404");
        }
        try {
            entity.getClass().getMethod("setId", id.getClass()).invoke(entity, id);
        } catch (Exception e) {
            throw new ApiException("Error setting ID for entity: " + this.entity, "500");
        }
        repository.save(entity);
    }
}
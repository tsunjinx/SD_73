package org.example.be_sp.util;

import org.example.be_sp.exception.ApiException;
import org.example.be_sp.model.response.PagingResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public class GenericCrudService<E, ID, response,request> {
    private final Class<E> entity;
    private final Class<response> responseClass;
    private final Class<request> requestClass;
    private final JpaRepository<E, ID> repository;

    public GenericCrudService(Class<E> entity, Class<response> responseClass, Class<request> requestClass, JpaRepository<E, ID> repository) {
        this.entity = entity;
        this.responseClass = responseClass;
        this.requestClass = requestClass;
        this.repository = repository;
    }


    public List<response> getAll() {
        return repository.findAll().stream()
                .map(e -> MapperUtils.map(e, responseClass))
                .toList();
    }

    public PagingResponse<response> paging(int page, int size) {
        return new PagingResponse<>(repository.findAll(PageRequest.of(page, size)).map(e -> MapperUtils.map(e, responseClass)), page);
    }

    public response getById(ID id) {
        if (!repository.existsById(id)) {
            throw new ApiException("Entity with id " + id + " does not exist", "404");
        }
        return MapperUtils.map(repository.findById(id).orElseThrow(() -> new ApiException("Cant not find entity with id:" + id, "404")), responseClass);
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
        repository.save(entity);
    }
}
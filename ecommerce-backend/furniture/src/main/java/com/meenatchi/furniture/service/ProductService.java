package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.ProductRequest;
import com.meenatchi.furniture.dto.response.CategoryResponse;
import com.meenatchi.furniture.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getAllProducts(Pageable pageable);
    ProductResponse getProductById(Long id);
    Page<ProductResponse> searchProducts(String query, Pageable pageable);
    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    List<CategoryResponse> getAllCategories();
}


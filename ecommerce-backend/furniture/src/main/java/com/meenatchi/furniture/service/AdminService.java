package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.BlockUserRequest;
import com.meenatchi.furniture.dto.request.ProductRequest;
import com.meenatchi.furniture.dto.request.UpdateOrderStatusRequest;
import com.meenatchi.furniture.dto.response.AdminDashboardResponse;
import com.meenatchi.furniture.dto.response.OrderResponse;
import com.meenatchi.furniture.dto.response.ProductResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    AdminDashboardResponse getDashboardStats();

    Page<UserResponse> getAllUsers(int page, int limit, String search, String status);

    UserResponse blockUser(Long userId, BlockUserRequest request);

    UserResponse unblockUser(Long userId);

    Page<ProductResponse> getAllProducts(int page, int limit);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long productId, ProductRequest request);

    void deleteProduct(Long productId);

    Page<OrderResponse> getAllOrders(int page, int limit);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
}


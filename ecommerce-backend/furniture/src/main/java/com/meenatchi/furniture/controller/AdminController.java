package com.meenatchi.furniture.controller;

import com.meenatchi.furniture.constant.AppConstants;
import com.meenatchi.furniture.dto.request.BlockUserRequest;
import com.meenatchi.furniture.dto.request.ProductRequest;
import com.meenatchi.furniture.dto.request.UpdateOrderStatusRequest;
import com.meenatchi.furniture.dto.response.AdminDashboardResponse;
import com.meenatchi.furniture.dto.response.OrderResponse;
import com.meenatchi.furniture.dto.response.ProductResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import com.meenatchi.furniture.service.AdminService;
import com.meenatchi.furniture.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConstants.ADMIN_PREFIX)
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard", description = "Get admin dashboard metrics")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard retrieved", dashboard));
    }

    @GetMapping("/users")
    @Operation(summary = "Get users", description = "Get all users with pagination and filtering")
    public ResponseEntity<ApiResponse<?>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        Page<UserResponse> users = adminService.getAllUsers(page, limit, search, status);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/users/{id}/block")
    @Operation(summary = "Block user", description = "Block a user account")
    public ResponseEntity<ApiResponse<?>> blockUser(
            @PathVariable Long id,
            @Valid @RequestBody BlockUserRequest request) {
        UserResponse user = adminService.blockUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User blocked successfully", user));
    }

    @PutMapping("/users/{id}/unblock")
    @Operation(summary = "Unblock user", description = "Unblock a user account")
    public ResponseEntity<ApiResponse<?>> unblockUser(@PathVariable Long id) {
        UserResponse user = adminService.unblockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unblocked successfully", user));
    }

    @GetMapping("/products")
    @Operation(summary = "Get products", description = "Get all products with pagination")
    public ResponseEntity<ApiResponse<?>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<ProductResponse> products = adminService.getAllProducts(page, limit);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", products));
    }

    @PostMapping("/products")
    @Operation(summary = "Create product", description = "Create a new product")
    public ResponseEntity<ApiResponse<?>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = adminService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update product", description = "Update an existing product")
    public ResponseEntity<ApiResponse<?>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = adminService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete product", description = "Delete a product")
    public ResponseEntity<ApiResponse<?>> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get orders", description = "Get all orders with pagination")
    public ResponseEntity<ApiResponse<?>> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<OrderResponse> orders = adminService.getAllOrders(page, limit);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status", description = "Update order status")
    public ResponseEntity<ApiResponse<?>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse order = adminService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }
}

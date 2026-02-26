package com.meenatchi.furniture.controller;

import com.meenatchi.furniture.constant.AppConstants;
import com.meenatchi.furniture.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Order Controller - handles order operations
 */
@RestController
@RequestMapping(AppConstants.ORDER_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    @PostMapping
    @Operation(summary = "Create order", description = "Create a new order from cart")
    public ResponseEntity<ApiResponse<?>> createOrder() {
        // TODO: Implement order creation
        return ResponseEntity.ok(ApiResponse.success("Order created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get orders", description = "Get user's orders")
    public ResponseEntity<ApiResponse<?>> getOrders() {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order", description = "Get order details")
    public ResponseEntity<ApiResponse<?>> getOrder(@PathVariable String id) {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Order retrieved"));
    }
}


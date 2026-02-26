package com.meenatchi.furniture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private long id;
    private String orderNumber;
    private String status;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String notes;
    private Set<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {

        private long id;
        private ProductResponse product;
        private Integer quantity;
        private BigDecimal priceAtTime;
    }
}


package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.AddToCartRequest;
import com.meenatchi.furniture.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItem(Long userId, Long itemId, Integer quantity);
    CartResponse removeFromCart(Long userId, Long itemId);
    CartResponse clearCart(Long userId);
    CartResponse validateCart(Long userId);
}


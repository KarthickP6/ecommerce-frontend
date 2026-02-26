package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.AddToCartRequest;
import com.meenatchi.furniture.dto.response.CartResponse;
import com.meenatchi.furniture.entity.Cart;
import com.meenatchi.furniture.entity.CartItem;
import com.meenatchi.furniture.entity.Product;
import com.meenatchi.furniture.exception.BusinessException;
import com.meenatchi.furniture.exception.ResourceNotFoundException;
import com.meenatchi.furniture.repository.CartItemRepository;
import com.meenatchi.furniture.repository.CartRepository;
import com.meenatchi.furniture.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

/**
 * Cart Service Implementation
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock");
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .priceAtTime(product.getPrice())
                    .build();
        }

        cartItemRepository.save(cartItem);
        cart = cartRepository.findByUserId(userId).get();
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Item does not belong to this cart");
        }

        if (quantity <= 0) {
            throw new BusinessException("Quantity must be greater than 0");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        cart = cartRepository.findByUserId(userId).get();
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Item does not belong to this cart");
        }

        cartItemRepository.delete(cartItem);
        cart = cartRepository.findByUserId(userId).get();
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().clear();
        cart = cartRepository.save(cart);
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse validateCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + item.getProduct().getName());
            }
        }

        return mapToCartResponse(cart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        BigDecimal totalPrice = cart.getItems().stream()
                .map(item -> item.getPriceAtTime().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .itemCount(cart.getItems().size())
                .totalPrice(totalPrice)
                .items(cart.getItems().stream()
                        .map(item -> CartResponse.CartItemResponse.builder()
                                .id(item.getId())
                                .quantity(item.getQuantity())
                                .priceAtTime(item.getPriceAtTime())
                                .build())
                        .collect(Collectors.toSet()))
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}


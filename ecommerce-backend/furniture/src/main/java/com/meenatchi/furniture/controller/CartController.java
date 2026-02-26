package com.meenatchi.furniture.controller;

import com.meenatchi.furniture.constant.AppConstants;
import com.meenatchi.furniture.dto.request.AddToCartRequest;
import com.meenatchi.furniture.dto.response.CartResponse;
import com.meenatchi.furniture.service.CartService;
import com.meenatchi.furniture.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Cart Controller - handles shopping cart operations
 */
@RestController
@RequestMapping(AppConstants.CART_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management APIs")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get cart", description = "Get current user's shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add to cart", description = "Add product to shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item", description = "Update quantity of item in cart")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.updateCartItem(userId, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove from cart", description = "Remove item from shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            Authentication authentication,
            @PathVariable Long itemId) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.removeFromCart(userId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @PostMapping("/clear")
    @Operation(summary = "Clear cart", description = "Clear all items from shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate cart", description = "Validate cart items before checkout")
    public ResponseEntity<ApiResponse<CartResponse>> validateCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.validateCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart is valid", cart));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        // TODO: Extract user ID from JWT token
        return 1L; // Default for now
    }
}


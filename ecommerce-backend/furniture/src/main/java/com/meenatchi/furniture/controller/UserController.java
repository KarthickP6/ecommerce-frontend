package com.meenatchi.furniture.controller;

import com.meenatchi.furniture.constant.AppConstants;
import com.meenatchi.furniture.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * User Controller - handles user profile and preferences
 */
@RestController
@RequestMapping(AppConstants.USER_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management APIs")
public class UserController {

    @GetMapping("/profile")
    @Operation(summary = "Get profile", description = "Get user profile")
    public ResponseEntity<ApiResponse<?>> getProfile() {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved"));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update profile", description = "Update user profile")
    public ResponseEntity<ApiResponse<?>> updateProfile() {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Profile updated"));
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get addresses", description = "Get user addresses")
    public ResponseEntity<ApiResponse<?>> getAddresses() {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved"));
    }

    @GetMapping("/wishlist")
    @Operation(summary = "Get wishlist", description = "Get user wishlist")
    public ResponseEntity<ApiResponse<?>> getWishlist() {
        // TODO: Implement
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved"));
    }
}

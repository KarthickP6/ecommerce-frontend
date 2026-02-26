package com.meenatchi.furniture.controller;

import com.meenatchi.furniture.constant.AppConstants;
import com.meenatchi.furniture.dto.request.ForgotPasswordRequest;
import com.meenatchi.furniture.dto.request.GoogleOAuthRequest;
import com.meenatchi.furniture.dto.request.LoginRequest;
import com.meenatchi.furniture.dto.request.RefreshTokenRequest;
import com.meenatchi.furniture.dto.request.RegisterRequest;
import com.meenatchi.furniture.dto.response.AuthResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import com.meenatchi.furniture.service.AuthService;
import com.meenatchi.furniture.service.GoogleOAuthService;
import com.meenatchi.furniture.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller - handles login, register, OAuth, and logout
 */
@RestController
@RequestMapping(AppConstants.AUTH_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Login with email and password to get JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/google")
    @Operation(summary = "Google OAuth authentication", description = "Authenticate with Google ID token")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateWithGoogle(@Valid @RequestBody GoogleOAuthRequest request) {
        AuthResponse response = googleOAuthService.authenticateWithGoogle(request.getIdToken());
        return ResponseEntity.ok(ApiResponse.success("Google authentication successful", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout and invalidate tokens")
    public ResponseEntity<ApiResponse<?>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Get new access token using refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Request password reset")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // TODO: Implement email sending
        return ResponseEntity.ok(ApiResponse.success("Password reset email sent"));
    }

    @GetMapping("/verify-token")
    @Operation(summary = "Verify token", description = "Check if current token is valid")
    public ResponseEntity<ApiResponse<?>> verifyToken() {
        return ResponseEntity.ok(ApiResponse.success("Token is valid"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get details of currently logged-in user")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", user));
    }
}


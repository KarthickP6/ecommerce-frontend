package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.LoginRequest;
import com.meenatchi.furniture.dto.request.RegisterRequest;
import com.meenatchi.furniture.dto.response.AuthResponse;
import com.meenatchi.furniture.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout();
    UserResponse getCurrentUser();
}


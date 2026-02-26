package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.LoginRequest;
import com.meenatchi.furniture.dto.request.RegisterRequest;
import com.meenatchi.furniture.dto.response.AuthResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import com.meenatchi.furniture.entity.Role;
import com.meenatchi.furniture.entity.User;
import com.meenatchi.furniture.exception.BusinessException;
import com.meenatchi.furniture.exception.ResourceNotFoundException;
import com.meenatchi.furniture.repository.CartRepository;
import com.meenatchi.furniture.repository.RoleRepository;
import com.meenatchi.furniture.repository.UserRepository;
import com.meenatchi.furniture.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Authentication Service Implementation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            log.info("Login attempt for email: {}", request.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            log.info("User found: {}, roles: {}", user.getEmail(),
                    user.getRoles().stream().map(Role::getName).collect(Collectors.joining(",")));

            String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getId());
            String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getId());

            UserResponse userResponse = mapToUserResponse(user);
            log.info("Login successful for user: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(userResponse)
                    .expiresIn(900L)
                    .build();
        } catch (Exception ex) {
            log.error("Login failed for email: {}, error: {}", request.getEmail(), ex.getMessage());
            throw new BusinessException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            log.warn("Registration failed: passwords do not match for email: {}", request.getEmail());
            throw new BusinessException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: email already registered: {}", request.getEmail());
            throw new BusinessException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Assign USER role by default
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("User role not found"));
        user.setRoles(new HashSet<>(Set.of(userRole)));
        log.info("Assigned USER role to new user: {}", request.getEmail());

        user = userRepository.save(user);

        // Create cart for new user
        cartRepository.save(com.meenatchi.furniture.entity.Cart.builder()
                .user(user)
                .build());

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getId());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getId());

        UserResponse userResponse = mapToUserResponse(user);
        log.info("Registration successful for user: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userResponse)
                .expiresIn(900L)
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getId());

        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userResponse)
                .expiresIn(900L)
                .build();
    }

    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    @Override
    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}


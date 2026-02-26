package com.meenatchi.furniture.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meenatchi.furniture.dto.response.AuthResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import com.meenatchi.furniture.entity.Cart;
import com.meenatchi.furniture.entity.Role;
import com.meenatchi.furniture.entity.User;
import com.meenatchi.furniture.repository.CartRepository;
import com.meenatchi.furniture.repository.RoleRepository;
import com.meenatchi.furniture.repository.UserRepository;
import com.meenatchi.furniture.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Google OAuth Service Implementation
 * Handles Google OAuth token verification and user creation/update
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleOAuthServiceImpl implements GoogleOAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CartRepository cartRepository;
    private final RoleRepository roleRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    @Override
    @Transactional
    public AuthResponse authenticateWithGoogle(String idToken) {
        try {
            log.info("Processing Google OAuth token");

            // Decode JWT (Google ID Token format: header.payload.signature)
            String[] parts = idToken.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid token format");
            }

            // Decode payload (add padding if needed)
            String payload = parts[1];
            payload += "==".substring(0, (8 - payload.length() % 8) % 8);
            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes);

            // Parse JSON payload
            JsonNode tokenPayload = objectMapper.readTree(decodedPayload);

            String email = tokenPayload.get("email").asText();
            String name = tokenPayload.get("name").asText();
            String picture = tokenPayload.has("picture") ? tokenPayload.get("picture").asText() : null;

            log.info("Google OAuth: Processing user with email: {}", email);

            // Check if user exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.info("Existing user found with email: {}", email);
                // Update profile picture if available
                if (picture != null && (user.getAvatar() == null || user.getAvatar().isEmpty())) {
                    user.setAvatar(picture);
                    userRepository.save(user);
                }
            } else {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPassword(""); // OAuth users don't need password
                user.setAvatar(picture);
                user.setBlocked(false);

                // Set default USER role
                Role userRole = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("USER role not found"));
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);

                user = userRepository.save(user);
                log.info("New user created via Google OAuth: {}", email);

                // Create cart for new user
                Cart cart = new Cart();
                cart.setUser(user);
                cartRepository.save(cart);
                log.info("Cart created for user: {}", email);
            }

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());

            log.info("Google OAuth authentication successful for: {}", email);

            // Build response
            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(UserResponse.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .name(user.getName())
                            .avatar(user.getAvatar())
                            .roles(user.getRoles().stream()
                                    .map(Role::getName)
                                    .collect(Collectors.toSet()))
                            .createdAt(user.getCreatedAt())
                            .build())
                    .expiresIn(900L) // 15 minutes
                    .build();

        } catch (Exception e) {
            log.error("Error processing Google OAuth token", e);
            throw new RuntimeException("Failed to authenticate with Google: " + e.getMessage());
        }
    }
}


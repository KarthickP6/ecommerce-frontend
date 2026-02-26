package com.meenatchi.furniture.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Google OAuth Request DTO
 * Contains the ID token received from frontend after Google authentication
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleOAuthRequest {
    private String idToken;
}


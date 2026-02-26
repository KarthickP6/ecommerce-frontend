package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.response.AuthResponse;

/**
 * Google OAuth Service Interface
 * Handles Google OAuth authentication and token verification
 */
public interface GoogleOAuthService {
    /**
     * Authenticate user with Google OAuth token
     * @param idToken - Google ID Token from frontend
     * @return AuthResponse with user data and tokens
     */
    AuthResponse authenticateWithGoogle(String idToken);
}


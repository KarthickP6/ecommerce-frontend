import axiosInstance from './axiosInstance';

/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_TOKEN: '/auth/verify-token',
};

/**
 * Login with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with user data and tokens
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 * @param name - User name
 * @param email - User email
 * @param password - User password
 * @param confirmPassword - Password confirmation
 * @returns Promise with user data and tokens
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
      name,
      email,
      password,
      confirmPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * Clears tokens from server
 * @returns Promise
 */
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 * TODO: Implement refresh logic in axios interceptor
 * @param refreshToken - The refresh token
 * @returns Promise with new access token
 */
export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param email - User email
 * @returns Promise
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param token - Password reset token
 * @param newPassword - New password
 * @param confirmPassword - Password confirmation
 * @returns Promise
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify if token is still valid
 * @returns Promise with verification result
 */
export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get(AUTH_ENDPOINTS.VERIFY_TOKEN);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyToken,
};


import axios from 'axios';

/**
 * Axios Instance Configuration
 * Handles API communication with JWT token management
 */

// Get base URL from environment variables
// IMPORTANT: Must use http://localhost:8080/api for backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Log the API base URL for debugging
console.log('API Base URL configured:', API_BASE_URL);
console.log('VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);

/**
 * Create Axios Instance
 * Configure base URL and timeout
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attach JWT token to all requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from localStorage or sessionStorage
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response
    // Response structure: { data, status, statusText, headers, config }
    // The backend wraps responses in ApiResponse, so return the full response
    // including the nested data structure
    console.log('axiosInstance - Response received:', {
      status: response.status,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
    });
    return response;
  },
  (error) => {
    // Handle response errors
    const { response, message } = error;

    if (response) {
      // Server responded with error status
      const { status, data } = response;

      console.error(`API Error [${status}]:`, data?.message || message);

      // Handle different status codes
      switch (status) {
        case 400:
          // Bad Request
          console.error('Bad Request:', data?.message);
          break;

        case 401:
          // Unauthorized - Token expired or invalid
          // TODO: Implement token refresh logic here
          // - Clear tokens from storage
          // - Redirect to login
          // - Refresh token logic will be added later
          console.error('Unauthorized - Token may be expired');
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('accessToken');
          // Redirect to login can be implemented here
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Forbidden - Access denied');
          break;

        case 404:
          // Not Found
          console.error('Not Found:', data?.message);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server Error:', data?.message || 'Please try again later');
          break;

        default:
          console.error('Error:', data?.message || message);
      }

      // Return error in consistent format
      return Promise.reject({
        status,
        message: data?.message || message,
        data: data?.data || null,
      });
    }

    // Network error or no response from server
    console.error('Network Error:', message);
    return Promise.reject({
      status: 0,
      message: message || 'Network error. Please check your connection.',
      data: null,
    });
  }
);

export default axiosInstance;

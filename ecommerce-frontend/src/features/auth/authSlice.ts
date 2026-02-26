import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '@/api/authApi';

/**
 * Helper function to derive primary role from roles array
 * Backend returns Set<String> with values like ["ADMIN", "USER"]
 * We need a single role for easier checking
 */
const deriveRoleFromRoles = (roles?: string[]): 'user' | 'admin' => {
  if (!roles || roles.length === 0) return 'user';
  // Check if ADMIN role exists (case-insensitive)
  return roles.some(r => r.toUpperCase() === 'ADMIN') ? 'admin' : 'user';
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  roles?: string[]; // From backend
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

/**
 * Async Thunk: Login User
 * Handles login API call and stores user data
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.loginUser(credentials.email, credentials.password);
      console.log('authSlice - Full API response:', response);

      // axios response structure (after our interceptor returns full response):
      // response.data = { success: true, message: "...", data: { user, accessToken, refreshToken, ... }, timestamp: "..." }
      const apiResponse = response.data; // This is our backend response wrapper

      if (!apiResponse) {
        console.error('authSlice - No response data from server');
        return rejectWithValue('No response data from server');
      }

      console.log('authSlice - API response data:', apiResponse);

      // Check if response was successful
      if (!apiResponse.success) {
        console.error('authSlice - Response indicates failure:', apiResponse.message);
        return rejectWithValue(apiResponse.message || 'Login failed');
      }

      // Extract the actual auth data from the nested data property
      const authData = apiResponse.data; // This contains { user, accessToken, refreshToken, tokenType, expiresIn }

      console.log('authSlice - Auth data extracted:', authData);
      console.log('authSlice - Checking authData:', {
        exists: !!authData,
        authDataKeys: authData ? Object.keys(authData) : [],
        hasUser: !!authData?.user,
        hasAccessToken: !!authData?.accessToken,
      });

      // Validate all required fields
      if (!authData) {
        console.error('authSlice - authData is null or undefined');
        return rejectWithValue('No authentication data received');
      }

      if (!authData.user) {
        console.error('authSlice - user is missing:', authData);
        return rejectWithValue('Missing user data in response');
      }

      if (!authData.accessToken) {
        console.error('authSlice - accessToken is missing:', authData);
        return rejectWithValue('Missing access token in response');
      }

      console.log('authSlice - Auth data valid, user:', {
        id: authData.user.id,
        email: authData.user.email,
        roles: authData.user.roles,
      });

      // Store tokens in secure storage
      localStorage.setItem('accessToken', authData.accessToken);
      if (authData.refreshToken) {
        sessionStorage.setItem('refreshToken', authData.refreshToken);
      }

      // Return only the auth data fields needed
      const returnData = {
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      };

      console.log('authSlice - Returning to Redux:', returnData);
      return returnData;
    } catch (error: any) {
      console.error('authSlice - Login error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async Thunk: Register User
 * Handles registration API call
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.registerUser(
        userData.name,
        userData.email,
        userData.password,
        userData.confirmPassword
      );
      // Extract data from response wrapper
      const apiResponse = response.data;
      console.log('authSlice - Register API response:', apiResponse);

      if (!apiResponse) {
        return rejectWithValue('No response data from server');
      }

      if (!apiResponse.success) {
        console.error('authSlice - Registration failed:', apiResponse.message);
        return rejectWithValue(apiResponse.message || 'Registration failed');
      }

      const authData = apiResponse.data;
      console.log('authSlice - Register auth data:', authData);

      // Validate all required fields
      if (!authData) {
        return rejectWithValue('No authentication data received');
      }

      if (!authData.user) {
        return rejectWithValue('Missing user data in response');
      }

      if (!authData.accessToken) {
        return rejectWithValue('Missing access token in response');
      }

      // Store token in localStorage
      localStorage.setItem('accessToken', authData.accessToken);
      if (authData.refreshToken) {
        sessionStorage.setItem('refreshToken', authData.refreshToken);
      }

      // Return in same structure as loginUser
      const returnData = {
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      };

      console.log('authSlice - Register returning to Redux:', returnData);
      return returnData;
    } catch (error: any) {
      console.error('authSlice - Registration error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async Thunk: Google OAuth Authentication
 * Handles Google OAuth token verification and user creation/login
 */
export const googleOAuthLogin = createAsyncThunk(
  'auth/googleOAuthLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await authApi.googleAuthenticate(idToken);
      const apiResponse = response.data;
      console.log('authSlice - Google OAuth API response:', apiResponse);

      if (!apiResponse || !apiResponse.success) {
        return rejectWithValue(apiResponse?.message || 'Google authentication failed');
      }

      const authData = apiResponse.data;
      if (!authData || !authData.user || !authData.accessToken) {
        return rejectWithValue('Invalid response from Google authentication');
      }

      // Store tokens
      localStorage.setItem('accessToken', authData.accessToken);
      if (authData.refreshToken) {
        sessionStorage.setItem('refreshToken', authData.refreshToken);
      }

      return {
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      };
    } catch (error: any) {
      console.error('authSlice - Google OAuth error:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Google authentication failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async Thunk: Logout User
 * Clears tokens and calls logout API
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutUser();
      // Clear tokens from storage
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      return null;
    } catch (error: any) {
      // Still clear tokens even if API call fails
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/**
 * Auth Slice
 * Manages authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action for successful login
    loginSuccess: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
      state.error = null;
    },

    // Action for login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = action.payload;
    },

    // Action for logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },

    // Action to set access token
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Action to clear error
    clearError: (state) => {
      state.error = null;
    },

    // Action to restore auth state from storage
    restoreAuth: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    // Login async thunk handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        console.log('Redux - loginUser fulfilled, payload:', action.payload);

        // Extract role from roles array returned by backend
        // action.payload structure: { user, accessToken, refreshToken }
        const user = {
          ...action.payload.user,
          role: deriveRoleFromRoles(action.payload.user.roles),
        };
        console.log('Redux - Derived user:', user);

        state.user = user;
        state.accessToken = action.payload.accessToken;
        state.error = null;

        console.log('Redux - State updated:', {
          isAuthenticated: state.isAuthenticated,
          userEmail: state.user?.email,
          hasAccessToken: !!state.accessToken,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Register async thunk handlers
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // Extract role from roles array returned by backend
        // action.payload structure: { user, accessToken, refreshToken }
        const user = {
          ...action.payload.user,
          role: deriveRoleFromRoles(action.payload.user.roles),
        };
        state.user = user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Google OAuth async thunk handlers
    builder
      .addCase(googleOAuthLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleOAuthLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // Extract role from roles array returned by backend
        // action.payload structure: { user, accessToken, refreshToken }
        const user = {
          ...action.payload.user,
          role: deriveRoleFromRoles(action.payload.user.roles),
        };
        state.user = user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(googleOAuthLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout async thunk handlers
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Keep cleared state even on error
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  setAccessToken,
  clearError,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;


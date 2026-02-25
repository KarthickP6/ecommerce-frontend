import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '@/api/authApi';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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
      // Store token in localStorage
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        sessionStorage.setItem('refreshToken', response.refreshToken);
      }
      return {
        user: response.user,
        accessToken: response.accessToken,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
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
      // Store token in localStorage
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        sessionStorage.setItem('refreshToken', response.refreshToken);
      }
      return {
        user: response.user,
        accessToken: response.accessToken,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
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
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
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
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
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


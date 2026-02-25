import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

    // Action to update access token
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


import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: number;
  topProducts: Array<{ id: string; name: string; sales: number }>;
}

interface AdminState {
  analytics: Analytics | null;
  selectedUserId: string | null;
  selectedProductId: string | null;
  filters: {
    dateRange: string;
    status: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  analytics: null,
  selectedUserId: null,
  selectedProductId: null,
  filters: {
    dateRange: 'month',
    status: 'all',
  },
  loading: false,
  error: null,
};

/**
 * Admin Slice
 * Manages admin dashboard, analytics, and management features
 */
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setAnalytics: (state, action: PayloadAction<Analytics>) => {
      state.analytics = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedUserId: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },

    setSelectedProductId: (state, action: PayloadAction<string | null>) => {
      state.selectedProductId = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<AdminState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSelectedItems: (state) => {
      state.selectedUserId = null;
      state.selectedProductId = null;
    },
  },
});

export const {
  setLoading,
  setAnalytics,
  setSelectedUserId,
  setSelectedProductId,
  setFilters,
  resetFilters,
  setError,
  clearError,
  clearSelectedItems,
} = adminSlice.actions;

export default adminSlice.reducer;


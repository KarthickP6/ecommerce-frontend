import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as adminApi from '../../api/adminApi';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  blocked?: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  rating: number;
  category: any;
  images: string[];
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalPrice: number;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminState {
  dashboard: DashboardStats | null;
  users: {
    data: User[];
    total: number;
    page: number;
    limit: number;
  };
  products: {
    data: Product[];
    total: number;
    page: number;
    limit: number;
  };
  orders: {
    data: Order[];
    total: number;
    page: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  dashboard: null,
  users: { data: [], total: 0, page: 1, limit: 20 },
  products: { data: [], total: 0, page: 1, limit: 20 },
  orders: { data: [], total: 0, page: 1, limit: 20 },
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      return await adminApi.getAllUsers(params.page, params.limit, params.search, params.status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const blockUserThunk = createAsyncThunk(
  'admin/blockUser',
  async (params: { id: string; blocked: boolean; reason?: string }, { rejectWithValue }) => {
    try {
      return await adminApi.blockUser(params.id, params.blocked, params.reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

export const unblockUserThunk = createAsyncThunk(
  'admin/unblockUser',
  async (id: string, { rejectWithValue }) => {
    try {
      return await adminApi.unblockUser(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock user');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await adminApi.getAllProducts(params.page, params.limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'admin/createProduct',
  async (productData: any, { rejectWithValue }) => {
    try {
      return await adminApi.createProduct(productData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'admin/updateProduct',
  async (params: { id: string; data: any }, { rejectWithValue }) => {
    try {
      return await adminApi.updateProduct(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'admin/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await adminApi.getAllOrders(params.page, params.limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'admin/updateOrderStatus',
  async (params: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await adminApi.updateOrderStatus(params.id, params.status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.loading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.data = action.payload.content || [];
        state.users.total = action.payload.totalElements || 0;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        const index = state.users.data.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users.data[index] = action.payload;
        }
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        const index = state.users.data.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users.data[index] = action.payload;
        }
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.data = action.payload.content || [];
        state.products.total = action.payload.totalElements || 0;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.data.unshift(action.payload.data || action.payload);
        state.loading = false;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.data.findIndex((p) => p.id === action.payload.data?.id || action.payload?.id);
        if (index !== -1) {
          state.products.data[index] = action.payload.data || action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products.data = state.products.data.filter((p) => p.id !== parseInt(action.payload));
        state.loading = false;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders.data = action.payload.content || [];
        state.orders.total = action.payload.totalElements || 0;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const index = state.orders.data.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders.data[index] = action.payload;
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;


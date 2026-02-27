import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as productApi from '@/api/productApi';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCategories = createAsyncThunk(
  'product/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getCategories();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch categories');
    }
  }
);

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params: { page?: number; limit?: number; search?: string; category?: string }, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts(
        params.page || 0,
        params.limit || 20,
        params.search || '',
        params.category || ''
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch product');
    }
  }
);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: any[];
  filters: {
    search: string;
    category: string;
    priceMin: number;
    priceMax: number;
    rating: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  categories: [],
  filters: {
    search: '',
    category: '',
    priceMin: 0,
    priceMax: 10000,
    rating: 0,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
  loading: false,
  error: null,
};

/**
 * Product Slice
 * Manages product listing, search, filter, and details
 */
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setProducts: (state, action: PayloadAction<{ products: Product[]; total: number }>) => {
      state.products = action.payload.products;
      state.pagination.total = action.payload.total;
      state.loading = false;
      state.error = null;
    },

    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
      state.loading = false;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 when filters change
    },

    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        // Backend returns: { success, data: { content: [...], totalElements, totalPages, number, size }, ... }
        const payload = action.payload;

        // Extract products from content array
        const content = payload?.content || payload?.data?.content || [];
        const totalElements = payload?.totalElements || payload?.data?.totalElements || 0;

        state.products = Array.isArray(content) ? content : [];
        state.pagination.total = totalElements;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<any>) => {
        // Backend returns: { success, data: [...], message, timestamp }
        // data can be array directly or wrapped in object
        const payload = action.payload;
        state.categories = Array.isArray(payload) ? payload : (payload.data || payload || []);
        state.loading = false;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setProducts,
  setSelectedProduct,
  setError,
  setFilters,
  setPagination,
  resetFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;

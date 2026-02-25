import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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


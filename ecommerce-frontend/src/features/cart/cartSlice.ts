import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../product/productSlice';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

/**
 * Utility function to calculate cart totals
 */
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

/**
 * Cart Slice
 * Manages shopping cart state and operations
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;


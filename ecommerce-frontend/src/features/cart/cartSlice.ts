import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../product/productSlice';
import * as cartApi from '@/api/cartApi';

export interface CartItem {
  id?: string;
  productId: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  syncLoading: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
  syncLoading: false,
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
 * Async Thunk: Fetch cart from API
 * Retrieves user's cart with JWT authentication
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

/**
 * Async Thunk: Add item to cart via API
 * Sends JWT token automatically through axios interceptor
 */
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartApi.addToCart(productId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

/**
 * Async Thunk: Update cart item quantity via API
 * Sends JWT token automatically through axios interceptor
 */
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartApi.updateCartItem(itemId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

/**
 * Async Thunk: Remove item from cart via API
 * Sends JWT token automatically through axios interceptor
 */
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(itemId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

/**
 * Async Thunk: Clear entire cart via API
 * Sends JWT token automatically through axios interceptor
 */
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

/**
 * Async Thunk: Validate cart items before checkout
 * Sends JWT token automatically through axios interceptor
 */
export const validateCartAsync = createAsyncThunk(
  'cart/validateCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.validateCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Cart validation failed');
    }
  }
);

/**
 * Cart Slice
 * Manages shopping cart state and operations
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Synchronous: Add item to local cart
     * Used for optimistic updates or when API call is not needed
     */
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          productId: action.payload.product.id,
          product: action.payload.product,
          quantity: action.payload.quantity,
        });
      }

      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      state.error = null;
    },

    /**
     * Synchronous: Remove item from local cart
     * Used for optimistic updates or when API call is not needed
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      state.error = null;
    },

    /**
     * Synchronous: Update item quantity in local cart
     * Used for optimistic updates or when API call is not needed
     */
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
      state.error = null;
    },

    /**
     * Synchronous: Clear all items from local cart
     */
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.loading = false;
      state.error = null;
    },

    /**
     * Synchronous: Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Synchronous: Set sync loading state for API operations
     */
    setSyncLoading: (state, action: PayloadAction<boolean>) => {
      state.syncLoading = action.payload;
    },

    /**
     * Synchronous: Set error message
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Synchronous: Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;
          const { total, itemCount } = calculateTotals(state.items);
          state.total = total;
          state.itemCount = itemCount;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch cart';
      });

    // Add to Cart Async
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.syncLoading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;
          const { total, itemCount } = calculateTotals(state.items);
          state.total = total;
          state.itemCount = itemCount;
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = (action.payload as string) || 'Failed to add item to cart';
      });

    // Update Cart Item Async
    builder
      .addCase(updateCartItemAsync.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.syncLoading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;
          const { total, itemCount } = calculateTotals(state.items);
          state.total = total;
          state.itemCount = itemCount;
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = (action.payload as string) || 'Failed to update cart item';
      });

    // Remove from Cart Async
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.syncLoading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;
          const { total, itemCount } = calculateTotals(state.items);
          state.total = total;
          state.itemCount = itemCount;
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = (action.payload as string) || 'Failed to remove item from cart';
      });

    // Clear Cart Async
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.syncLoading = false;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = (action.payload as string) || 'Failed to clear cart';
      });

    // Validate Cart
    builder
      .addCase(validateCartAsync.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(validateCartAsync.fulfilled, (state, action) => {
        state.syncLoading = false;
        if (action.payload?.isValid === false) {
          state.error = action.payload.message || 'Cart contains invalid items';
        }
      })
      .addCase(validateCartAsync.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = (action.payload as string) || 'Cart validation failed';
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setSyncLoading,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../cart/cartSlice';
import * as orderApi from '@/api/orderApi';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  trackingNumber?: string;
}

export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddressId: string;
  paymentMethod: string;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  currentOrder: Partial<Order> | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  paymentLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  currentOrder: null,
  loading: false,
  error: null,
  createLoading: false,
  paymentLoading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

/**
 * Async Thunk: Create Order
 * Creates new order from cart items with JWT
 */
export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (orderData: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

/**
 * Async Thunk: Fetch Order History
 * Retrieves user's orders with pagination
 */
export const fetchOrderHistoryAsync = createAsyncThunk(
  'order/fetchOrderHistory',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.getOrderHistory(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

/**
 * Async Thunk: Fetch Single Order
 * Retrieves order details by ID
 */
export const fetchOrderByIdAsync = createAsyncThunk(
  'order/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

/**
 * Async Thunk: Process Payment
 * Processes payment for order
 */
export const processPaymentAsync = createAsyncThunk(
  'order/processPayment',
  async (
    {
      orderId,
      paymentData,
    }: {
      orderId: string;
      paymentData: { method: string; cardDetails?: object; transactionId?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.processPayment(orderId, paymentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment failed');
    }
  }
);

/**
 * Async Thunk: Cancel Order
 * Cancels an existing order
 */
export const cancelOrderAsync = createAsyncThunk(
  'order/cancelOrder',
  async (
    { orderId, reason }: { orderId: string; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.cancelOrder(orderId, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

/**
 * Order Slice
 * Manages orders and order history
 */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    /**
     * Synchronous: Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Synchronous: Set orders
     */
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Synchronous: Set selected order
     */
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
      state.loading = false;
    },

    /**
     * Synchronous: Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Synchronous: Clear current order
     */
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    /**
     * Synchronous: Reset order state
     */
    resetOrderState: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.createLoading = false;
      state.paymentLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Create Order Async
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = (action.payload as string) || 'Failed to create order';
      });

    // Fetch Order History Async
    builder
      .addCase(fetchOrderHistoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.orders) {
          state.orders = action.payload.orders;
        }
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchOrderHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch orders';
      });

    // Fetch Order By ID Async
    builder
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch order';
      });

    // Process Payment Async
    builder
      .addCase(processPaymentAsync.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(processPaymentAsync.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (state.currentOrder) {
          state.currentOrder.paymentMethod = action.payload?.paymentMethod;
        }
        if (state.selectedOrder) {
          state.selectedOrder.paymentMethod = action.payload?.paymentMethod;
        }
        state.error = null;
      })
      .addCase(processPaymentAsync.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = (action.payload as string) || 'Payment failed';
      });

    // Cancel Order Async
    builder
      .addCase(cancelOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedOrder?.id === action.payload?.id) {
          state.selectedOrder.status = 'cancelled';
        }
        const orderIndex = state.orders.findIndex(
          (o) => o.id === action.payload?.id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = 'cancelled';
        }
      })
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to cancel order';
      });
  },
});

export const {
  setLoading,
  setOrders,
  setSelectedOrder,
  clearError,
  clearCurrentOrder,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;


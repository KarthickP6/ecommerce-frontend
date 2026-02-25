import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../cart/cartSlice';

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

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  currentOrder: Partial<Order> | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  currentOrder: null,
  loading: false,
  error: null,
};

/**
 * Order Slice
 * Manages orders and order history
 */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
      state.loading = false;
    },

    createOrderStart: (state, action: PayloadAction<Partial<Order>>) => {
      state.currentOrder = action.payload;
      state.loading = true;
      state.error = null;
    },

    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
    },

    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }

      if (state.selectedOrder?.id === action.payload.orderId) {
        state.selectedOrder.status = action.payload.status;
        state.selectedOrder.updatedAt = new Date().toISOString();
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  setLoading,
  setOrders,
  setSelectedOrder,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatus,
  setError,
  clearError,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;


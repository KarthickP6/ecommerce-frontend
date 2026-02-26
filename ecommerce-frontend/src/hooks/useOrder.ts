import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import {
  clearError,
  clearCurrentOrder,
  resetOrderState,
  createOrderAsync,
  fetchOrderHistoryAsync,
  fetchOrderByIdAsync,
  processPaymentAsync,
  cancelOrderAsync,
  type CreateOrderPayload,
} from '../features/order/orderSlice';

/**
 * useOrder Hook
 * Provides order operations with async thunks and proper state management
 * Automatically includes JWT token through axios interceptor
 */
export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderState = useSelector((state: RootState) => state.order);

  /**
   * Create new order
   * Automatically sends JWT token
   */
  const createOrder = useCallback(
    (orderData: CreateOrderPayload) => {
      return dispatch(createOrderAsync(orderData));
    },
    [dispatch]
  );

  /**
   * Fetch order history with pagination
   * Automatically sends JWT token
   */
  const fetchOrderHistory = useCallback(
    (page = 1, limit = 10) => {
      return dispatch(fetchOrderHistoryAsync({ page, limit }));
    },
    [dispatch]
  );

  /**
   * Fetch single order by ID
   * Automatically sends JWT token
   */
  const fetchOrderById = useCallback(
    (orderId: string) => {
      return dispatch(fetchOrderByIdAsync(orderId));
    },
    [dispatch]
  );

  /**
   * Process payment for order
   * Automatically sends JWT token
   */
  const processPayment = useCallback(
    (orderId: string, paymentData: { method: string; cardDetails?: object; transactionId?: string }) => {
      return dispatch(
        processPaymentAsync({
          orderId,
          paymentData,
        })
      );
    },
    [dispatch]
  );

  /**
   * Cancel order
   * Automatically sends JWT token
   */
  const cancelOrder = useCallback(
    (orderId: string, reason?: string) => {
      return dispatch(
        cancelOrderAsync({
          orderId,
          reason,
        })
      );
    },
    [dispatch]
  );

  /**
   * Clear error message
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear current order
   */
  const handleClearCurrentOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  /**
   * Reset entire order state
   */
  const resetOrder = useCallback(() => {
    dispatch(resetOrderState());
  }, [dispatch]);

  return {
    // State
    orders: orderState.orders,
    selectedOrder: orderState.selectedOrder,
    currentOrder: orderState.currentOrder,
    loading: orderState.loading,
    createLoading: orderState.createLoading,
    paymentLoading: orderState.paymentLoading,
    error: orderState.error,
    pagination: orderState.pagination,

    // Async methods (with JWT)
    createOrder,
    fetchOrderHistory,
    fetchOrderById,
    processPayment,
    cancelOrder,

    // Utilities
    clearError: handleClearError,
    clearCurrentOrder: handleClearCurrentOrder,
    resetOrder,
  };
};


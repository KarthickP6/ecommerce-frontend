import axiosInstance from './axiosInstance';

/**
 * Order API Service
 * Handles order-related API calls
 */

const ORDER_ENDPOINTS = {
  CREATE_ORDER: '/orders',
  GET_ORDERS: '/orders',
  GET_ORDER: '/orders/:id',
  UPDATE_ORDER_STATUS: '/orders/:id/status',
  CANCEL_ORDER: '/orders/:id/cancel',
  GET_ORDER_HISTORY: '/orders/user/history',
  PROCESS_PAYMENT: '/orders/:id/payment',
  GET_PAYMENT_METHODS: '/payment-methods',
};

/**
 * Create new order
 * @param orderData - Order data with items and shipping
 * @returns Promise with created order
 */
export const createOrder = async (orderData: {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddressId: string;
  paymentMethod: string;
  notes?: string;
}) => {
  try {
    const response = await axiosInstance.post(
      ORDER_ENDPOINTS.CREATE_ORDER,
      orderData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all user orders
 * @param page - Page number
 * @param limit - Items per page
 * @param status - Filter by status
 * @returns Promise with orders list
 */
export const getOrders = async (
  page = 1,
  limit = 10,
  status?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    const response = await axiosInstance.get(
      `${ORDER_ENDPOINTS.GET_ORDERS}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single order details
 * @param id - Order ID
 * @returns Promise with order details
 */
export const getOrderById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      ORDER_ENDPOINTS.GET_ORDER.replace(':id', id)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user order history
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with order history
 */
export const getOrderHistory = async (page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await axiosInstance.get(
      `${ORDER_ENDPOINTS.GET_ORDER_HISTORY}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update order status (Admin only)
 * @param id - Order ID
 * @param status - New status
 * @returns Promise with updated order
 */
export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) => {
  try {
    const response = await axiosInstance.put(
      ORDER_ENDPOINTS.UPDATE_ORDER_STATUS.replace(':id', id),
      { status }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel order
 * @param id - Order ID
 * @param reason - Cancellation reason
 * @returns Promise
 */
export const cancelOrder = async (id: string, reason?: string) => {
  try {
    const response = await axiosInstance.post(
      ORDER_ENDPOINTS.CANCEL_ORDER.replace(':id', id),
      { reason }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Process payment for order
 * @param id - Order ID
 * @param paymentData - Payment details
 * @returns Promise with payment confirmation
 */
export const processPayment = async (
  id: string,
  paymentData: {
    method: string;
    cardDetails?: object;
    transactionId?: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      ORDER_ENDPOINTS.PROCESS_PAYMENT.replace(':id', id),
      paymentData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get available payment methods
 * @returns Promise with payment methods list
 */
export const getPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get(
      ORDER_ENDPOINTS.GET_PAYMENT_METHODS
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  getOrderHistory,
  updateOrderStatus,
  cancelOrder,
  processPayment,
  getPaymentMethods,
};


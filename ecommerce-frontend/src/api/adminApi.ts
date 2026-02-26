import axiosInstance from './axiosInstance';

/**
 * Admin API Service
 * Handles all admin-related API calls for dashboard, users, orders, and analytics
 */

const ADMIN_ENDPOINTS = {
  GET_DASHBOARD: '/admin/dashboard',
  GET_USERS: '/admin/users',
  BLOCK_USER: '/admin/users/:id/block',
  UNBLOCK_USER: '/admin/users/:id/unblock',
  GET_PRODUCTS: '/admin/products',
  CREATE_PRODUCT: '/admin/products',
  UPDATE_PRODUCT: '/admin/products/:id',
  DELETE_PRODUCT: '/admin/products/:id',
  GET_ORDERS: '/admin/orders',
  UPDATE_ORDER_STATUS: '/admin/orders/:id/status',
  GET_ANALYTICS: '/admin/analytics/sales',
};

/**
 * Get admin dashboard with key metrics
 * @returns Promise with dashboard data (total users, orders, revenue, etc.)
 */
export const getAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get(ADMIN_ENDPOINTS.GET_DASHBOARD);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users with pagination and filtering
 * @param page - Page number
 * @param limit - Items per page
 * @param search - Search query for user names
 * @param status - Filter by status (active, blocked, etc.)
 * @returns Promise with paginated users list
 */
export const getAdminUsers = async (
  page = 1,
  limit = 20,
  search = '',
  status = ''
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
    });

    const response = await axiosInstance.get(
      `${ADMIN_ENDPOINTS.GET_USERS}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Block or unblock a user
 * @param id - User ID
 * @param blocked - Block/unblock status
 * @param reason - Reason for blocking (optional)
 * @returns Promise with updated user
 */
export const blockUser = async (
  id: string,
  blocked: boolean,
  reason?: string
) => {
  try {
    const response = await axiosInstance.put(
      ADMIN_ENDPOINTS.BLOCK_USER.replace(':id', id),
      {
        blocked,
        ...(reason && { reason }),
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all orders with pagination and filtering
 * @param page - Page number
 * @param limit - Items per page
 * @param status - Filter by order status (pending, processing, shipped, delivered, cancelled)
 * @param dateFrom - Filter orders from date (YYYY-MM-DD)
 * @param dateTo - Filter orders to date (YYYY-MM-DD)
 * @returns Promise with paginated orders list
 */
export const getAdminOrders = async (
  page = 1,
  limit = 20,
  status = '',
  dateFrom = '',
  dateTo = ''
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    });

    const response = await axiosInstance.get(
      `${ADMIN_ENDPOINTS.GET_ORDERS}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get sales analytics with various time periods
 * @param period - Time period (daily, weekly, monthly, yearly)
 * @param from - Start date (YYYY-MM-DD)
 * @param to - End date (YYYY-MM-DD)
 * @returns Promise with analytics data (total sales, orders, charts, top products, etc.)
 */
export const getSalesAnalytics = async (
  period = 'monthly',
  from = '',
  to = ''
) => {
  try {
    const params = new URLSearchParams({
      period,
      ...(from && { from }),
      ...(to && { to }),
    });

    const response = await axiosInstance.get(
      `${ADMIN_ENDPOINTS.GET_ANALYTICS}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Unblock a user
 * @param id - User ID
 * @returns Promise with updated user
 */
export const unblockUser = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      ADMIN_ENDPOINTS.UNBLOCK_USER.replace(':id', id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all products with pagination
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Promise with paginated products list
 */
export const getAllProducts = async (page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await axiosInstance.get(
      `${ADMIN_ENDPOINTS.GET_PRODUCTS}?${params}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new product
 * @param productData - Product data
 * @returns Promise with created product
 */
export const createProduct = async (productData: any) => {
  try {
    const response = await axiosInstance.post(
      ADMIN_ENDPOINTS.CREATE_PRODUCT,
      productData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing product
 * @param id - Product ID
 * @param productData - Updated product data
 * @returns Promise with updated product
 */
export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await axiosInstance.put(
      ADMIN_ENDPOINTS.UPDATE_PRODUCT.replace(':id', id),
      productData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a product
 * @param id - Product ID
 * @returns Promise with success message
 */
export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      ADMIN_ENDPOINTS.DELETE_PRODUCT.replace(':id', id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all orders with pagination and filtering
 * @param page - Page number
 * @param limit - Items per page
 * @param status - Filter by order status (pending, processing, shipped, delivered, cancelled)
 * @param dateFrom - Filter orders from date (YYYY-MM-DD)
 * @param dateTo - Filter orders to date (YYYY-MM-DD)
 * @returns Promise with paginated orders list
 */
export const getAllOrders = async (
  page = 1,
  limit = 20,
  status = '',
  dateFrom = '',
  dateTo = ''
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    });

    const response = await axiosInstance.get(
      `${ADMIN_ENDPOINTS.GET_ORDERS}?${params}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update order status
 * @param id - Order ID
 * @param status - New order status
 * @returns Promise with updated order
 */
export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(
      ADMIN_ENDPOINTS.UPDATE_ORDER_STATUS.replace(':id', id),
      { status }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAdminDashboard,
  getAdminUsers,
  blockUser,
  unblockUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getSalesAnalytics,
};


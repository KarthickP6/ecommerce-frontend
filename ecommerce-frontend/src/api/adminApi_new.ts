import axiosInstance from './axiosInstance';

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
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get(ADMIN_ENDPOINTS.GET_DASHBOARD);
  return response.data.data;
};

export const getAllUsers = async (page = 1, limit = 20, search = '', status = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
  });
  const response = await axiosInstance.get(`${ADMIN_ENDPOINTS.GET_USERS}?${params}`);
  return response.data.data;
};

export const blockUser = async (id: string, blocked: boolean, reason?: string) => {
  const response = await axiosInstance.put(
    ADMIN_ENDPOINTS.BLOCK_USER.replace(':id', id),
    { blocked, ...(reason && { reason }) }
  );
  return response.data.data;
};

export const unblockUser = async (id: string) => {
  const response = await axiosInstance.put(
    ADMIN_ENDPOINTS.UNBLOCK_USER.replace(':id', id)
  );
  return response.data.data;
};

export const getAllProducts = async (page = 1, limit = 20) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await axiosInstance.get(`${ADMIN_ENDPOINTS.GET_PRODUCTS}?${params}`);
  return response.data.data;
};

export const createProduct = async (productData: any) => {
  const response = await axiosInstance.post(ADMIN_ENDPOINTS.CREATE_PRODUCT, productData);
  return response.data.data;
};

export const updateProduct = async (id: string, productData: any) => {
  const response = await axiosInstance.put(
    ADMIN_ENDPOINTS.UPDATE_PRODUCT.replace(':id', id),
    productData
  );
  return response.data.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_ENDPOINTS.DELETE_PRODUCT.replace(':id', id)
  );
  return response.data;
};

export const getAllOrders = async (page = 1, limit = 20) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await axiosInstance.get(`${ADMIN_ENDPOINTS.GET_ORDERS}?${params}`);
  return response.data.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await axiosInstance.put(
    ADMIN_ENDPOINTS.UPDATE_ORDER_STATUS.replace(':id', id),
    { status }
  );
  return response.data.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
};


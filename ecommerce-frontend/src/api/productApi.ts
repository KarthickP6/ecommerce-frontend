import axiosInstance from './axiosInstance';

/**
 * Product API Service
 * Handles all product-related API calls
 */

const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_ONE: '/products/:id',
  CREATE: '/products',
  UPDATE: '/products/:id',
  DELETE: '/products/:id',
  SEARCH: '/products/search',
  GET_BY_CATEGORY: '/products/category/:categoryId',
  GET_CATEGORIES: '/categories',
  RATE_PRODUCT: '/products/:id/rate',
  ADD_REVIEW: '/products/:id/reviews',
};

/**
 * Get all products with filters
 * @param page - Page number
 * @param limit - Items per page
 * @param search - Search query
 * @param category - Category filter
 * @param minPrice - Min price filter
 * @param maxPrice - Max price filter
 * @param sort - Sort option
 * @returns Promise with paginated products
 */
export const getAllProducts = async (
  page = 1,
  limit = 12,
  search = '',
  category = '',
  minPrice = 0,
  maxPrice = 10000,
  sort = 'newest'
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      ...(sort && { sort }),
    });

    const response = await axiosInstance.get(
      `${PRODUCT_ENDPOINTS.GET_ALL}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Promise with product details
 */
export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_ENDPOINTS.GET_ONE.replace(':id', id)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Search products
 * @param query - Search query
 * @param filters - Additional filters
 * @returns Promise with search results
 */
export const searchProducts = async (query: string, filters?: object) => {
  try {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });

    const response = await axiosInstance.get(
      `${PRODUCT_ENDPOINTS.SEARCH}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get products by category
 * @param categoryId - Category ID
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with category products
 */
export const getProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 12
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await axiosInstance.get(
      `${PRODUCT_ENDPOINTS.GET_BY_CATEGORY.replace(':categoryId', categoryId)}?${params}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all categories
 * @returns Promise with categories list
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(PRODUCT_ENDPOINTS.GET_CATEGORIES);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new product (Admin only)
 * @param productData - Product data
 * @returns Promise with created product
 */
export const createProduct = async (productData: FormData) => {
  try {
    const response = await axiosInstance.post(
      PRODUCT_ENDPOINTS.CREATE,
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update product (Admin only)
 * @param id - Product ID
 * @param productData - Product data to update
 * @returns Promise with updated product
 */
export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await axiosInstance.put(
      PRODUCT_ENDPOINTS.UPDATE.replace(':id', id),
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete product (Admin only)
 * @param id - Product ID
 * @returns Promise
 */
export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      PRODUCT_ENDPOINTS.DELETE.replace(':id', id)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Rate a product
 * @param id - Product ID
 * @param rating - Rating (1-5)
 * @returns Promise
 */
export const rateProduct = async (id: string, rating: number) => {
  try {
    const response = await axiosInstance.post(
      PRODUCT_ENDPOINTS.RATE_PRODUCT.replace(':id', id),
      { rating }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Add review to product
 * @param id - Product ID
 * @param reviewData - Review data
 * @returns Promise
 */
export const addProductReview = async (
  id: string,
  reviewData: { title: string; comment: string; rating: number }
) => {
  try {
    const response = await axiosInstance.post(
      PRODUCT_ENDPOINTS.ADD_REVIEW.replace(':id', id),
      reviewData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  rateProduct,
  addProductReview,
};


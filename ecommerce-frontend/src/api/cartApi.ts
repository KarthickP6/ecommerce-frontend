import axiosInstance from './axiosInstance';

/**
 * Cart API Service
 * Handles shopping cart operations
 */

const CART_ENDPOINTS = {
  GET_CART: '/cart',
  ADD_ITEM: '/cart/items',
  UPDATE_ITEM: '/cart/items/:itemId',
  REMOVE_ITEM: '/cart/items/:itemId',
  CLEAR_CART: '/cart/clear',
  VALIDATE_CART: '/cart/validate',
};

/**
 * Get user's cart
 * @returns Promise with cart data
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get(CART_ENDPOINTS.GET_CART);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Add item to cart
 * @param productId - Product ID
 * @param quantity - Quantity to add
 * @returns Promise with updated cart
 */
export const addToCart = async (productId: string, quantity: number) => {
  try {
    const response = await axiosInstance.post(CART_ENDPOINTS.ADD_ITEM, {
      productId,
      quantity,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param itemId - Cart item ID
 * @param quantity - New quantity
 * @returns Promise with updated cart
 */
export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const response = await axiosInstance.put(
      CART_ENDPOINTS.UPDATE_ITEM.replace(':itemId', itemId),
      { quantity }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove item from cart
 * @param itemId - Cart item ID
 * @returns Promise with updated cart
 */
export const removeFromCart = async (itemId: string) => {
  try {
    const response = await axiosInstance.delete(
      CART_ENDPOINTS.REMOVE_ITEM.replace(':itemId', itemId)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Clear entire cart
 * @returns Promise
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.post(CART_ENDPOINTS.CLEAR_CART);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate cart items before checkout
 * Check if all items are still available
 * @returns Promise with validation result
 */
export const validateCart = async () => {
  try {
    const response = await axiosInstance.post(CART_ENDPOINTS.VALIDATE_CART);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
};


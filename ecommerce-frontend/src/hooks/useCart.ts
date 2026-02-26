import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToCartAsync,
  removeFromCartAsync,
  updateCartItemAsync,
  clearCartAsync,
  fetchCart,
  validateCartAsync,
} from '../features/cart/cartSlice';
import type { Product } from '../features/product/productSlice';

/**
 * useCart Hook
 * Provides cart operations with both sync and async methods
 * Automatically includes JWT token through axios interceptor
 */
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartState = useSelector((state: RootState) => state.cart);

  /**
   * Synchronous: Add item to local cart
   * For optimistic UI updates before API call
   */
  const addItemToCart = useCallback(
    (product: Product, quantity: number) => {
      dispatch(addToCart({ product, quantity }));
    },
    [dispatch]
  );

  /**
   * Asynchronous: Add item to cart via API
   * Sends JWT token automatically
   */
  const addItemToCartAsync = useCallback(
    (productId: string, quantity: number) => {
      return dispatch(addToCartAsync({ productId, quantity }));
    },
    [dispatch]
  );

  /**
   * Synchronous: Remove item from local cart
   * For optimistic UI updates before API call
   */
  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  /**
   * Asynchronous: Remove item from cart via API
   * Sends JWT token automatically
   */
  const removeItemAsync = useCallback(
    (itemId: string) => {
      return dispatch(removeFromCartAsync(itemId));
    },
    [dispatch]
  );

  /**
   * Synchronous: Update item quantity in local cart
   * For optimistic UI updates before API call
   */
  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  /**
   * Asynchronous: Update item quantity via API
   * Sends JWT token automatically
   */
  const updateItemQuantityAsync = useCallback(
    (itemId: string, quantity: number) => {
      return dispatch(updateCartItemAsync({ itemId, quantity }));
    },
    [dispatch]
  );

  /**
   * Synchronous: Clear entire cart
   * For optimistic UI updates before API call
   */
  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  /**
   * Asynchronous: Clear entire cart via API
   * Sends JWT token automatically
   */
  const emptyCartAsync = useCallback(() => {
    return dispatch(clearCartAsync());
  }, [dispatch]);

  /**
   * Fetch cart from API
   * Sends JWT token automatically
   */
  const loadCart = useCallback(() => {
    return dispatch(fetchCart());
  }, [dispatch]);

  /**
   * Validate cart before checkout
   * Sends JWT token automatically
   */
  const validateCart = useCallback(() => {
    return dispatch(validateCartAsync());
  }, [dispatch]);

  return {
    // State
    items: cartState.items,
    total: cartState.total,
    itemCount: cartState.itemCount,
    loading: cartState.loading,
    syncLoading: cartState.syncLoading,
    error: cartState.error,

    // Sync operations (local only)
    addItemToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,

    // Async operations (API + JWT)
    addItemToCartAsync,
    removeItemAsync,
    updateItemQuantityAsync,
    emptyCartAsync,
    loadCart,
    validateCart,
  };
};


import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { userReducer } from '../features/user';
import { productReducer } from '../features/product';
import { cartReducer } from '../features/cart';
import { orderReducer } from '../features/order';
import { adminReducer } from '../features/admin';

/**
 * Root Reducer
 * Combines all feature slices into a single reducer
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  admin: adminReducer,
});


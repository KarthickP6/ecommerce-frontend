import axiosInstance from './axiosInstance';

/**
 * User API Service
 * Handles all user-related API calls including profile, addresses, and wishlist
 */

const USER_ENDPOINTS = {
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CREATE_ADDRESS: '/users/addresses',
  GET_ADDRESSES: '/users/addresses',
  UPDATE_ADDRESS: '/users/addresses/:id',
  DELETE_ADDRESS: '/users/addresses/:id',
  GET_WISHLIST: '/users/wishlist',
  ADD_WISHLIST: '/users/wishlist',
  DELETE_WISHLIST: '/users/wishlist/:productId',
};

/**
 * Get user profile
 * @returns Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_PROFILE);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param profileData - User profile data to update
 * @returns Promise with updated user profile
 */
export const updateUserProfile = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}) => {
  try {
    const response = await axiosInstance.put(
      USER_ENDPOINTS.UPDATE_PROFILE,
      profileData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new address for user
 * @param addressData - Address details
 * @returns Promise with created address
 */
export const createAddress = async (addressData: {
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}) => {
  try {
    const response = await axiosInstance.post(
      USER_ENDPOINTS.CREATE_ADDRESS,
      addressData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all user addresses
 * @returns Promise with list of addresses
 */
export const getUserAddresses = async () => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_ADDRESSES);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user address
 * @param id - Address ID
 * @param addressData - Updated address data
 * @returns Promise with updated address
 */
export const updateAddress = async (
  id: string,
  addressData: {
    type?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  }
) => {
  try {
    const response = await axiosInstance.put(
      USER_ENDPOINTS.UPDATE_ADDRESS.replace(':id', id),
      addressData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user address
 * @param id - Address ID
 * @returns Promise
 */
export const deleteAddress = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      USER_ENDPOINTS.DELETE_ADDRESS.replace(':id', id)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's wishlist
 * @returns Promise with wishlist items
 */
export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_WISHLIST);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Add product to wishlist
 * @param productId - Product ID to add
 * @returns Promise with updated wishlist
 */
export const addToWishlist = async (productId: string) => {
  try {
    const response = await axiosInstance.post(
      USER_ENDPOINTS.ADD_WISHLIST,
      { productId }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove product from wishlist
 * @param productId - Product ID to remove
 * @returns Promise with updated wishlist
 */
export const removeFromWishlist = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(
      USER_ENDPOINTS.DELETE_WISHLIST.replace(':productId', productId)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};


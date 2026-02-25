import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface UserState {
  profile: {
    phone?: string;
    dateOfBirth?: string;
    addresses: Address[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

/**
 * User Slice
 * Manages user profile and account settings
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    addAddress: (state, action: PayloadAction<Address>) => {
      if (state.profile) {
        state.profile.addresses.push(action.payload);
      }
    },

    updateAddress: (state, action: PayloadAction<Address>) => {
      if (state.profile) {
        const index = state.profile.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.profile.addresses[index] = action.payload;
        }
      }
    },

    deleteAddress: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.addresses = state.profile.addresses.filter(addr => addr.id !== action.payload);
      }
    },

    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProfile,
  setError,
  addAddress,
  updateAddress,
  deleteAddress,
  clearProfile,
} = userSlice.actions;

export default userSlice.reducer;


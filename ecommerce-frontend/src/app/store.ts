import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

/**
 * Configure Redux Store
 * Combines all feature slices
 */
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in serializable check
        ignoredActions: ['auth/login/fulfilled', 'auth/refreshToken/fulfilled'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


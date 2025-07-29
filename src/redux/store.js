import { configureStore } from '@reduxjs/toolkit';
import membersReducer from './slices/membersSlice';
import roleReducer from './slices/roleSlice';
import notificationsReducer from './slices/notificationsSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    members: membersReducer,
    role: roleReducer,
    notifications: notificationsReducer,
    analytics: analyticsReducer
  }
}); 
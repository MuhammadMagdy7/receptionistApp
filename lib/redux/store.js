// lib/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import visitReducer from './visitSlice';

export const store = configureStore({
  reducer: {
    visits: visitReducer,
  },
});

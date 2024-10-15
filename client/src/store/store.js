import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productslice.js';

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;

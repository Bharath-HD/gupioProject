import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import ordersReducer from './ordersSlice';

export default configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer
  }
});

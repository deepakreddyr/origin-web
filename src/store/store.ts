import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { shopCategorySlice } from './slice/shopCategoriesSlice';
import { cartSlice } from './slice/CartSlice';
import { productsSlice } from './slice/productsSlice';
import { loginSlice } from './slice/loginSlice';
import { placeOrderDetailsSlice } from './slice/placeOrderDetails';
import { orderAndRefundSlice } from './slice/OrderAndRefundDetails';

// Create the store
const makeStore = () =>
  configureStore({
    reducer: {
      [shopCategorySlice.name]: shopCategorySlice.reducer,
      [cartSlice.name]: cartSlice.reducer,
      [productsSlice.name]: productsSlice.reducer,
      [loginSlice.name]: loginSlice.reducer,
      [placeOrderDetailsSlice.name]: placeOrderDetailsSlice.reducer,
      [orderAndRefundSlice.name]: orderAndRefundSlice.reducer
    }
  });

// Types for the store and dispatch
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Export the wrapper
export const wrapper = createWrapper<AppStore>(makeStore);

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOrderDetailsLoading: true,
  orderDetailsData: {},
  refundList: []
};

export const orderAndRefundSlice = createSlice({
  name: 'orderAndRefundDetails',
  initialState,
  reducers: {
    setIsOrderDetailsLoading: (state, action) => {
      state.isOrderDetailsLoading = action.payload;
    },
    setOrderDetailsData: (state, action) => {
      state.orderDetailsData = action.payload;
    },
    setRefundList: (state, action) => {
      state.refundList = action.payload;
    }
  }
});

export const { setIsOrderDetailsLoading, setOrderDetailsData, setRefundList } = orderAndRefundSlice.actions;

export default orderAndRefundSlice.reducer;

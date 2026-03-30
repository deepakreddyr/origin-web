import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  productsList: [] as any[],
  isProductListLoading: true,
  notifiedItems: [] as number[]
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<any[]>) {
      state.productsList = action.payload;
    },
    setIsProductListLoading(state, action: PayloadAction<boolean>) {
      state.isProductListLoading = action.payload;
    },
    addNotifiedItem(state, action: PayloadAction<number>) {
      if (!state.notifiedItems.includes(action.payload)) {
        state.notifiedItems.push(action.payload);
      }
    }
  }
});

export const { setProductList, setIsProductListLoading, addNotifiedItem } = productsSlice.actions;
export default productsSlice.reducer;

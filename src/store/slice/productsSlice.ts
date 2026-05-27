import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  productsList: [] as any[],
  isProductListLoading: true,
  notifiedItems: [] as number[],
  currentPage: 1,
  lastPage: 1,
  isFetchingNextPage: false
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<any[]>) {
      state.productsList = action.payload;
    },
    appendProductList(state, action: PayloadAction<any[]>) {
      state.productsList = [...state.productsList, ...action.payload];
    },
    setIsProductListLoading(state, action: PayloadAction<boolean>) {
      state.isProductListLoading = action.payload;
    },
    setIsFetchingNextPage(state, action: PayloadAction<boolean>) {
      state.isFetchingNextPage = action.payload;
    },
    setPaginationDetails(state, action: PayloadAction<{ currentPage: number; lastPage: number }>) {
      state.currentPage = action.payload.currentPage;
      state.lastPage = action.payload.lastPage;
    },
    addNotifiedItem(state, action: PayloadAction<number>) {
      if (!state.notifiedItems.includes(action.payload)) {
        state.notifiedItems.push(action.payload);
      }
    }
  }
});

export const {
  setProductList,
  appendProductList,
  setIsProductListLoading,
  setIsFetchingNextPage,
  setPaginationDetails,
  addNotifiedItem
} = productsSlice.actions;
export default productsSlice.reducer;

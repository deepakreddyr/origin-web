import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ComboItem {
  item_name: string;
  image: string;
  uom: string;
  qty: string;
}

interface SubscriptionItem {
  id: number;
  item_code: string;
  name: string;
  image: string;
  price: number;
  price_inclusive_of_all_taxes?: number;
  quantity: number;
  max_qty: number;
  combo_items?: ComboItem[];
}

interface SubscriptionCartState {
  item: SubscriptionItem | null;
  totalQuantity: number;
  totalPrice: number;
  isSubscriptionActive: boolean;
}

const initialState: SubscriptionCartState = {
  item: null,
  totalQuantity: 0,
  totalPrice: 0,
  isSubscriptionActive: false
};

export const subscriptionCartSlice = createSlice({
  name: 'subscriptionCart',
  initialState,
  reducers: {
    setSubscriptionItem: (state, action: PayloadAction<SubscriptionItem>) => {
      state.item = action.payload;
      state.totalQuantity = action.payload.quantity;
      state.totalPrice = action.payload.price * action.payload.quantity;
    },
    setIsSubscriptionActive: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionActive = action.payload;
    },
    clearSubscriptionCart: (state) => {
      state.item = null;
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.isSubscriptionActive = false;
    },
    updateSubscriptionQuantity: (state, action: PayloadAction<number>) => {
      if (state.item) {
        state.item.quantity = action.payload;
        state.totalQuantity = action.payload;
        state.totalPrice = state.item.price * action.payload;
      }
    }
  }
});

export const { setSubscriptionItem, setIsSubscriptionActive, clearSubscriptionCart, updateSubscriptionQuantity } =
  subscriptionCartSlice.actions;

export default subscriptionCartSlice.reducer;

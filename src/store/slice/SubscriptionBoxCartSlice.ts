import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HarvestItemDetail {
  title: string;
  weight: string;
  icon?: string;
  description: string;
  tag?: string;
}

export interface SubscriptionBoxItem {
  id: number;
  item_code: string;
  name: string;
  image: string;
  variant_id: number;
  uom_id: number;
  unit: string;
  weight: string;
  plan_type: 'monthly' | 'trial';
  plan_title: string;
  price: number;
  single_price: number;
  per_delivery: number;
  quantity: number;
  harvest_items?: HarvestItemDetail[];
}

export interface SubscriptionBoxCartState {
  item: SubscriptionBoxItem | null;
  totalQuantity: number;
  totalPrice: number;
  isSubscriptionBoxActive: boolean;
}

const initialState: SubscriptionBoxCartState = {
  item: null,
  totalQuantity: 0,
  totalPrice: 0,
  isSubscriptionBoxActive: false
};

export const subscriptionBoxCartSlice = createSlice({
  name: 'subscriptionBoxCart',
  initialState,
  reducers: {
    setSubscriptionBoxItem: (state, action: PayloadAction<SubscriptionBoxItem>) => {
      state.item = action.payload;
      state.totalQuantity = action.payload.quantity;
      state.totalPrice = action.payload.price * action.payload.quantity;
      state.isSubscriptionBoxActive = true;
    },
    setIsSubscriptionBoxActive: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionBoxActive = action.payload;
    },
    clearSubscriptionBoxCart: (state) => {
      state.item = null;
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.isSubscriptionBoxActive = false;
    },
    updateSubscriptionBoxQuantity: (state, action: PayloadAction<number>) => {
      if (state.item) {
        state.item.quantity = action.payload;
        state.totalQuantity = action.payload;
        state.totalPrice = state.item.price * action.payload;
      }
    }
  }
});

export const {
  setSubscriptionBoxItem,
  setIsSubscriptionBoxActive,
  clearSubscriptionBoxCart,
  updateSubscriptionBoxQuantity
} = subscriptionBoxCartSlice.actions;

export default subscriptionBoxCartSlice.reducer;

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

export const SUBSCRIPTION_BOX_CART_LS_KEY = 'subscription_box_cart';

const saveSubscriptionBoxCartToLs = (state: SubscriptionBoxCartState) => {
  if (typeof window !== 'undefined') {
    try {
      if (state.item) {
        localStorage.setItem(SUBSCRIPTION_BOX_CART_LS_KEY, JSON.stringify(state));
      } else {
        localStorage.removeItem(SUBSCRIPTION_BOX_CART_LS_KEY);
      }
    } catch (e) {
      console.error('Failed to save subscription box cart to localStorage:', e);
    }
  }
};

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
    hydrateSubscriptionBoxCart: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(SUBSCRIPTION_BOX_CART_LS_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.item) {
              state.item = parsed.item;
              state.totalQuantity = parsed.totalQuantity || parsed.item.quantity || 1;
              state.totalPrice = parsed.totalPrice || parsed.item.price * (parsed.item.quantity || 1);
              state.isSubscriptionBoxActive = true;
            }
          }
        } catch (e) {
          console.error('Failed to hydrate subscription box cart from localStorage:', e);
        }
      }
    },
    setSubscriptionBoxItem: (state, action: PayloadAction<SubscriptionBoxItem>) => {
      state.item = action.payload;
      state.totalQuantity = action.payload.quantity;
      state.totalPrice = action.payload.price * action.payload.quantity;
      state.isSubscriptionBoxActive = true;
      saveSubscriptionBoxCartToLs(state);
    },
    setIsSubscriptionBoxActive: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionBoxActive = action.payload;
      saveSubscriptionBoxCartToLs(state);
    },
    clearSubscriptionBoxCart: (state) => {
      state.item = null;
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.isSubscriptionBoxActive = false;
      saveSubscriptionBoxCartToLs(state);
    },
    updateSubscriptionBoxQuantity: (state, action: PayloadAction<number>) => {
      if (state.item) {
        state.item.quantity = action.payload;
        state.totalQuantity = action.payload;
        state.totalPrice = state.item.price * action.payload;
      }
      saveSubscriptionBoxCartToLs(state);
    }
  }
});

export const {
  hydrateSubscriptionBoxCart,
  setSubscriptionBoxItem,
  setIsSubscriptionBoxActive,
  clearSubscriptionBoxCart,
  updateSubscriptionBoxQuantity
} = subscriptionBoxCartSlice.actions;

export default subscriptionBoxCartSlice.reducer;

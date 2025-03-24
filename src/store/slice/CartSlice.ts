import { couponDetailsInitialState } from '@/constants';
import { CartItem, Product } from '@/utilities/shop/types';
import { updateCartItemsToLs } from '@/utilities/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  totalOriginalPrice: number;
  cartTabType: string;
  isProceedBtnEnabled: boolean;
  couponDetails: any;
  amountToPay: any;
  discountAmount: any;
  cart_minimum: any;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  totalOriginalPrice: 0,
  amountToPay: 0,
  cartTabType: '',
  isProceedBtnEnabled: false,
  couponDetails: couponDetailsInitialState,
  discountAmount: null,
  cart_minimum: null
};

const updateCartTotals = (state: any) => {
  state.totalPrice = 0;
  state.totalOriginalPrice = 0;
  state.totalQuantity = state.items.length;

  state.items.forEach((item: any) => {
    item.multiple_uoms.forEach((uom: any) => {
      state.totalPrice += uom.price * uom.cart_quantity;
      state.totalOriginalPrice += uom.market_price * uom.cart_quantity;
    });
  });

  // if (state.couponDetails.isValid && state.discountAmount) {
  //   let amountWithoutRoundOff = state.totalPrice - Math.round(state.discountAmount);
  //   state.amountToPay = Math.round(amountWithoutRoundOff);
  //   if (state.amountToPay < state.couponDetails.min_cart_value) {
  //     state.couponDetails = couponDetailsInitialState;
  //   }
  // }
};

const isProceedBtnEnabled = (state: any) => {
  if (state.amountToPay < state.cart_minimum) return false;

  for (let item of state.items) {
    for (let uom of item.multiple_uoms) {
      if (uom.cart_quantity > uom.maximum_quantity || !uom.is_available) {
        return false;
      }
    }
  }

  return true; // Button is enabled if no conditions are met
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state: any, action: PayloadAction<[]>) => {
      state.items = action.payload;
      updateCartTotals(state);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    removeItemFromCart: (state: any, action: PayloadAction<number>) => {
      const variantId = action.payload;

      state.items = state.items
        .map((item: any) => {
          item.multiple_uoms = item.multiple_uoms.filter((uom: any) => uom.variant_id !== variantId);
          return item;
        })
        .filter((item: any) => item.multiple_uoms.length > 0);
      updateCartTotals(state);
      updateCartItemsToLs(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    addItemToCart: (state: any, action: PayloadAction<Product>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item: any) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push(newItem);
      }
      updateCartTotals(state);
      updateCartItemsToLs(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    increaseQuantity: (state, action: PayloadAction<any>) => {
      const { varientId, stepperQuantity } = action.payload;
      state.items.forEach((item: any) => {
        const uom = item.multiple_uoms.find((uom: any) => uom.variant_id === varientId);
        if (uom) {
          uom.cart_quantity += stepperQuantity;
        }
      });
      updateCartTotals(state);
      updateCartItemsToLs(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    // does not store when item_quamtity is 0
    decreaseQuantity: (state, action: PayloadAction<any>) => {
      const { varientId, stepperQuantity } = action.payload;

      state.items = state.items.filter((item: any) => {
        const uom = item.multiple_uoms.find((uom: any) => uom.variant_id === varientId);

        if (uom) {
          uom.cart_quantity -= stepperQuantity;
          if (uom.cart_quantity <= 0) {
            return false;
          }
        }
        return true;
      });
      updateCartTotals(state);
      updateCartItemsToLs(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    // decreaseQuantity: (state, action: PayloadAction<any>) => {
    //   const { varientId, stepperQuantity } = action.payload;

    //   state.items = state.items.map((item: any) => {
    //     const uom = item.multiple_uoms.find((uom: any) => uom.variant_id === varientId);

    //     if (uom) {
    //       uom.cart_quantity = Math.max(uom.cart_quantity - stepperQuantity, 0); // Avoid negative quantity
    //     }
    //     return item;
    //   });

    //   // Update cart totals, items in local storage, and the proceed button state
    //   updateCartTotals(state);
    //   updateCartItemsToLs(state.items);
    //   state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    // },
    setCartMinimum: (state, action) => {
      state.cart_minimum = action.payload;
    },
    setCartTabType: (state, action) => {
      state.cartTabType = action.payload;
    },

    setCouponDetails: (state, action: PayloadAction<any>) => {
      state.couponDetails = action.payload;
    },
    resetCouponDetails: (state) => {
      state.couponDetails = couponDetailsInitialState;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setDiscountAmount: (state, action) => {
      state.discountAmount = action.payload;
    },
    setAmountToPay: (state, action) => {
      state.amountToPay = action.payload;
    },

    setIsProceedButtonEnabled: (state, action) => {
      state.isProceedBtnEnabled = action.payload;
    },

    clearCart: (state: CartState) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalOriginalPrice = 0;
      state.cartTabType = '';
      state.couponDetails = couponDetailsInitialState;

      localStorage.removeItem('cart_items');
    }
  }
});

export const {
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCartItems,
  removeItemFromCart,
  setCartTabType,
  setCouponDetails,
  resetCouponDetails,
  setTotalPrice,
  setAmountToPay,
  setDiscountAmount,
  setIsProceedButtonEnabled,
  setCartMinimum
} = cartSlice.actions;
export default cartSlice.reducer;

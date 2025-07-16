import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  delivery_fee: 0,
  individual_package_enabled: null,
  delivery_type: '',
  delivery_date: '',
  sub_total: 0,
  tax: 0,
  total: 0,
  time_slot_id: '',
  store_id: '',
  is_rewards_used: null,
  payment_method: '',
  sub_payment_method: '',
  uuid: '',
  instructions: '',
  coupon_id: '',
  deliverySlotDetails: {},
  checkoutDetails: {}
};

export const placeOrderDetailsSlice = createSlice({
  name: 'placeOrderDetails',
  initialState,
  reducers: {
    updateItems(state, action) {
      state.items = action.payload;
    },
    updateDeliveryFee(state, action) {
      state.delivery_fee = action.payload;
    },
    setIndividualPackageEnabled(state, action) {
      state.individual_package_enabled = action.payload;
    },
    updateDeliveryType(state, action) {
      state.delivery_type = action.payload;
    },
    updateDeliveryDate(state, action) {
      state.delivery_date = action.payload;
    },
    updateSubTotal(state, action) {
      state.sub_total = action.payload;
    },
    updateTax(state, action) {
      state.tax = action.payload;
    },
    updateTotal(state, action) {
      state.total = action.payload;
    },
    updateTimeSlotId(state, action) {
      state.time_slot_id = action.payload;
    },
    updateStoreId(state, action) {
      state.store_id = action.payload;
    },
    setRewardsUsed(state, action) {
      state.is_rewards_used = action.payload;
    },
    updatePaymentMethod(state, action) {
      state.payment_method = action.payload;
    },
    updateSubPaymentMethod(state, action) {
      state.sub_payment_method = action.payload;
    },
    updateUuid(state, action) {
      state.uuid = action.payload;
    },
    setCouponId(state, action) {
      state.coupon_id = action.payload;
    },
    updateInstructions(state, action) {
      state.instructions = action.payload;
    },
    setDeliverylotDetails(state, action) {
      state.deliverySlotDetails = action.payload;
    },

    setCheckoutDetails(state, action) {
      state.checkoutDetails = action.payload;
    },
    resetOrderDetails(state) {
      Object.assign(state, initialState);
    }
  }
});

export const {
  updateItems,
  updateDeliveryFee,
  setIndividualPackageEnabled,
  updateDeliveryType,
  updateDeliveryDate,
  updateSubTotal,
  updateTax,
  updateTotal,
  updateTimeSlotId,
  updateStoreId,
  setRewardsUsed,
  updatePaymentMethod,
  updateSubPaymentMethod,
  updateUuid,
  updateInstructions,
  resetOrderDetails,
  setCouponId,
  setDeliverylotDetails,
  setCheckoutDetails
} = placeOrderDetailsSlice.actions;

export default placeOrderDetailsSlice.reducer;

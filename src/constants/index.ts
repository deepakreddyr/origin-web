import { paymentIcons } from '../../public/assets/icons/paymentTypes';

export enum COUPON_TABS {
  COUPON_LIST = 'COUPON_LIST',
  COUPON_APPLIED = 'COUPON_APPLIED'
}

export const couponDetailsInitialState = {
  id: null,
  name: '',
  code: '',
  min_cart_value: null,
  max_cart_value: null,
  discount_type: '',
  discount: null,
  expire_at: '',
  isValid: null,
  description: '',
  error_message: '',
  timeslot_disable_message: null,
  exclude_timeslot_id: null,
  is_cod_available: true,
  is_reward_available: false,
  message: null,
  offer: ''
};

export let paymentTypeList = [
  { id: 1, name: 'Pay with any UPI', icon: paymentIcons.upiIcon, sub_payment_method: 'upi' },
  { id: 2, name: 'Pay with debit / Credit card', icon: paymentIcons.cardIcon, sub_payment_method: 'card' },
  { id: 3, name: 'Pay with Net banking', icon: paymentIcons.bankIcon, sub_payment_method: 'netbanking' },
  { id: 4, name: 'Pay On delivery', icon: paymentIcons.codIcon, sub_payment_method: null }
];

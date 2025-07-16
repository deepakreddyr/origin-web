import { request, header } from '@/utilities/request';
import type { AppliedCoupon } from '../context/atoms';

export const validateCoupon = async (payload: any, set: any) => {
  try {
    set((prevState: AppliedCoupon) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true
    }));

    const response: any = await request(`/api/v3/user/coupons/validate`, {
      method: 'POST',
      headers: {
        Authorization: header(),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    set((prevState: AppliedCoupon) => ({
      ...prevState,
      loading: false,
      success: true,
      coupon: response.data,
      isApplied: true
      // commented for future ref
      // isApplied: response.data[0].isValid === 0 ? false : true
    }));
    return true;
  } catch (error: any) {
    const message = await error.response.json();

    set((prevState: AppliedCoupon) => ({
      ...prevState,
      error: message,
      success: false,
      loading: false
    }));
    return false;
  }
};

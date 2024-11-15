import { atom } from "jotai";

import type CouponI from "../types/CouponI";

// import type CartAtomI from '../types/CartAtomI';

export const isCouponPageIsOpen = atom<boolean>(false);

export interface CouponList {
  loading: boolean;
  error: boolean;
  success: boolean;
  coupons: any[] | null;
}

export const couponList = atom<CouponList>({
  loading: false,
  error: false,
  success: false,
  coupons: null,
});

export interface AppliedCoupon {
  isApplied: boolean;
  loading: boolean;
  error: boolean;
  success: boolean;
  coupon: CouponI | null;
}

export const isCouponApplied = atom<AppliedCoupon>({
  isApplied: false,
  loading: false,
  error: false,
  success: false,
  coupon: null,
});

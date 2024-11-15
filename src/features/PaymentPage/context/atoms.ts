import { atom } from "jotai";

import type CheckoutAtom from "../types/CheckoutAtom";
export type PaymentPrefill =
  | "paylater"
  | "upi"
  | "card"
  | "cash"
  | "netbanking";

export const isPaymentIsOpen = atom<boolean>(false);

export const checkoutAPI = atom<CheckoutAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export enum FailOrSuccess {
  FAIL,
  SUCCESS,
  NONE,
}

export const failOrSuccess = atom<FailOrSuccess>(FailOrSuccess.NONE);
export const paymentPrefillAtom = atom<PaymentPrefill>("upi");

export const razorPayObjectAtom = atom<any>(null);

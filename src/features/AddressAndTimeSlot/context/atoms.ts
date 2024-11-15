import { atom } from "jotai";

import type CheckoutAtom from "../types/CheckoutAtom";

export const isAddressAndTimeSlotIsOpen = atom<boolean>(false);

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

export const razorPayObjectAtom = atom<any>(null);

import { atom } from "jotai";

import type CartAtomI from "../types/CartAtomI";

export const isCartPageIsOpen = atom<boolean>(false);

export const cartItems = atom<any[]>([]);

export const cartAtom = atom<CartAtomI>({
  loading: false,
  success: false,
  error: false,
  cart: null,
  cartValues: null,
});

type CheckoutExtraDetails = {
  instructions: string;
  isRewardsEnabledInCart: boolean;
};

export const checkoutExtraDetailsAtom = atom<CheckoutExtraDetails>({
  instructions: "",
  isRewardsEnabledInCart: false,
});

import { atom } from "jotai";

import type { OrderDetailsResponse } from "../types/OrderDetailsResponse";

export const isEditOrderIsOpen = atom<boolean>(false);
export const isRetryPaymentOpenAtom = atom<boolean>(false);

export const orderDetailsAtom = atom<OrderDetailsResponse>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

import { atom } from "jotai";

import type { OrderDetailsResponse } from "../types/OrderDetailsResponse";

export const orderDetailsAtom = atom<OrderDetailsResponse>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

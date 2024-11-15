import { atom } from "jotai";

export interface EditOrderAtomI {
  loading: boolean;
  success: boolean;
  error: boolean;
  orderItems: any;
}

export const editOrderAtom = atom<EditOrderAtomI>({
  loading: false,
  success: false,
  error: false,
  orderItems: null,
});

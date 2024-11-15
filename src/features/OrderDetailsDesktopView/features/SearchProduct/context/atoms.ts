import { atom } from "jotai";

export interface SearchedProductAtomI {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: any;
}

export const isSearchedProductEnableAtom = atom<boolean>(false);

export const searchedProductAtom = atom<SearchedProductAtomI>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

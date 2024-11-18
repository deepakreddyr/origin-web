import { atom } from 'jotai';

import type { SearchedItem, SearchedProductResponse } from '../types/SearchedProduct';

export const searchStringAtom = atom<string>('');

export const searchedProductAtom = atom<ISearchedProductAtom>({
  loading: false,
  success: false,
  error: false,
  products: null
});
export const querySearchedProductAtom = atom<ISearchedQueryProductAtom>({
  loading: false,
  success: false,
  error: false,
  products: null
});

export interface ISearchedProductAtom {
  loading: boolean;
  success: boolean;
  error: boolean;
  products: SearchedProductResponse | null;
}
export interface ISearchedQueryProductAtom {
  loading: boolean;
  success: boolean;
  error: boolean;
  products: SearchedItem[] | null;
}

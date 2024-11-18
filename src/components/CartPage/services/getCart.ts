import { header, request } from '@/utilities/request';
import type CartAtomI from '../types/CartAtomI';

export const getCart = async (set: any) => {
  try {
    set((prevState: CartAtomI) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true
    }));

    const response: any = await request(`/api/v5/user/cart`, {
      method: 'GET',
      headers: {
        Authorization: header(),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    set((prevState: CartAtomI) => ({
      ...prevState,
      loading: false,
      success: true,
      cart: response
    }));
  } catch (error) {
    set((prevState: CartAtomI) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false
    }));
  }
};

import { header, request } from '@/utilities/request';
import type { ISearchedProductAtom } from '../context/atoms';

export const getSearchedProductResponse = async (set: any) => {
  try {
    set(
      (prevState: ISearchedProductAtom): ISearchedProductAtom => ({
        ...prevState,
        loading: true,
        error: false,
        success: true
      })
    );

    const response: any = await request(`/api/v5/user/search/items`, {
      method: 'GET',
      headers: {
        Authorization: header(),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    set(
      (prevState: ISearchedProductAtom): ISearchedProductAtom => ({
        ...prevState,
        loading: false,
        success: true,
        products: response
      })
    );
  } catch (error) {
    set(
      (prevState: ISearchedProductAtom): ISearchedProductAtom => ({
        ...prevState,
        error: true,
        success: false,
        loading: false
      })
    );
  }
};

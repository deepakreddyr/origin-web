import { header, request } from '@/utilities/request';
import type AddressAtomI from '../types/AddressAtomI';
import { mainApiUrl } from '@/url';

export const getAddress = async (set: any) => {
  try {
    // Set loading state
    set((prevState: AddressAtomI) => ({
      ...prevState,
      loading: true,
      error: false,
      success: false,
      address: null,
      defaultAddress: null,
      data: null
    }));

    const response: any = await request(mainApiUrl.getAddress, {
      method: 'GET',
      headers: {
        Authorization: header(),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.length > 0) {
      // Prefer deliverable default address
      let defaultAddress = response.data.find((item: any) => item.is_default && item.deliverable);

      // If default is not deliverable, pick any deliverable address
      if (!defaultAddress) {
        defaultAddress = response.data.find((item: any) => item.deliverable);
      }

      // Update localStorage
      if (defaultAddress) {
        localStorage.setItem('store-id', JSON.stringify(defaultAddress.store_id));
        localStorage.setItem('selected_address', JSON.stringify(defaultAddress));
      } else {
        // Remove stored address if none are deliverable
        localStorage.removeItem('store-id');
        localStorage.removeItem('selected_address');
      }

      set((prevState: AddressAtomI) => ({
        ...prevState,
        loading: false,
        error: false,
        success: true,
        address: response.data,
        data: response.data,
        defaultAddress
      }));
    } else {
      // No addresses returned
      set((prevState: AddressAtomI) => ({
        ...prevState,
        loading: false,
        error: false,
        success: false,
        address: null,
        data: null,
        defaultAddress: null
      }));
    }
  } catch (error) {
    // Error handling
    set((prevState: AddressAtomI) => ({
      ...prevState,
      loading: false,
      error: true,
      success: false,
      address: null,
      data: null,
      defaultAddress: null
    }));
  }
};

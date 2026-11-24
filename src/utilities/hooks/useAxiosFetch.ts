import axios from 'axios';
import { header } from '../request';

export const axiosFetch = async (url: string, data: any, method: string, additionalHeaders: any) => {
  let locationHeaders: Record<string, any> = {};
  if (typeof window !== 'undefined') {
    const selectedAddress = localStorage.getItem('selected_address');
    const storeId = localStorage.getItem('store-id');

    if (selectedAddress) {
      try {
        const parsed = JSON.parse(selectedAddress);
        locationHeaders = {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          'store-id': parsed.store_id || storeId
        };
      } catch (e) {
        console.error('Error parsing selected_address', e);
      }
    }

    // Ensure store-id is present even if selected_address was missing or failed to parse
    if (storeId && storeId !== 'null' && !locationHeaders['store-id']) {
      locationHeaders['store-id'] = storeId;
    }
  }

  try {
    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'mm-build-version': '1.0.0',
        'mm-device-type': 'web',
        'delivery-type': 'instant',
        ...locationHeaders,
        ...additionalHeaders
      }
    });

    return { ...response, status: response?.status };
  } catch (error: any) {
    return {
      ...error.response?.data,
      status: error.response?.status,
      success: false
    };
  }
};

import axios from 'axios';
import { header } from '../request';

export const axiosFetch = async (url: string, data: any, method: string, additionalHeaders: any) => {
  try {
    const headers: any = {
      ...additionalHeaders,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'mm-build-version': '1.0.0',
      'mm-device-type': 'web',
      'delivery-type': 'instant'
    };

    if (typeof window !== 'undefined') {
      const storeId = localStorage.getItem('store-id');
      if (storeId && storeId !== 'null') {
        headers['store-id'] = JSON.parse(storeId);
      }
    }

    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: headers
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

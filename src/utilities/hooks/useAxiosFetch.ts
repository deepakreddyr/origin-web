import axios from 'axios';
import { header } from '../request';

export const axiosFetch = async (url: string, data: any, method: string, additionalHeaders: any) => {
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

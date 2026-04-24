import { request } from '@/utilities/request';
import type { ServiceabilityPayload } from '../../../layouts/Header/types/ServiceabilityPayload';
import { mainApiUrl } from '@/url';

export const checkServiceabilityAddress = async (postData: { latitude: any; longitude: any }) => {
  try {
    const response: any = await request(mainApiUrl.fetchForAddressDeliverable, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: postData.latitude,
        longitude: postData.longitude
      })
    });

    if (response.deliverable && response.store_id) {
      localStorage.setItem('store-id', JSON.stringify(response.store_id));
    }

    return response;
  } catch (error) {
    return { deliverable: false };
  }
};

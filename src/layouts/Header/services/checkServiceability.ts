import { mainApiUrl } from '@/url';
import { request } from '@/utilities/request';

export const checkServiceability = async (
  set: any,
  postData: { latitude: string; longitude: string; name: string }
) => {
  try {
    set((prevState: any) => ({
      ...prevState,
      loading: true,
      error: false,
      success: false,
      isDeliverable: false
    }));

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

    localStorage.setItem('address', JSON.stringify(postData));

    if (response.deliverable && response.store_id) {
      localStorage.setItem('store-id', JSON.stringify(response.store_id));
    }

    set((prevState: any) => ({
      ...prevState,
      loading: false,
      success: true,
      isDeliverable: response.deliverable
    }));
  } catch (error) {
    set((prevState: any) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false
    }));
  }
};

import { request } from '@/utilities/request';

export const getOrderDetails = async (set: any, params: { id: string; authToken: string }, dontLoad = false) => {
  try {
    set((prevState: any) => ({
      ...prevState,
      loading: !dontLoad,
      error: false,
      success: false
    }));

    const response: any = await request(`/api/v3/user/orders/${params.id}?showAllBills=true`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${params.authToken}`,
        'Delivery-Type': 'app',
        'MM-Device-Type': 'web',
        'MM-Build-Version': '1.0.1'
      }
    });

    if (response?.data) {
      set((prevState: any) => ({
        ...prevState,
        loading: false,
        success: true,
        data: response.data
      }));
    } else {
      throw new Error('No data found in response');
    }
  } catch (error) {
    console.error('Error fetching order details:', error);

    set((prevState: any) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false
    }));
  }
};

import { header, request } from '@/utilities/request';

export const getOrderDetails = async (set: any, params: { id: string }, dontLoad = false) => {
  try {
    set((prevState: any) => ({
      ...prevState,
      loading: !dontLoad,
      error: false,
      success: true
    }));

    const response: any = await request(`/api/v3/user/orders/${params.id}?showAllBills=true`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: header()
      }
    });

    set((prevState: any) => ({
      ...prevState,
      loading: false,
      success: true,
      data: response?.data
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

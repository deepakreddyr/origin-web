import { header, request } from '@/utilities/request';

export const getSearchQuery = async (set: any, params: { queryString: string }) => {
  try {
    set((prevState: any) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true,
      data: null
    }));

    const response: any = await request(`/api/v3/user/items?query=${params.queryString}`, {
      method: 'GET',
      headers: {
        Authorization: header(),
        Accept: 'application/json'
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
      loading: false,
      data: null
    }));
  }
};

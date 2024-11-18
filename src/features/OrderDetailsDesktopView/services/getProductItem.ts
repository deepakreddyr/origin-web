import { header, request } from '@/utilities/request';

export const getProductItem = async (id: string) => {
  try {
    const response: any = await request(`/api/v3/user/items/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: header()
      }
    });
    return response;
  } catch (error) {
    //
  }
  return null;
};

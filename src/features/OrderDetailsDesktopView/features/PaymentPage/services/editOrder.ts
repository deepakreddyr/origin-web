import { header, request } from "../../../../../utils/request";

export const editOrderService = async (payload: any) => {
  try {
    const response: any = await request(
      `/api/v3/user/order-update/${payload.id}`,
      {
        method: "POST",
        headers: {
          Authorization: header(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload.body),
      }
    );

    return response;
  } catch (error) {
    //
  }
  return null;
};

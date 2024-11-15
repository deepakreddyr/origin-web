import { header, request } from "@/utilities/request";

export const getOrderDetailsForReorder = async (id: string) => {
  try {
    const response: any = await request(
      `/api/v3/user/orders/${id}?showAllBills=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: header(),
        },
      }
    );

    return response?.data;
  } catch (error) {
    return null;
  }
};

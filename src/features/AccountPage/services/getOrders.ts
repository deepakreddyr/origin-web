import { header, request } from "@/utilities/request";
import type OrdersAtom from "../types/OrdersAtom";
import { mainApiUrl } from "@/url";

export const getOrders = async (set: any) => {
  try {
    set((prevState: OrdersAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const requestURL = mainApiUrl.getOrdersForUser;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: OrdersAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response.data,
    }));
  } catch (error) {
    set((prevState: OrdersAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

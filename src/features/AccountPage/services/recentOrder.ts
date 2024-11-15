import { header, request } from "@/utilities/request";
import type RecentOrderAtom from "../types/RecentOrdersAtom";

export const getRecentOrders = async (set: any) => {
  try {
    set((prevState: RecentOrderAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const requestURL = `/api/v5/user/support/recent-order`;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: RecentOrderAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response.data,
    }));
  } catch (error) {
    set((prevState: RecentOrderAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

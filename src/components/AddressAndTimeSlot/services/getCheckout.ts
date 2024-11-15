import { request } from "http";
import type CheckoutAtom from "../types/CheckoutAtom";
import { header } from "@/utilities/request";

export const getCheckout = async (set: any) => {
  try {
    set((prevState: CheckoutAtom) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true,
    }));

    const response: any = await request(`/api/v5/user/checkout`, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    set((prevState: CheckoutAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      data: response,
    }));
  } catch (error) {
    set((prevState: CheckoutAtom) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false,
    }));
  }
};

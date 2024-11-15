import { header, request } from "@/utilities/request";
import type SupportChatAtom from "../types/SupprtChatAtom";

export const postMessage = async (
  payload: any,
  orderId: any,
  setSupportChatArg: any
) => {
  try {
    setSupportChatArg((prevState: SupportChatAtom) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true,
    }));

    const response: any = await request(
      `/api/v1/support/chats?order_id=${orderId}`,
      {
        method: "POST",
        headers: {
          Authorization: header(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    setSupportChatArg((prevState: SupportChatAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      coupon: response.data,
      isApplied: true,
    }));
  } catch (error) {
    setSupportChatArg((prevState: SupportChatAtom) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false,
    }));
  }
};

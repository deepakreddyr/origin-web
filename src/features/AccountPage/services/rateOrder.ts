import { header, request } from "@/utilities/request";
import type { RateOrderPayload } from "../types/RateOrderPayload";

export const rateOrderApi = async (payload: RateOrderPayload) => {
  try {
    const requestURL = `/api/v1/user/ratings`;

    const response = await request(requestURL, {
      method: "POST",
      headers: {
        Authorization: header(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (e) {
    return null;
  }
};

import { header, request } from "@/utilities/request";
import type ReferEarnAtom from "../types/ReferEarnAtom";

export const getReferEarn = async (set: any) => {
  try {
    set((prevState: ReferEarnAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const requestURL = `/api/v3/user/referral-code`;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: ReferEarnAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response,
    }));
  } catch (error) {
    set((prevState: ReferEarnAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

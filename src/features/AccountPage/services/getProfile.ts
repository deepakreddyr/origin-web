import { header, request } from "@/utilities/request";

import type ProfileAtom from "../types/ProfileAtom";

export const getProfile = async (set: any) => {
  try {
    set((prevState: ProfileAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const requestURL = `/api/v1/user/profile`;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: ProfileAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response.data,
    }));
  } catch (error) {
    set((prevState: ProfileAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

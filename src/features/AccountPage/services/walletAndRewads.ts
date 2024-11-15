import { header, request } from "@/utilities/request";
import type WalletAndRewardsAtom from "../types/WalletAndRewardsAtom";

export const getWalletAndRewards = async (set: any) => {
  try {
    set((prevState: WalletAndRewardsAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const requestURL = `/api/v1/user/wallet`;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: WalletAndRewardsAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response.data,
    }));
  } catch (error) {
    set((prevState: WalletAndRewardsAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

import { header, request } from "@/utilities/request";
import type Address from "../types/Address";
import type SaveAddressAtomI from "../types/SaveAddressAtomI";

export const saveAddress = async (payload: Address, set: any) => {
  try {
    set(() => ({
      isSaved: false,
      loading: true,
      error: false,
      success: true,
      address: null,
    }));

    const response: any = await request(`/api/v1/user/address`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: header(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    set((prevState: SaveAddressAtomI) => ({
      ...prevState,
      loading: false,
      success: true,
      data: response.data,
    }));
  } catch (error) {
    set((prevState: SaveAddressAtomI) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false,
      isSaved: true,
    }));
  }
};

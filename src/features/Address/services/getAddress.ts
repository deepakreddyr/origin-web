import { header, request } from "@/utilities/request";
import type AddressAtomI from "../types/AddressAtomI";
import { mainApiUrl } from "@/url";

export const getAddress = async (set: any) => {
  try {
    set((prevState: AddressAtomI) => ({
      ...prevState,
      loading: true,
      error: false,
      success: false,
      address: null,
    }));

    const response: any = await request(mainApiUrl.getAddress, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const defaultAddress = response.data.find((item: any) => item.is_default);

    localStorage.setItem("store-id", JSON.stringify(defaultAddress?.store_id));

    set((prevState: AddressAtomI) => ({
      ...prevState,
      loading: false,
      error: false,
      success: false,
      address: response.data,
      defaultAddress,
    }));
  } catch (error) {
    set((prevState: AddressAtomI) => ({
      ...prevState,
      loading: false,
      error: false,
      success: false,
      address: null,
    }));
  }
};

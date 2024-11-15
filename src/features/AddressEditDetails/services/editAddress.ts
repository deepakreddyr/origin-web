import { header, request } from "@/utilities/request";
import type AddressResponse from "../../AccountPage/types/Address";
import type SaveAddressAtomI from "../types/SaveAddressAtomI";

export const editAddress = async (payload: AddressResponse, set: any) => {
  try {
    set(() => ({
      isSaved: false,
      loading: true,
      error: false,
      success: true,
      address: null,
    }));

    const requestURL = `/api/v1/user/address/${payload.address_id}`;

    const response: any = await request(requestURL, {
      method: "PATCH",
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

import { header, request } from "@/utilities/request";
import type Address from "../types/Address";
import type AddressAtomI from "../types/AddressAtomI";

export const editAddress = async (payload: Address, setAddressAtom: any) => {
  try {
    const response: any = await request(
      `/api/v1/user/address/${payload.address_id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          Authorization: header(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    setAddressAtom((prevState: AddressAtomI) => ({
      ...prevState,
      loading: true,
      error: false,
      success: false,
      address: response.data,
      defaultAddress: response.data.find((item: any) => item.is_default),
    }));
  } catch (error) {
    //
  }
};

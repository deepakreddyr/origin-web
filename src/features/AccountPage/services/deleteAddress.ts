import { header, request } from "@/utilities/request";
import type Address from "../types/Address";

export const deleteAddress = async (
  id: number | string
): Promise<Address[] | null> => {
  try {
    const requestURL = `/api/v1/user/address/${id}`;

    const response: any = await request(requestURL, {
      method: "DELETE",
      headers: {
        Authorization: header(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

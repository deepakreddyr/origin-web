import { header, request } from "@/utilities/request";

export const deleteAccount = async () => {
  try {
    const response: any = await request(`/api/v3/user/deleteuser`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: header(),
      },
    });

    return response;
  } catch (error) {
    return false;
  }
};

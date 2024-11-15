import { header } from "@/utilities/request";

export const getSupportChat = async (set: any, order_id: string) => {
  try {
    set((prevState: any) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true,
    }));

    const response: any = await request(
      `/api/v1/support/chats?order_id=${order_id}`,
      {
        method: "GET",
        headers: {
          Authorization: header(),
          Accept: "application/json",
        },
      }
    );

    set((prevState: any) => ({
      ...prevState,
      loading: false,
      success: true,
      data: response?.data,
    }));
  } catch (error) {
    set((prevState: any) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false,
    }));
  }
};

import { header, request } from "../../../utils/request";
import type { CouponList } from "../context/atoms";

export const getCoupon = async (subTotal: number, set: any) => {
  try {
    set((prevState: CouponList) => ({
      ...prevState,
      loading: true,
      error: false,
      success: true,
    }));

    const response: any = await request(
      `/api/v1/user/coupons?sub_total=${subTotal}`,
      {
        method: "GET",
        headers: {
          Authorization: header(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    set((prevState: CouponList) => ({
      ...prevState,
      loading: false,
      success: true,
      coupons: response.data,
    }));
  } catch (error) {
    set((prevState: CouponList) => ({
      ...prevState,
      error: true,
      success: false,
      loading: false,
    }));
  }
};

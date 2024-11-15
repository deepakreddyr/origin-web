import { header, request } from "@/utilities/request";
import type TransactionListAtom from "../types/TransactionListAtom";

export const getTransactionList = async (
  set: any,
  page: number = 1,
  increasePage: boolean = false
) => {
  try {
    set((prevState: TransactionListAtom) => ({
      ...prevState,
      loading: true,
      success: false,
      error: false,
    }));

    const nextPage = increasePage ? page + 1 : page;
    const requestURL = `/api/v1/user/wallet/transactions?page=${nextPage}`;

    const response: any = await request(requestURL, {
      method: "GET",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
    });

    set((prevState: TransactionListAtom) => ({
      ...prevState,
      loading: false,
      success: true,
      error: false,
      data: response.data,
      meta: response.meta,
    }));
  } catch (error) {
    set((prevState: TransactionListAtom) => ({
      ...prevState,
      loading: false,
      success: false,
      error: true,
    }));
  }
};

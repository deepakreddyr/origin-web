import type TransactionListResponse from "./TransactionList";

type TransactionListAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: TransactionListResponse | null;
};

export default TransactionListAtom;

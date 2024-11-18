import type RecentOrderResponse from "./RecentOrder";

type RecentOrderAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: RecentOrderResponse | null;
};

export default RecentOrderAtom;

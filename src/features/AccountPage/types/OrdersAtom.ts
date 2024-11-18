import type { Order } from "./Order";

type OrdersAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: Order[] | null;
};

export default OrdersAtom;

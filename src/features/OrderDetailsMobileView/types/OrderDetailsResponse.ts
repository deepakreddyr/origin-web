import type { OrderDetails } from "./OrderDetails";

export interface OrderDetailsResponse {
  loading: boolean;
  success: boolean;
  error: any;
  data: OrderDetails | null;
}

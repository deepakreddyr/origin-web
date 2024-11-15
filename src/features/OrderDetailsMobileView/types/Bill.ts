export interface Bill {
  bill_id: number;
  order_id: number;
  sub_total: number;
  tax: number;
  discount: number;
  coupon_id: number | null;
  total: number;
  bill_created_at: number;
  delivery_type: string;
  delivery_fee: number;
  payment_method: string;
  payment_status: string;
  coupon: string | null;
  packaging_price: number;
  wallet_spent: any; // Replace with appropriate type
  reward_spent: any; // Replace with appropriate type
  sub_payment_method: any; // Replace with appropriate type
  reason_for_edit: any; // Replace with appropriate type
  round_off: string;
  refund_amount: any; // Replace with appropriate type
  type: string;
}

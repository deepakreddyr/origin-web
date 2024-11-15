export interface Coupon {
  id: number | string;
  name: string;
  code: string;
  min_cart_value: number;
  max_cart_value: number;
  discount_type: string;
  discount: number;
  expire_at: string;
  message: any;
  isValid: any;
  description: string;
  error_message: string;
  timeslot_disable_message: any;
  exclude_timeslot_id: any;
  is_cod_available: boolean;
  is_reward_available: boolean;
}

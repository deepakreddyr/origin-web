export default interface CouponI {
  id: number;
  name: string;
  code: string;
  min_cart_value: number;
  max_cart_value: number;
  discount_type: "fixed" | "percentage"; // You might want to add percentage as an option
  discount: number;
  expire_at: string;
  isValid: number;
  description: string | null;
  error_message: string | null;
  timeslot_disable_message: string | null;
  exclude_timeslot_id: number | null;
  is_cod_available: boolean;
  is_reward_available: boolean;
  message: string | null;
  offer: string;
}

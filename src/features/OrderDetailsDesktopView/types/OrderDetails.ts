import type { Bill } from "./Bill";
import type { Item } from "./Item";
import type { Status } from "./Status";
import type { TimeSlot } from "./TimeSlot";

interface Driver {
  name: string;
  phone: string;
  latitude: string;
  longitude: string;
  previous_order_started_at: string | null;
  eta: string | null;
  delay_message: string | null;
  device_type: string;
}

export interface OrderDetails {
  is_edit: boolean;
  edit_order_type: string;
  edit_order_time: number;
  is_order_editable: boolean;
  order_id: number;
  order_code: number;
  status: string;
  status_list: Status[];
  address: string;
  address_name: string;
  latitude: string;
  longitude: string;
  sub_total: number;
  tax: number;
  discount: number;
  coupon_id: number;
  total: number;
  order_created_at: number;
  delivery_date: any;
  driver: Driver | null;
  delivery_type: string;
  delivery_fee: number;
  time_slot: TimeSlot;
  time_formatted: string;
  payment_method: string;
  payment_status: string;
  comment: null;
  items: Item[];
  coupon: string;
  applied_coupon: null;
  is_rated: boolean;
  razorpay_order_id: null;
  uuid: string;
  bills: Bill[];
  customer_support_phone: string;
  individual_packaging_enabled: boolean;
  packaging_price: number;
  tickets: any[]; // Replace with appropriate type
  refunds: any;
  instructions: null;
  is_repeat_order_enabled: boolean;
  deductions_from_wallet: any; // Replace with appropriate type
  deductions_from_reward: any; // Replace with appropriate type
  delay_message: null;
  enable_cod: boolean;
  disable_cod_for_offers: boolean;
  enable_cod_for_redemption: boolean;
  order_cancellation_time: number;
}

import type { Bill } from './Bill';
import type { Coupon } from './coupon';
import type { Item } from './Item';
import type { Status } from './Status';
import type { TimeSlot } from './TimeSlot';

interface Driver {
  name: string;
  phone: string;
  latitude: string;
  longitude: string;
  previous_order_started_at: number | null;
  eta: number | null;
  delay_message: string | null;
  device_type: string;
}

interface Refunds {
  amount: number;
  message: string;
  order_id: number;
  status: string;
}

export interface OrderDetails {
  is_edit: boolean;
  edit_order_type: string;
  edit_order_time: number;
  is_order_editable: boolean;
  order_id: number;
  razorpay_key: string;
  status: string;
  status_list: Status[];
  address: string;
  formatted_address: string;
  address_name: string;
  latitude: string;
  longitude: string;
  sub_total: number;
  total_market_price: number;
  tax: number;
  discount: number;
  coupon_id: number;
  total: number;
  order_created_at: number;
  driver: Driver | null;
  delivery_type: string;
  delivery_fee: number;
  time_slot: TimeSlot;
  time_formatted: string;
  payment_method: string;
  payment_status: string;
  comment: null;
  items: Item[];
  coupon: Coupon;
  applied_coupon: null;
  is_rated: boolean;
  razorpay_order_id: null;
  uuid: string;
  bills: Bill[];
  customer_support_phone: string;
  individual_packaging_enabled: boolean;
  packaging_price: number;
  tickets: any[];
  refunds: Refunds | null;
  instructions: null;
  is_repeat_order_enabled: boolean;
  deductions_from_wallet: any;
  deductions_from_reward: any;
  delay_message: null;
  enable_cod: boolean;
  disable_cod_for_offers: boolean;
  enable_cod_for_redemption: boolean;
  order_cancellation_time: number;
  lbnp?: {
    dcc?: string;
    tracking_url?: string;
    agent_name?: string;
    agent_phone?: string;
    start_time?: number;
    end_time?: number;
  };
}

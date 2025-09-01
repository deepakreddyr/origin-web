interface StatusList {
  status_message: string;
  time: string;
}

interface TimeSlot {
  id: number;
  from: string;
  to: string;
}

interface OrderedUom {
  variant_id: number;
  uom_id: number;
  cart_quantity: number;
  subtotal: number;
  price: number;
  unit: string;
  ripeness: any;
}

interface Item {
  id: number;
  name: string;
  item_code: string;
  image: string;
  logo: string;
  ordered_uoms: OrderedUom[];
}

interface Bill {
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
  wallet_spent: number | null;
  reward_spent: number | null;
  sub_payment_method: string | null;
  reason_for_edit: string | null;
  round_off: string;
  refund_amount: number | null;
  type: string;
}

interface Ticket {
  id: number;
  ticket_raised_at: number;
  ticket_closed_at: number;
  chat: {
    id: number;
    question: string | null;
    message: string | null;
    image: string | null;
    rating: boolean;
    type: string;
    options: any;
    user_type: string;
  };
  ticket_status: string;
}

interface Faq {
  id: number;
  title: string;
  description: string;
}

interface Order {
  is_edit: boolean;
  edit_order_type: string;
  edit_order_time: number;
  is_order_editable: boolean;
  order_id: number;
  status: string;
  status_list: StatusList[];
  address: string;
  latitude: string;
  longitude: string;
  sub_total: number;
  tax: number;
  discount: number;
  coupon_id: number;
  total: number;
  order_created_at: number;
  driver: null | any;
  delivery_type: string;
  delivery_fee: number;
  time_slot: TimeSlot;
  time_formatted: string;
  payment_method: string;
  payment_status: string;
  comment: string | null;
  items: Item[];
  coupon: string;
  applied_coupon: string | null;
  is_rated: boolean;
  razorpay_order_id: string | null;
  uuid: string;
  bills: Bill[];
  customer_support_phone: string;
  individual_packaging_enabled: boolean;
  packaging_price: number;
  tickets: Ticket[];
  refunds: any;
  instructions: string | null;
  is_repeat_order_enabled: boolean;
  deductions_from_wallet: any;
  deductions_from_reward: any;
  delay_message: string | null;
  enable_cod: boolean;
  disable_cod_for_offers: boolean;
  enable_cod_for_redemption: boolean;
  order_cancellation_time: number;
  delivery_date: number;
  faqs: Faq[];
}

interface Data {
  order: Order;
}

type RecentOrderResponse = any;
export default RecentOrderResponse;

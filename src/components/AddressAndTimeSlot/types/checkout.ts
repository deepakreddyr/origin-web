interface TimeSlot {
  id: number;
  from: string;
  to: string;
  reward_value: any;
  reward_type: any;
  message: any;
  discount_value: any;
  discount_type: any;
  maximum_discount: any;
  available: boolean;
}

interface Wallet {
  id: number;
  wallet_balance: number;
  reward_balance: number;
  min_amount: number;
  max_amount: number;
  default_amount_list: number[];
  kyc_updated: boolean;
}

interface DeliveryDate {
  [index: number]: number;
}
interface ImmediateDeliverySettings {
  immediate_delivery_available: boolean;
  immediate_delivery_time_enabled: boolean;
  immediate_delivery_enabled: boolean;
  is_immediate_delivery_busy: boolean;
  disable_coupon_fast_delivery: boolean;
  immediate_cart_minimum: number;
  immediate_order_title: string;
  immediate_order_sub_title: string;
  immediate_delivery_disabled_message: string;
  disable_order_placing_message: string | null;
  immediate_delivery_fee: string;
}

export default interface Checkout {
  dash_delivery: ImmediateDeliverySettings;
  is_exotel_enabled: boolean;
  timeslots: TimeSlot[];
  default_pay_type: string;
  formatted_delivery_date: string[];
  tax: string;
  individual_package_price: number;
  delivery_fee: string;
  packaging_charge: null | any;
  pay_later: number;
  delivery_date: DeliveryDate;
  edit_order_time: number;
  is_individual_package: boolean;
  date_skip_message: null | any;
  store_name: null | any;
  wallet: Wallet;
  wallet_enabled: boolean;
  reward_enabled: boolean;
  max_redeemable_rewards: number;
  enable_cod: boolean;
  enable_order_edit: boolean;
  show_instant_delivery_time_delay_message: null | any;
  disable_cod_for_offers: boolean;
  instant_delivery_error_message: null | any;
  time_slot_message: string;
  time_slot_selected_message: string;
  reward_time_slot_id: number;
  reward_for_time_slot: string;
  redemption_restrict_info: null | any;
  rewards_info_url: string;
  reward_upsell_message: string;
  redemption_enabled: boolean;
  enable_cod_for_redemption: boolean;
  late_slot_min_reward_value: number;
  app_order_min_reward_value: number;
  nearest_redeemable_reward: number;
}

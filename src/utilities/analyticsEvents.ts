export const AnalyticsEvents = {
  // Login & Registration
  FIRST_OPEN: 'first_open',
  INTRO: 'intro',
  PHONE: 'phone',
  OTP: 'otp',
  USER_DETAILS: 'user_details',
  ADDRESS: 'address',
  ADDRESS_DETAILS: 'address_details',
  REGISTRATION_PROCEED: 'registration_proceed',
  REGISTRATION_SUCCESSFUL: 'registration_successful',
  REGISTRATION_FAILED: 'registration_failed',
  REGISTERED: 'registered',
  REGISTERED_WITH_DELIVERABLE: 'registered_with_deliverable',
  REGISTERED_WITH_NOT_DELIVERABLE: 'registered_with_not_deliverable',
  LOGGED_IN: 'logged_in',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',

  // Skip Login Flow
  SKIP_LOGIN_LOCATION: 'skip_login_location',
  SKIP_LOGIN_SEARCH: 'skip_login_search',
  SKIP_LOGIN_HOME: 'skip_login_home',
  SKIP_LOGIN_CATEGORY: 'skip_login_category',
  SKIP_LOGIN_ITEM_DETAILS: 'skip_login_item_details',
  SKIP_LOGIN_PHONE: 'skip_login_phone',
  SKIP_LOGIN_OTP: 'skip_login_otp',
  SKIP_LOGIN_USER_DETAILS: 'skip_login_user_details',
  SKIP_LOGIN_ADDRESS: 'skip_login_address',
  SKIP_LOGIN_ADDRESS_DETAILS: 'skip_login_address_details',
  SKIP_LOGIN_SEARCH_MAIN: 'skip_login_search_main',

  // Screen / Activity Views
  HOME: 'home',
  SEARCH: 'search',
  CATEGORY: 'category',
  SUB_CATEGORY: 'sub_category',
  ITEM_DETAILS: 'item_details',
  VIEW_CART: 'view_cart',
  CHECKOUT: 'checkout',
  CHECKOUT_V2: 'checkout_v2',
  PAYMENT_METHOD: 'payment_method',
  CONFIRMATION: 'confirmation',
  ORDER_DETAILS: 'order_details',
  STORE_ORDER_DETAILS: 'store_order_details',
  ORDERS: 'orders',
  ACCOUNT: 'account',
  PROFILE: 'profile',
  COUPON_LIST: 'coupon_list',
  SELECT_ADDRESS: 'select_address',
  MANAGE_ADDRESS: 'manage_address',
  DELIVERY_TYPE: 'delivery_type',
  LOCATION_PERMISSION: 'location_permission',
  NO_INTERNET: 'no_internet',
  STORE_LOCATOR: 'store_locator',
  STORE_SELECTED: 'store_selected',

  // Cart
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  DELETE_FROM_CART: 'delete_from_cart',
  ALL_CART_ITEMS: 'all_cart_items',
  UOM_ALL_CART_ITEMS: 'uom_all_cart_items',
  ABANDONED_CART: 'abandoned_cart',
  ABANDON_CHECKOUT: 'abandon_checkout',

  // Orders & Payment
  PLACED_ORDER: 'placed_order',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENTFAIL_CANCEL_ORDER: 'paymentfail_cancel_order',
  PAYMENTFAIL_RETRY: 'paymentfail_retry',
  PAYMENTFAIL_COD: 'paymentfail_cod',
  ORDER_DETAILS_PAYMENT_OPTION: 'order_details_payment_option',
  ORDER_STATUS: 'order_status',

  // Delivery & Location
  INSTANT_DELIVERY: 'instant_delivery',
  TIMESLOT_DELIVERY: 'timeslot_delivery',
  SLOT_SELECT: 'slot_select',
  LAUNCH_INSTANT: 'launch_instant',
  LAUNCH_NEXT_DAY: 'launch_next_day',
  HOME_INSTANT: 'home_instant',
  HOME_NEXT_DAY: 'home_next_day',
  DELIVERABLE_LOCATION: 'deliverable_location',
  USER_LOCATION: 'user_location',
  SERVICEABLE_USER_LOCATION: 'serviceable_user_location',
  ADDRESS_FLOW: 'address_flow',
  ADD_LOCATION: 'add_location',
  DELIVERY_INSTRUCTION: 'delivery_instruction',

  // Coupons & Promotions
  APPLIED_COUPON: 'applied_coupon',
  COUPON_SELECTED: 'coupon_selected',
  COUPON_UPSELL: 'coupon_upsell',

  // Search & Discovery
  PRODUCT_SEARCH: 'product_search',
  PRODUCT_VIEW: 'product_view',
  PRODUCT_PURCHASE: 'product_purchase',
  CATEGORY_VIEWED: 'category_viewed',
  SUB_CATEGORY_VIEWED: 'sub_category_viewed',
  BANNER_CLICKS: 'banner_clicks',

  // Account & Profile
  ALTERNATE_PHONE_NUMBER: 'alternate_phone_number',
  FEEDBACK: 'feedback',
  CUSTOMER_SUPPORT_PHONE: 'customer_support_phone',
  CUSTOMER_SUPPORT_EMAIL: 'customer_support_email',
  CUSTOMER_SUPPORT_WHATSAPP: 'customer_support_whatsapp',
  PHONE_UPDATED: 'phone_updated',
  DELETE_ACCOUNT: 'delete_account',
  LOGOUT: 'logout',

  // Session Time Tracking
  TRACK_APP_USAGE: 'track_app_usage',
  TRACK_OTP: 'track_otp',
  TRACK_HOME: 'track_home',
  TRACK_CATEGORY: 'track_category',
  TRACK_SUB_CATEGORY: 'track_sub_category',
  TRACK_SEARCH: 'track_search',
  TRACK_CART: 'track_cart',
  TRACK_CHECKOUT: 'track_checkout',
  TRACK_PAYMENT_METHOD: 'track_payment_method',
  TRACK_ORDER_DETAILS: 'track_order_details',
  TRACK_STORE_ORDER_DETAILS: 'track_store_order_details',
  TRACK_REG_USER_DETAILS: 'track_reg_user_details',
  TRACK_REG_LOCATION: 'track_reg_location',
  TRACK_REG_LOCATION_DETAILS: 'track_reg_location_details',
  TRACK_ITEM_DETAILS: 'track_item_details',
  TRACK_NEED_HELP: 'track_need_help',
  TRACK_COUPON_LIST: 'track_coupon_list',
  TRACK_ORDERS: 'track_orders',
  TRACK_STORE_LOCATOR: 'track_store_locator',

  // Legacy/Mango (Keeping for compatibility)
  MANGO_HOME: 'mango_home',
  MANGO_RECIPE_VIEW: 'mango_recipe_view',
  PRODUCT_CLICKED: 'product_clicked',
  RECIPE_CLICKED: 'recipe_clicked',
  USER_SELECTED_ADDRESS: 'user_selected_address',
  PAGE_VIEW: 'page_view'
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export interface AnalyticsItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface CartItemProperties {
  item_name: string;
  item_code: string | number;
  product_price: number;
  prqt: number;
  category: string;
  selling_price: number;
  final_price: number;
  prid: string | number;
  product_url?: string;
  image?: string;
  from_cart?: boolean;
  in_stock?: boolean;
}

export type EventProperties = {
  [key in AnalyticsEventName]?: any;
} & {
  // Login
  [AnalyticsEvents.LOGGED_IN]: { 'user-id': string | number };

  // Cart
  [AnalyticsEvents.ADD_TO_CART]: CartItemProperties;
  [AnalyticsEvents.REMOVE_FROM_CART]: CartItemProperties;
  [AnalyticsEvents.DELETE_FROM_CART]: CartItemProperties;
  [AnalyticsEvents.ALL_CART_ITEMS]: {
    cart_items: any[];
    cart_items_lite: any[];
    min_cart_total: number;
    cart_sub_total: number;
  };
  [AnalyticsEvents.UOM_ALL_CART_ITEMS]: {
    uoms: any[];
    uom_all_cart_items: any[];
  };

  // Orders
  [AnalyticsEvents.PLACED_ORDER]: {
    orderid: string | number;
    order_value: number;
    count_of_order_items: number;
    mode_of_payment: string;
    discount_amt: number;
    shipping: number;
    items: any[];
    total_prqt: number;
    amount: number;
    alternate_phone?: string;
    instructions?: string;
  };
  [AnalyticsEvents.PAYMENT_SUCCESS]: {
    payment_mode: string;
    amount: number;
    orderid: string | number;
  };
  [AnalyticsEvents.PAYMENT_FAILED]: {
    payment_mode: string;
    amount: number;
    orderid: string | number;
  };

  // Location
  [AnalyticsEvents.DELIVERABLE_LOCATION]: {
    latitude: number;
    longitude: number;
    serviceable: boolean;
  };
  [AnalyticsEvents.USER_LOCATION]: {
    latitude: number;
    longitude: number;
  };
  [AnalyticsEvents.SERVICEABLE_USER_LOCATION]: {
    latitude: number;
    longitude: number;
    serviceable: boolean;
  };
  [AnalyticsEvents.ADDRESS_FLOW]: {
    view: string;
    direct_address_flow: boolean;
  };
  [AnalyticsEvents.DELIVERY_INSTRUCTION]: {
    instructions: string;
  };

  // Coupons
  [AnalyticsEvents.APPLIED_COUPON]: {
    coupon_name: string;
    min_cart_value: number;
  };
  [AnalyticsEvents.COUPON_SELECTED]: {
    coupon_name: string;
    min_cart_value: number;
  };
  [AnalyticsEvents.COUPON_UPSELL]: {
    coupon_upsell: string | boolean;
  };

  // Search
  [AnalyticsEvents.PRODUCT_SEARCH]: {
    keyword: string;
    count_search_result: number;
  };
  [AnalyticsEvents.PRODUCT_VIEW]: {
    item_code: string | number;
    item_alias?: string;
    category: string;
    // Including existing properties for compatibility
    prid?: string | number;
    uom?: string;
    image?: string;
    prqt?: number;
    product_name?: string;
    selling_price?: number;
    final_price?: number;
    in_stock?: string | boolean;
  };
  [AnalyticsEvents.PRODUCT_PURCHASE]: {
    item_code: string | number;
    product_name: string;
    product_price: number;
  };
  [AnalyticsEvents.CATEGORY_VIEWED]: {
    category_name: string;
  };
  [AnalyticsEvents.SUB_CATEGORY_VIEWED]: {
    sub_category_name: string;
  };

  // Account
  [AnalyticsEvents.ALTERNATE_PHONE_NUMBER]: {
    alternate_phone: string;
  };
  [AnalyticsEvents.CUSTOMER_SUPPORT_EMAIL]: {
    email_id: string;
  };
  [AnalyticsEvents.PHONE_UPDATED]: {
    phone_updated: boolean;
  };

  // Legacy/Mango
  [AnalyticsEvents.MANGO_RECIPE_VIEW]: {
    recipe_name: string;
    recipe_slug: string;
  };
  [AnalyticsEvents.PRODUCT_CLICKED]: {
    product_id: string | number;
    product_name: string;
    source?: string;
  };
  [AnalyticsEvents.RECIPE_CLICKED]: {
    recipe_name: string;
    recipe_slug: string;
    source?: string;
  };
};

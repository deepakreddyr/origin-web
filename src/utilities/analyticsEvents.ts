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

  // Lifecycle
  NO_INTERNET: 'no_internet',
  APP_UPDATED: 'app_updated',
  PAGE_VIEW: 'page_view',

  // Navigation & Screens
  HOME: 'home',
  SEARCH: 'search',
  CATEGORY_VIEWED: 'category_viewed',
  SUB_CATEGORY_VIEWED: 'sub_category_viewed',
  BANNER_CLICKS: 'banner_clicks',
  NOTIFICATION_CLICK: 'notification_click',

  // Discovery
  PRODUCT_VIEW: 'product_view',
  PRODUCT_SEARCH: 'product_search',

  // Cart
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  DELETE_FROM_CART: 'delete_from_cart',
  VIEW_CART: 'view_cart',
  ALL_CART_ITEMS: 'all_cart_items',
  ABANDONED_CART: 'abandoned_cart',

  // Checkout
  CHECKOUT: 'checkout',
  PRODUCT_PURCHASE: 'product_purchase',
  PLACED_ORDER: 'placed_order',
  PAYMENT_METHOD: 'payment_method',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',

  // Location / Address
  ADD_LOCATION: 'add_location',
  USER_SELECTED_ADDRESS: 'user_selected_address',
  DELIVERABLE_LOCATION: 'deliverable_location',

  // Coupons
  COUPON_LIST: 'coupon_list',
  COUPON_SELECTED: 'coupon_selected',
  APPLIED_COUPON: 'applied_coupon',

  // Account
  DELETE_ACCOUNT: 'delete_account',
  LOGOUT: 'logout',

  // Other utilities
  TRACK_OTP: 'track_otp',
  TRACK_API: 'track_api'
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

// --- Strong Typing for Properties ---

export type BaseItemProperties = {
  item_code?: string | number;
  item_name?: string;
  category?: string;
  prid?: string | number;
  uom?: string;
  image?: string;
  prqt?: number;
  selling_price?: number;
  final_price?: number;
};

export type EventProperties = {
  // Login & Registration
  [AnalyticsEvents.LOGGED_IN]: { 'user-id': string };
  [AnalyticsEvents.USER_SIGNUP]: { mobile_number: string; user_name: string; gender: string; email_id: string };

  [AnalyticsEvents.FIRST_OPEN]: Record<string, never>;
  [AnalyticsEvents.INTRO]: Record<string, never>;
  [AnalyticsEvents.PHONE]: Record<string, never>;
  [AnalyticsEvents.OTP]: Record<string, never>;
  [AnalyticsEvents.USER_DETAILS]: Record<string, never>;
  [AnalyticsEvents.ADDRESS]: Record<string, never>;
  [AnalyticsEvents.ADDRESS_DETAILS]: Record<string, never>;
  [AnalyticsEvents.REGISTRATION_PROCEED]: Record<string, never>;
  [AnalyticsEvents.REGISTRATION_SUCCESSFUL]: Record<string, never>;
  [AnalyticsEvents.REGISTRATION_FAILED]: Record<string, never>;
  [AnalyticsEvents.REGISTERED]: Record<string, never>;
  [AnalyticsEvents.REGISTERED_WITH_DELIVERABLE]: Record<string, never>;
  [AnalyticsEvents.REGISTERED_WITH_NOT_DELIVERABLE]: Record<string, never>;
  [AnalyticsEvents.USER_LOGIN]: Record<string, never>;

  [AnalyticsEvents.SKIP_LOGIN_LOCATION]: Record<string, never>;
  [AnalyticsEvents.SKIP_LOGIN_SEARCH]: Record<string, never>;
  [AnalyticsEvents.SKIP_LOGIN_HOME]: Record<string, never>;

  [AnalyticsEvents.NO_INTERNET]: Record<string, never>;
  [AnalyticsEvents.APP_UPDATED]: Record<string, never>;

  [AnalyticsEvents.PAGE_VIEW]: { page_path: string; page_title?: string };

  [AnalyticsEvents.HOME]: Record<string, never>;
  [AnalyticsEvents.SEARCH]: Record<string, never>;
  [AnalyticsEvents.CATEGORY_VIEWED]: { category_name: string };
  [AnalyticsEvents.SUB_CATEGORY_VIEWED]: { sub_category_name: string };
  [AnalyticsEvents.BANNER_CLICKS]: Record<string, any>;
  [AnalyticsEvents.NOTIFICATION_CLICK]: Record<string, any>;

  [AnalyticsEvents.PRODUCT_VIEW]: BaseItemProperties & {
    item_alias?: string;
    product_name?: string;
    in_stock?: boolean | string;
  };
  [AnalyticsEvents.PRODUCT_SEARCH]: { keyword: string; count_search_result: number };

  [AnalyticsEvents.ADD_TO_CART]: BaseItemProperties & {
    product_price?: number;
    product_url?: string;
    from_cart?: boolean;
  };
  [AnalyticsEvents.REMOVE_FROM_CART]: BaseItemProperties & {
    product_price?: number;
    product_url?: string;
    from_cart?: boolean;
  };
  [AnalyticsEvents.DELETE_FROM_CART]: BaseItemProperties & {
    product_price?: number;
    product_url?: string;
    from_cart?: boolean;
  };
  [AnalyticsEvents.VIEW_CART]: Record<string, never>;
  [AnalyticsEvents.ALL_CART_ITEMS]: {
    cart_items: any[];
    cart_items_lite?: any[];
    min_cart_total?: number;
    cart_sub_total?: number;
  };
  [AnalyticsEvents.ABANDONED_CART]: {
    cart_items: any[];
    cart_value: number;
    count_of_item: number;
  };

  [AnalyticsEvents.CHECKOUT]: {
    selling_amount: number;
    discount_amt?: number;
    amount: number;
    shipping?: number;
    instructions?: string;
    payment_mode: string;
    order_id: string;
    items: AnalyticsItem[];
  };
  [AnalyticsEvents.PRODUCT_PURCHASE]: {
    order_id: string;
    amount: number;
    items: AnalyticsItem[];
  };
  [AnalyticsEvents.PLACED_ORDER]: {
    order_id: string;
    amount: number;
    payment_method: string;
    items: AnalyticsItem[];
  };
  [AnalyticsEvents.PAYMENT_SUCCESS]: {
    order_id: string;
    amount: number;
    payment_method: string;
  };
  [AnalyticsEvents.PAYMENT_FAILED]: {
    order_id: string;
    amount: number;
    payment_method: string;
  };
  [AnalyticsEvents.PAYMENT_METHOD]: Record<string, never>;

  [AnalyticsEvents.ADD_LOCATION]: Record<string, any>;
  [AnalyticsEvents.USER_SELECTED_ADDRESS]: {
    latitude: number;
    longitude: number;
    address_id: string;
    store_id: string;
  };
  [AnalyticsEvents.DELIVERABLE_LOCATION]: {
    latitude: number;
    longitude: number;
    serviceable: boolean;
  };

  [AnalyticsEvents.COUPON_LIST]: Record<string, never>;
  [AnalyticsEvents.COUPON_SELECTED]: { coupon_name: string; min_cart_value: number };
  [AnalyticsEvents.APPLIED_COUPON]: { coupon_name: string; min_cart_value: number };

  [AnalyticsEvents.DELETE_ACCOUNT]: Record<string, never>;
  [AnalyticsEvents.LOGOUT]: Record<string, never>;

  [AnalyticsEvents.TRACK_OTP]: Record<string, never>;
  [AnalyticsEvents.TRACK_API]: Record<string, never>;
};

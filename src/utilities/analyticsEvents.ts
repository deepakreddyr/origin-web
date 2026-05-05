export const AnalyticsEvents = {
  // Address
  USER_SELECTED_ADDRESS: 'user_selected_address',
  ADD_LOCATION: 'add_location',

  // Page views
  HOME: 'home',
  HOME_HEROBANNER: 'home_herobanner',
  PAGE_VIEW: 'page_view',

  // Cart / Checkout
  CART: 'cart',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CHECKOUT: 'checkout',
  PRODUCT_PURCHASE: 'product_purchase',
  ABANDON_CHECKOUT: 'abandon_checkout',
  APPLY_COUPON: 'apply_coupon',

  // Category
  CATEGORY_VIEWED: 'category_viewed',
  SUB_CATEGORY_VIEWED: 'sub_category_viewed',

  // Product
  PRODUCT_VIEW: 'product_view',

  // Auth / User
  USER_SIGNUP: 'user_signup',
  LOGGED_IN: 'logged_in',
  LOGOUT: 'logout',
  DELETE_ACCOUNT: 'delete_account',

  // Mango
  MANGO_HOME: 'mango_home',
  MANGO_RECIPE_VIEW: 'mango_recipe_view',
  PRODUCT_CLICKED: 'product_clicked',
  RECIPE_CLICKED: 'recipe_clicked'
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

export type EventProperties = {
  [AnalyticsEvents.USER_SELECTED_ADDRESS]: {
    latitude: string | number;
    longitude: string | number;
    adress_id: string; // Matching "adress_id" per previous schema
    store_id: string;
  };
  [AnalyticsEvents.ADD_LOCATION]: {
    home_address: string;
  };

  // Page views
  [AnalyticsEvents.HOME]: Record<string, never>;
  [AnalyticsEvents.HOME_HEROBANNER]: Record<string, never>;
  [AnalyticsEvents.PAGE_VIEW]: {
    page_name: string;
  };

  // Cart / Checkout
  [AnalyticsEvents.CART]: {
    store_id?: string;
    items?: AnalyticsItem[];
    total_price?: number;
    total_quantity?: number;
  };
  [AnalyticsEvents.ADD_TO_CART]: {
    product_id: string | number;
    product_name: string;
    product_price: number;
    quantity: number;
    store_id?: string;
  };
  [AnalyticsEvents.REMOVE_FROM_CART]: {
    product_id: string | number;
    product_name: string;
  };
  [AnalyticsEvents.CHECKOUT]: {
    selling_amount: number | string;
    discount_amt: number | string;
    amount: number | string;
    shipping: number | string;
    instructions?: string;
    payment_mode?: string;
    order_id?: string;
    items: AnalyticsItem[];
    store_id?: string;
  };
  [AnalyticsEvents.PRODUCT_PURCHASE]: {
    order_id: string;
    amount: number;
    items: AnalyticsItem[];
  };
  [AnalyticsEvents.ABANDON_CHECKOUT]: {
    items: AnalyticsItem[];
    total_price: number;
    store_id?: string;
  };
  [AnalyticsEvents.APPLY_COUPON]: {
    coupon_code: string;
    discount_amount: number;
    is_success: boolean;
  };

  // Category
  [AnalyticsEvents.CATEGORY_VIEWED]: {
    category_name: string;
  };
  [AnalyticsEvents.SUB_CATEGORY_VIEWED]: {
    sub_category_name: string;
  };

  // Product
  [AnalyticsEvents.PRODUCT_VIEW]: {
    prid: string;
    uom: string;
    image: string;
    prqt: number;
    product_name: string;
    category: string;
    selling_price: number;
    final_price: number;
    in_stock: string | boolean;
  };

  // Auth / User
  [AnalyticsEvents.USER_SIGNUP]: {
    mobile_number: string;
    user_name: string;
    gender: string;
    email_id: string;
  };
  [AnalyticsEvents.LOGGED_IN]: {
    user_id: string;
  };
  [AnalyticsEvents.LOGOUT]: Record<string, never>;
  [AnalyticsEvents.DELETE_ACCOUNT]: Record<string, never>;

  // Mango
  [AnalyticsEvents.MANGO_HOME]: Record<string, never>;
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

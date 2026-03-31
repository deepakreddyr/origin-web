interface UrlMap {
  [key: string]: string; // Allow any string as a key and expect a string URL as the value
}

export const mainApiUrl = {
  requestOtp: '/api/v1/auth/otp',
  verifyOtp: '/api/v1/oauth/token',
  getProfileDetails: '/api/v1/user/profile',
  getOrdersForUser: '/api/v4/user/orders',
  fetchOrders: '/api/v3/user/orders', // to be removed
  fetchForAddressDeliverable: '/api/v5/public/check-deliverable',
  getAddress: '/api/v1/user/address',
  cartCheckout: '/api/v5/user/checkout', // this will give time and other details
  placeOrder: '/api/v3/user/orders', // to be removed
  ordersActions: '/api/v3/user/orders',
  getTestimonials: '/api/v1/public/testimonials',
  launch: '/api/v5/user/launch'
};

export const unprotectedUrl: UrlMap = {
  getShopDetails: '/api/v5/public/skip-login/shop-all',
  searchForProduct: '/api/v5/public/skip-login/items',
  getCategories: '/api/v5/public/skip-login/categories',
  getHomepage: '/api/v5/public/skip-login/homepage',
  getSubscriptionItems: '/api/v5/public/skip-login/subscription/items',
  getMangoHomepage: '/api/v5/public/skip-login/mango-homepage',
  mangoSearch: '/api/v5/public/skip-login/search/items/parent-category',
  getMangoListing: '/api/v3/public/skip-login/categories/3'
};

export const protectedUrl: UrlMap = {
  getCategories: '/api/v5/user/categories',
  getShopDetails: '/api/v5/user/shop-all',
  addToCart: '/api/v5/user/cart/items/add',
  getCartItems: '/api/v5/user/cart',
  getCoupons: '/api/v1/user/coupons',
  checkIfCouponIsValid: '/api/v3/user/coupons/validate',
  proceedToCheckout: '/api/v5/user/checkout',
  validateCoupon: '/api/v3/user/coupons/validate',
  updatePaymentType: '/api/v3/user/order/update/payment-method',
  cancelOngoingOrder: '/api/v5/user/order-cancel',
  removeitemsFromCart: '/api/v3/user/cart/items/remove',
  clearCartItems: '/api/v3/user/cart/clear',
  retryPayment: '/api/v1/user/payment/razorpay/init/order',
  searchForProduct: '/api/v5/user/items',
  updatePayment: '/api/v3/user/order/update/payment-method',
  getHomepage: '/api/v5/user/homepage',
  notifyMe: '/api/v5/user/items/notify-me',
  requestItems: '/api/v3/user/request-items',
  getSubscriptionItems: '/api/v5/user/subscription/items',
  getMangoHomepage: '/api/v5/user/mango-homepage',
  mangoSearch: '/api/v5/user/search/items/parent-category',
  getMangoListing: '/api/v3/user/categories/3'
};
// /api/5v / user / items;

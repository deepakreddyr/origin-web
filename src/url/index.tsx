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
  getTestimonials: '/api/v1/public/testimonials'
};

export const unprotectedUrl: UrlMap = {
  getShopDetails: '/api/v5/public/skip-login/shop-all',
  searchForProduct: '/api/v5/public/skip-login/items',
  getCategories: '/api/v5/public/skip-login/categories'
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
  updatePayment: '/api/v3/user/order/update/payment-method'
};
// /api/5v / user / items;

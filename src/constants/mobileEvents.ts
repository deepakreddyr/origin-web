export const checkDeviceForAndroidRetryPayment = typeof window !== 'undefined' && window.App && window.App.retryPayment;

export const checkDeviceForIOSRetryPayment =
  typeof window !== 'undefined' &&
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.retryPayment;

export const checkDeviceForAndroidPayOnDelivery =
  typeof window !== 'undefined' && window.App && window.App.payOnDelivery;

export const checkDeviceForIOSPayOnDelivery =
  typeof window !== 'undefined' &&
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.payOnDelivery;

export const checkDeviceForAndroidPayOnline = typeof window !== 'undefined' && window.App && window.App.payOnline;

export const checkDeviceForIOSPayOnline =
  typeof window !== 'undefined' &&
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.payOnline;

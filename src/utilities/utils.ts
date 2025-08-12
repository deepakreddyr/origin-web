import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { Product } from './shop/types';

export const getAddressAndStoreId = () => {
  const addressFromLs = localStorage.getItem('selected_address');
  let parsedAddress = null;
  try {
    parsedAddress = addressFromLs ? JSON.parse(addressFromLs) : null;
  } catch (error) {
    console.error('Error parsing selected_address from localStorage:', error);
  }
  return parsedAddress;
};

// local Storage item

export const updateCartItemsToLs = (cartItems: any) => {
  localStorage.setItem('cart_items', JSON.stringify(cartItems));
};

export const setRouteSourceToLs = (source: string) => {
  localStorage.setItem('tab_source', JSON.stringify(source));
};

export const removeRouteSourceFromLs = (name: string) => {
  localStorage.removeItem(name);
};

export const prepareCartItemsToApi = (cartItems: any) => {
  return {
    items: cartItems.map((item: any) => ({
      item_code: item.item_code,
      uom: Array.isArray(item.multiple_uoms)
        ? item.multiple_uoms
            .map((uomItem: any) => ({
              id: uomItem.variant_id,
              qty: uomItem.cart_quantity
            }))
            .filter((uom: any) => uom.qty > 0)
        : [
            {
              id: item.variant_id,
              qty: item.cart_quantity
            }
          ]
    }))
  };
};

export const clearPostPaymentItemsinLs = () => {
  localStorage.removeItem('total_cart');
  localStorage.removeItem('order_type');
  localStorage.removeItem('razorpay_response');
};
export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of the day

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diffInDays = Math.floor((date.getTime() - today.getTime()) / oneDayInMs);

  const dayName = date.toLocaleString('default', { weekday: 'long' }); // e.g., "Saturday"
  const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '/'); // e.g., "21/08/24"

  if (diffInDays === 0) {
    return `Today, ${dayName} ${formattedDate}`;
  } else if (diffInDays === 1) {
    return `Tomorrow, ${dayName} ${formattedDate}`;
  } else {
    return `${dayName} ${formattedDate}`;
  }
}

export const calculateCouponDiscount = (totalPrice: any, couponDetails: any) => {
  const { min_cart_value, max_cart_value, discount_type, discount } = couponDetails;
  if (discount_type === 'percentage') {
    if (discount && totalPrice) {
      let discountedAmount = totalPrice * (discount / 100);
      if (!max_cart_value) {
        return discountedAmount;
      }
      if (discountedAmount >= max_cart_value) {
        return max_cart_value;
      } else {
        return discountedAmount;
      }
    }
  } else if (discount_type === 'fixed') {
    let discountedAmount = discount;
    if (!max_cart_value) {
      return discountedAmount;
    }
    if (discountedAmount >= max_cart_value) {
      return max_cart_value;
    } else {
      return discountedAmount;
    }
  }
};

export const formatTimestamp = (unixTimestamp: any) => {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds

  // Extract day, date, month, year, and time components
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${dayName}, ${monthName} ${day} ${year} ${hours}:${minutes} ${ampm}`;
};

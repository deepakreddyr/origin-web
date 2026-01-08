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

// utils.ts

// ... (other utility functions)

/**
 * Transforms the nested cart structure (CartProduct[]) into the API payload format.
 * If a UOM has 'cart_ripeness' entries, it breaks them out into separate UOM objects
 * in the API payload, each with its specific quantity and ripeness_type.
 * * @param cartItems Array of top-level Product objects (the nested structure from Redux/LS).
 * @returns An object conforming to the API payload structure { items: [...] }.
 */
export const prepareCartItemsToApi = (cartItems: any) => {
  const apiPayload: any[] = [];

  cartItems.forEach((product: any) => {
    if (!product.item_code || !Array.isArray(product.multiple_uoms)) {
      return;
    }

    const productEntry: any = {
      item_code: product.item_code,
      uom: [] as any[],
      // Default to null, will be updated if a UOM has text
      gift_text: null,
      selected_rating: 0
    };

    product.multiple_uoms.forEach((uom: any) => {
      // Check if UOM has positive quantity OR if it's a basket with valid child items
      let hasValidBasketItems = false;
      if (uom.basket && Array.isArray(uom.basket.basket_items)) {
        hasValidBasketItems = uom.basket.basket_items.some((item: any) => item.cart_qty > 0);
      }

      const shouldInclude = uom.variant_id && (uom.cart_quantity > 0 || hasValidBasketItems);

      if (shouldInclude) {

        // --- FIX: Capture gift_text from the UOM level ---
        if (uom.gift_text) {
          productEntry.gift_text = uom.gift_text;
        }

        let filteredBasketItems = null;
        if (uom.basket && Array.isArray(uom.basket.basket_items)) {
          filteredBasketItems = uom.basket.basket_items.filter((item: any) => item.cart_qty > 0);
        }

        if (Array.isArray(uom.cart_ripeness) && uom.cart_ripeness.length > 0) {
          uom.cart_ripeness.forEach((ripenessObj: { ripeness_type: string, qty: any }) => {
            const qty = Number(ripenessObj.qty);
            if (qty > 0) {
              const entry: any = {
                id: uom.variant_id,
                variant_id: uom.variant_id,
                qty: qty,
                ripeness_type: ripenessObj.ripeness_type,
              };
              if (filteredBasketItems && filteredBasketItems.length > 0) {
                entry.basket_items = filteredBasketItems;
              }
              productEntry.uom.push(entry);
            }
          });
        } else {
          const qty = Number(uom.cart_quantity);
          if (qty > 0) {
            const uomEntry: any = {
              id: uom.variant_id,
              variant_id: uom.variant_id,
              qty: qty,
            };

            if (uom.gift_text) {
              uomEntry.gift_text = uom.gift_text;
            }

            if (filteredBasketItems && filteredBasketItems.length > 0) {
              uomEntry.basket_items = filteredBasketItems;
            }
            productEntry.uom.push(uomEntry);
          }
        }
      }
    });

    if (productEntry.uom.length > 0) {
      apiPayload.push(productEntry);
    }
  });

  return { items: apiPayload };
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
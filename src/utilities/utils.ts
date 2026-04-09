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
export const prepareCartItemsToApi = (cartItems: any, includeFreeItems: boolean = false) => {
  // cartItems is expected to be an array of top-level Product objects
  // console.log(cartItems, "cartItems");
  const apiPayload: any[] = [];

  cartItems.forEach((product: any) => {
    // 1. Check for valid product code and UOMs
    if (!product.item_code || !Array.isArray(product.multiple_uoms)) {
      return; // Skip invalid product entries
    }

    // Filter out free items ONLY if includeFreeItems is false
    if (!includeFreeItems && (product.isFreeItem || product.free || product.isFree)) {
      return; // Skip free product entries for sync API
    }

    // 2. Initialize the structure for this product
    const productEntry = {
      item_code: product.item_code,
      uom: [] as any[]
    };

    // 3. Iterate through all UOM/Variant entries within this product
    product.multiple_uoms.forEach((uom: any) => {
      // We only care about UOMs that have been added to the cart (cart_quantity > 0)
      if (uom.variant_id && uom.cart_quantity > 0) {
        // --- NEW LOGIC FOR RIPENESS EXPLOSION ---
        if (Array.isArray(uom.cart_ripeness) && uom.cart_ripeness.length > 0) {
          // A. Item with Ripeness: Explode into separate UOM entries
          uom.cart_ripeness.forEach((ripenessObj: { ripeness_type: string; qty: string }) => {
            const qty = Number(ripenessObj.qty);
            if (qty > 0) {
              productEntry.uom.push({
                id: uom.variant_id,
                qty: qty,
                ripeness_type: ripenessObj.ripeness_type // Include ripeness_type
              });
            }
          });
        } else {
          // B. Simple Item (No Ripeness split): Use the UOM's total quantity
          const qty = Number(uom.cart_quantity);
          if (qty > 0) {
            const uomEntry: { id: number; qty: number; ripeness_type?: string } = {
              id: uom.variant_id,
              qty: qty
            };

            // If the UOM has a default selected_ripeness_type (e.g., if it was
            // implicitly selected but not split), include it.
            // NOTE: The previous version used selected_ripeness_type which is only
            // available in the FLAT structure. In the NESTED structure, if cart_ripeness
            // is empty, we must rely on omitting the ripeness_type key entirely.

            productEntry.uom.push(uomEntry);
          }
        }
      }
    });

    // 4. Add the product entry to the main payload if it contains UOMs
    if (productEntry.uom.length > 0) {
      apiPayload.push(productEntry);
    }
  });

  // console.log(apiPayload, "apiPayload");
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

export const calculateCouponDiscount = (totalPrice: number, couponDetails: any) => {
  const { max_cart_value, discount_type, discount } = couponDetails;

  let discountedAmount = 0;
  if (discount_type === 'percentage') {
    discountedAmount = totalPrice * (discount / 100);
  } else if (discount_type === 'fixed') {
    discountedAmount = discount;
  }

  // If max_cart_value is provided (and not null/0), cap the discount
  if (max_cart_value && max_cart_value > 0) {
    return Math.min(discountedAmount, max_cart_value);
  }

  return discountedAmount;
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

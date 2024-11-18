import { header, request } from '@/utilities/request';
import { getCart } from './getCart';

export const addToCart = async (cartItems: any[], cartSet: any) => {
  try {
    await request(`/api/v1/user/cart/clear`, {
      method: 'GET',
      headers: {
        Authorization: header(),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const requestURL = `/api/v3/user/cart/items/add`;
      const addPayload = {
        items: cartItems.map((e) => ({
          item_code: e.item_code,
          uom: e.uom.map((uomItem: any) => {
            return {
              id: uomItem.variant_id,
              qty: uomItem.qty
            };
          })
        }))
      };

      await request(requestURL, {
        method: 'POST',
        headers: {
          Authorization: header(),
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addPayload)
      });
      getCart(cartSet);
    }
  } catch (error) {
    //
  }
};

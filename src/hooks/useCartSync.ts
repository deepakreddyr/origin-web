import { useCartStore } from './useCartStore';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import { protectedUrl } from '@/url';
import { useDispatch, useSelector } from 'react-redux';

let isSyncingInProgress = false;

export const useCartSync = () => {
  const dispatch = useDispatch();
  const { cart, isMangoPage, actions, subscriptionCart } = useCartStore();
  const { setCartItems, setCartMinimum, setFreeItems } = actions;

  const isSubscription = subscriptionCart?.isSubscriptionActive;
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();

  const fetchCartItemsFromApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      dispatch(setCartItems(data.data));
      if (data.cart_minimum) {
        dispatch(setCartMinimum(data.cart_minimum));
      }

      if (data.free_items && data.free_items.length > 0) {
        dispatch(
          setFreeItems({
            freeItems: data.free_items,
            freeItemsMov: Number(data.free_items_mov) || 0
          })
        );
      } else {
        dispatch(setFreeItems({ freeItems: [], freeItemsMov: 0 }));
      }
    };

    if (addressFromLs) getDataFromApi(apiUrl, successHandler, () => {}, additionalHeaders);
  };

  const sendItemsToApi = (force: boolean = false) => {
    if (isSyncingInProgress) {
      console.log('Cart sync already in progress, skipping...');
      return;
    }

    const token = localStorage.getItem('user_token');
    if (!token || !loginDetails.isLogin) return;
    if (isSubscription) return;

    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const syncLocalCartToBackend = () => {
      const lsKey = isMangoPage ? 'mango_cart_items' : 'cart_items';
      const cartItemFromLs = localStorage.getItem(lsKey);

      if (cartItemFromLs) {
        const cartItemsParsed = JSON.parse(cartItemFromLs);
        if (cartItemsParsed.length === 0 && !force) {
          isSyncingInProgress = false;
          return;
        }

        const cartItemsToApi = prepareCartItemsToApi(cartItemsParsed);
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];

        const successHandler = () => {
          isSyncingInProgress = false;
          fetchCartItemsFromApi();
        };

        const failureHandler = () => {
          isSyncingInProgress = false;
          fetchCartItemsFromApi();
        };

        sendDataToApi(apiUrl, cartItemsToApi, 'POST', successHandler, failureHandler, additionalHeaders);
      } else {
        isSyncingInProgress = false;
        fetchCartItemsFromApi();
      }
    };

    // Clear cart first before syncing to ensure consistency
    isSyncingInProgress = true;
    const clearApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['clearCartItems'];
    getDataFromApi(clearApiUrl, syncLocalCartToBackend, syncLocalCartToBackend, additionalHeaders);
  };

  return { sendItemsToApi, fetchCartItemsFromApi };
};

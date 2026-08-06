import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAtom } from 'jotai';
import { request, header } from '@/utilities/request';
import { mainApiUrl } from '@/url';
import { handleLaunchResponse } from '@/utilities/launchHelper';
import { addressAtom } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import { setIsSubscriptionActive, setSubscriptionItem } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { setCartTabType } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setLoginDetails } from '@/store/slice/loginSlice';

export const ADDRESS_NOT_DELIVERABLE_KEY = 'ADDRESS_NOT_DELIVERABLE';

const GlobalLaunchListener = () => {
  const dispatch = useDispatch();
  const [, setAddress] = useAtom(addressAtom);
  const [, setProfile] = useAtom(profileAtom);

  const loginDetails = useSelector((state: any) => state.loginDetails);

  // Restore subscription state after login/reload
  useEffect(() => {
    const isSubscriptionPending = localStorage.getItem('SUBSCRIPTION_LOGIN_PENDING');
    const pendingItem = localStorage.getItem('PENDING_SUBSCRIPTION_ITEM');

    if (isSubscriptionPending === 'true' && pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        dispatch(setSubscriptionItem(item));
        dispatch(setIsSubscriptionActive(true));
        dispatch(setIsSidebarOpen(true));
        dispatch(setTabType(TabTypeConstant.CART));
        dispatch(setCartTabType(TabTypeConstant.CART_MAIN));

        // Clean up
        localStorage.removeItem('SUBSCRIPTION_LOGIN_PENDING');
        localStorage.removeItem('PENDING_SUBSCRIPTION_ITEM');
      } catch (error) {
        console.error('Failed to restore subscription cart', error);
      }
    }
  }, [dispatch]);

  // On reload: if address was previously marked as not deliverable, re-open the sidebar
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const notDeliverable = localStorage.getItem(ADDRESS_NOT_DELIVERABLE_KEY);
    if (token && notDeliverable === 'true') {
      dispatch(
        setLoginDetails({
          isSidebarOpen: true,
          isLogin: true,
          user: token,
          tabType: TabTypeConstant.MANAGE_ADDRESS
        })
      );
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('user_token');

    // Do NOT fire launch API while sidebar is open — prevents downstream 500 errors
    if (token && loginDetails.isLogin && !loginDetails.isSidebarOpen) {
      // Signal that address data is being loaded so UI can show disabled/loading state
      setAddress((prev: any) => ({ ...prev, loading: true }));

      const fetchLaunch = async () => {
        try {
          const authHeader = header();
          if (!authHeader) return;

          const response: any = await request(mainApiUrl.launch, {
            method: 'GET',
            headers: { Authorization: authHeader }
          });
          handleLaunchResponse(response, dispatch, setAddress, setProfile, token, false);

          // --- Real-time deliverability check for default address ---
          // The launch API caches the `deliverable` flag; when the delivery zone
          // is shrunk on the backend, that flag becomes stale. We validate live.
          const defaultAddress = response?.address?.find((a: any) => a.is_default === true);
          if (defaultAddress?.latitude && defaultAddress?.longitude) {
            try {
              const deliverabilityResponse: any = await request(mainApiUrl.fetchForAddressDeliverable, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  latitude: defaultAddress.latitude,
                  longitude: defaultAddress.longitude
                })
              });

              if (!deliverabilityResponse?.deliverable) {
                // Address is no longer in the delivery zone — update atom and clear storage
                setAddress((prev: any) => ({
                  ...prev,
                  defaultAddress: null,
                  address:
                    prev.address?.map((a: any) =>
                      a.address_id === defaultAddress.address_id ? { ...a, deliverable: false, store_id: null } : a
                    ) ?? []
                }));
                localStorage.removeItem('selected_address');
                localStorage.removeItem('store-id');
                // Persist so the sidebar re-opens even after a full page reload
                localStorage.setItem(ADDRESS_NOT_DELIVERABLE_KEY, 'true');

                // Open the address management sidebar so the user can update their address
                dispatch(
                  setLoginDetails({
                    isSidebarOpen: true,
                    isLogin: true,
                    user: token,
                    tabType: TabTypeConstant.MANAGE_ADDRESS
                  })
                );
              }
            } catch (deliverabilityError) {
              console.error('Deliverability check failed', deliverabilityError);
            }
          }
          // ----------------------------------------------------------
        } catch (e) {
          console.error('Launch API failed', e);
        }
      };
      fetchLaunch();
    }
  }, [loginDetails.isLogin, loginDetails.isSidebarOpen]); // Run when isLogin or sidebar state changes

  return null;
};

export default GlobalLaunchListener;

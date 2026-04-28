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

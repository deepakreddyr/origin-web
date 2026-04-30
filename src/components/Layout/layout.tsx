import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/utilities/createEmotionCache';
import theme from '@/utilities/theme';
import Header from '../Header';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import Footer from '../Footer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// getAddress and getProfile are handled by GlobalLaunchListener via the launch API
// Do NOT call them separately here to avoid duplicate API calls and race conditions
import { useAtom } from 'jotai';

import { cartItems, isCartPageIsOpen } from '@/features/CartPage/context/atoms';
import { setIsHeaderVisible, setTabType, setLoginDetails, setIsFreshLogin } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { isAccountIsOpen, profileAtom } from '@/features/AccountPage/context/atoms';
const clientSideEmotionCache = createEmotionCache();
import { login as loginAtom } from '@/components/Login/context/atom';
import SidebarScreen from '../shared/SidebarScreen';
import CouponStatusBar from '../shared/CouponStatusBar';
import { addressAtom } from '@/features/Address/context/atoms';
import { protectedUrl } from '@/url';
import { clearPostPaymentItemsinLs, getAddressAndStoreId } from '@/utilities/utils';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import DownloadAppWrapper from '../downloadApp/DownloadAppWrapper';
import { useState } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { useCartSync } from '@/hooks/useCartSync';

export default function Layout({
  children,
  mainMenuItems,
  footerData,
  isHeaderSticky,
  search = false,
  useTopPadding = false,
  isHeader = true,
  transparentColor
}: {
  children: React.ReactNode;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
  isHeaderSticky: any;
  search?: boolean;
  useTopPadding?: boolean;
  isHeader?: boolean;
  transparentColor?: 'white' | 'black';
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDownloadApp, setShowDownloadApp] = useState(false);
  const { isReady, query } = router;
  const [address, setAddressAtom] = useAtom(addressAtom);
  const [, setCartDetails] = useAtom(cartItems);
  const [profileDetails, setProfileAtom] = useAtom(profileAtom);
  const [, setLoginInfo] = useAtom(loginAtom); // Jotai atom for login info
  const getDataFromApi = useGetDataFromApi();

  const { isMangoPage, actions } = useCartStore();
  const { sendItemsToApi, fetchCartItemsFromApi } = useCartSync();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  useEffect(() => {
    const lsKey = isMangoPage ? 'mango_cart_items' : 'cart_items';
    const cart = localStorage.getItem(lsKey);
    if (cart) {
      try {
        const parsedCart = JSON.parse(cart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          dispatch(actions.setCartItems(parsedCart));
        }
      } catch (e) {
        console.error('Failed to parse cart from LS', e);
      }
    }
    const addressFromLs = getAddressAndStoreId();

    const userToken = localStorage.getItem('user_token');
    if (userToken && addressFromLs) {
      dispatch(
        setLoginDetails({
          isLoginSidebarOpen: false,
          isLogin: true,
          tabType: '',
          user: userToken
        })
      );

      // Profile is fetched by GlobalLaunchListener via launch API — no separate call needed
      clearPostPaymentItemsinLs();
    }

    // --- Download App Popup Logic ---
    const isMangoRoute = router.pathname.startsWith('/mango');
    const isSubscriptionRoute = router.pathname.startsWith('/subscription');
    if (isReady && query.type !== 'app' && !isMangoRoute && !isSubscriptionRoute) {
      const timer = setTimeout(() => {
        try {
          const hasSeenInSession = sessionStorage.getItem('downloadAppPopupShown');
          if (!hasSeenInSession) {
            setShowDownloadApp(true);
          }
        } catch (error) {
          console.error('Error accessing sessionStorage:', error);
        }
      }, 2000); // 2-second delay
      return () => clearTimeout(timer);
    }
  }, [setCartDetails, setAddressAtom, setLoginInfo, setProfileAtom, isReady, query.type]);

  useEffect(() => {
    if (isReady) {
      const addressFromLs = getAddressAndStoreId();

      // Address is fetched by GlobalLaunchListener via launch API — no separate call needed

      const lsKey = isMangoPage ? 'mango_cart_items' : 'cart_items';
      try {
        const storedItems = localStorage.getItem(lsKey);
        const productItems = storedItems ? JSON.parse(storedItems) : [];

        // Do NOT make any API calls while the sidebar is open (registration, address, cart, etc.)
        if (loginDetails.isSidebarOpen) return;

        if (Array.isArray(productItems) && productItems.length > 0) {
          dispatch(actions.setCartItems(productItems));
        } else if (loginDetails.isLogin && profileDetails?.data?.profile && addressFromLs) {
          fetchCartItemsFromApi();
        }
      } catch (error) {
        console.error('Failed to parse cart items from localStorage:', error);
      }
    }
  }, [isReady, profileDetails?.data?.profile, isMangoPage, loginDetails.isLogin, loginDetails.isSidebarOpen]);

  // Global Sync on Login — only when sidebar is closed and store-id exists
  useEffect(() => {
    const storeId = localStorage.getItem('store-id');

    if (
      loginDetails.isLogin &&
      loginDetails.isFreshLogin &&
      !loginDetails.isSidebarOpen &&
      storeId &&
      storeId !== 'null'
    ) {
      sendItemsToApi();
      dispatch(setIsFreshLogin(false));
    }
  }, [loginDetails.isLogin, loginDetails.isFreshLogin, loginDetails.isSidebarOpen]);

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        {isHeader && query.type !== 'app' && (
          <Header
            isHeaderSticky={isHeaderSticky}
            mainMenuItems={mainMenuItems}
            search={search}
            transparentColor={transparentColor}
          />
        )}
        <SidebarScreen />
        <main className={`${useTopPadding ? 'pt-[22vw] mob:pt-[35vw] md:pt-[6vw]' : ''}`}>{children}</main>
        {query.type !== 'app' && <CouponStatusBar />}
        {showDownloadApp && (
          <DownloadAppWrapper
            onClose={() => {
              setShowDownloadApp(false);
              sessionStorage.setItem('downloadAppPopupShown', 'true');
            }}
          />
        )}
        {query.type !== 'app' && <Footer footerData={footerData} />}
      </ThemeProvider>
    </CacheProvider>
  );
}

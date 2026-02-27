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
import { setCartItems } from '@/store/slice/CartSlice';
import { getAddress } from '@/features/Address/services/getAddress';
import { getProfile } from '@/features/AccountPage/services/getProfile';
import { useAtom } from 'jotai';

import { cartItems, isCartPageIsOpen } from '@/features/CartPage/context/atoms';
import { setLoginDetails } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { isAccountIsOpen, profileAtom } from '@/features/AccountPage/context/atoms';
const clientSideEmotionCache = createEmotionCache();
import { login as loginAtom } from '@/components/Login/context/atom';
import SidebarScreen from '../shared/SidebarScreen';
import { addressAtom } from '@/features/Address/context/atoms';
import { protectedUrl } from '@/url';
import { clearPostPaymentItemsinLs, getAddressAndStoreId } from '@/utilities/utils';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';

export default function Layout({
  children,
  mainMenuItems,
  footerData,
  isHeaderSticky,
  search = false,
  useTopPadding = false,
  isHeader = true
}: {
  children: React.ReactNode;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
  isHeaderSticky: any;
  search?: boolean;
  useTopPadding?: boolean;
  isHeader?: boolean;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isReady, query } = router;
  const [address, setAddressAtom] = useAtom(addressAtom);
  const [, setCartDetails] = useAtom(cartItems);
  const [profileDetails, setProfileAtom] = useAtom(profileAtom);
  const [, setLoginInfo] = useAtom(loginAtom); // Jotai atom for login info
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const cart = localStorage.getItem('cartItem');
    if (cart) setCartDetails(JSON.parse(cart));
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

      getProfile(setProfileAtom);
      clearPostPaymentItemsinLs();
    }
  }, [setCartDetails, setAddressAtom, setLoginInfo, setProfileAtom]);

  const fetchCartItemsFromApi = () => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];

    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data?: any) => {
      dispatch(setCartItems(data?.data));
      localStorage.setItem('cart_items', JSON.stringify(data.data));
    };
    const failureHandler = (data: any) => {
      // console.log(data);
    };
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  useEffect(() => {
    if (isReady) {
      const userToken = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();

      if (profileDetails?.data?.profile) {
        getAddress(setAddressAtom);
      }
      try {
        const storedItems = localStorage.getItem('cart_items');
        const productItems: [] = storedItems ? JSON.parse(storedItems) : [];

        if (Array.isArray(productItems) && productItems.length > 0) {
          dispatch(setCartItems(productItems));
        } else if (userToken && profileDetails?.data?.profile && addressFromLs) {
          fetchCartItemsFromApi();
          // getAddress(setAddressAtom);
        }
      } catch (error) {
        console.error('Failed to parse cart items from localStorage:', error);
      }
    }
  }, [isReady, profileDetails?.data?.profile]);

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        {isHeader && query.type !== 'app' && (
          <Header isHeaderSticky={isHeaderSticky} mainMenuItems={mainMenuItems} search={search} />
        )}
        <SidebarScreen />
        <main className={`${useTopPadding ? 'pt-[22vw] mob:pt-[35vw] md:pt-[6vw]' : ''}`}>{children}</main>
        {query.type !== 'app' && <Footer footerData={footerData} />}
      </ThemeProvider>
    </CacheProvider>
  );
}

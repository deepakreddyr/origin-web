import React, { useEffect, useMemo } from 'react';
import Login from '../Login';
import Account from '@/features/AccountPage';
import { useDispatch, useSelector } from 'react-redux';
import SidebarWrapper from '../Login/components/SidebarWrapper';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { useAtom } from 'jotai';
// import { isCartPageIsOpen } from '../CartPage/context/atoms'
import { cartItems, isCartPageIsOpen } from '@/features/CartPage/context/atoms';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { addressActiveScreenAtom } from '@/features/AccountPage/context/atoms';
import { getHeaderSidebarName } from '@/utilities/sidebarHelperFunctions';
import Cart from '../Cart/Cart';
import CouponList from '../Cart/ApplyCoupon/CouponList';
import { resetCouponDetails, setCartTabType } from '@/store/slice/CartSlice';
import { useGetHeaderSidebarName } from '@/utilities/hooks/useGetHeaderSidebarName';
import Payment from '../Cart/Payment/Payment';
import SelectAddressSidebar from '@/features/AccountPage/components/selectAddress/SelectAddressSidebar';
import RefundDetailsWrapper from '../orderRefund/RefundDetailsWrapper';
import { addressAtom } from '@/features/Address/context/atoms';
import { useRouter } from 'next/router';

const SidebarScreen = () => {
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);
  const cart = useSelector((state: any) => state.cart);
  const [isCartOpen] = useAtom(isCartPageIsOpen);
  const dispatch = useDispatch();
  const getHeaderName = useGetHeaderSidebarName();
  const [address, setAddress] = useAtom(addressAtom);
  const router = useRouter();

  const onClickBackButton = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER: {
        break;
      }
      case TabTypeConstant.ENTER_OTP: {
        dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
        break;
      }

      case TabTypeConstant.SETTING:
      case TabTypeConstant.HELP_FAQ:
      case TabTypeConstant.YOUR_ORDERS:
      case TabTypeConstant.EDIT_ACCOUNT:
        dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
        break;
      case TabTypeConstant.REGISTER: {
        dispatch(setTabType(TabTypeConstant.ENTER_OTP));
        break;
      }

      case TabTypeConstant.MANAGE_ADDRESS:
        if (
          activeScreen === TabTypeConstant.SERVICEABILITY ||
          activeScreen === TabTypeConstant.MANUAL_ADDRESS ||
          activeScreen === TabTypeConstant.COMPLETE_ADDRESS ||
          activeScreen === TabTypeConstant.NO_DATA
        ) {
          if (address.address) {
            setActiveScreen(TabTypeConstant.ADDRESS_LIST);
          } else {
            dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
            return;
          }
        }
        dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
        break;
      // case TabTypeConstant.ADDRESS_LIST:
      //   dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));

      case TabTypeConstant.CART:
        if (cart.cartTabType === TabTypeConstant.COUPON_CODE_LIST) {
          dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
          dispatch(resetCouponDetails());
          break;
        }

      case TabTypeConstant.PAYMENT:
        dispatch(setTabType(TabTypeConstant.CART));
        dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
        break;

      case TabTypeConstant.REFUND_LIST:
        dispatch(setTabType(''));
        dispatch(setCartTabType(''));
        break;

      default: {
        break;
      }
    }
  };

  const isBackButtonEnable = useMemo(() => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
      case TabTypeConstant.REGISTER:
        return false;

      case TabTypeConstant.CART:
        if (cart.cartTabType === TabTypeConstant.COUPON_CODE_LIST) return true;
        if (cart.cartTabType === TabTypeConstant.CART_MAIN) return false;

      case TabTypeConstant.EMPTY_CART:
        return false;

      case TabTypeConstant.ENTER_OTP:
      case TabTypeConstant.EDIT_ACCOUNT:
      case TabTypeConstant.MANAGE_ADDRESS:
      case TabTypeConstant.ADDRESS_LIST:
      case TabTypeConstant.SERVICEABILITY:
      case TabTypeConstant.COMPLETE_ADDRESS:
      case TabTypeConstant.MANUAL_ADDRESS:
      case TabTypeConstant.NO_DATA:
      case TabTypeConstant.YOUR_ORDERS:
      case TabTypeConstant.HELP_FAQ:
      case TabTypeConstant.SETTING:
      case TabTypeConstant.PAYMENT:
        return true;

      default: {
        return false;
      }
    }
  }, [loginDetails, cart.cartTabType]);

  const SCREEN_MAP: any = {
    [TabTypeConstant.CART]: <Cart />,
    [TabTypeConstant.SELECT_ADDRESS]: <SelectAddressSidebar />,
    [TabTypeConstant.REFUND_LIST]: <RefundDetailsWrapper />
  };

  useEffect(() => {
    dispatch(setIsSidebarOpen(false));
  }, [router.route]);

  return (
    <SidebarWrapper
      onClickBackButton={onClickBackButton}
      isBackButtonEnable={isBackButtonEnable}
      headerTitle={getHeaderName()}
    >
      <Login />
      <Account />
      {SCREEN_MAP[loginDetails.tabType]}
      {/* {loginDetails.tabType === TabTypeConstant.CART && <Cart />} */}
    </SidebarWrapper>
  );
};

export default SidebarScreen;

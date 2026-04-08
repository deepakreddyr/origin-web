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
import { useRouter } from 'next/router';
import { useCartStore } from '@/hooks/useCartStore';
import { useGetHeaderSidebarName } from '@/utilities/hooks/useGetHeaderSidebarName';
import SelectAddressSidebar from '@/features/AccountPage/components/selectAddress/SelectAddressSidebar';
import RefundDetailsWrapper from '../orderRefund/RefundDetailsWrapper';
import { addressAtom } from '@/features/Address/context/atoms';

const SidebarScreen = () => {
  const router = useRouter();
  const { cart, isMangoPage, actions } = useCartStore();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);
  const [isCartOpen] = useAtom(isCartPageIsOpen);
  const dispatch = useDispatch();
  const getHeaderName = useGetHeaderSidebarName();
  const [address, setAddress] = useAtom(addressAtom);

  const onClickBackButton = () => {
    const tabSource = localStorage.getItem('tab_source');
    const parsedTabSource = tabSource ? JSON.parse(tabSource) : null;

    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER: {
        if (parsedTabSource === TabTypeConstant.CART) {
          dispatch(setTabType(TabTypeConstant.CART));
        }
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
        dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
        break;
      }

      case TabTypeConstant.MANAGE_ADDRESS:
        if (
          activeScreen === TabTypeConstant.SERVICEABILITY ||
          activeScreen === TabTypeConstant.MANUAL_ADDRESS ||
          activeScreen === TabTypeConstant.COMPLETE_ADDRESS ||
          activeScreen === TabTypeConstant.NO_DATA ||
          activeScreen === TabTypeConstant.ADDRESS_LIST
        ) {
          if (address.address && address.address.length > 0) {
            setActiveScreen(TabTypeConstant.ADDRESS_LIST);
            // return;
          }
        }

        if (loginDetails.isFreshLogin) {
          dispatch(setTabType(TabTypeConstant.REGISTER));
          return;
        }

        if (parsedTabSource === TabTypeConstant.CART) {
          dispatch(setTabType(TabTypeConstant.CART));
          dispatch(actions.setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
        } else if (parsedTabSource === TabTypeConstant.SELECT_ADDRESS) {
          dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
        } else if (parsedTabSource === TabTypeConstant.ACCOUNT_MAIN) {
          dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
        } else {
          dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
        }
        break;

      case TabTypeConstant.SELECT_ADDRESS:
        if (parsedTabSource === TabTypeConstant.CART) {
          dispatch(setTabType(TabTypeConstant.CART));
          dispatch(actions.setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
        } else {
          dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));
        }
        break;
      // case TabTypeConstant.ADDRESS_LIST:
      //   dispatch(setTabType(TabTypeConstant.ACCOUNT_MAIN));

      case TabTypeConstant.PAYMENT:
        dispatch(setTabType(TabTypeConstant.CART));
        dispatch(actions.setCartTabType(TabTypeConstant.CART_MAIN));
        break;

      case TabTypeConstant.CART:
        if (cart.cartTabType === TabTypeConstant.COUPON_CODE_LIST) {
          dispatch(actions.resetCouponDetails());
          dispatch(actions.setCartTabType(TabTypeConstant.CART_MAIN));
          break;
        }
        if (cart.cartTabType === TabTypeConstant.CART_ADDRESS_LIST || cart.cartTabType === TabTypeConstant.PAYMENT) {
          const flowType = localStorage.getItem('FLOW_TYPE');
          if (flowType === 'retry_payment' && cart.cartTabType === TabTypeConstant.PAYMENT) {
            dispatch(setIsSidebarOpen(false));
            localStorage.removeItem('FLOW_TYPE');
            break;
          }
          dispatch(actions.setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
          break;
        }
        if (cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR) {
          dispatch(actions.setCartTabType(TabTypeConstant.CART_MAIN));
          break;
        }
        if (isMangoPage && cart.cartTabType === TabTypeConstant.CART_MAIN) {
          dispatch(setIsSidebarOpen(false));
          break;
        }
        break;

      case TabTypeConstant.REFUND_LIST:
        dispatch(setTabType(''));
        dispatch(actions.setCartTabType(''));
        break;

      default: {
        break;
      }
    }
  };

  const isBackButtonEnable = useMemo(() => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
      case TabTypeConstant.REGISTER: {
        const tabSource = localStorage.getItem('tab_source');
        const parsedTabSource = tabSource ? JSON.parse(tabSource) : null;
        if (parsedTabSource === TabTypeConstant.CART) return true;
        return loginDetails.tabType === TabTypeConstant.REGISTER;
      }

      case TabTypeConstant.CART:
        if (
          cart.cartTabType === TabTypeConstant.COUPON_CODE_LIST ||
          cart.cartTabType === TabTypeConstant.CART_ADDRESS_LIST ||
          cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR ||
          cart.cartTabType === TabTypeConstant.PAYMENT
        )
          return true;
        if (cart.cartTabType === TabTypeConstant.CART_MAIN) return isMangoPage;
        return false;

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

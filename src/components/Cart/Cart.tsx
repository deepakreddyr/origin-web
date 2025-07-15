import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from './EmptyCart';
import ReviewList from './ReviewList';
import DeliveryInstruction from './DeliveryInstruction';
import ActionCtaWithItems from './ActionCtaWithItems';
import CouponSection from './ApplyCoupon/CouponSection';
import { useRouter } from 'next/router';
import AddressAndTimeSlot from './AddressAndTimeSlot/AddressAndTimeSlot';
import { setCartItems, setCartMinimum, setCartTabType, setIsProceedButtonEnabled } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { getAddressAndStoreId, prepareCartItemsToApi, setRouteSourceToLs } from '@/utilities/utils';
import { setIsHeaderVisible, setTabType } from '@/store/slice/loginSlice';
import { protectedUrl } from '@/url';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import CouponFlowWrapper from './ApplyCoupon/CouponFlowWrapper';
import { couponDetailsInitialState } from '@/constants';
import BillDetailsWrapper from './billDetails/BillDetailsWrapper';
import Payment from './Payment/Payment';
import { updateTimeSlotId } from '@/store/slice/placeOrderDetails';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';

const Cart = (props: any) => {
  const cart = useSelector((state: any) => state.cart);
  const [showAddressModal, setAddressModal] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const router = useRouter();
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();
  const [billDetails, setBillDetails] = useState({ cart_minimum: '', delivery_charge: '', free_delivery_charge: '' });
  const [address, setAddress] = useAtom(addressAtom);

  const fetchCartItemsFromApi = () => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];

    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {
      // console.log(data);
      dispatch(setCartItems(data.data));
      dispatch(setCartMinimum(data.cart_minimum));
      setBillDetails({
        ...billDetails,
        cart_minimum: data.cart_minimum,
        delivery_charge: data.delivery_charge
        // free_delivery_charge: data?.free_delivery_charge ? data.free_delivery_charge : 0
      });
    };
    const failureHandler = (data: any) => {
      // console.log(data);
    };
    if (addressFromLs) getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const sendItemsToApi = () => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    let cartItems;
    let additionalHeaders = {};

    const token = localStorage.getItem('user_token');
    const cartItemFromLs = localStorage.getItem('cart_items');
    const addressFromLs = getAddressAndStoreId();

    if (!token) {
      return;
    }

    if (cartItemFromLs) {
      cartItems = prepareCartItemsToApi(JSON.parse(cartItemFromLs));
    }

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {
      fetchCartItemsFromApi();
    };
    const failureHandler = (data: any) => {
      //  setLoading(false);
    };
    if (loginDetails.isSidebarOpen)
      sendDataToApi(apiUrl, cartItems, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  useEffect(() => {
    let cartItemFromLs = localStorage.getItem('cart_items');
    let cartItemsParsed;
    if (cartItemFromLs) {
      cartItemsParsed = JSON.parse(cartItemFromLs);
    }

    if (cartItemFromLs) {
      if (cartItemsParsed.length === 0) {
        return;
      } else {
        sendItemsToApi();
      }
    } else {
      fetchCartItemsFromApi();
    }
  }, [loginDetails.isSidebarOpen]);

  useEffect(() => {
    if (!loginDetails.isSidebarOpen) {
      setAddressModal(false);
      setShowCouponList(false);
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
      dispatch(updateTimeSlotId(''));
      dispatch(setIsHeaderVisible(true));
    }
  }, [loginDetails.isSidebarOpen]);

  const proceedButtonHandler = () => {
    if (loginDetails.user) {
      if (!address.address) {
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
        return;
      }
      if (cart.cartTabType === TabTypeConstant.CART_MAIN) {
        setAddressModal(true);
        dispatch(setIsProceedButtonEnabled(false));

        // dispatch(setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
      }
      if (cart.cartTabType === TabTypeConstant.CART_MAIN && showAddressModal) {
        dispatch(setCartTabType(TabTypeConstant.PAYMENT));
      }
    } else {
      setRouteSourceToLs(TabTypeConstant.CART);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  useEffect(() => {
    let paymentFlow = localStorage.getItem('FLOW_TYPE') ? localStorage.getItem('FLOW_TYPE') : null;

    if (cart.items.length === 0) {
      if (paymentFlow) {
        return;
      } else {
        dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
      }
    }
  }, [cart.items]);

  const SCREEN_MAP: any = {
    COUPON_CODE_LIST: <CouponFlowWrapper setShowCouponList={setShowCouponList} />,
    PAYMENT: <Payment />,
    CART_MAIN: (
      <>
        <ReviewList />
        <DeliveryInstruction />
        {/* <CouponSection setShowCouponList={setShowCouponList} /> */}
        {showAddressModal && (
          <div className="w-[30vw] flex items-end relative  justify-end">
            {<AddressAndTimeSlot showAddressModal={showAddressModal} setAddressModal={setAddressModal} />}
          </div>
        )}
        <BillDetailsWrapper billDetails={billDetails} />
        {cart.cartTabType !== TabTypeConstant.CART_ADDRESS_LIST && (
          <ActionCtaWithItems
            btnName={loginDetails.user ? 'PROCEED' : 'PROCEED'} // kept for future changes
            handler={proceedButtonHandler}
            isDisabled={!cart.isProceedBtnEnabled}
          />
        )}
      </>
    ),
    EMPTY_CART: <EmptyCart />
  };
  return (
    <div className="flex flex-col grow gap-[1.1vw] mob:gap-[4.1vw] pb-[6vw] mob:pb-[20vw]">
      {SCREEN_MAP[cart.cartTabType]}
    </div>
  );
};

export default Cart;

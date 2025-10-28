'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from './EmptyCart';
import ReviewList from './ReviewList';
import DeliveryInstruction from './DeliveryInstruction';
import ActionCtaWithItems from './ActionCtaWithItems';
import CouponSection from './ApplyCoupon/CouponSection';
import { useRouter } from 'next/router';
import AddressAndTimeSlot from './AddressAndTimeSlot/AddressAndTimeSlot';
import RestrictOrderInfo from './RestrictOrderInfo';
import {
  setCartItems,
  setCartMinimum,
  setCartTabType,
  setIsProceedButtonEnabled,
} from '@/store/slice/CartSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import {
  getAddressAndStoreId,
  prepareCartItemsToApi,
  setRouteSourceToLs,
} from '@/utilities/utils';
import {
  setIsHeaderVisible,
  setTabType,
} from '@/store/slice/loginSlice';
import { protectedUrl } from '@/url';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import CouponFlowWrapper from './ApplyCoupon/CouponFlowWrapper';
import BillDetailsWrapper from './billDetails/BillDetailsWrapper';
import Payment from './Payment/Payment';
import { updateTimeSlotId } from '@/store/slice/placeOrderDetails';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';

const Cart = () => {
  const cart = useSelector((state: any) => state.cart);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const [showAddressModal, setAddressModal] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);
  const [orderRestrictionData, setOrderRestrictionData] = useState<null | {
    title: string;
    description: string;
    until: string;
    is_available: boolean;
  }>(null);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const router = useRouter();
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();
  const [billDetails, setBillDetails] = useState({
    cart_minimum: '',
    delivery_charge: '',
    free_delivery_charge: '',
    distance_delivery_fees: null,
    distance_from_warehouse: null,
  });
  const [address, setAddress] = useAtom(addressAtom);

  const fetchCartItemsFromApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs
      ? { 'store-id': addressFromLs.store_id }
      : {};

    const successHandler = (data: any) => {
      dispatch(setCartItems(data.data));
      dispatch(setCartMinimum(data.cart_minimum));
      setBillDetails({
        cart_minimum: data.cart_minimum,
        delivery_charge: data.delivery_charge,
        free_delivery_charge: data.free_delivery_charge || '',
        distance_delivery_fees: data.distance_delivery_fees || null,
        distance_from_warehouse: data.distance_from_warehouse || null,
      });

      if (data.order_restricted) {
        setOrderRestrictionData({
          title: data.order_restricted.title,
          description: data.order_restricted.description,
          until: data.order_restricted.until,
          is_available: data.order_restricted.is_available,
        });
      } else {
        setOrderRestrictionData(null);
      }
    };

    const failureHandler = (err: any) => {
      // handle error
    };

    if (addressFromLs)
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const sendItemsToApi = () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    const cartItemFromLs = localStorage.getItem('cart_items');
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs
      ? { 'store-id': addressFromLs.store_id }
      : {};

    if (cartItemFromLs) {
      const cartItems = prepareCartItemsToApi(JSON.parse(cartItemFromLs));

      const successHandler = () => {
        fetchCartItemsFromApi();
      };

      const failureHandler = () => {
        // handle error
      };

      if (loginDetails.isSidebarOpen) {
        sendDataToApi(
          apiUrl,
          cartItems,
          'POST',
          successHandler,
          failureHandler,
          additionalHeaders,
        );
      }
    }
  };

  useEffect(() => {
    const cartItemFromLs = localStorage.getItem('cart_items');
    if (cartItemFromLs) {
      const cartItemsParsed = JSON.parse(cartItemFromLs);
      if (cartItemsParsed.length === 0) return;
      sendItemsToApi();
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
      
      // If we're in the main cart view and no modal is open
      if (cart.cartTabType === TabTypeConstant.CART_MAIN && !showAddressModal) {
        setAddressModal(true);
        dispatch(setIsProceedButtonEnabled(false)); // Disable until timing is selected
        return;
      }
      
      // If modal is open, check if user has selected delivery timing
      if (cart.cartTabType === TabTypeConstant.CART_MAIN && showAddressModal) {
        // Check if user has selected a delivery type and timing
        const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
        const hasSelectedTiming = placeOrderDetails.delivery_type === 'INSTANT' || 
                                  (placeOrderDetails.delivery_type === 'TIME_SLOT' && placeOrderDetails.time_slot_id !== '');
        
        if (hasSelectedDelivery && hasSelectedTiming) {
          // User has selected timing, proceed to payment
          setAddressModal(false);
          dispatch(setCartTabType(TabTypeConstant.PAYMENT));
          return;
        } else {
          // User hasn't selected timing, show alert or keep modal open
          alert('Please select a delivery timing to proceed.');
          return;
        }
      }
    } else {
      setRouteSourceToLs(TabTypeConstant.CART);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  useEffect(() => {
    const paymentFlow = localStorage.getItem('FLOW_TYPE');
    if (cart.items.length === 0 && !paymentFlow) {
      dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
    }
  }, [cart.items]);

  const SCREEN_MAP: any = {
    COUPON_CODE_LIST: (
      <CouponFlowWrapper setShowCouponList={setShowCouponList} />
    ),
    PAYMENT: <Payment />,
    CART_MAIN: (
      <>
        {orderRestrictionData && (
          <RestrictOrderInfo orderRestrictionData={orderRestrictionData} />
        )}
        <ReviewList />
        <DeliveryInstruction />
        <CouponSection setShowCouponList={setShowCouponList} />
        {showAddressModal && (
          <div className="w-[30vw] flex items-end relative justify-end">
            <AddressAndTimeSlot
              showAddressModal={showAddressModal}
              setAddressModal={setAddressModal}
            />
          </div>
        )}
        <BillDetailsWrapper billDetails={billDetails} orderRestrictionData={orderRestrictionData}/>
        {cart.cartTabType !== TabTypeConstant.CART_ADDRESS_LIST && (
          <ActionCtaWithItems
            btnName={loginDetails.user ? 'PROCEED' : 'LOGIN'}
            handler={proceedButtonHandler}
            isDisabled={!cart.isProceedBtnEnabled}
            orderRestrictionData={orderRestrictionData}
            showAddressModal={showAddressModal}
          />
        )}
      </>
    ),
    EMPTY_CART: <EmptyCart />,
  };

  return (
    <div className="flex flex-col grow gap-[1.1vw] mob:gap-[4.1vw] pb-[6vw] mob:pb-[25vw]">
      {SCREEN_MAP[cart.cartTabType]}
    </div>
  );
};

export default Cart;
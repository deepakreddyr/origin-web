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
  setFreeItems,
  removeFreeItemFromCart
} from '@/store/slice/CartSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { getAddressAndStoreId, prepareCartItemsToApi, setRouteSourceToLs } from '@/utilities/utils';
import { setIsHeaderVisible, setTabType } from '@/store/slice/loginSlice';
import { protectedUrl } from '@/url';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import CouponFlowWrapper from './ApplyCoupon/CouponFlowWrapper';
import BillDetailsWrapper from './billDetails/BillDetailsWrapper';
import Payment from './Payment/Payment';
import FreeItemSection from './FreeItemSection/FreeItemSection';
import { updateTimeSlotId } from '@/store/slice/placeOrderDetails';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
// Import InfoOutlinedIcon to be used in the new MaxQuantityToast copy
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationChangedPopup from './AddressAndTimeSlot/LocationChangedPopup';
import { clearSubscriptionCart } from '@/store/slice/SubscriptionCartSlice';

// ==========================================================
// MAX QUANTITY TOAST COMPONENT MOVED/COPIED HERE FOR GLOBAL RENDER
// ==========================================================
const InfoToast: React.FC<{
  message: string | null;
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || message === null) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] max-w-md transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full">
        <div className="flex items-center justify-center w-full gap-2">
          <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem' }} />
          <p className="text-[0.70rem] mob:text-[2.8vw] font-semibold text-white text-center leading-tight">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
// ==========================================================

const Cart = () => {
  const cart = useSelector((state: any) => state.cart);
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);
  const isSubscription = subscriptionCart.isSubscriptionActive;

  // Use subscription cart data if active, otherwise normal cart
  const currentCart = isSubscription ? subscriptionCart : cart;

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
    distance_from_warehouse: null
  });
  const [address, setAddress] = useAtom(addressAtom);

  // ✅ HYDRATION: LOAD CART FROM LS ON MOUNT
  useEffect(() => {
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.length > 0) {
          dispatch(setCartItems(parsedCart));
        }
      } catch (err) {
        console.error('Failed to parse cart from LS:', err);
      }
    }
  }, [dispatch]);

  // --- TOAST/POPUP STATE ---
  const [infoToastMessage, setInfoToastMessage] = useState<string | null>(null);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const handleShowToast = (message: string) => {
    setInfoToastMessage(message);
    setShowInfoToast(true);
  };

  // ✅ TRIGGER: AUTO-REMOVE FREE ITEMS IF MOV NOT MET
  useEffect(() => {
    if (!isSubscription && cart.freeItemsMov > 0 && cart.totalPrice < cart.freeItemsMov) {
      const freeItem = cart.items.find((item: any) => item.isFreeItem || item.free);
      if (freeItem) {
        dispatch(removeFreeItemFromCart(freeItem.item_code));
      }
    }
  }, [cart.totalPrice, cart.freeItemsMov, cart.items, dispatch, isSubscription]);

  const handleMaxQuantityExceededGlobal = (maxQty: number) => {
    handleShowToast(`Maximum quantity of ${maxQty} reached for this item.`);
  };
  // ----------------------------

  const fetchCartItemsFromApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      dispatch(setCartItems(data.data));
      dispatch(setCartMinimum(data.cart_minimum));
      setBillDetails({
        cart_minimum: data.cart_minimum,
        delivery_charge: data.delivery_charge,
        free_delivery_charge: data.free_delivery_charge || '',
        distance_delivery_fees: data.distance_delivery_fees || null,
        distance_from_warehouse: data.distance_from_warehouse || null
      });

      if (data.order_restricted) {
        setOrderRestrictionData({
          title: data.order_restricted.title,
          description: data.order_restricted.description,
          until: data.order_restricted.until,
          is_available: data.order_restricted.is_available
        });
      } else {
        setOrderRestrictionData(null);
      }

      // Store free items data
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

    const failureHandler = (err: any) => {
      // handle error
    };

    if (addressFromLs) getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const sendItemsToApi = () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    const cartItemFromLs = localStorage.getItem('cart_items');
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    if (cartItemFromLs) {
      const cartItems = prepareCartItemsToApi(JSON.parse(cartItemFromLs));
      const successHandler = () => {
        fetchCartItemsFromApi();
      };

      const failureHandler = () => {
        fetchCartItemsFromApi();
      };

      if (loginDetails.isSidebarOpen) {
        if (isSubscription) return; // Skip normal cart sync in subscription mode
        sendDataToApi(apiUrl, cartItems, 'POST', successHandler, failureHandler, additionalHeaders);
      }
    }
  };

  useEffect(() => {
    if (isSubscription) return; // Skip normal cart API calls in subscription mode
    const cartItemFromLs = localStorage.getItem('cart_items');
    if (cartItemFromLs) {
      const cartItemsParsed = JSON.parse(cartItemFromLs);
      if (cartItemsParsed.length === 0) return;
      sendItemsToApi();
    } else {
      fetchCartItemsFromApi();
    }
  }, [loginDetails.isSidebarOpen, isSubscription]);

  useEffect(() => {
    if (!loginDetails.isSidebarOpen) {
      setAddressModal(false);
      setShowCouponList(false);
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
      dispatch(updateTimeSlotId(''));
      dispatch(setIsHeaderVisible(true));
      // If subscription was active, clear it when sidebar closes?
      // User said "only when clicking order now", maybe clear it on close to reset
      if (isSubscription) {
        dispatch(clearSubscriptionCart());
      }
    }
  }, [loginDetails.isSidebarOpen, isSubscription, dispatch]);

  // Ensure proceed button is enabled when returning to main cart view
  useEffect(() => {
    if (cart.cartTabType === TabTypeConstant.CART_MAIN) {
      dispatch(setIsProceedButtonEnabled(true));
    }
    // Also ensure modal is open if we returned to an address selection screen
    if (
      cart.cartTabType === TabTypeConstant.CART_ADDRESS_LIST ||
      cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR
    ) {
      setAddressModal(true);
    }
  }, [dispatch, cart.cartTabType]);

  const proceedButtonHandler = () => {
    if (loginDetails.user) {
      if (!address.address) {
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
        return;
      }

      // If we're in the main cart view and no modal is open
      if (cart.cartTabType === TabTypeConstant.CART_MAIN && !showAddressModal) {
        setAddressModal(true);
        dispatch(setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
        dispatch(setIsProceedButtonEnabled(false)); // Disable until timing is selected
        return;
      }

      // If modal is open, check if user has selected delivery timing
      if (
        (cart.cartTabType === TabTypeConstant.CART_MAIN ||
          cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR) &&
        showAddressModal
      ) {
        // Check if user has selected a delivery type and timing
        const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
        const hasSelectedTiming =
          placeOrderDetails.delivery_type === 'INSTANT' ||
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
      if (isSubscription && subscriptionCart.item) {
        localStorage.setItem('SUBSCRIPTION_LOGIN_PENDING', 'true');
        localStorage.setItem('PENDING_SUBSCRIPTION_ITEM', JSON.stringify(subscriptionCart.item));
      }
      setRouteSourceToLs(TabTypeConstant.CART);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  useEffect(() => {
    const paymentFlow = localStorage.getItem('FLOW_TYPE');
    const isCartEmpty = isSubscription ? !subscriptionCart.item : cart.items.length === 0;

    if (isCartEmpty && !paymentFlow) {
      dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
    } else if (!isCartEmpty && (cart.cartTabType === TabTypeConstant.EMPTY_CART || cart.cartTabType === '')) {
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  }, [cart.items.length, subscriptionCart.item, isSubscription, cart.cartTabType, dispatch]);

  const cartMainContent = (
    <>
      {orderRestrictionData && <RestrictOrderInfo orderRestrictionData={orderRestrictionData} />}
      {!isSubscription && <CouponSection setShowCouponList={setShowCouponList} onShowToast={handleShowToast} />}
      {!isSubscription && <FreeItemSection onShowToast={handleShowToast} />}
      <ReviewList onShowMaxQuantityToast={handleMaxQuantityExceededGlobal} />
      {!isSubscription && <DeliveryInstruction />}
      {showAddressModal && (
        <div className="w-[30vw] flex items-end relative justify-end">
          <AddressAndTimeSlot
            showAddressModal={showAddressModal}
            setAddressModal={setAddressModal}
            setShowLocationPopup={setShowLocationPopup}
            isSubscription={isSubscription}
            onShowToast={handleShowToast}
          />
        </div>
      )}
      <BillDetailsWrapper
        billDetails={billDetails}
        orderRestrictionData={orderRestrictionData}
        isSubscription={isSubscription}
      />
      {cart.cartTabType !== TabTypeConstant.CART_ADDRESS_LIST && (
        <ActionCtaWithItems
          btnName={loginDetails.user ? 'PROCEED' : 'LOGIN'}
          handler={proceedButtonHandler}
          isDisabled={
            isSubscription
              ? subscriptionCart.item?.quantity > subscriptionCart.item?.max_qty
              : !cart.isProceedBtnEnabled
          }
          orderRestrictionData={orderRestrictionData}
          showAddressModal={showAddressModal}
          isSubscription={isSubscription}
        />
      )}
    </>
  );

  const SCREEN_MAP: any = {
    COUPON_CODE_LIST: <CouponFlowWrapper setShowCouponList={setShowCouponList} />,
    PAYMENT: <Payment />,
    CART_MAIN: cartMainContent,
    ADDRESS_TIMESLOT_SELECTOR: cartMainContent,
    CART_ADDRESS_LIST: cartMainContent,
    EMPTY_CART: <EmptyCart />
  };

  return (
    <div className="flex flex-col grow gap-[1.1vw] mob:gap-[4.1vw] pb-[6vw] mob:pb-[25vw]">
      <InfoToast message={infoToastMessage} isVisible={showInfoToast} onClose={() => setShowInfoToast(false)} />
      <LocationChangedPopup
        isVisible={showLocationPopup}
        onClose={() => {
          window.location.reload();
        }}
      />
      {SCREEN_MAP[cart.cartTabType]}
    </div>
  );
};

export default Cart;

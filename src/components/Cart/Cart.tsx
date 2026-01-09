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
  setCartItemsFromServer,
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MaxQuantityToast from '../shared/MaxQuantityToast';
import DeliveringToSection from './DeliveringToSection';

const Cart = () => {
  const cart = useSelector((state: any) => state.cart);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const [showAddressModal, setAddressModal] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);
  const [showDeliveringModal, setShowDeliveringModal] = useState(false); // NEW STATE
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

  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  const handleMaxQuantityExceededGlobal = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const [receiverDetails, setReceiverDetails] = useState({ receiver_name: '', receiver_phone: '' });
  const [addressModalTab, setAddressModalTab] = useState('');

  const fetchCartItemsFromApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCartItems'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs
      ? { 'store-id': addressFromLs.store_id }
      : {};

    const successHandler = (data: any) => {
      dispatch(setCartItemsFromServer(data.data));
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

    const currentCartItems = cart.items;
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs
      ? { 'store-id': addressFromLs.store_id }
      : {};

    if (currentCartItems && currentCartItems.length > 0) {
      const cartItems = prepareCartItemsToApi(currentCartItems);

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
    if (cart.items && cart.items.length > 0) {
      sendItemsToApi();
    } else {
      fetchCartItemsFromApi();
    }
  }, [loginDetails.isSidebarOpen]);

  useEffect(() => {
    if (!loginDetails.isSidebarOpen) {
      setAddressModal(false);
      setShowCouponList(false);
      setShowDeliveringModal(false); // CLOSE MODAL
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

      if (cart.cartTabType === TabTypeConstant.CART_MAIN && !showAddressModal) {
        setAddressModalTab('');
        setAddressModal(true);
        dispatch(setIsProceedButtonEnabled(false));
        return;
      }

      if (cart.cartTabType === TabTypeConstant.CART_MAIN && showAddressModal) {
        const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
        const hasSelectedTiming = placeOrderDetails.delivery_type === 'INSTANT' ||
          (placeOrderDetails.delivery_type === 'TIME_SLOT' && placeOrderDetails.time_slot_id !== '');

        if (hasSelectedDelivery && hasSelectedTiming) {
          setAddressModal(false);
          dispatch(setCartTabType(TabTypeConstant.PAYMENT));
          return;
        } else {
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

  // HANDLE SAVE FROM MODAL
  const handleSaveReceiverDetails = () => {
    setShowDeliveringModal(false);
    // You can add validation here if needed
    console.log('Receiver details saved:', receiverDetails);
  };

  useEffect(() => {
    const paymentFlow = localStorage.getItem('FLOW_TYPE');
    if (cart.items.length === 0 && !paymentFlow) {
      dispatch(setCartTabType(TabTypeConstant.EMPTY_CART));
    } else if (cart.items.length > 0 && cart.cartTabType === TabTypeConstant.EMPTY_CART) {
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  }, [cart.items, cart.cartTabType]);

  const SCREEN_MAP: any = {
    COUPON_CODE_LIST: (
      <CouponFlowWrapper setShowCouponList={setShowCouponList} />
    ),
    PAYMENT: <Payment receiverDetails={receiverDetails} />,
    CART_MAIN: (
      <>
        {orderRestrictionData && (
          <RestrictOrderInfo orderRestrictionData={orderRestrictionData} />
        )}
        <CouponSection setShowCouponList={setShowCouponList} />

        {/* TRIGGER BUTTON FOR MODAL */}
        <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-4 mob:py-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
          <button
            onClick={() => setShowDeliveringModal(true)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-[SofiaPro] font-semibold text-sm text-[#231F20]">Send it as a gift</span>
              <span className="text-xs text-[#231F20CC]">→</span>
            </div>
            {address?.defaultAddress && (
              <p className="mt-1 font-[SofiaPro] text-xs text-[#231F20CC] line-clamp-1">
                {address.defaultAddress.address}, {address.defaultAddress.city}, {address.defaultAddress.state} - {address.defaultAddress.pincode}
              </p>
            )}
          </button>
        </div>

        <ReviewList onShowMaxQuantityToast={handleMaxQuantityExceededGlobal} />

        <DeliveryInstruction />
        {showAddressModal && (
          <div className="w-[30vw] flex items-end relative justify-end">
            <AddressAndTimeSlot
              showAddressModal={showAddressModal}
              setAddressModal={setAddressModal}
              activeTab={addressModalTab}
            />
          </div>
        )}
        <BillDetailsWrapper billDetails={billDetails} orderRestrictionData={orderRestrictionData} />
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
      <MaxQuantityToast
        maxQuantity={toastMaxQuantity}
        isVisible={showMaxQuantityToast}
        onClose={() => setShowMaxQuantityToast(false)}
      />

      {/* DELIVERING TO MODAL */}
      <DeliveringToSection
        address={address?.defaultAddress}
        onChangeClick={() => {
          setShowDeliveringModal(false);
          setAddressModalTab(TabTypeConstant.CART_ADDRESS_LIST);
          setAddressModal(true);
        }}
        receiverDetails={receiverDetails}
        setReceiverDetails={setReceiverDetails}
        isOpen={showDeliveringModal}
        onClose={() => setShowDeliveringModal(false)}
        onSave={handleSaveReceiverDetails}
      />

      {SCREEN_MAP[cart.cartTabType]}
    </div>
  );
};

export default Cart;
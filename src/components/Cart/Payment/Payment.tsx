import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import { mainApiUrl, protectedUrl } from '@/url';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useAtom } from 'jotai';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import MakePayment from './MakePayment';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setIsHeaderVisible } from '@/store/slice/loginSlice';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

import { useCartStore } from '@/hooks/useCartStore';

const Payment = (props: any) => {
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const [paymentFLowScreen, setPaymentFlowScreen] = useState(TabTypeConstant.MAKE_PAYMENT);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { cart, subscriptionCart, isMangoPage, actions } = useCartStore();
  const isSubscription = subscriptionCart.isSubscriptionActive;
  const sendDataToApi = useSendDataToApi();
  const [paymentModalDetails, setPaymentModalDetails] = useState({
    cartValue: '',
    paymentType: '',
    orderDetails: {},
    orderResponse: {}
  });
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();

  const orderAndRefundDetails = useSelector((state: any) => state.orderAndRefundDetails);
  const successAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successAudio.current = new Audio('/assets/audio/orderAudio.mp3');
    successAudio.current.load();
  }, []);

  // Add ref to prevent duplicate order placement
  const isPlacingOrderRef = useRef(false);

  const clearPostPaymentItemsinLs = () => {
    localStorage.removeItem('total_cart');
    localStorage.removeItem('order_type');
    localStorage.removeItem('razorpay_response');
  };

  const clearBackendCart = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['clearCartItems'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id,
        'delivery-type': isSubscription ? 'subscription' : 'instant'
      };
    }

    const successHandler = (data: any) => {};
    const failureHandler = (data: any) => {};
    // Full clear doesn't need items payload
    getDataFromApi(url, successHandler, failureHandler, additionalHeaders);
  };

  const onSuccess = (orderResponse: any, paymentMethod: any) => {
    setPaymentModalDetails({
      ...paymentModalDetails,
      cartValue: orderResponse.sub_total,
      orderResponse: orderResponse,
      paymentType: paymentMethod
    });
    setPaymentFlowScreen(TabTypeConstant.PAYMENT_SUCCESS);
    dispatch(setIsHeaderVisible(false));
    clearBackendCart();
    dispatch(actions.clearCart());
    dispatch(actions.setCartTabType(TabTypeConstant.PAYMENT));
    clearPostPaymentItemsinLs();
  };

  const onFailure = (totalAmount: any, orderDetails: any, paymentMethod: any, orderResponse: any) => {
    setPaymentModalDetails({
      ...paymentModalDetails,
      cartValue: totalAmount,
      paymentType: paymentMethod,
      orderResponse: orderResponse
    });
    dispatch(setIsHeaderVisible(false));
    setPaymentFlowScreen(TabTypeConstant.PAYMENT_FAILED);
  };

  const checkoutRazporpay = (orderId: any) => {
    let totalAmount: any = localStorage.getItem('total_cart');
    let orderType: any = localStorage.getItem('order_type');
    let orderResponse: any = localStorage.getItem('razorpay_response');

    if (totalAmount) totalAmount = JSON.parse(totalAmount);
    if (orderType) orderType = JSON.parse(orderType);
    if (orderResponse) orderResponse = JSON.parse(orderResponse);

    if (totalAmount && orderType && orderResponse) {
      let TotalAmountInPaise = Math.round(totalAmount * 100);
      const razorpayOptions = {
        key: razKey,
        amount: String(TotalAmountInPaise),
        currency: 'INR',
        name: 'Origin Fresh',
        description: 'Origin Fresh',
        prefill: {
          name: profile?.data?.name,
          email: profile?.data?.email,
          contact: profile?.data?.phone,
          method: orderType.sub_payment_method
        },
        order_id: orderId,
        handler() {
          onSuccess(orderResponse, orderType.name);
        },
        modal: {
          ondismiss() {
            onFailure(totalAmount, orderType, orderType.name, orderResponse);
          }
        },
        theme: {
          color: '#fac510'
        }
      };
      const rzp1 = new (window as any).Razorpay(razorpayOptions);
      rzp1.open();
    }
  };

  const handleRetyPaymentFromOrderDetails = (orderType: any) => {
    return new Promise((resolve, reject) => {
      let apiUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
        protectedUrl['retryPayment'] +
        `/${orderAndRefundDetails.orderDetailsData.order_id}`;
      let additionalHeaders = {};

      const addressFromLs = getAddressAndStoreId();
      if (addressFromLs) {
        additionalHeaders = {
          'store-id': addressFromLs.store_id,
          'delivery-type': isSubscription ? 'subscription' : 'instant'
        };
      }

      const successHandler = (data: any) => {
        // console.log(data,"data");
        let orderResponse = {
          order_id: orderAndRefundDetails.orderDetailsData.order_id,
          sub_total: data.data.amount_due / 100
        };

        const razorpayOptions = {
          key: razKey,
          amount: String(data.data.amount_due),
          currency: 'INR',
          name: 'Origin Fresh',
          description: 'Origin Fresh',
          prefill: {
            name: profile?.data?.name,
            email: profile?.data?.email,
            contact: profile?.data?.phone,
            method: orderType.sub_payment_method
          },
          order_id: data.data.id,
          handler() {
            onSuccess(orderResponse, orderType.name);
            resolve(true);
          },
          modal: {
            ondismiss() {
              onFailure(data.data.amount_due, orderType, orderType.name, orderResponse);
              reject(new Error('Payment cancelled'));
            }
          },
          theme: {
            color: '#fac510'
          }
        };
        const rzp1 = new (window as any).Razorpay(razorpayOptions);
        rzp1.open();
      };

      const failureHandler = (data: any) => {
        reject(new Error('API call failed'));
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    });
  };

  const placeOrderHandler = (orderType: any) => {
    // Prevent duplicate order placement
    if (isPlacingOrderRef.current) {
      return Promise.reject(new Error('Order already in progress'));
    }

    return new Promise((resolve, reject) => {
      let paymentFlow = localStorage.getItem('FLOW_TYPE');

      if (paymentFlow === 'retry_payment') {
        // console.log("entered this part");
        // console.log(orderType,"orderType");
        handleRetyPaymentFromOrderDetails(orderType)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            isPlacingOrderRef.current = false;
          });
        return;
      }

      isPlacingOrderRef.current = true;

      let storeId: any = localStorage.getItem('store-id');
      const { items } = isSubscription ? { items: [] } : prepareCartItemsToApi(cart.items, true);
      const subscriptionItems =
        isSubscription && subscriptionCart.item
          ? [
              {
                id: subscriptionCart.item.variant_id,
                item_code: subscriptionCart.item.item_code,
                uom: [
                  {
                    id: subscriptionCart.item.variant_id,
                    uom_id: subscriptionCart.item.uom_id,
                    qty: subscriptionCart.totalQuantity
                  }
                ]
              }
            ]
          : [];
      let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + mainApiUrl['ordersActions'];
      const addressFromLs = getAddressAndStoreId();

      let additionalHeaders = {};
      const apiData = isSubscription
        ? {
            items: subscriptionItems,
            delivery_fee: 0,
            delivery_type: 'subscription',
            individual_package_enabled: false,
            delivery_date: placeOrderDetails.checkoutDetails.formatted_delivery_date[0],
            sub_total: subscriptionCart.totalPrice,
            tax: 0,
            total: subscriptionCart.totalPrice,
            time_slot_id: placeOrderDetails.time_slot_id,
            store_id: JSON.parse(storeId),
            is_rewards_used: false,
            payment_method: orderType.name === 'Pay On delivery' ? 'cash' : 'razorpay',
            coupon_id: null,
            sub_payment_method: orderType.sub_payment_method,
            uuid: uuidv4(),
            max_qty: subscriptionCart.totalQuantity
          }
        : {
            items,
            delivery_fee: cart.deliveryFee,
            individual_package_enabled: false,
            delivery_type: 'instant',
            delivery_date: placeOrderDetails.checkoutDetails.formatted_delivery_date[0],
            sub_total: cart.totalPrice,
            tax: 0,
            total: cart.amountToPay === 0 ? cart.totalPrice : cart.amountToPay,
            time_slot_id: placeOrderDetails.time_slot_id,
            store_id: JSON.parse(storeId),
            is_rewards_used: false,
            payment_method: orderType.name === 'Pay On delivery' ? 'cash' : 'razorpay',
            coupon_id: cart.couponDetails?.id ? cart.couponDetails?.id : null,
            sub_payment_method: orderType.sub_payment_method,
            uuid: uuidv4()
          };
      additionalHeaders = {
        ...(addressFromLs && { 'store-id': addressFromLs.store_id }),
        'delivery-type': isSubscription ? 'subscription' : 'instant',
        'mm-build-version': '1.0.0',
        'mm-device-type': 'web'
      };

      const successHandler = (response: any) => {
        if (response?.data) {
          localStorage.setItem('razorpay_response', JSON.stringify(response?.data));
          localStorage.setItem('order_type', JSON.stringify(orderType));
          let totalAmount = isSubscription
            ? subscriptionCart.totalPrice
            : cart.amountToPay === 0
              ? cart.totalPrice
              : cart.amountToPay;
          localStorage.setItem('total_cart', JSON.stringify(totalAmount));

          if (orderType.name === 'Pay On delivery') {
            let orderResponse = {
              order_id: response?.data?.order_id,
              sub_total: response.data.sub_total
            };
            onSuccess(orderResponse, orderType.name);
            isPlacingOrderRef.current = false;
            resolve(true);
          } else if (response?.data?.razorpay_order_id) {
            const order_id = response?.data?.razorpay_order_id;
            checkoutRazporpay(order_id);
            isPlacingOrderRef.current = false;
            resolve(true);
          }
        } else {
          isPlacingOrderRef.current = false;
          reject(new Error('No response data'));
        }
      };

      const failureHandler = (data: any) => {
        isPlacingOrderRef.current = false;
        reject(new Error('Order placement failed'));
      };
      sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
    });
  };

  const primeAudio = () => {
    if (successAudio.current) {
      // Playing and immediately pausing is a common way to "unlock" audio on mobile
      successAudio.current
        .play()
        .then(() => {
          successAudio.current?.pause();
          successAudio.current!.currentTime = 0;
        })
        .catch((e) => {
          // This might fail if called outside a click, which is fine, we're just trying to unlock
          console.log('Audio priming attempt:', e.message);
        });
    }
  };

  const PAYMENT_SCREEN_MAP: any = {
    MAKE_PAYMENT: <MakePayment placeOrderHandler={placeOrderHandler} primeAudio={primeAudio} />,
    PAYMENT_SUCCESS: <PaymentSuccess paymentModalDetails={paymentModalDetails} successAudio={successAudio} />,
    PAYMENT_FAILED: (
      <PaymentFailure
        paymentModalDetails={paymentModalDetails}
        placeOrderAgain={checkoutRazporpay}
        setPaymentFlowScreen={setPaymentFlowScreen}
      />
    )
  };

  return <div className="flex flex-col grow justify-between">{PAYMENT_SCREEN_MAP[paymentFLowScreen]}</div>;
};

export default Payment;

import React, { useEffect, useState } from 'react';
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

const Payment = (props: any) => {
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const [paymentFLowScreen, setPaymentFlowScreen] = useState(TabTypeConstant.MAKE_PAYMENT);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const cart = useSelector((state: any) => state.cart);
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

  const clearPostPaymentItemsinLs = () => {
    localStorage.removeItem('total_cart');
    localStorage.removeItem('order_type');
    localStorage.removeItem('razorpay_response');
  };

  const removeItemsFromBackend = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['removeitemsFromCart'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};
    let apiData;
    let transformedData;
    const cartItemFromLs = localStorage.getItem('cart_items');
    if (cartItemFromLs) {
      apiData = prepareCartItemsToApi(JSON.parse(cartItemFromLs));
      transformedData = {
        items: apiData.items.map((item: any) => {
          const { uom, ...rest } = item; // Destructure to exclude `uom`
          return rest; // Return the remaining keys
        })
      };
    }
    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }

    const successHandler = (data: any) => {};
    const failureHandler = (data: any) => {
      // console.log(data);
    };
    sendDataToApi(url, transformedData, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  const onSuccess = (orderResponse: any, paymentMethod: any) => {
    setPaymentModalDetails({
      ...paymentModalDetails,
      cartValue: orderResponse.sub_total,
      orderResponse: orderResponse,
      paymentType: paymentMethod
    });
    removeItemsFromBackend();
    setPaymentFlowScreen(TabTypeConstant.PAYMENT_SUCCESS);
    dispatch(setIsHeaderVisible(false));
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

  // totalAmount: any, orderDetails: any, orderResponse: any
  const checkoutRazporpay = (orderId: any) => {
    let totalAmount: any = localStorage.getItem('total_cart');
    let orderType: any = localStorage.getItem('order_type');
    let orderResponse: any = localStorage.getItem('razorpay_response');
    // console.log(orderId, "order-id");
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
          color: '#FFEB66'
        }
      };
      // console.log(razorpayOptions);
      const rzp1 = new (window as any).Razorpay(razorpayOptions);
      rzp1.open();
    }
  };

  const handleRetyPaymentFromOrderDetails = (orderType: any) => {
    let apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL +
      protectedUrl['retryPayment'] +
      `/${orderAndRefundDetails.orderDetailsData.order_id}`;
    let additionalHeaders = {};

    const addressFromLs = getAddressAndStoreId();
    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {
      // console.log(data,"data");
      let orderResponse = {
        order_id: orderAndRefundDetails.orderDetailsData.order_id,
        sub_total: data.data.amount_due / 100
      };
      // let TotalAmountInPaise = Math.round(totalAmount * 100);
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
        },
        modal: {
          ondismiss() {
            onFailure(data.data.amount_due, orderType, orderType.name, orderResponse);
          }
        },
        theme: {
          color: '#FFEB66'
        }
      };
      // console.log(razorpayOptions,"data-");
      const rzp1 = new (window as any).Razorpay(razorpayOptions);
      rzp1.open();
    };
    const failureHandler = (data: any) => {};
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const placeOrderHandler = (orderType: any) => {
    let paymentFlow = localStorage.getItem('FLOW_TYPE');

    if (paymentFlow === 'retry_payment') {
      handleRetyPaymentFromOrderDetails(orderType);
      return;
    }

    let storeId: any = localStorage.getItem('store-id');
    const { items } = prepareCartItemsToApi(cart.items);
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + mainApiUrl['ordersActions'];
    const addressFromLs = getAddressAndStoreId();

    let additionalHeaders = {};
    const apiData = {
      items,
      delivery_fee: placeOrderDetails.delivery_fee,
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

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (response: any) => {
      if (response?.data) {
        localStorage.setItem('razorpay_response', JSON.stringify(response?.data));
        localStorage.setItem('order_type', JSON.stringify(orderType));
        let totalAmount = cart.amountToPay === 0 ? cart.totalPrice : cart.amountToPay;
        localStorage.setItem('total_cart', JSON.stringify(totalAmount));
        if (orderType.name === 'Pay On delivery') {
          let orderResponse = {
            order_id: response?.data?.order_id,
            sub_total: response.data.sub_total
          };
          onSuccess(orderResponse, orderType.name);
        }
        if (response?.data?.razorpay_order_id) {
          // setCheckoutDetails;
          // totalAmount, orderType, response;
          const order_id=response?.data?.razorpay_order_id;
          checkoutRazporpay(order_id);
        }
      }
    };
    const failureHandler = (data: any) => {
      //  setLoading(false);
    };
    sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  const PAYMENT_SCREEN_MAP: any = {
    MAKE_PAYMENT: <MakePayment placeOrderHandler={placeOrderHandler} />,
    PAYMENT_SUCCESS: <PaymentSuccess paymentModalDetails={paymentModalDetails} />,
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

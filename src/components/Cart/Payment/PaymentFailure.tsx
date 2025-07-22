import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import failureAnimation from '../../../../src/assets/json/failure.json';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { resetOrderDetails } from '@/store/slice/placeOrderDetails';
import { clearCart, setCartTabType } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
const PaymentFailure = (props: any) => {
  const { paymentModalDetails, placeOrderAgain, setPaymentFlowScreen } = props;
  const sendDataToApi = useSendDataToApi();
  const [showFailureConfirmModal, setShowFailureConifrmModal] = useState(false);
  const [activeScreenIndex, setActiveScreenIndex] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();
  let paymentFlow = localStorage.getItem('FLOW_TYPE') ? localStorage.getItem('FLOW_TYPE') : null;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     localStorage.removeItem('FLOW_TYPE');
  //     dispatch(setTabType(TabTypeConstant.CART));
  //     dispatch(setCartTabType(TabTypeConstant.PAYMENT));
  //     dispatch(setIsSidebarOpen(false));
  //   }, 4000);

  //   // Cleanup the timer in case the component unmounts before 4 seconds
  //   return () => clearTimeout(timer);
  // }, []);

  const payOnCodHandler = () => {
    let additionalHeaders = {};

    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['updatePaymentType'];
    const addressFromLs = getAddressAndStoreId();

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }

    const apiData = {
      order_id: paymentModalDetails.orderResponse.order_id,
      payment_method: 'cash'
    };
    const successHandler = (response: any) => {
      router.push(`/orders/${paymentModalDetails.orderResponse.order_id}`);
      dispatch(setIsSidebarOpen(false));
      dispatch(resetOrderDetails());
      dispatch(clearCart());
    };
    const failureHandler = (response: any) => {};
    sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
  };
  const cancelOrder = () => {
    let additionalHeaders = {};
    let apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL +
      protectedUrl['cancelOngoingOrder'] +
      `/${paymentModalDetails.orderResponse.order_id}`;
    const addressFromLs = getAddressAndStoreId();

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }

    const successHandler = (response: any) => {
      setActiveScreenIndex(3);
      router.push(`/orders/${paymentModalDetails.orderResponse.order_id}`);
      dispatch(setIsSidebarOpen(false));
      dispatch(resetOrderDetails());
      dispatch(clearCart());
    };
    const failureHandler = (response: any) => {};
    sendDataToApi(apiUrl, [], 'POST', successHandler, failureHandler, additionalHeaders);
  };

  const showFailedOrder = () => {
    return (
      <>
        <div onClick={() => setActiveScreenIndex(2)} className="absolute top-[1.4vw] right-[1.4vw]">
          <button className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-danger font-semibold ">CANCEL</button>
        </div>
        <div className="w-[10vw] mob:w-[30vw]">
          <Lottie animationData={failureAnimation} />
        </div>
        <div className="text-center pt-[1.67vw] mob:pt-[5vw]  px-[4vw]">
          <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5vw] text-black font-semibold ">
            Uh-oh, your payment took a fruitless journey!
          </p>

          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-[#231F2099] font-regular pt-[.97vw]  mob:pt-[3.6vw]">
            But the refund&apos;s ripening soon. Let&apos;s pick another payment and get that fresh start.
          </p>
        </div>
        {!paymentFlow && (
          <div className="absolute bottom-[-5vw]  w-full mx-[-1.1vw] mob:mx-[-4.1vw] mob:pt-[4.1vw] mob: pt-[1.1vw] ">
            <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw]  text-center font-semibold pb-[1.1vw] mob:pb-[4.1vw]">
              You can also proceed with options below
            </p>
            <div className="flex items-center gap-[1.67vw] mob:gap-[5vw] justify-center">
              <button
                onClick={() => {
                  // this will open the checkout again with the same order keu and order dertails

                  placeOrderAgain(
                    paymentModalDetails.cartValue,
                    paymentModalDetails.orderDetails,
                    paymentModalDetails.orderResponse
                  );
                }}
                className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  mob:px-[4.1vw] px-[1.1vw] mob:py-[1.5vw] py-[.5vw] rounded-full bg-primary border border-primary"
              >
                Retry Payment
              </button>
              <button
                onClick={() => payOnCodHandler()}
                className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold px-[1.1vw] mob:px-[4.1vw] py-[.5vw] mob:py-[1.5vw] rounded-full bg-white border border-black"
              >
                Pay on Delivery
              </button>
            </div>
          </div>
        )}
      </>
    );
  };
  const cancelOrderConfirmationModal = () => {
    return (
      <div className="">
        <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-semibold ">Cancel Order ?</p>
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-[#231F20CC] ">
          Are you sure you want to cancel this order?
        </p>
        <div className="flex items-center gap-[2.2vw] mob:gap-[5vw] mob:pt-[5vw] pt-[2.2vw]">
          <button
            onClick={() => cancelOrder()}
            className="font-[SofiaPro] font-semibold text-[.97vw] mob:text-[3.6vw] text-danger border-danger px-[2.2vw] py-[.6vw] rounded-full border-[2px]"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => setActiveScreenIndex(1)}
            className="font-[SofiaPro] font-semibold text-[.97vw] mob:text-[3.6vw]  border-[2px] border-black px-[2.2vw] mob:px-[5vw] mob:py-[1.5vw] py-[.6vw] rounded-full "
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };
  const orderCancelled = () => {
    return (
      <>
        {' '}
        <div className="w-[10vw] mob:w-[30vw]">
          <Lottie animationData={failureAnimation} />
        </div>
        <div className="text-center pt-[1.67vw] mob:pt-[5vw] px-[4vw]">
          <p className="font-[SofiaPro] text-[1.25vw] text-black font-semibold ">The order went off the vine!</p>

          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] text-[#231F2099] font-regular pt-[.97vw] mob:pt-[3.6vw]">
            Don&apos;t beet yourself up! Refund&apos;s on the way. Try again for a fresh batch!
          </p>
        </div>
        <button
          onClick={() => {
            router.push('/shop');
            dispatch(setIsSidebarOpen(false));
          }}
          className="font-[SofiaPro] font-semibold text-[.97vw] mob:text-[3.6vw] border-[2px] text-white bg-black border-black px-[2.2vw] mob:px-[5vw] mob:py-[1.5vw] py-[.6vw] rounded-full mob:mt-[5vw] mt-[2.5vw]"
        >
          Go to Home
        </button>
      </>
    );
  };

  const ScreensList = [showFailedOrder(), cancelOrderConfirmationModal(), orderCancelled()];

  return (
    <div className="flex relative w-full flex-col  items-center justify-center grow">
      {ScreensList.map((screens: any, index: any) => activeScreenIndex === index + 1 && screens)}
    </div>
  );
};

export default PaymentFailure;

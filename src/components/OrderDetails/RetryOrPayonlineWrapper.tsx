import { setIsHeaderVisible, setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { setCartTabType } from '@/store/slice/CartSlice';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import { setCheckoutDetails } from '@/store/slice/placeOrderDetails';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useAtom } from 'jotai';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import { useRouter } from 'next/router';
import {
  checkDeviceForAndroidPayOnDelivery,
  checkDeviceForAndroidRetryPayment,
  checkDeviceForIOSPayOnDelivery,
  checkDeviceForIOSRetryPayment
} from '@/constants/mobileEvents';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

const RetryOrPayonlineWrapper = () => {
  const [profile, setProfileAtom] = useAtom(profileAtom);

  const orderAndRefundDetails = useSelector((state: any) => state.orderAndRefundDetails);
  let paymentMentod = orderAndRefundDetails.orderDetailsData.payment_method;
  let paymentStatus = orderAndRefundDetails.orderDetailsData.payment_status;
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();
  const sendDataToApi = useSendDataToApi();
  const router = useRouter();
  const { query } = router;

  const handlepayment = () => {
    localStorage.setItem('FLOW_TYPE', 'retry_payment');

    if (query.type === 'app') {
      if (checkDeviceForAndroidRetryPayment) {
        window.App.retryPayment(
          orderAndRefundDetails.orderDetailsData.order_id.toString(),
          orderAndRefundDetails.orderDetailsData.total
        );
      } else if (checkDeviceForIOSRetryPayment) {
        const messageToPost = {
          total: orderAndRefundDetails.orderDetailsData.total.toString(),
          orderId: orderAndRefundDetails.orderDetailsData.order_id.toString()
        };
        window.webkit.messageHandlers.retryPayment.postMessage(messageToPost);
      }
    } else {
      dispatch(setTabType(TabTypeConstant.CART));
      dispatch(setCartTabType(TabTypeConstant.PAYMENT));
      dispatch(setIsSidebarOpen(true));
    }
  };

  const handlePayOnDelivery = () => {
    if (query.type === 'app') {
      if (checkDeviceForAndroidPayOnDelivery) {
        window.App.payOnDelivery(
          orderAndRefundDetails.orderDetailsData.order_id.toString(),
          orderAndRefundDetails.orderDetailsData.total
        );
      } else if (checkDeviceForIOSPayOnDelivery) {
        const messageToPost = {
          total: orderAndRefundDetails.orderDetailsData.total.toString(),
          orderId: orderAndRefundDetails.orderDetailsData.total.toString()
        };
        window.webkit.messageHandlers.payOnDelivery.postMessage(messageToPost);
      }
    } else {
      let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['updatePayment'];
      let additionalHeaders = {};

      const addressFromLs = getAddressAndStoreId();

      if (addressFromLs) {
        additionalHeaders = {
          'store-id': addressFromLs.store_id
        };
      }
      const successHandler = (data: any) => {};
      const failureHandler = (data: any) => {};
      let apiData = {
        order_id: orderAndRefundDetails.orderDetailsData.order_id,
        payment_method: 'Razorpay'
      };
      sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
    }
  };

  if (paymentStatus === 'complete') return;
  return (
    <div className="bg-[#F2EEE44D] border border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] flex mob:flex-col items-end mob:items-center justify-between mob:mb-[4.1vw] w-full">
      <div className="w-[25vw] mob:w-full">
        <p className="font-[SofiaPro] font-semibold text-[1.1vw] mob:text-[4.1vw] text-black-op-80 ">
          Payment Pending!
        </p>
        <p className="font-[SofiaPro] font-regular  text-[.97vw] mob:text-[3vw] text-black-op-80 pt-[.83vw]">
          {paymentMentod === 'Razorpay'
            ? ' We are awaiting confirmation on your payment, You can click on Retry payment to try again.'
            : 'Pay Online and make the delivery expierence seamless'}
        </p>
      </div>
      <div className="flex flex-col gap-[.83vw] text-end mob:mt-[4.1vw] mob:w-full">
        {paymentMentod === 'Razorpay' ? (
          <div className="flex mob:grid mob:grid-cols-2 mob:gap-[4.1vw] gap-[.4vw]">
            <button
              onClick={handlepayment}
              className="bg-primary px-[1.45vw] mob:px-[2vw] font-medium py-[.6vw] mob:py-[2vw] text-[.83vw] mob:text-[3vw] font-[SofiaPro] rounded-full border mob:w-full border-primary "
            >
              Retry Payment
            </button>
            <button
              onClick={handlePayOnDelivery}
              className="px-[1.45vw] mob:py-[2vw] py-[.6vw] font-medium text-[.83vw]  mob:text-[3vw]  font-[SofiaPro] rounded-full border border-black"
            >
              Pay on delivery
            </button>
          </div>
        ) : (
          <button
            onClick={handlepayment}
            className="px-[1.45vw] mob:py-[2vw] py-[.6vw] font-medium text-[.83vw]  mob:text-[3vw]  font-[SofiaPro] rounded-full border border-black"
          >
            Pay online
          </button>
        )}
      </div>
    </div>
  );
};

export default RetryOrPayonlineWrapper;

import { mainApiUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import DetailsHeader from './DetailsHeader';
import OrderStatusIllustration from './OrderStatusIllustration';
import BillDetails from './BillDetails';
import DeliveryAddress from './DeliveryAddress';
import ItemsList from './ItemsList';
import OrderDetailsSkeleton from '../skeletonLoaders/orders/OrderDetailsSkeleton';
import RefundWrapper from '../orderRefund/RefundWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOrderDetailsLoading, setOrderDetailsData, setRefundList } from '@/store/slice/OrderAndRefundDetails';
import RetryOrPayonlineWrapper from './RetryOrPayonlineWrapper';

const OrderDetailsWrapper = () => {
  const getDataFromApi = useGetDataFromApi();
  const orderAndRefundDetails = useSelector((state: any) => state.orderAndRefundDetails);
  // console.log(orderAndRefundDetails,"orderAndRefundDetails");
  const router = useRouter();
  const { isReady, query } = router;
  const dispatch = useDispatch();

  const fetchOrderdetails = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL + mainApiUrl.ordersActions + `/${query.id}?showAllBills=true`;

    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (response: any) => {
      dispatch(setOrderDetailsData(response?.data));
      dispatch(setIsOrderDetailsLoading(false));
      dispatch(setRefundList(response?.data?.multiple_refunds));
    };
    const failureHandler = (response: any) => {
      dispatch(setOrderDetailsData(null));
      dispatch(setIsOrderDetailsLoading(false));
    };
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  // Only fetch on initial load - no more frequent polling
  useEffect(() => {
    if (isReady) {
      fetchOrderdetails();
    }
  }, [isReady, query.id]); // Only depend on isReady and query.id

  if (!orderAndRefundDetails.orderDetailsData)
    return <div className="pb-[6vw]  pt-[12vw] p-[10vw]">No Order found for this order</div>;

  if (orderAndRefundDetails.isOrderDetailsLoading)
    return (
      <div
        className={`pb-[6vw] mob:pb-[15vw] p-[10vw] mob:p-0 ${query.type !== 'app' ? 'mob:pt-[28vw]' : ''}  relative `}
      >
        <OrderDetailsSkeleton />
      </div>
    );

  return (
    <div
      className={`pb-[6vw] mob:pb-[15vw] p-[10vw] mob:p-0 ${query.type !== 'app' ? 'mob:pt-[28vw]' : ''}  relative `}
    >
      <DetailsHeader orderDetailsData={orderAndRefundDetails.orderDetailsData} />
      <div className="flex gap-[1.67vw] mob:gap-[4.1vw] mob:flex-col  ">
        <div className="w-full md:w-[30vw] flex flex-col gap-[1.1vw] mob:gap-[4.1vw] ">
          <OrderStatusIllustration
            orderDetailsData={orderAndRefundDetails.orderDetailsData}
            fetchOrderdetails={fetchOrderdetails}
          />
          <div className="w-full mob:block hidden mob:px-[4.1vw] ">
            {/* {(orderAndRefundDetails.orderDetailsData.status !== "Cancelled by user") && 
              <RetryOrPayonlineWrapper fetchOrderdetails={fetchOrderdetails} />
            } */}
            <ItemsList orderDetailsData={orderAndRefundDetails.orderDetailsData} />
          </div>
          <div className="mob:px-[4.1vw] flex flex-col gap-[1.671vw] mob:gap-[4.1vw] ">
            {orderAndRefundDetails.refundList.length > 0 && (
              <RefundWrapper
                orderDetailsData={orderAndRefundDetails.orderDetailsData}
                refundList={orderAndRefundDetails.refundList}
              />
            )}
            <BillDetails orderDetails={orderAndRefundDetails.orderDetailsData} />
            <DeliveryAddress orderDetailsData={orderAndRefundDetails.orderDetailsData} />
          </div>
        </div>
        <div className="w-full flex flex-col mob:hidden gap-[1.67vw]">
          {/* {(orderAndRefundDetails.orderDetailsData.status !== "Cancelled by user") && (orderAndRefundDetails.orderDetailsData.payment_status === "pending") &&
            <RetryOrPayonlineWrapper fetchOrderdetails={fetchOrderdetails} />
          } */}
          <ItemsList orderDetailsData={orderAndRefundDetails.orderDetailsData} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsWrapper;
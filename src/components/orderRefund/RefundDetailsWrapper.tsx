import React from 'react';
import { useSelector } from 'react-redux';
import RefundStatusWidget from './RefundStatusWidget';

const RefundDetailsWrapper = () => {
  const orderAndRefundDetails = useSelector((state: any) => state.orderAndRefundDetails);

  const totalRefundsAmount = orderAndRefundDetails.refundList.reduce((total: any, data: any) => total + data.amount, 0);
  const totalRefundsInitiated = orderAndRefundDetails.refundList.filter((data: any) => data.rrn_number !== null).length;

  return (
    <div>
      <div className="border bg-[#F2EEE44D] border-beige-200 p-[1.1vw] mob:p-[4.1vw] mob:rounded-[3vw] rounded-[.83vw]">
        {' '}
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium text-black-op-50">
          {orderAndRefundDetails.orderDetailsData.items.length}{' '}
          {orderAndRefundDetails.orderDetailsData.items.length === 1 ? 'item' : 'items'}
        </p>{' '}
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium text-black-op-50">
          Refund amt: <span className="font-semibold">₹{totalRefundsAmount}</span>{' '}
        </p>
      </div>
      <div className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw] mob:mt-[4.1vw] mt-[1.1vw] ">
        {orderAndRefundDetails.refundList.map((data: any, index: any) => (
          <RefundStatusWidget key={index} refundDetails={data} />
        ))}
      </div>
    </div>
  );
};
export default RefundDetailsWrapper;

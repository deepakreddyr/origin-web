import React, { memo } from 'react';
import dropdownIcon from '/public/assets/images/blackDropdown.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

const RefundWrapper = (props: any) => {
  const { orderDetailsData, refundList } = props;
  const totalRefundsAmount = refundList.reduce((total: any, data: any) => total + data.amount, 0);
  const totalRefundsInitiated = refundList.filter((data: any) => data.rrn_number !== null).length;
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        dispatch(setTabType(TabTypeConstant.REFUND_LIST));
        dispatch(setIsSidebarOpen(true));
      }}
      className="border cursor-pointer w-full h-max bg-[#F2EEE44D] border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw]  "
    >
      <div className="flex items-center justify-between border-b border-b-[#F2EEE4] pb-[.83vw] mob:pb-[3vw] mob:mb-[3vw] mb-[.83vw] ">
        <div className="flex items-center gap-[1.1vw] mob:gap-[4.1vw] ">
          <p className="font-[stinger] font-semibold text-[1.25vw] mob:text-[5vw] pt-[.3vw] mob:pt-[2vw] text-black-op-80">
            Refund details
          </p>
          <div className="bg-[#DC6F3F1F] px-[.5vw] mob:px-[3vw] mob:py-[2vw] py-[.2vw] mob:rounded-full rounded-[.78vw] ">
            <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-[#DC6F3F] ">
              {totalRefundsInitiated}/{refundList.length} Refund completed
            </p>
          </div>
        </div>
        <div className="w-[.83vw] mob:w-[3vw] mob:h-[3vw] h-[.83vw] relative ">
          <Image src={dropdownIcon} alt="dropdownIcon" />
        </div>
      </div>
      <div>
        {' '}
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium text-black-op-50">
          {orderDetailsData.items.length} {orderDetailsData.items.length === 1 ? 'item' : 'items'}
        </p>{' '}
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw]  font-medium text-black-op-50">
          Refund amt: ₹{totalRefundsAmount}
        </p>
      </div>
    </div>
  );
};

export default memo(RefundWrapper);

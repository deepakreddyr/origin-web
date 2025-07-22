import Image from 'next/image';
import React from 'react';
import backIcon from '/public/assets/icons/backIcon.png';
import { formatTimestamp } from '@/utilities/utils';
import { useRouter } from 'next/router';
const DetailsHeader = (props: any) => {
  const { orderDetailsData } = props;
  const { order_id, time_formatted, order_created_at, need_help_message, delivery_date } = orderDetailsData;
  const router = useRouter();

  const onClickBackButton = () => {
    router.back();
  };
  return (
    <div className="flex items-start mob:items-center gap-[.6vw] mob:gap-[2vw] pt-[2.2vw] pb-[1.67vw] mob:py-[4vw] sticky top-0 z-[8] mob:pl-[4vw] bg-white">
      <div className="flex items-center justify-end ">
        <button
          onClick={onClickBackButton}
          className="relative w-[2.5vw] h-[2.5vw] mob:w-[5vw] mob:h-[5vw] cursor-pointer bg-transparent border-none rounded-full flex items-center justify-center
        hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
        >
          <div className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
            <Image src={backIcon} alt="back" />
          </div>
        </button>
      </div>
      <div>
        <p className="font-[SofiaPro] text-[1.389vw] mob:text-[5.12vw] font-semibold ">Order Details</p>
        <p className="font-[SofiaPro] font-medium text-[.97vw] mob:text-[3.6vw] text-[#231F2080] ">
          Order #{order_id}
          <span> | </span>
          {/* {time_formatted} */}
          {formatTimestamp(order_created_at)}
        </p>
      </div>
    </div>
  );
};

export default DetailsHeader;

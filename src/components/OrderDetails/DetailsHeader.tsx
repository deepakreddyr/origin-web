import React from 'react';
import Image from 'next/image';
import backIcon from '/public/assets/icons/backIcon.png';
import { formatTimestamp } from '@/utilities/utils';
import { useRouter } from 'next/router';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const DetailsHeader = (props: any) => {
  const { orderDetailsData } = props;
  const { order_code, order_created_at } = orderDetailsData;
  const router = useRouter();

  const onClickBackButton = () => {
    router.back();
  };

  return (
    // <div className="flex items-start mob:items-center justify-between w-full gap-[.6vw] mob:gap-[2vw] pt-[2.2vw] pb-[1.67vw] mob:py-[4vw] sticky top-0 z-[8] mob:px-[4vw] px-[2vw] bg-[#FFF9E5]">
    <div className="flex items-start mob:items-center justify-between w-full gap-[.6vw] mob:gap-[2vw] pt-[2.2vw] pb-[1.67vw] mob:py-[4vw] sticky top-0 z-[8] mob:px-[4vw] px-[2vw]">
      {/* Back + Title */}
      <div className="flex items-start mob:items-center gap-[.6vw] mob:gap-[2vw]">
        <div className="flex items-center justify-end">
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
          <p className="font-[SofiaPro] text-[1.389vw] mob:text-[5.12vw] font-semibold">Order Details</p>
          <p className="font-[SofiaPro] font-medium text-[.97vw] mob:text-[3.6vw] text-[#231F2080]">
            Order #{order_code}
            <span> | </span>
            {formatTimestamp(order_created_at)}
          </p>
        </div>
      </div>

      {/* Contact Support */}
      <div className="flex flex-col items-end justify-center">
        <div className="flex items-center gap-[0.5vw] mob:gap-[1.5vw]">
          <SupportAgentIcon
            className="text-[#231F20]"
            sx={{
              fontSize: { xs: '5vw', md: '1.5vw' },
            }}
          />
          <p className="font-[SofiaPro] font-semibold text-[0.9vw] mob:text-[3.8vw] text-[#231F20]">Contact Support</p>
        </div>
        <a
          href="tel:+919876543210"
          className="font-[SofiaPro] text-[0.85vw] mob:text-[3.5vw] text-[#CC4C85] font-medium underline"
        >
          +91 9900508216
        </a>
      </div>
    </div>
  );
};

export default DetailsHeader;

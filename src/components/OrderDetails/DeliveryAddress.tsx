import { ADDRESS_ICON_MAP, ADDRESS_ICON_MAP_PNG } from '@/utilities/maps';
import Image from 'next/image';
import React from 'react';
import paymentTypeIcon from '/public/assets/images/paymentTypeIcon.png';
import Other from '/public/assets/icons/addressIcons/others.png';

const DeliveryAddress = (props: any) => {
  const { orderDetailsData } = props;
  const { address, address_name, payment_method } = orderDetailsData;

  return (
    <div className="border w-full h-max bg-[#F2EEE44D] border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] ">
      <div className="">
        <p className="font-[Recoleta] font-bold text-[1.25vw] mob:text-[5vw] text-black-op-80 pb-[1.1vw] mob:pb-[4.1vw]">
          Delivering to
        </p>
        <div className="flex gap-[.5vw] mob:gap-[1.5vw] ">
          <div className="flex items-center justify-center w-[2.8vw] mob:w-[9vw] mob:h-[9vw] h-[2.8vw] bg-[#F8F4E9] rounded-[.6vw] mob:rounded-[2vw] border border-[#F2EEE4]">
            <div className="opacity-80 relative w-[1.2vw] mob:w-[4.1vw] mob:h-[4.1vw] h-[1.2vw] ">
              <Image
                src={ADDRESS_ICON_MAP_PNG[address_name] ? ADDRESS_ICON_MAP_PNG[address_name] : Other}
                fill
                alt=""
              />
            </div>
          </div>
          <div className="w-[26vw] mob:w-[80vw]">
            <p className="font-[SofiaPro] font-semibold text-[1.1vw] mob:text-[4.1vw] text-black ">{address_name}</p>
            <p className="font-[SofiaPro] font-regular text-[.83vw] mob:text-[3vw] mob:pt-[1vw] text-black-op-50">
              {address}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-[1.67vw] mob:pt-[8vw]">
        <p className="font-[Recoleta] font-bold text-[1.25vw] mob:text-[5vw] text-black-op-80 pb-[1.1vw] mob:pb-[4.1vw]">
          Payment Type
        </p>
        <div className="flex items-center gap-[.5vw] mob:gap-[1.5vw]">
          <div className="w-[2.9vw] h-[2.9vw] mob:w-[9vw] mob:h-[9vw] relative ">
            <Image src={paymentTypeIcon} alt="" />
          </div>
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  ">
            {payment_method === 'Razorpay' ? 'Paid Online' : 'Cash on Delivery'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;

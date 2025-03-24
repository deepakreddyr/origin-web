import React from 'react';
import clock from '/public/assets/icons/greenClock.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryType } from '@/store/slice/placeOrderDetails';
import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';
const ScheduledDeliveryBtn = (props: any) => {
  const { activeDeliveryType, setActiveDeliveryType } = props;
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails, delivery_type } = placeOrderDetails;
  let isButtonEnabled = checkoutDetails.timeslots.length > 0;

  return (
    <button
      onClick={() => {
        setActiveDeliveryType('TIME_SLOT');
        dispatch(updateDeliveryType('TIME_SLOT'));
      }}
      disabled={!isButtonEnabled}
      className={`border ${isButtonEnabled ? `text-[#006C37] ${delivery_type === 'TIME_SLOT' ? 'border-[#006C37]' : 'border-[#006C3733]'}  bg-[#006C3733]` : 'text-[#231F204D] border-[#231F2005] bg-[#006C3733]'}  p-[.97vw] pt-[0vw] mob:p-[3.6vw]  mob:pr-[1.5vw] pr-[.5vw] rounded-[.97vw] mob:rounded-[3.6vw] mob:w-[42vw] mob:h-[25vw]  w-[13vw] h-[7vw]`}
    >
      <div className="w-[1.1vw] mob:w-[3.6vw] mob:h-[3.6vw] h-[1.1vw] relative">
        <Image src={clock} alt="green clock" />
      </div>
      <div className="text-start mob:pt-[3vw] pt-[.87vw]">
        <p className="font-[Stinger] text-[.97vw] mob:text-[3.6vw] font-semibold ">Time slot delivery</p>
        <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw] text-medium">
          {isButtonEnabled ? (
            <>
              Pick a time slot between
              <br />
              {`${checkoutDetails.timeslots[0].from} - ${checkoutDetails.timeslots[checkoutDetails.timeslots.length - 1].to}`}
            </>
          ) : (
            checkoutDetails.dash_delivery.timeslot_order_full_message
          )}
        </p>
      </div>
    </button>
  );
};

export default ScheduledDeliveryBtn;

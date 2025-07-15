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
      className={`flex flex-col items-center justify-center text-center border ${
        isButtonEnabled
          ? `text-[#006C37] ${
              delivery_type === 'TIME_SLOT' ? 'border-[#006C37]' : 'border-[#006C3733]'
            } bg-[#006C3733]`
          : 'text-[#231F204D] border-[#231F2005] bg-[#006C3733]'
      } p-[1.5vw] mob:p-[5vw] rounded-[1.2vw] mob:rounded-[4vw] w-full`}
    >
      <div className="mb-[1vw] mob:mb-[3vw]">
        <Image
          src={clock}
          alt="green clock"
          width={40} // Adjust size as needed
          height={40}
        />
      </div>
      <p className="font-[Stinger] text-[1.5vw] mob:text-[5vw] font-semibold mb-[0.8vw] mob:mb-[2vw]">
        Time Slot Delivery
      </p>
      <p className="font-[SofiaPro] text-[1.2vw] mob:text-[3.8vw] text-medium leading-snug">
        {isButtonEnabled ? (
          <>
            Pick a time slot between <br />
            <span className="font-bold text-[1.4vw] mob:text-[4.5vw]">
              {`${checkoutDetails.timeslots[0].from} - ${
                checkoutDetails.timeslots[checkoutDetails.timeslots.length - 1].to
              }`}
            </span>
          </>
        ) : (
          <span className="font-bold text-[1.4vw] mob:text-[4.5vw]">
            {checkoutDetails.dash_delivery.timeslot_order_full_message}
          </span>
        )}
      </p>
    </button>
  );
};

export default ScheduledDeliveryBtn;

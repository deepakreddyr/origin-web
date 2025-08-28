import React from 'react';
import clock from '/public/assets/icons/greenClock.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryType, updateTimeSlotId } from '@/store/slice/placeOrderDetails';

const ScheduledDeliveryBtn = (props: any) => {
  const { activeDeliveryType, setActiveDeliveryType } = props;
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails, delivery_type } = placeOrderDetails;

  let isButtonEnabled = checkoutDetails?.timeslots?.length > 0;
  
  // Auto-select this button if user has selected a time slot
  const isAutoSelected = placeOrderDetails.time_slot_id !== '' || delivery_type === 'TIME_SLOT';
  const isSelected = isAutoSelected || activeDeliveryType === 'TIME_SLOT';

  const handleScheduledDeliverySelection = () => {
    if (!isButtonEnabled) return;
    
    setActiveDeliveryType('TIME_SLOT');
    dispatch(updateDeliveryType('TIME_SLOT'));
    // Clear any previously selected time slot when manually clicking the button
    dispatch(updateTimeSlotId(''));
  };

  return (
    <button
      onClick={handleScheduledDeliverySelection}
      disabled={!isButtonEnabled}
      className={`flex flex-col items-center justify-center text-center border transition-all duration-200 ${
        isButtonEnabled
          ? `text-[#006C37] ${
              isSelected
                ? 'border-2 border-[#006C37] shadow-md'
                : 'border border-[#006C3733] hover:border-[#006C37] hover:shadow-sm'
            } bg-[#E6F4EC]`
          : 'text-[#231F204D] border-[#231F2005] bg-[#E6F4EC] cursor-not-allowed'
      } p-[1vw] mob:p-[5vw] rounded-[0.8vw] mob:rounded-[4vw] w-full`}
    >
      <div className="mb-[0.5vw] mob:mb-[3vw] relative">
        <Image
          src={clock}
          alt="green clock"
          width={28}
          height={28}
          className="mob:w-[40px] mob:h-[40px]"
        />
      </div>
      
      <p className="font-[SofiaPro] text-[1vw] mob:text-[5vw] font-semibold mb-[0.4vw] mob:mb-[2vw]">
        Time Slot Delivery
        {isSelected && (
          <span className="ml-2 text-[#006C37] font-bold">✓</span>
        )}
      </p>
      
      <p className="font-[SofiaPro] text-[0.85vw] mob:text-[3.8vw] leading-snug">
        {isButtonEnabled ? (
          <>
            Pick a time slot between <br />
            <span className="font-bold text-[1vw] mob:text-[4.5vw]">
              {`${checkoutDetails.timeslots[0].from} - ${
                checkoutDetails.timeslots[checkoutDetails.timeslots.length - 1].to
              }`}
            </span>
          </>
        ) : (
          <span className="font-bold text-[1vw] mob:text-[4.5vw]">
            {checkoutDetails?.dash_delivery?.timeslot_order_full_message || 'No time slots available'}
          </span>
        )}
      </p>
    </button>
  );
};

export default ScheduledDeliveryBtn;
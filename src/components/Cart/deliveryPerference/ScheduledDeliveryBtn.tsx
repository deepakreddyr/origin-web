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
      className={`flex flex-col items-start text-start border transition-all duration-200 ${
        isButtonEnabled
          ? `text-[#006C37] ${
              isSelected
                ? 'border-2 border-[#006C37] shadow-[0_4px_12px_rgba(3,152,85,0.1)]'
                : 'border border-[#E7F6EC] hover:border-[#006C3733]'
            } bg-[#E7F6EC]`
          : 'text-[#231F204D] border-[#231F2005] bg-[#231F2005] cursor-not-allowed'
      } p-[1vw] mob:p-[4vw] rounded-[1vw] mob:rounded-[4vw] w-full min-h-[10vw] mob:min-h-[35vw]`}
    >
      {/* Icon in top left */}
      <div className="mb-[1vw] mob:mb-[3.5vw] relative w-[1.4vw] h-[1.4vw] mob:w-[6vw] mob:h-[6vw]">
        <Image src={clock} alt="green clock" fill className="object-contain" />
      </div>

      <div className="flex flex-col gap-[0.4vw] mob:gap-[1.5vw]">
        <p className="font-[Recoleta] text-[1.1vw] mob:text-[4.5vw] font-bold leading-tight">Time slot delivery</p>

        <p className="font-[SofiaPro] text-[.75vw] mob:text-[3vw] opacity-80 leading-tight">
          {isButtonEnabled ? (
            <>
              Pick a time slot between{' '}
              {`${checkoutDetails.timeslots[0].from} - ${
                checkoutDetails.timeslots[checkoutDetails.timeslots.length - 1].to
              }`}
            </>
          ) : (
            <span>{checkoutDetails?.dash_delivery?.timeslot_order_full_message || 'No time slots available'}</span>
          )}
        </p>
      </div>
    </button>
  );
};

export default ScheduledDeliveryBtn;

import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setCartTabType, setIsProceedButtonEnabled } from '@/store/slice/CartSlice';
import { setDeliverylotDetails, updateTimeSlotId, updateDeliveryType } from '@/store/slice/placeOrderDetails';
import { formatRelativeDate } from '@/utilities/utils';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DeliveryTimings = (props: any) => {
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails } = placeOrderDetails;

  const handleTimeSlotSelection = (time: any) => {
    // Automatically set delivery type to TIME_SLOT when user selects a timing
    dispatch(updateDeliveryType('TIME_SLOT'));
    dispatch(updateTimeSlotId(time.id));
    dispatch(setDeliverylotDetails(time));
    // Enable proceed button immediately
    dispatch(setIsProceedButtonEnabled(true));
  };

  return (
    <div className="relative mt-[1vw] mob:mt-[2vw]">
      <div className="bg-primary-100 w-[1.67vw] mob:w-[5vw] mob:h-[5vw]  h-[1.67vw] rotate-45  absolute top-[.0vw] right-[3.25vw] mob:right-[22vw] "></div>
      <div
        className="w-full min-h-[10vw] bg-primary-100 rounded-[.97vw] mob:rounded-[3.6vw] mob:p-[3.6vw] p-[.97vw] "
        style={{ boxShadow: '0px 0px 10px 0px #231F200F inset' }}
      >
        <p className="font-[SofiaPro] text-[.83vw]  mob:text-[3vw]">
          Delivery, <span className="font-semibold">{formatRelativeDate(checkoutDetails.delivery_date[0])}</span>{' '}
        </p>
        <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[2.5vw] mt-5">
          Please select your preferred delivery timing.
        </p>
        <div className="grid grid-cols-2 gap-[1.1vw] mob:gap-[4.1vw] mob:pt-[4.1vw] pt-[1.1vw]">
          {checkoutDetails.timeslots.map((time: any) => {
            const isSelected = placeOrderDetails.time_slot_id === time.id;
            const isAvailable = time.available;

            return (
              <button
                key={time.id}
                onClick={() => isAvailable && handleTimeSlotSelection(time)}
                disabled={!isAvailable}
                className={`font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] transition-all duration-200 ${
                  isAvailable
                    ? `bg-white ${
                        isSelected
                          ? 'bg-[#E0EDE7] border-2 border-[#006C37] text-[#006C37] shadow-md'
                          : 'border border-gray-200 hover:border-[#006C37] hover:shadow-sm'
                      }`
                    : 'bg-[#231F200F] text-[#231F2066] cursor-not-allowed'
                } mob:py-[1.5vw] py-[.5vw] mob:rounded-[3vw] rounded-[.8vw]`}
              >
                {time.from} - {time.to}
                {isSelected && <span className="ml-2 text-[#006C37] font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimings;

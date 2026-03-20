import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryType, updateTimeSlotId, setDeliverylotDetails } from '@/store/slice/placeOrderDetails';
import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';

const SubscriptionTimeslot = () => {
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails } = placeOrderDetails;

  const deliveryDate = checkoutDetails?.formatted_delivery_date?.[0];
  const timeslot = checkoutDetails?.timeslot;

  // Auto-select the fixed timeslot as soon as it's available
  useEffect(() => {
    if (timeslot?.id) {
      dispatch(updateDeliveryType('TIME_SLOT'));
      dispatch(updateTimeSlotId(timeslot.id));
      dispatch(
        setDeliverylotDetails({
          id: timeslot.id,
          from: timeslot.from_time,
          to: timeslot.to_time
        })
      );
      dispatch(setIsProceedButtonEnabled(true));
    }
  }, [timeslot?.id, dispatch]);

  if (!deliveryDate || !timeslot) return null;

  return (
    <div className="relative mt-[1vw] mob:mt-[2vw]">
      {/* Arrow pointer */}
      <div className="bg-primary-100 w-[1.67vw] mob:w-[5vw] mob:h-[5vw] h-[1.67vw] rotate-45 absolute top-[0vw] right-[3.25vw] mob:right-[22vw]" />

      <div
        className="w-full bg-primary-100 rounded-[.97vw] mob:rounded-[3.6vw] mob:p-[3.6vw] p-[.97vw]"
        style={{ boxShadow: '0px 0px 10px 0px #231F200F inset' }}
      >
        {/* Delivery date */}
        <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw]">
          Delivery, <span className="font-semibold">{deliveryDate}</span>
        </p>

        {/* Fixed timeslot pill */}
        <div className="mt-[.8vw] mob:mt-[3vw]">
          <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[2.5vw] mb-[.5vw] mob:mb-[2vw]">
            Your delivery timeslot
          </p>
          <div className="inline-flex items-center gap-[.5vw] mob:gap-[2vw] bg-white border-2 border-[#006C37] text-[#006C37] rounded-[.8vw] mob:rounded-[3vw] px-[1.2vw] mob:px-[4vw] py-[.5vw] mob:py-[1.5vw]">
            <span className="text-[#006C37] font-bold text-[.9vw] mob:text-[3.5vw]">✓</span>
            <span className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw]">
              {timeslot.from_time} – {timeslot.to_time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTimeslot;

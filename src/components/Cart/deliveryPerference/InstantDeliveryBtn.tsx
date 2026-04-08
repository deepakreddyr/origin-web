import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryType, updateTimeSlotId } from '@/store/slice/placeOrderDetails';
import React from 'react';
import { useCartStore } from '@/hooks/useCartStore';

const InstantDeliveryBtn = (props: any) => {
  const { cart, actions } = useCartStore();
  const { setIsProceedButtonEnabled } = actions;
  const { activeDeliveryType, setActiveDeliveryType } = props;
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails, delivery_type } = placeOrderDetails;

  // Check if instant delivery is actually available
  const isButtonEnabled =
    checkoutDetails?.dash_delivery?.immediate_delivery_available &&
    checkoutDetails?.dash_delivery?.immediate_delivery_enabled;

  const isSelected = delivery_type === 'INSTANT' || activeDeliveryType === 'INSTANT';

  // Get instant delivery fee
  const instantDeliveryFee = checkoutDetails?.dash_delivery?.immediate_delivery_fee;
  const hasFee = instantDeliveryFee && parseFloat(instantDeliveryFee) > 0;

  const handleInstantDeliverySelection = () => {
    if (!isButtonEnabled) return;

    setActiveDeliveryType('INSTANT');
    dispatch(updateDeliveryType('INSTANT'));
    // Clear any previously selected time slot when switching to instant delivery
    dispatch(updateTimeSlotId(''));
    // Immediately enable proceed button for instant delivery
    dispatch(setIsProceedButtonEnabled(true));
  };

  return (
    <button
      onClick={handleInstantDeliverySelection}
      disabled={!isButtonEnabled}
      className={`relative flex flex-col items-start text-start border transition-all duration-200 ${
        isButtonEnabled
          ? `text-[#6F2D72] ${
              isSelected
                ? 'border-2 border-[#6F2D72] shadow-[0_4px_12px_rgba(111,45,114,0.1)]'
                : 'border border-[#6F2D721A] hover:border-[#6F2D7233]'
            } bg-[#F2EAFC]`
          : 'text-[#231F204D] border-[#231F2005] bg-[#231F2005] cursor-not-allowed'
      } p-[1vw] mob:p-[4vw] rounded-[1vw] mob:rounded-[4vw] w-full min-h-[10vw] mob:min-h-[35vw]`}
    >
      {/* Badge in top right */}
      {isButtonEnabled && (
        <div className="absolute top-[1vw] right-[1vw] mob:top-[3vw] mob:right-[3vw] bg-white rounded-full px-[.6vw] py-[.15vw] mob:px-[2.5vw] mob:py-[.8vw] shadow-sm">
          <p className="font-[SofiaPro] font-bold text-[.65vw] mob:text-[2.5vw] text-[#6F2D72]">
            {checkoutDetails?.dash_delivery?.delivery_time}
          </p>
        </div>
      )}

      {/* Icon in top left */}
      <div className="mb-[1vw] mob:mb-[3.5vw]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          className="w-[1.4vw] h-[1.4vw] mob:w-[6vw] mob:h-[6vw]"
        >
          <path
            d="M12.2029 6.11534H9.76786C9.76786 6.11534 12.5334 1.24993 12.8286 0.770874C13.1239 0.291817 13.0884 0 12.498 0H7.11118C6.78646 0 6.49117 0.197365 6.40267 0.479057L3.15544 8.76436C2.97835 9.24341 3.33252 9.7508 3.86395 9.7508H5.57607L3.68129 15.3676C3.47455 16.0157 4.27375 16.2371 4.7459 15.73L12.8381 7.07291C13.2808 6.62177 12.8381 6.11534 12.2029 6.11534Z"
            fill={isButtonEnabled ? '#6F2D72' : '#231F204D'}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-[0.4vw] mob:gap-[1.5vw]">
        <p className="font-[Recoleta] text-[1.1vw] mob:text-[4.5vw] font-bold leading-tight">
          {checkoutDetails?.dash_delivery?.immediate_order_title}
        </p>
        <p className="font-[SofiaPro] text-[.75vw] mob:text-[3vw] opacity-80 leading-tight">
          {isButtonEnabled
            ? checkoutDetails?.dash_delivery?.immediate_order_sub_title
            : 'Instant delivery not available'}
        </p>
      </div>
    </button>
  );
};

export default InstantDeliveryBtn;

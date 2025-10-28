import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';
import { updateDeliveryType, updateTimeSlotId } from '@/store/slice/placeOrderDetails';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const InstantDeliveryBtn = (props: any) => {
  const { activeDeliveryType, setActiveDeliveryType } = props;
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const { checkoutDetails, delivery_type } = placeOrderDetails;

  // Check if instant delivery is actually available
  const isButtonEnabled = checkoutDetails?.dash_delivery?.immediate_delivery_available && 
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
      className={`border transition-all duration-200 ${
        isButtonEnabled
          ? `text-[#6F2D72] ${
              isSelected
                ? 'border-2 border-[#6F2D72] shadow-md'
                : 'border border-[#6F2D7233] hover:border-[#6F2D72] hover:shadow-sm'
            } bg-[#6F2D7233]`
          : 'text-[#231F204D] border-[#231F2005] bg-[#231F2005] cursor-not-allowed'
      } p-[.97vw] mob:p-[3.6vw] rounded-[.97vw] mob:rounded-[3.6vw] w-full`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12.2029 6.11534H9.76786C9.76786 6.11534 12.5334 1.24993 12.8286 0.770874C13.1239 0.291817 13.0884 0 12.498 0H7.11118C6.78646 0 6.49117 0.197365 6.40267 0.479057L3.15544 8.76436C2.97835 9.24341 3.33252 9.7508 3.86395 9.7508H5.57607L3.68129 15.3676C3.47455 16.0157 4.27375 16.2371 4.7459 15.73L12.8381 7.07291C13.2808 6.62177 12.8381 6.11534 12.2029 6.11534Z"
              fill={isButtonEnabled ? '#6F2D72' : '#231F204D'}
            />
          </svg>
        </div>
        <div
          className={`${
            isButtonEnabled
              ? 'text-[#6F2D72] border-[#6F2D72] bg-[#6F2D7233]'
              : 'text-[#231F204D] border-[#231F2005] bg-[#231F201A]'
          } rounded-full`}
        >
          <p
            className={`font-[SofiaPro] font-semibold text-[.6vw] mob:text-[2vw] ${
              isButtonEnabled ? 'text-[#6F2D72]' : 'text-[#231F204D]'
            } px-[.6vw] mob:px-[1.8vw] mob:py-[.5vw] py-[.2vw] rounded-full`}
          >
            {checkoutDetails?.dash_delivery?.delivery_time}
          </p>
        </div>
      </div>
      <div className="text-start pt-[.87vw] mob:pt-[3vw]">
        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">
          {checkoutDetails?.dash_delivery?.immediate_order_title}
          {isSelected && (
            <span className="text-purple text-xs font-bold ml-1">✓</span>
          )}
        </p>
        <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw]">
          {isButtonEnabled 
            ? checkoutDetails?.dash_delivery?.immediate_order_sub_title
            : 'Instant delivery not available'
          }
        </p>
        {isButtonEnabled && hasFee && (
          <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw] text-[#6F2D72] font-medium mt-[.5vw] mob:mt-[2vw]">
            Additional ₹{instantDeliveryFee} applicable
          </p>
        )}
      </div>
    </button>
  );
};

export default InstantDeliveryBtn;
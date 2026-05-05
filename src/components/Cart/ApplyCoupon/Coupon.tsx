import React from 'react';
import { useDispatch } from 'react-redux';
import { useCartStore } from '@/hooks/useCartStore';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

const Coupon = (props: any) => {
  const { couponDetailsFromList, validateCoupon } = props;
  const { cart } = useCartStore();

  const { min_cart_value, isValid, code, discount_type, discount, max_cart_value, error_message, description } =
    couponDetailsFromList;

  let isMinvalueConditionValid = cart.totalPrice >= min_cart_value;
  let balanceToBeAdded = Math.ceil(min_cart_value - cart.totalPrice);
  let isCouponValid = Boolean(isValid);
  let isButtonDisabled = !isCouponValid || !isMinvalueConditionValid;

  return (
    <div
      className={`rounded-[1.1vw] mob:rounded-[4.1vw] bg-[#F2EEE44D] border border-[#231F201F] ${isButtonDisabled ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between mob:p-[4vw] p-[1vw]">
        <div className="flex flex-col gap-1">
          <p className="font-[SofiaPro] font-semibold text-[1.1vw] mob:text-[4.1vw] text-black">{code}</p>
          <p className="font-[SofiaPro] font-medium text-[0.83vw] mob:text-[3vw] text-[#231F20CC]">
            {discount_type === 'percentage'
              ? `Avail discount of ${discount}% or upto ₹${max_cart_value || 0}`
              : `Avail discount of ₹${discount}`}
          </p>
          {!isMinvalueConditionValid && (
            <p className="font-[SofiaPro] font-medium text-[0.83vw] mob:text-[3vw] text-[#D0583F]">
              Add ₹{balanceToBeAdded} more to unlock this coupon
            </p>
          )}
        </div>
        <button
          disabled={isButtonDisabled}
          onClick={() => {
            trackEvent(AnalyticsEvents.COUPON_SELECTED, {
              coupon_id: String(couponDetailsFromList.id),
              coupon_code: code
            });
            validateCoupon(code);
          }}
          className={`bg-secondary ${isButtonDisabled ? 'opacity-60' : ''} rounded-full text-white py-[.5vw] mob:py-[2vw] mob:px-[6vw] px-[1.5vw] font-[SofiaPro] font-bold mob:text-[3vw] text-[.83vw] mt-1`}
        >
          APPLY
        </button>
      </div>

      <div className="relative w-full">
        {/* Decorative Circles */}
        <div className="absolute bg-white h-[1.5vw] w-[1.5vw] mob:w-[5vw] mob:h-[5vw] rounded-full mob:top-[-2.5vw] top-[-0.75vw] left-[-0.8vw] mob:left-[-2.5vw] border-r-[2px] border-[#231F201A]"></div>
        <div className="absolute bg-white h-[1.5vw] w-[1.5vw] mob:w-[5vw] mob:h-[5vw] rounded-full top-[-0.75vw] mob:top-[-2.5vw] right-[-0.8vw] mob:right-[-2.5vw] border-l-[2px] border-[#231F201A]"></div>

        <div className="border-t border-dashed border-black border-opacity-20 mx-[1vw] mob:mx-[4vw] pt-[1vw] pb-[1vw] mob:pt-[4vw] mob:pb-[4vw]">
          <p
            className={`font-[SofiaPro] text-[0.83vw] mob:text-[3vw] font-medium ${!isMinvalueConditionValid ? 'text-[#D0583F]' : 'text-[#231F20CC]'}`}
          >
            {!isMinvalueConditionValid ? error_message : description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coupon;

import React from 'react';
import { useDispatch } from 'react-redux';
import { useCartStore } from '@/hooks/useCartStore';

const Coupon = (props: any) => {
  const { couponDetailsFromList, setCouponsTab, validateCoupon } = props;
  const { cart } = useCartStore();
  const dispatch = useDispatch();

  const { min_cart_value, isValid } = couponDetailsFromList;

  let isMinvalueConditionValid = cart.totalPrice > min_cart_value;
  let balanceToBeAdded = min_cart_value - cart.totalPrice;
  let isCouponValid = Boolean(isValid);
  let isButtonDisabled = !isCouponValid || !isMinvalueConditionValid;

  return (
    <div
      className={`rounded-[1.1vw] mob:rounded-[4.1vw] bg-[#F2EEE44D] border border-[#231F201F] ${isCouponValid ? '' : 'opacity-60'} `}
    >
      <div className="flex items-center justify-between mob:p-[3vw] p-[.78vw]">
        <div>
          <p className="font-[SofiaPro] font-semibold text-[1.1vw] mob:text-[4.1vw] ">{couponDetailsFromList.code}</p>
          <p
            className={`font-[SofiaPro] font-medium text-[.83vw] mob:text-[3vw] mob:pt-[1.4vw] pt-[.4vw] ${!isMinvalueConditionValid ? 'text-error' : 'text-black'}  `}
          >
            {isCouponValid && isMinvalueConditionValid && isCouponValid
              ? couponDetailsFromList.description
              : `Add ₹${balanceToBeAdded} more to use this coupon.`}
          </p>
        </div>
        <button
          disabled={isButtonDisabled}
          onClick={() => {
            validateCoupon(couponDetailsFromList.code);
            // dispatch(setCouponDetails({ ...couponDetailsFromList }));
            // setCouponsTab(COUPON_TABS.COUPON_APPLIED);
          }}
          className={`bg-secondary ${isButtonDisabled ? 'opacity-60' : ''} rounded-full text-white py-[.5vw] mob:py-[1.4vw] mob:px-[4.5vw] px-[1.3vw] font-[SofiaPro] font-bold mob:text-[3vw] text-[.83vw]`}
        >
          APPLY
        </button>
      </div>
      <div className="relative w-full">
        <div className="absolute bg-white h-[1.5vw] w-[1.5vw] mob:w-[5vw] mob:h-[5vw] rounded-full mob:top-[-2.2vw] top-[-.75vw] left-[-1vw] border-r-[2px] border-[#231F201A]"></div>
        <div className="absolute bg-white h-[1.5vw] w-[1.5vw] mob:w-[5vw] mob:h-[5vw] rounded-full top-[-.75vw] mob:top-[-2.2vw] right-[-1vw] border-l-[2px] border-[#231F201A]"></div>
        <div className="border-t border-dashed border-black-op-30 p-[1.1vw] mob:p-[4.1vw] ">
          <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-semibold  text-black-op-60 ">
            {couponDetailsFromList.offer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coupon;

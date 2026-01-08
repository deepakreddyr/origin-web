import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import percentageIcon from '/public/assets/icons/percentageIcon.png';
import warningIcon from '/public/assets/icons/warningIcon.png';

import { setCartTabType } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

const CouponAppliedModal = (props: any) => {
  const { setShowCouponList, error } = props;

  const cart = useSelector((state: any) => state.cart);
  const { couponDetails, discountAmount } = cart;

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowCouponList(false);
    dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
  };

  return (
    <div className="flex flex-col grow items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Icon + Heading */}
      <div className="flex items-center gap-2 md:gap-[.4vw]">
        <div className="relative w-6 h-6 md:w-[1.67vw] md:h-[1.67vw]">
          <Image
            src={error ? warningIcon : percentageIcon}
            alt="coupon status icon"
            fill
          />
        </div>

        <p className="font-[SofiaPro] font-semibold text-lg md:text-[1.25vw] text-black">
          {error ? 'Oops! Coupon does not exist!' : 'Coupon applied successfully!'}
        </p>
      </div>

      {/* Description */}
      <p className="font-[SofiaPro] py-4 md:py-[1.1vw] font-medium text-base md:text-[.97vw] text-[#231F20] max-w-md">
        {error ? (
          <>
            Please verify the code and try applying again, or use available
            coupons from the list!
          </>
        ) : (
          <>
            Coupon used{' '}
            <span className="font-bold">
              '{couponDetails?.code}'
            </span>
            . You saved ₹{discountAmount} on this order.
          </>
        )}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleClose}
        className="
          border border-secondary text-secondary
          font-[SofiaPro] font-semibold
          text-base md:text-[.97vw]
          py-3 md:py-[.87vw]
          px-8 md:px-[4vw]
          rounded-full
          transition-all
          hover:bg-secondary hover:text-white
        "
      >
        {error ? 'Got it!' : 'Whoohoo! Thanks'}
      </button>
    </div>
  );
};

export default CouponAppliedModal;

import React from 'react';
import percentageIcon from '/public/assets/icons/percentageIcon.png';
import warningIcon from '/public/assets/icons/warningIcon.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setCartTabType } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

const CouponAppliedModal = (props: any) => {
  const { setShowCouponList, error, setError } = props;
  const cart = useSelector((state: any) => state.cart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col grow items-center justify-center h-[80vh]">
      {error ? (
        <>
          <div className="flex items-center gap-2 md:gap-[.4vw]">
            <div className="relative w-8 h-8 md:w-[1.67vw] md:h-[1.67vw]">
              <Image src={warningIcon} alt="warning icon" fill />
            </div>
            <p className="font-[SofiaPro] font-semibold mt-1 md:mt-[.4vw] text-xl md:text-[1.25vw] text-black">
              Oops! Coupon does not exist!
            </p>
          </div>
          <p className="font-[SofiaPro] py-4 md:py-[1.1vw] text-center px-6 md:px-[3vw] font-medium text-base md:text-[.97vw] text-[#231F20]">
            Please verify the code and try applying again! or use available coupons from the list!
          </p>
          <button
            onClick={() => {
              setShowCouponList(false);
              dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
            }}
            className="border text-secondary font-[SofiaPro] text-base md:text-[.97vw] py-3 md:py-[.87vw] px-10 md:px-[4vw] font-semibold border-secondary rounded-full"
          >
            Got it!
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 md:gap-[.4vw]">
            <div className="relative w-8 h-8 md:w-[1.67vw] md:h-[1.67vw]">
              <Image src={percentageIcon} alt="percentage icon" fill />
            </div>
            <p className="font-[SofiaPro] font-semibold mt-1 md:mt-[.4vw] text-xl md:text-[1.25vw] text-black">
              Coupon applied successfully!
            </p>
          </div>
          <p className="font-[SofiaPro] py-4 md:py-[1.1vw] font-medium text-base md:text-[.97vw] text-[#231F20] text-center">
            Coupon used <span className="font-bold">'{couponDetails?.code}'.</span>
            <br />
            You saved ₹{cart.discountAmount} on this order.
          </p>
          <button
            onClick={() => {
              setShowCouponList(false);
              dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
            }}
            className="border text-secondary font-[SofiaPro] text-base md:text-[.97vw] py-3 md:py-[.87vw] px-10 md:px-[4vw] font-semibold border-secondary rounded-full mt-4"
          >
            Whoohoo! Thanks
          </button>
        </>
      )}
    </div>
  );
};

export default CouponAppliedModal;

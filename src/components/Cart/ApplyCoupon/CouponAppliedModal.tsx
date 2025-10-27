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
          <div className="flex items-center gap-[.4vw]">
            <div className="relative w-[1.67vw] h-[1.67vw]   ">
              <Image src={error ? warningIcon : percentageIcon} alt="percentage icon" fill />{' '}
            </div>
            <p className="font-slab font-semibold mt-[.4vw] text-[1.25vw] text-black ">
              Oops! Coupon does not exist!
            </p>
          </div>
          <p className="font-slab py-[1.1vw] text-center px-[3vw] font-medium text-[.97vw] text-[#231F20] ">
            Please verify the code and try applying again! or use available coupons from the list!
          </p>
          <button
            onClick={() => {
              setShowCouponList(false);
              dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
            }}
            className="border text-secondary font-slab text-[.97vw] py-[.87vw] px-[4vw] font-semibold border-secondary rounded-full"
          >
            Got it!
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-[.4vw]">
            <div className="relative w-[1.67vw] h-[1.67vw]   ">
              <Image src={percentageIcon} alt="percentage icon" fill />{' '}
            </div>
            <p className="font-slab font-semibold mt-[.4vw] text-[1.25vw] text-black ">
              Coupon applied successfully!
            </p>
          </div>
          <p className="font-slab py-[1.1vw] font-medium text-[.97vw] text-[#231F20] ">
            Coupon used <span className="font-bold">'{couponDetails.code}'.</span> You saved ₹{cart.discountAmount} on
            this order.
          </p>
          <button
            onClick={() => {
              setShowCouponList(false);
              dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
            }}
            className="border text-secondary font-slab text-[.97vw] py-[.87vw] px-[4vw] font-semibold border-secondary rounded-full"
          >
            Whoohoo! Thanks
          </button>
        </>
      )}
    </div>
  );
};

export default CouponAppliedModal;

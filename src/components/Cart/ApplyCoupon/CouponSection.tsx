import React from 'react';
import percentageIcon from '/public/assets/icons/percentageIcon.png';
import gotoIcon from '/public/assets/icons/gotoIcon.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setCartTabType, setCouponDetails, setDiscountAmount } from '@/store/slice/CartSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setRouteSourceToLs } from '@/utilities/utils';
import { setTabType } from '@/store/slice/loginSlice';
import { couponDetailsInitialState } from '@/constants';
const CouponSection = (props: any) => {
  const { setShowCouponList } = props;
  const cart = useSelector((state: any) => state.cart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  const handleAddCoupon = () => {
    const hasFreeItem = cart.items.some((item: any) => item.isFreeItem);
    if (hasFreeItem) {
      props.onShowToast?.('Coupons cannot be added with free items in cart');
      return;
    }

    if (loginDetails.user) {
      setShowCouponList(true);
      dispatch(setCartTabType(TabTypeConstant.COUPON_CODE_LIST));
    } else {
      setRouteSourceToLs(TabTypeConstant.CART);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
    }
  };

  const resetCouponHandler = () => {
    dispatch(setCouponDetails({ ...couponDetailsInitialState }));
    dispatch(setDiscountAmount(0));
  };

  return (
    // <></>
    <div className=" bg-[#F2EEE44D]  flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] mob:pb-[2vw] pb-[.6vw] font-bold text-black">
        Save with coupons
      </h3>

      {couponDetails.name === '' ? (
        <button
          onClick={() => handleAddCoupon()}
          className="flex text-start items-center border border-[#F2EEE4] bg-[#F2EEE4] justify-between p-[.83vw] rounded-[.83vw] mob:p-[3vw] mob:rounded-[3vw]  "
        >
          <div className="flex gap-[.798vw] mob:gap-[3vw] items-center">
            <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[10vw] mob:h-[10vw]  ">
              <Image src={percentageIcon} alt="percentage icon" fill />{' '}
            </div>
            <div className="">
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  ">View coupons & Offers</p>
              <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw] font-regular pt-[.3vw] mob:pt-[1.5vw] ">
                Find and apply to save on this order
              </p>
            </div>
          </div>
          <div className="relative w-[1.25vw] h-[1.25vw] mob:w-[5vw] mob:h-[5vw]   ">
            <Image src={gotoIcon} alt="percentage icon" fill />{' '}
          </div>
        </button>
      ) : (
        <div className="flex  items-center justify-between border border-secondary bg-[#25874D1A] p-[.83vw] mob:p-[3vw] rounded-[1.1vw] mob:rounded-[3.6vw] ">
          <div className="flex gap-[.798vw] mob:gap-[3vw] items-center">
            <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[10vw] mob:h-[10vw]  ">
              <Image src={percentageIcon} alt="percentage icon" fill />{' '}
            </div>
            <div className="">
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  ">View coupons & Offers</p>
              <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw] font-regular pt-[.3vw] mob:pt-[2vw] ">
                You Saved {couponDetails.offer} on this order
              </p>
            </div>
          </div>
          <button
            onClick={resetCouponHandler}
            className="font-[SofiaPro] font-bold text-[.83vw] mob:text-[3vw] text-white bg-[#D0583F] rounded-full px-[.83vw] py-[.6vw] mob:px-[3vw] mob:py-[2vw]"
          >
            REMOVE
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponSection;

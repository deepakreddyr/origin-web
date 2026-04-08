import React from 'react';
import percentageIcon from '/public/assets/icons/percentageIcon.png';
import gotoIcon from '/public/assets/icons/gotoIcon.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setRouteSourceToLs } from '@/utilities/utils';
import { setTabType } from '@/store/slice/loginSlice';
import { couponDetailsInitialState } from '@/constants';
import { useAtom } from 'jotai';
import { couponList } from '@/features/CouponPage/context/atoms';
import { calculateCouponDiscount } from '@/utilities/utils';
import { validateCoupon } from '@/features/CouponPage/services/validateCoupon';
import { isCouponApplied } from '@/features/CouponPage/context/atoms';
import { cartItems } from '@/features/CartPage/context/atoms';
import { useCartStore } from '@/hooks/useCartStore';

const CouponSection = (props: any) => {
  const { setShowCouponList } = props;
  const { cart, actions } = useCartStore();
  const { couponDetails } = cart;
  const [couponsState] = useAtom(couponList);
  const [, setAppliedCoupon] = useAtom(isCouponApplied);
  const [cartItemsList] = useAtom(cartItems);
  console.log(couponDetails);
  const { setCartTabType, setCouponDetails, setDiscountAmount } = actions;
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  // Calculate the live discount amount based on current cart total
  const liveDiscount = React.useMemo(() => {
    if (couponDetails && couponDetails.code) {
      return calculateCouponDiscount(cart.totalPrice, couponDetails) || 0;
    }
    return 0;
  }, [cart.totalPrice, couponDetails]);

  const handleAddCoupon = () => {
    const hasFreeItem = cart.items.some((item: any) => item.isFreeItem);
    if (hasFreeItem) {
      props.onShowToast?.('Please remove free items to apply coupon');
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
    setAppliedCoupon((prev: any) => ({ ...prev, isApplied: false, coupon: null }));
  };

  const bestCoupon = React.useMemo(() => {
    if (!couponsState.coupons || couponsState.coupons.length === 0) return null;

    // Filter only those that satisfy min_cart_value
    const validCoupons = couponsState.coupons.filter((c: any) => cart.totalPrice >= (c.min_cart_value || 0));

    if (validCoupons.length === 0) return null;

    return validCoupons.reduce((best: any, current: any) => {
      const currentDiscount = calculateCouponDiscount(cart.totalPrice, current) || 0;
      const bestDiscount = calculateCouponDiscount(cart.totalPrice, best) || 0;
      return currentDiscount > bestDiscount ? current : best;
    }, validCoupons[0]);
  }, [couponsState.coupons, cart.totalPrice]);

  const handleApplyBestCoupon = async (coupon: any) => {
    const hasFreeItem = cart.items.some((item: any) => item.isFreeItem);
    if (hasFreeItem) {
      props.onShowToast?.('Please remove free items to apply coupon');
      return;
    }

    const payload = {
      code: coupon.code,
      items: cart.items
        .map((item: any) => ({
          item_code: item.item_code,
          uom: item.multiple_uoms
            .filter((uom: any) => !uom.is_not_discounted)
            .map((uom: any) => ({
              variant_id: uom.variant_id,
              qty: uom.cart_quantity
            }))
        }))
        .filter((item: any) => item.uom.length > 0)
    };

    const success = await validateCoupon(payload, setAppliedCoupon);
    if (success) {
      // Keep the original coupon object so recalculation works (especially for percentage type)
      dispatch(setCouponDetails({ ...coupon }));
      dispatch(setDiscountAmount(Math.round(calculateCouponDiscount(cart.totalPrice, coupon) || 0)));
    }
  };

  return (
    // <></>
    <div className=" bg-[#F2EEE44D]  flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] mob:pb-[2vw] pb-[.6vw] font-bold text-black">
        Save with coupons
      </h3>

      {couponDetails.name === '' || !couponDetails.name ? (
        bestCoupon ? (
          <div className="flex flex-col gap-[1vw] mob:gap-[4vw]">
            <div className="flex items-center justify-between border border-[#F2EEE4] bg-white p-[1vw] rounded-[1.2vw] mob:p-[4vw] mob:rounded-[4vw]">
              <div className="flex gap-[.798vw] mob:gap-[3vw] items-center">
                <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[10vw] mob:h-[10vw] flex-shrink-0">
                  <Image src={percentageIcon} alt="percentage icon" fill />
                </div>
                <div className="flex flex-col">
                  <p className="font-[SofiaPro] text-[1vw] mob:text-[3.5vw] font-semibold text-black">
                    Save ₹{Math.round(calculateCouponDiscount(cart.totalPrice, bestCoupon) || 0)} on this order
                  </p>
                  <p className="font-[SofiaPro] text-[.8vw] mob:text-[3vw] font-medium text-black">
                    {bestCoupon.code} •{' '}
                    {bestCoupon.discount_type === 'percentage'
                      ? `${bestCoupon.discount}% off up to ₹${bestCoupon.max_cart_value || 0}`
                      : bestCoupon.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleApplyBestCoupon(bestCoupon)}
                className="bg-secondary rounded-full text-white py-[.5vw] mob:py-[1.4vw] mob:px-[4.5vw] px-[1.3vw] font-[SofiaPro] font-bold mob:text-[3vw] text-[.83vw]"
              >
                APPLY
              </button>
            </div>

            <button onClick={() => handleAddCoupon()} className="flex items-center justify-center gap-2 py-1">
              <p className="font-[SofiaPro] text-[.9vw] mob:text-[3.5vw] font-bold text-black border-b border-black">
                View all coupons
              </p>
              <div className="relative w-[1vw] h-[1vw] mob:w-[4vw] mob:h-[4vw]">
                <Image src={gotoIcon} alt="go to" fill className="opacity-60" />
              </div>
            </button>
          </div>
        ) : (
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
              </div>
            </div>
            <div className="relative w-[1.25vw] h-[1.25vw] mob:w-[5vw] mob:h-[5vw]   ">
              <Image src={gotoIcon} alt="percentage icon" fill />{' '}
            </div>
          </button>
        )
      ) : (
        <div className="flex  items-center justify-between border border-secondary bg-[#25874D1A] p-[.83vw] mob:p-[3vw] rounded-[1.1vw] mob:rounded-[3.6vw] ">
          <div className="flex gap-[.798vw] mob:gap-[3vw] items-center">
            <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[10vw] mob:h-[10vw]  ">
              <Image src={percentageIcon} alt="percentage icon" fill />{' '}
            </div>
            <div className="">
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold  ">
                Applied Coupon '{couponDetails.name}'
              </p>
              <p className="font-[SofiaPro] text-[.78vw] mob:text-[3vw] font-regular ">
                You Saved ₹{Math.round(liveDiscount)} on this order
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

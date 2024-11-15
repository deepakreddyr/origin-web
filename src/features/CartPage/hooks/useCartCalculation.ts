import { useAtom } from 'jotai';
import React from 'react';

import { isCouponApplied } from '../../CouponPage/context/atoms';
import {
  cartAtom,
  cartItems,
  checkoutExtraDetailsAtom,
} from '../context/atoms';

export default function useCartCalculation() {
  const [cartItemsDetails] = useAtom(cartItems);
  const [appliedCoupon] = useAtom(isCouponApplied);
  const [cart] = useAtom(cartAtom);
  const [checkoutExtraDetails] = useAtom(checkoutExtraDetailsAtom);

  const getCouponDetails = () => {
    if (
      appliedCoupon.isApplied &&
      Array.isArray(appliedCoupon.coupon) &&
      appliedCoupon.coupon.length > 0
    ) {
      return appliedCoupon.coupon[0];
    }
    return null;
  };

  const subTotal = React.useMemo(() => {
    if (!(cartItemsDetails && Array.isArray(cartItemsDetails))) return 0;
    let totalPrice: number = 0;
    cartItemsDetails.forEach((item: any) => {
      item.uom.forEach((uom: any) => {
        totalPrice += uom.qty * uom.price;
      });
    });
    return totalPrice;
  }, [cartItemsDetails]);

  const totalSavings = React.useMemo(() => {
    if (!(cartItemsDetails && Array.isArray(cartItemsDetails))) return 0;
    let marketPrice: number = 0;
    cartItemsDetails.forEach((item: any) => {
      item.multiple_uoms.forEach((uom: any) => {
        marketPrice +=
          uom.qty *
          (!!uom.market_price && uom.market_price > 0
            ? uom.market_price
            : uom.price);
      });
    });
    if (marketPrice > subTotal) return marketPrice - subTotal;
    return 0;
  }, [cartItemsDetails]);

  const couponDiscount = React.useMemo(() => {
    if (!(cartItemsDetails && Array.isArray(cartItemsDetails))) return 0;

    let couponDiscountedPrice: number = 0;

    if (
      appliedCoupon.isApplied &&
      Array.isArray(appliedCoupon.coupon) &&
      appliedCoupon.coupon.length > 0
    ) {
      const coupon = appliedCoupon.coupon[0];
      switch (coupon.discount_type) {
        case 'fixed': {
          couponDiscountedPrice += coupon.discount;
          break;
        }
        case 'percentage': {
          couponDiscountedPrice += (coupon.discount * subTotal) / 100;
          break;
        }
        default:
          break;
      }
    }

    return couponDiscountedPrice;
  }, [cartItemsDetails, appliedCoupon, subTotal]);

  const rewardsDiscount = React.useMemo(() => {
    if (!(cartItemsDetails && Array.isArray(cartItemsDetails))) return 0;

    if (
      !(
        checkoutExtraDetails.isRewardsEnabledInCart &&
        cart.cart?.reward_enabled &&
        cart.cart?.max_redeemable_rewards
      )
    )
      return 0;

    return cart.cart.max_redeemable_rewards;
  }, [cartItemsDetails, checkoutExtraDetails, cart]);

  const total = React.useMemo(() => {
    if (!(cartItemsDetails && Array.isArray(cartItemsDetails))) return 0;
    return subTotal - couponDiscount - rewardsDiscount;
  }, [cartItemsDetails, couponDiscount, subTotal, rewardsDiscount]);

  return {
    total,
    subTotal,
    couponDiscount,
    rewardsDiscount,
    totalSavings,
    isCouponApplied: !!(appliedCoupon.isApplied && appliedCoupon.coupon),
    getCouponDetails,
  };
}

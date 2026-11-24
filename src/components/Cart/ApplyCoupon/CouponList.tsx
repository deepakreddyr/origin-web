import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { calculateCouponDiscount, getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { setAmountToPay, setCouponDetails, setDiscountAmount, setTotalPrice } from '@/store/slice/CartSlice';
import {
  setMangoAmountToPay,
  setMangoCouponDetails,
  setMangoDiscountAmount,
  setMangoTotalPrice
} from '@/store/slice/MangoCartSlice';
import { useCartStore } from '@/hooks/useCartStore';
import { COUPON_TABS, couponDetailsInitialState } from '@/constants';
import { setCouponId } from '@/store/slice/placeOrderDetails';
import CouponListSkeleton from '@/components/skeletonLoaders/cart/CouponListSkeleton';
import ApplyCouponInput from './ApplyCouponInput';
import { useAtom } from 'jotai';
import { couponList } from '@/features/CouponPage/context/atoms';
import Coupon from './Coupon';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

const CouponList = (props: any) => {
  const { setCouponsTab, error, setError } = props;
  const { cart, actions } = useCartStore();
  const { setAmountToPay, setCouponDetails, setDiscountAmount, setTotalPrice } = actions;

  const getDataFromApi = useGetDataFromApi();
  const [couponsState, setCouponsState] = useAtom(couponList);
  const couponListItems = couponsState.coupons || [];
  const loading = couponsState.loading;
  const sendDataToApi = useSendDataToApi();
  const dispatch = useDispatch();
  const [manuallyAppliedCoupon, setManuallyAppliedCoupon] = useState('');

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCoupons'] + `?sub_total=${cart.totalPrice}`;

    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      setCouponsState((prev) => ({ ...prev, coupons: data.data, success: true, loading: false }));
    };

    const failureHandler = () => {
      setCouponsState((prev) => ({ ...prev, coupons: [], error: true, loading: false }));
    };

    if (!couponsState.coupons || couponsState.coupons.length === 0) {
      setCouponsState((prev) => ({ ...prev, loading: true }));
    }
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [cart.totalPrice, cart.couponDetails?.code]);

  const validateCoupon = (couponCode: string) => {
    const hasFreeItem = cart.items.some((item: any) => item.isFreeItem);
    if (hasFreeItem) {
      props.onShowToast?.('Please remove free items to apply coupon');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['validateCoupon'];

    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (response: any) => {
      const couponData = response?.data[0];
      const isValid = couponData?.isValid === 1;

      if (isValid) {
        // Apply success results to both carts to keep them in sync
        dispatch(setCouponDetails({ ...couponData }));
        dispatch(setMangoCouponDetails({ ...couponData }));

        // Recalculate discount based on current cart
        const discountValue = Math.round(calculateCouponDiscount(cart.totalPrice, couponData) || 0);
        dispatch(setDiscountAmount(discountValue));
        dispatch(setMangoDiscountAmount(discountValue));

        // Re-calculate to pay
        const finalAmount = Math.max(0, cart.totalPrice - discountValue);
        dispatch(setAmountToPay(finalAmount));
        dispatch(setMangoAmountToPay(finalAmount));

        props.onCouponApplied?.(couponCode);
        setError(false);
        dispatch(setCouponId(couponData.id));

        const disountedAmount = calculateCouponDiscount(cart.totalPrice, couponData);
        const finalCartAmount = cart.totalPrice - disountedAmount;

        dispatch(setDiscountAmount(Math.round(disountedAmount)));
        dispatch(setAmountToPay(finalCartAmount));

        // Track applied coupon
        trackEvent(AnalyticsEvents.APPLIED_COUPON, {
          coupon_name: couponCode,
          min_cart_value: couponData?.min_cart_value || 0
        });
      } else {
        setError(true);
      }

      setCouponsTab(COUPON_TABS.COUPON_APPLIED);
    };

    const failureHandler = () => {
      setError(true); // ❌ API failure, show error
      setCouponsTab(COUPON_TABS.COUPON_APPLIED);
    };

    const cartItems = prepareCartItemsToApi(cart.items);
    const apiData = {
      items: cartItems?.items || [],
      code: couponCode
    };

    sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  if (loading) return <CouponListSkeleton />;

  return (
    <div>
      <div>
        <ApplyCouponInput
          manuallyAppliedCoupon={manuallyAppliedCoupon}
          setManuallyAppliedCoupon={setManuallyAppliedCoupon}
          validateCoupon={validateCoupon}
        />
      </div>
      <ul className="pl-0">
        {couponListItems.length > 0 && (
          <li className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw] border-t mt-[1.1vw] mob:mt-[4.1vw] mob:first:pt-[4.1vw] first:pt-[1.1vw]">
            {couponListItems.map((data: any) => (
              <Coupon
                key={data.id}
                validateCoupon={validateCoupon}
                couponDetailsFromList={data}
                setCouponsTab={setCouponsTab}
              />
            ))}
          </li>
        )}
      </ul>
    </div>
  );
};

export default CouponList;

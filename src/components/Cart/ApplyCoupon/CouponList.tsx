import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { calculateCouponDiscount, getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { setAmountToPay, setCouponDetails, setDiscountAmount, setTotalPrice } from '@/store/slice/CartSlice';
import { useCartStore } from '@/hooks/useCartStore';
import { COUPON_TABS } from '@/constants';
import { setCouponId } from '@/store/slice/placeOrderDetails';
import CouponListSkeleton from '@/components/skeletonLoaders/cart/CouponListSkeleton';
import ApplyCouponInput from './ApplyCouponInput';
import Coupon from './Coupon';

const CouponList = (props: any) => {
  const { setCouponsTab, error, setError } = props;
  const { cart, actions } = useCartStore();
  const { setAmountToPay, setCouponDetails, setDiscountAmount, setTotalPrice } = actions;

  const getDataFromApi = useGetDataFromApi();
  const [couponList, setCouponList] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const sendDataToApi = useSendDataToApi();
  const dispatch = useDispatch();
  const [manuallyAppliedCoupon, setManuallyAppliedCoupon] = useState('');

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCoupons'] + `?sub_total=${cart.totalPrice}`;

    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      setCouponList(data.data);
      setIsLoading(false);
    };

    const failureHandler = () => {
      setIsLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, []);

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
        setError(false); // ✅ Clear error if coupon is valid

        dispatch(setCouponDetails({ ...couponData }));
        dispatch(setCouponId(couponData.id));

        const disountedAmount = calculateCouponDiscount(cart.totalPrice, couponData);
        const finalCartAmount = cart.totalPrice - disountedAmount;

        dispatch(setDiscountAmount(Math.round(disountedAmount)));
        dispatch(setAmountToPay(finalCartAmount));
      } else {
        setError(true); // ❌ Coupon invalid
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
        {couponList.length > 0 && (
          <li className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw] border-t mt-[1.1vw] mob:mt-[4.1vw] mob:first:pt-[4.1vw] first:pt-[1.1vw]">
            {couponList.map((data: any) => (
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

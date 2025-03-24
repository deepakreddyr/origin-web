import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { calculateCouponDiscount, getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplyCouponInput from './ApplyCouponInput';
import Coupon from './Coupon';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { setAmountToPay, setCouponDetails, setDiscountAmount, setTotalPrice } from '@/store/slice/CartSlice';
import { COUPON_TABS } from '@/constants';
import { setCouponId } from '@/store/slice/placeOrderDetails';
import CouponListSkeleton from '@/components/skeletonLoaders/cart/CouponListSkeleton';

const CouponList = (props: any) => {
  const { setCouponsTab, error, setError } = props;
  const cart = useSelector((state: any) => state.cart);
  const getDataFromApi = useGetDataFromApi();
  const [couponList, setCouponList] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const sendDataToApi = useSendDataToApi();
  const dispatch = useDispatch();
  const [manuallyAppliedCoupon, setManuallyAppliedCoupon] = useState('');

  useEffect(() => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCoupons'] + `?sub_total=${cart.totalPrice}`;

    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {
      setCouponList(data.data);
      setIsLoading(false);
    };
    const failureHandler = (data: any) => {
      setIsLoading(false);
    };
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, []);

  const validateCoupon = (couponCode: any) => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['validateCoupon'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (response: any) => {
      // coupon to be fixed
      if (response?.data) {
        dispatch(setCouponDetails({ ...response.data[0] }));
        dispatch(setCouponId(response.data[0].id));
        const disountedAmount = calculateCouponDiscount(cart.totalPrice, response.data[0]);
        let finalCartAmount = cart.totalPrice - disountedAmount;

        // console.log(disountedAmount);
        // console.log(finalCartAmount);

        dispatch(setDiscountAmount(Math.round(disountedAmount)));
        dispatch(setAmountToPay(finalCartAmount));
      }
      if (!response) {
        setError(true);
      }
      setCouponsTab(COUPON_TABS.COUPON_APPLIED);
    };
    const failureHandler = (response: any) => {
      setError(true);
    };
    let cartItems = prepareCartItemsToApi(cart.items);
    let apiData = { items: cartItems?.items, code: couponCode };
    sendDataToApi(apiUrl, apiData, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  if (loading) return <CouponListSkeleton />;
  return (
    <div>
      <div className="">
        <ApplyCouponInput
          manuallyAppliedCoupon={manuallyAppliedCoupon}
          setManuallyAppliedCoupon={setManuallyAppliedCoupon}
          validateCoupon={validateCoupon}
        />
      </div>
      <ul className="pl-0">
        {couponList.length > 0 && (
          <li className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw] border-t mt-[1.1vw] mob:mt-[4.1vw] mob:first:pt-[4.1vw] first:pt-[1.1vw] ">
            {couponList.map((data: any) => (
              <Coupon
                validateCoupon={validateCoupon}
                couponDetailsFromList={data}
                key={data.id}
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

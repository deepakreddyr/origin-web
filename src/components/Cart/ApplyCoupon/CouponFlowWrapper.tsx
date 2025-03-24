import React, { useState } from 'react';
import CouponList from './CouponList';
import CouponAppliedModal from './CouponAppliedModal';
import { COUPON_TABS } from '@/constants';

const CouponFlowWrapper = (props: any) => {
  const { setShowCouponList } = props;
  const [couponsTab, setCouponsTab] = useState(COUPON_TABS['COUPON_LIST']);
  const [error, setError] = useState(false);
  const SCREEN_MAP: any = {
    COUPON_LIST: <CouponList setCouponsTab={setCouponsTab} error={error} setError={setError} />,
    COUPON_APPLIED: <CouponAppliedModal setShowCouponList={setShowCouponList} error={error} setError={setError} />
  };
  return <div>{SCREEN_MAP[couponsTab]}</div>;
};

export default CouponFlowWrapper;

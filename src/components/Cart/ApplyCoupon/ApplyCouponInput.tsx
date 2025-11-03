import React from 'react';

const ApplyCouponInput = (props: any) => {
  const { manuallyAppliedCoupon, validateCoupon, setManuallyAppliedCoupon } = props;
  return (
    <div className="">
      <div className="mb-[1.1vw] mob:mb-[4.1vw]  flex pr-[1.1vw] mob:pr-[4.1vw] bg-primary-100 rounded-full ">
        <input
          onChange={(e) => setManuallyAppliedCoupon(e.target.value)}
          className="h-[3.2vw] mob:h-[12vw] p-[1.1vw] mob:p-[4.1vw] text-[.97vw] mob:text-[3.6vw] font-[SofiaPro] placeholder: w-full bg-primary-100 rounded-full outline-none "
          type="text"
          placeholder="Enter Coupon Code"
        />
        <button
          onClick={() => validateCoupon(manuallyAppliedCoupon)}
          className="font-[SofiaPro] text-secondary text-[.97vw] mob:text-[3.6vw] font-semibold "
        >
          APPLY
        </button>
      </div>
    </div>
  );
};

export default ApplyCouponInput;

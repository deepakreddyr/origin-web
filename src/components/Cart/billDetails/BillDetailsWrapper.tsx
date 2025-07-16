import { couponDetailsInitialState } from '@/constants';
import {
  setAmountToPay,
  setCouponDetails,
  setDiscountAmount,
  setIsProceedButtonEnabled
} from '@/store/slice/CartSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BillDetailsWrapper = (props: any) => {
  const { billDetails } = props;
  const cart = useSelector((state: any) => state.cart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();

  useEffect(() => {
    let amountTobePaid;
    const { totalPrice, amountToPay, discountAmount } = cart;
    if (billDetails.delivery_charge > 0) {
      amountTobePaid = totalPrice + billDetails.delivery_charge;
    } else {
      amountTobePaid = totalPrice;
    }
    if (couponDetails.code && couponDetails.isValid === 1) {
      if (amountToPay < couponDetails.min_cart_value) {
        amountTobePaid = amountTobePaid + discountAmount;
        dispatch(setDiscountAmount(0));
        dispatch(setCouponDetails(couponDetailsInitialState));
        return;
      } else {
        amountTobePaid = amountTobePaid - discountAmount;
      }
    }
    dispatch(setIsProceedButtonEnabled(amountTobePaid > cart.cart_minimum));
    dispatch(setAmountToPay(amountTobePaid));
    localStorage.setItem('total_to_pay', cart.amountToPay);
  }, [couponDetails, cart, billDetails]);

  const remainingAmount = billDetails.cart_minimum
    ? Number(billDetails.cart_minimum) - cart.amountToPay
    : 0;

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[stinger] text-[1.1vw] mob:text-[4.1vw] mob:pb-[1.5vw] pb-[.6vw] font-semibold text-[#231F20CC]">
        Bill details
      </h3>
      <ul className="p-0 flex flex-col mob:gap-[1vw] gap-[.3vw]">
        <li>
          <div className="flex items-center text-black justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Item total</p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">₹{cart.totalOriginalPrice}</p>
          </div>
        </li>

        {cart.totalOriginalPrice - cart.totalPrice > 0 && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Savings</p>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                ₹{cart.totalOriginalPrice - cart.totalPrice}
              </p>
            </div>
          </li>
        )}

        {cart.discountAmount > 0 && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Coupon used</p>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                ₹{Math.round(cart.discountAmount)}
              </p>
            </div>
          </li>
        )}

        <li>
          <div className="flex items-center text-secondary justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Delivery fee</p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
              {billDetails.free_delivery_charge && (
                <span className="text-black-op-60 font-regular line-through">
                  ₹{billDetails.free_delivery_charge}
                </span>
              )}{' '}
              {billDetails.delivery_charge === 0 ? 'FREE' : `₹${billDetails.delivery_charge}`}
            </p>
          </div>
        </li>

        <li>
          <div className="flex items-center text-black justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">To Pay</p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">₹{cart.amountToPay}</p>
          </div>
        </li>
      </ul>

      {billDetails.cart_minimum &&
      Number(billDetails.cart_minimum) > 0 &&
      cart.amountToPay < billDetails.cart_minimum && (
        <div className="font-[SofiaPro] font-bold bg-green-50 border border-green-200 rounded-md p-3 mt-3">
          {/* <p className="font-[SofiaPro] font-bold text-green-800 font-semibold text-sm">
            You're almost there! 🎉
          </p> */}
          <p className="font-[SofiaPro] font-bold text-green-700 text-sm mt-1">
            Add <span className="font-[SofiaPro] font-bold font-bold">₹{remainingAmount}</span> more to reach the minimum order!
          </p>
        </div>
    )}
    </div>
  );
};

export default BillDetailsWrapper;

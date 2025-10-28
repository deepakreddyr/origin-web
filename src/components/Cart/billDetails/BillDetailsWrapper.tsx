import { couponDetailsInitialState } from '@/constants';
import {
  setAmountToPay,
  setCouponDetails,
  setDiscountAmount,
  setIsProceedButtonEnabled
} from '@/store/slice/CartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, IconButton, useMediaQuery } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const BillDetailsWrapper = (props: any) => {
  const { billDetails } = props;
  const cart = useSelector((state: any) => state.cart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Function to calculate delivery fee based on distance_delivery_fees
  const calculateDeliveryFee = () => {
    // If distance_delivery_fees is not present, use default delivery_charge
    if (!billDetails.distance_delivery_fees || !Array.isArray(billDetails.distance_delivery_fees)) {
      return billDetails.delivery_charge;
    }

    const cartValue = cart.totalPrice;

    // Find the matching fee tier based on cart value
    const matchingTier = billDetails.distance_delivery_fees.find((tier: any) => {
      const fromAmount = parseFloat(tier.from_amount);
      const toAmount = parseFloat(tier.to_amount);
      return cartValue >= fromAmount && cartValue <= toAmount;
    });

    // If a matching tier is found, return its value, otherwise use default delivery_charge
    if (matchingTier) {
      return parseFloat(matchingTier.value);
    }

    return billDetails.delivery_charge;
  };

  useEffect(() => {
    let amountTobePaid;
    const { totalPrice, amountToPay, discountAmount } = cart;
    
    // Calculate dynamic delivery fee
    const deliveryFee = calculateDeliveryFee();
    
    if (deliveryFee > 0) {
      amountTobePaid = totalPrice + deliveryFee;
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
  }, [couponDetails, cart, billDetails, dispatch]);

  const remainingAmount = billDetails.cart_minimum
    ? Number(billDetails.cart_minimum) - cart.amountToPay
    : 0;

  const handleTooltipToggle = () => {
    if (isMobile) {
      setTooltipOpen((prev) => !prev);
      setTimeout(() => setTooltipOpen(false), 2000);
    }
  };

  const handleTooltipOpen = () => {
    if (!isMobile) setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    if (!isMobile) setTooltipOpen(false);
  };

  // Get the current delivery fee to display
  const currentDeliveryFee = calculateDeliveryFee();

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] mob:pb-[1.5vw] pb-[.6vw] font-semibold text-[#231F20CC]">
        Bill details
      </h3>
      <ul className="p-0 flex flex-col mob:gap-[1vw] gap-[.3vw]">
        <li>
          <div className="flex items-center text-black justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw] flex items-center gap-[0.4vw]">
              Item total
            </p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
              ₹{cart.totalOriginalPrice}
            </p>
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

        {localStorage.getItem("user_token") && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Delivery fee</p>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                {billDetails.free_delivery_charge && (
                  <span className="text-black-op-60 font-regular line-through">
                    ₹{billDetails.free_delivery_charge}
                  </span>
                )}{' '}
                {currentDeliveryFee === 0 ? 'FREE' : `₹${currentDeliveryFee}`}
              </p>
            </div>
          </li>
        )}

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
            <p className="font-[SofiaPro] font-bold text-green-700 text-sm mt-1">
              Add <span className="font-[SofiaPro] font-bold">₹{remainingAmount}</span> more to reach the minimum order!
            </p>
          </div>
        )}
    </div>
  );
};

export default BillDetailsWrapper;
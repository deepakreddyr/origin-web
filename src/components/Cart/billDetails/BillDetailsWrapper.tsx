import { couponDetailsInitialState } from '@/constants';
import {
  setAmountToPay,
  setCouponDetails,
  setDiscountAmount,
  setIsProceedButtonEnabled,
  setDeliveryFee
} from '@/store/slice/CartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, IconButton, useMediaQuery } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { calculateCouponDiscount } from '@/utilities/utils';

const BillDetailsWrapper = (props: any) => {
  const { billDetails, isSubscription = false } = props;
  const cart = useSelector((state: any) => state.cart);
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);
  const { couponDetails } = cart;
  const dispatch = useDispatch();

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Function to calculate delivery fee based on distance_delivery_fees
  const calculateDeliveryFee = () => {
    // If distance_delivery_fees is not present, use default delivery_charge
    if (!billDetails.distance_delivery_fees || !Array.isArray(billDetails.distance_delivery_fees)) {
      return billDetails.delivery_charge || 0;
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

    return billDetails.delivery_charge || 0;
  };

  // Function to get the free delivery threshold
  const getFreeDeliveryThreshold = () => {
    if (!billDetails.distance_delivery_fees || !Array.isArray(billDetails.distance_delivery_fees)) {
      return null;
    }

    // Find the tier where delivery is free (value is 0)
    const freeTier = billDetails.distance_delivery_fees.find((tier: any) => {
      return parseFloat(tier.value) === 0;
    });

    if (freeTier) {
      return parseFloat(freeTier.from_amount);
    }

    // If no free tier exists, find the highest to_amount + 1 (next threshold for potential free delivery)
    const sortedTiers = [...billDetails.distance_delivery_fees].sort(
      (a, b) => parseFloat(b.to_amount) - parseFloat(a.to_amount)
    );

    if (sortedTiers.length > 0) {
      const highestTier = sortedTiers[0];
      // Return the next tier threshold (to_amount + 0.01 rounded up)
      return Math.ceil(parseFloat(highestTier.to_amount)) + 1;
    }

    return null;
  };

  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSubscription) return; // Skip updating normal cart state in subscription mode

    // Calculate dynamic delivery fee
    const deliveryFee = calculateDeliveryFee();
    dispatch(setDeliveryFee(deliveryFee));

    // Calculate current live discount based on subtotal
    const currentDiscount =
      couponDetails.code && couponDetails.isValid === 1
        ? calculateCouponDiscount(cart.totalPrice, couponDetails) || 0
        : 0;

    const roundedDiscount = Math.round(currentDiscount);

    // Initial calculation (Subtotal + Delivery - Discount)
    let finalAmountToPay = cart.totalPrice - roundedDiscount + deliveryFee;

    // Validate if the coupon minimum cart value is still met
    if (couponDetails.code && couponDetails.isValid === 1) {
      if (cart.totalPrice < (couponDetails.min_cart_value || 0)) {
        // If below minimum, reset coupon and revert the discount
        finalAmountToPay = cart.totalPrice + deliveryFee;
        dispatch(setDiscountAmount(0));
        dispatch(setCouponDetails(couponDetailsInitialState));
        dispatch(setIsProceedButtonEnabled(finalAmountToPay >= (cart.cart_minimum || 0)));
        dispatch(setAmountToPay(finalAmountToPay));
        return;
      }
    }

    dispatch(setIsProceedButtonEnabled(finalAmountToPay >= (cart.cart_minimum || 0)));
    dispatch(setAmountToPay(finalAmountToPay));

    // Sync the discount amount back to the state
    if (roundedDiscount !== cart.discountAmount) {
      dispatch(setDiscountAmount(roundedDiscount));
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('total_to_pay', String(finalAmountToPay));
    }
  }, [couponDetails, cart, billDetails, dispatch, isSubscription]);

  const remainingAmount = cart.cart_minimum ? Number(cart.cart_minimum) - cart.amountToPay : 0;

  const handleTooltipToggle = () => {
    if (isMobile) {
      setTooltipOpen((prev) => !prev);
      setTimeout(() => setTooltipOpen(false), 3000);
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
  const freeDeliveryThreshold = getFreeDeliveryThreshold();

  // Check if info icon should be shown - only when there's a delivery fee
  const shouldShowInfo = currentDeliveryFee > 0 && freeDeliveryThreshold;

  const isLoggedIn = mounted && loginDetails.user;

  return (
    <div className="bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[4.1vw] rounded-[1.1vw]">
      <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] mob:pb-[1.5vw] pb-[.6vw] font-bold text-[#231F20]">
        Bill details
      </h3>
      <ul className="p-0 flex flex-col mob:gap-[1vw] gap-[.3vw]">
        <li>
          <div className="flex items-center text-black justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw] flex items-center gap-[0.4vw]">
              Item total
            </p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
              ₹{isSubscription ? subscriptionCart.totalPrice : cart.totalOriginalPrice}
            </p>
          </div>
        </li>

        {cart.totalOriginalPrice - cart.totalPrice > 0 && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Savings</p>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                - ₹{cart.totalOriginalPrice - cart.totalPrice}
              </p>
            </div>
          </li>
        )}

        {cart.discountAmount > 0 && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Coupon used</p>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                - ₹{Math.round(cart.discountAmount)}
              </p>
            </div>
          </li>
        )}

        {isLoggedIn && (
          <li>
            <div className="flex items-center text-secondary justify-between">
              <div className="flex items-center gap-[0.3vw] mob:gap-[1vw]">
                <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">Delivery fee</p>
                {shouldShowInfo && (
                  <Tooltip
                    title={
                      <div className="p-[0.5vw] mob:p-[2vw]">
                        <p className="font-[SofiaPro] font-semibold text-[0.9vw] mob:text-[3.5vw] mb-[0.3vw] mob:mb-[1vw]">
                          Details
                        </p>
                        <p className="font-[SofiaPro] font-bold text-[0.85vw] mob:text-[3.2vw] mb-[0.2vw] mob:mb-[0.8vw]">
                          You're outside our free delivery zone.
                        </p>
                        <p className="font-[SofiaPro] text-[0.8vw] mob:text-[3vw] opacity-80">
                          Order for ₹{freeDeliveryThreshold} or more for free delivery.
                        </p>
                      </div>
                    }
                    open={tooltipOpen}
                    onClose={handleTooltipClose}
                    onOpen={handleTooltipOpen}
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#231F20',
                          color: 'white',
                          fontSize: isMobile ? '3vw' : '0.8vw',
                          borderRadius: isMobile ? '2vw' : '0.5vw',
                          padding: isMobile ? '2vw' : '0.8vw',
                          maxWidth: isMobile ? '70vw' : '18vw',
                          '& .MuiTooltip-arrow': {
                            color: '#231F20'
                          }
                        }
                      }
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleTooltipToggle}
                      sx={{
                        padding: isMobile ? '1vw' : '0.2vw',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <InfoOutlinedIcon
                        sx={{
                          fontSize: isMobile ? '4vw' : '1.1vw',
                          color: '#231F20CC'
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
                {billDetails.free_delivery_charge && currentDeliveryFee > 0 && (
                  <span className="text-black-op-60 font-regular line-through mr-[0.3vw]">
                    ₹{billDetails.free_delivery_charge}
                  </span>
                )}
                {currentDeliveryFee === 0 ? <span className="text-secondary">FREE</span> : `₹${currentDeliveryFee}`}
              </p>
            </div>
          </li>
        )}

        <li>
          <div className="flex items-center text-black justify-between">
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">To Pay</p>
            <p className="font-[SofiaPro] font-bold mob:text-[3.6vw] text-[.97vw]">
              ₹{isSubscription ? subscriptionCart.totalPrice : cart.amountToPay}
            </p>
          </div>
        </li>
      </ul>

      {/* {Number(cart.cart_minimum) > 0 && cart.amountToPay < Number(cart.cart_minimum) && (
        <div className="font-[SofiaPro] font-bold bg-green-50 border border-green-200 rounded-md p-3 mt-3">
          <p className="font-[SofiaPro] font-bold text-green-700 text-sm mt-1">
            Add <span className="font-[SofiaPro] font-bold">₹{remainingAmount}</span> more to reach the minimum order!
          </p>
        </div>
      )} */}
    </div>
  );
};

export default BillDetailsWrapper;

import { Box, Typography } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAtom } from 'jotai';
import React from 'react';

import { cartAtom, cartItems, checkoutExtraDetailsAtom } from '../../../CartPage/context/atoms';
// import { isCouponApplied } from "../../../CouponPage/context/atoms";

const CartValue = () => {
  const [cartItemsDetails] = useAtom(cartItems);
  // const [appliedCoupon] = useAtom(isCouponApplied);
  const [cart] = useAtom(cartAtom);
  const [checkoutExtraDetails] = useAtom(checkoutExtraDetailsAtom);

  // const total = React.useMemo(() => {
  //   if (cartItemsDetails && Array.isArray(cartItemsDetails)) {
  //     // Calculate the total price
  //     let totalPrice: number = 0;

  //     cartItemsDetails.forEach((item: any) => {
  //       item.uom.forEach((uom: any) => {
  //         totalPrice += uom.qty * uom.price;
  //       });
  //     });

  //     if (appliedCoupon.isApplied && appliedCoupon.coupon) {
  //       switch (appliedCoupon.coupon.discount_type) {
  //         case "fixed": {
  //           totalPrice -= appliedCoupon.coupon.discount;
  //           break;
  //         }
  //         case "percentage": {
  //           totalPrice -= (appliedCoupon.coupon.discount * totalPrice) / 100;
  //           break;
  //         }
  //         default:
  //           break;
  //       }
  //     }

  //     if (
  //       checkoutExtraDetails.isRewardsEnabledInCart &&
  //       cart.cart?.reward_enabled &&
  //       cart.cart?.max_redeemable_rewards
  //     ) {
  //       totalPrice -= cart.cart.max_redeemable_rewards;
  //     }

  //     return totalPrice;
  //   }
  //   return 0;
  // }, [cartItemsDetails, appliedCoupon, checkoutExtraDetails, cart]);

  return (
    <Box
      className="sidebar-info"
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        borderRadius: '0px 0px 12px 12px',
        border: '1px solid #EAE5CF',
        backgroundColor: '#FBF4E5',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        gap: 2
      }}
    >
      {/* to be uncommented */}
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "rgba(0, 0, 0, 0.70)",
            fontWeight: "normal",
          }}
        >
          TOTAL ITEMS
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: "700",
            fontFamily: "Roboto Mono",
          }}
        >
          {cartItemsDetails.length} items
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "rgba(0, 0, 0, 0.70)",
            fontWeight: "normal",
          }}
        >
          FINAL AMOUNT
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: "700",
            fontFamily: "Roboto Mono",
          }}
        >
          ₹{total}
        </Typography>
      </Box> */}
    </Box>
  );
};

export default CartValue;

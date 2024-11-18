import { Box, Checkbox, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

import { isCouponApplied } from '@/features/CouponPage/context/atoms';

import Coin from '../../assets/coin.png';
import { cartAtom, cartItems, checkoutExtraDetailsAtom } from '../../context/atoms';
import styles from './style.module.css';

const CartRewards = () => {
  const [cartItemsDetails] = useAtom(cartItems);
  const [appliedCoupon] = useAtom(isCouponApplied);
  const [cart] = useAtom(cartAtom);
  const [checkoutExtraDetails, setCheckoutExtraDetails] = useAtom(checkoutExtraDetailsAtom);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setChecked(event.target.checked);
    setCheckoutExtraDetails((prevState) => ({
      ...prevState,
      isRewardsEnabledInCart: event.target.checked
    }));
  };

  const total = React.useMemo(() => {
    if (cartItemsDetails && Array.isArray(cartItemsDetails)) {
      // Calculate the total price
      let totalPrice: number = 0;

      cartItemsDetails.forEach((item: any) => {
        item.uom.forEach((uom: any) => {
          totalPrice += uom.qty * uom.price;
        });
      });

      if (appliedCoupon.isApplied && appliedCoupon.coupon) {
        switch (appliedCoupon.coupon.discount_type) {
          case 'fixed': {
            totalPrice -= appliedCoupon.coupon.discount;
            break;
          }
          case 'percentage': {
            totalPrice -= (appliedCoupon.coupon.discount * totalPrice) / 100;
            break;
          }
          default:
            break;
        }
      }

      if (
        checkoutExtraDetails.isRewardsEnabledInCart &&
        cart.cart?.reward_enabled &&
        cart.cart?.max_redeemable_rewards
      ) {
        totalPrice -= cart.cart.max_redeemable_rewards;
      }

      return totalPrice;
    }
    return 0;
  }, [cartItemsDetails, appliedCoupon, checkoutExtraDetails, cart]);

  const rewardBalance = cart.cart?.reward_balance ?? 0;
  const maxRedeemableRewards = cart.cart?.max_redeemable_rewards ?? 0;

  const remainingRewardBalance = rewardBalance - maxRedeemableRewards;

  if (!cart.cart?.reward_enabled) return <></>;

  return (
    <Box className={styles.rewards}>
      <Box className={styles['checkbox-reward']}>
        <Checkbox checked={checkoutExtraDetails.isRewardsEnabledInCart} onChange={handleChange} />
        <Typography className={styles['unlock-text']}>Unlock Rewards {total}</Typography>
      </Box>
      <Box className={styles['balance-container']}>
        <Typography className={styles['balance-text']}>Balance</Typography>
        <Box className={styles['coin-container']}>
          <Image className={styles['coin-img']} src={Coin} alt="coin" />
          {checkoutExtraDetails.isRewardsEnabledInCart ? (
            <Typography className={styles['coin-text']}>{remainingRewardBalance}</Typography>
          ) : (
            <Typography className={styles['coin-text']}>{cart.cart?.reward_balance}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CartRewards;

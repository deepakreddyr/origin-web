import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import * as cartActions from '@/store/slice/CartSlice';
import * as mangoCartActions from '@/store/slice/MangoCartSlice';

export const useCartStore = () => {
  const router = useRouter();
  const isMangoPage = router.pathname.startsWith('/mango');

  const cart = useSelector((state: any) => (isMangoPage ? state.mangoCart : state.cart));
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);

  // Return the appropriate actions based on the current page
  const actions = React.useMemo(
    () =>
      isMangoPage
        ? {
            addItemToCart: mangoCartActions.addMangoItemToCart,
            increaseQuantity: mangoCartActions.increaseMangoQuantity,
            decreaseQuantity: mangoCartActions.decreaseMangoQuantity,
            removeItemFromCart: mangoCartActions.removeMangoItemFromCart,
            clearCart: mangoCartActions.clearMangoCart,
            setCartItems: mangoCartActions.setMangoCartItems,
            setCartTabType: mangoCartActions.setMangoCartTabType,
            setCouponDetails: mangoCartActions.setMangoCouponDetails,
            resetCouponDetails: mangoCartActions.resetMangoCouponDetails,
            setTotalPrice: mangoCartActions.setMangoTotalPrice,
            setAmountToPay: mangoCartActions.setMangoAmountToPay,
            setDiscountAmount: mangoCartActions.setMangoDiscountAmount,
            setIsProceedButtonEnabled: mangoCartActions.setIsMangoProceedButtonEnabled,
            setCartMinimum: mangoCartActions.setMangoCartMinimum,
            setDeliveryFee: mangoCartActions.setMangoDeliveryFee,
            validateAndCleanCart: mangoCartActions.validateAndCleanMangoCart,
            setFreeItems: mangoCartActions.setMangoFreeItems,
            addFreeItemToCart: mangoCartActions.addFreeMangoItemToCart,
            removeFreeItemFromCart: mangoCartActions.removeFreeMangoItemFromCart,
            setMaxQuantityError: mangoCartActions.setMangoMaxQuantityError
          }
        : {
            addItemToCart: cartActions.addItemToCart,
            increaseQuantity: cartActions.increaseQuantity,
            decreaseQuantity: cartActions.decreaseQuantity,
            removeItemFromCart: cartActions.removeItemFromCart,
            clearCart: cartActions.clearCart,
            setCartItems: cartActions.setCartItems,
            setCartTabType: cartActions.setCartTabType,
            setCouponDetails: cartActions.setCouponDetails,
            resetCouponDetails: cartActions.resetCouponDetails,
            setTotalPrice: cartActions.setTotalPrice,
            setAmountToPay: cartActions.setAmountToPay,
            setDiscountAmount: cartActions.setDiscountAmount,
            setIsProceedButtonEnabled: cartActions.setIsProceedButtonEnabled,
            setCartMinimum: cartActions.setCartMinimum,
            setDeliveryFee: cartActions.setDeliveryFee,
            validateAndCleanCart: cartActions.validateAndCleanCart,
            setFreeItems: cartActions.setFreeItems,
            addFreeItemToCart: cartActions.addFreeItemToCart,
            removeFreeItemFromCart: cartActions.removeFreeItemFromCart,
            setMaxQuantityError: cartActions.setMaxQuantityError
          },
    [isMangoPage]
  );

  return {
    cart,
    subscriptionCart,
    isMangoPage,
    actions
  };
};

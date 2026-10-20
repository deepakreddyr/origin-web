import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import * as cartActions from '@/store/slice/CartSlice';
import * as mangoCartActions from '@/store/slice/MangoCartSlice';

import * as subscriptionBoxCartActions from '@/store/slice/SubscriptionBoxCartSlice';

export const useCartStore = () => {
  const router = useRouter();
  const currentPath = router?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isMangoPage = Boolean(currentPath?.startsWith('/mango') || router?.asPath?.startsWith('/mango'));
  const isSubscriptionBoxPage = Boolean(
    currentPath?.startsWith('/subscriptionbox') || router?.asPath?.startsWith('/subscriptionbox')
  );
  const isSubscriptionPage = Boolean(currentPath === '/subscription' || router?.asPath?.startsWith('/subscription'));

  const cart = useSelector((state: any) => (isMangoPage ? state.mangoCart : state.cart));
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);
  const subscriptionBoxCart = useSelector((state: any) => state.subscriptionBoxCart);

  // Return the appropriate actions based on the current page
  const actions = isMangoPage
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
        setShowTimeslotSheet: mangoCartActions.setMangoShowTimeslotSheet,
        setOrderRestrictionData: mangoCartActions.setMangoOrderRestrictionData,
        setDeliveryFee: mangoCartActions.setMangoDeliveryFee,
        validateAndCleanCart: mangoCartActions.validateAndCleanMangoCart,
        setFreeItems: mangoCartActions.setMangoFreeItems,
        addFreeItemToCart: mangoCartActions.addFreeMangoItemToCart,
        removeFreeItemFromCart: mangoCartActions.removeFreeMangoItemFromCart,
        setMaxQuantityError: mangoCartActions.setMangoMaxQuantityError,
        setInstantMessage: mangoCartActions.setMangoInstantMessage
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
        setShowTimeslotSheet: cartActions.setShowTimeslotSheet,
        setOrderRestrictionData: cartActions.setOrderRestrictionData,
        setDeliveryFee: cartActions.setDeliveryFee,
        validateAndCleanCart: cartActions.validateAndCleanCart,
        setFreeItems: cartActions.setFreeItems,
        addFreeItemToCart: cartActions.addFreeItemToCart,
        removeFreeItemFromCart: cartActions.removeFreeItemFromCart,
        setMaxQuantityError: cartActions.setMaxQuantityError,
        setInstantMessage: cartActions.setInstantMessage
      };

  return {
    cart,
    subscriptionCart,
    subscriptionBoxCart,
    isMangoPage,
    isSubscriptionBoxPage,
    isSubscriptionPage,
    actions,
    subscriptionBoxCartActions
  };
};

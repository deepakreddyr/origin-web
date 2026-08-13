import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useCartStore } from '@/hooks/useCartStore';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { ADDRESS_ICON_MAP } from '@/utilities/maps';
import Image from 'next/image';
import { ChevronRight, ChevronDown } from 'lucide-react';
interface OrderRestrictionData {
  title: string;
  description: string;
  until: string;
  is_available: boolean;
}

interface ActionCtaWithItemsProps {
  btnName: string;
  handler: () => void;
  isDisabled: boolean;
  orderRestrictionData?: OrderRestrictionData | null;
  showAddressModal?: boolean;
  isSubscription?: boolean;
  cartMinimum?: number;
}

const ActionCtaWithItems: React.FC<ActionCtaWithItemsProps> = ({
  btnName,
  handler,
  isDisabled,
  orderRestrictionData,
  showAddressModal = false,
  isSubscription = false,
  cartMinimum = 0
}) => {
  const { cart, subscriptionCart, isMangoPage, actions } = useCartStore();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const [addressState] = useAtom(addressAtom);
  const dispatch = useDispatch();

  const [isOrderRestricted, setIsOrderRestricted] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);

  const recalcDisableState = useCallback(() => {
    let cartItemsFromLS: any[] = [];
    if (typeof window !== 'undefined') {
      const lsKey = isMangoPage ? 'mango_cart_items' : 'cart_items';
      const lsData = localStorage.getItem(lsKey);
      cartItemsFromLS = lsData ? JSON.parse(lsData) : [];
    }

    let disabled = false;

    if (isSubscription) {
      if (subscriptionCart?.item) {
        const item = subscriptionCart.item;
        if (item.quantity > item.max_qty) {
          disabled = true;
        }
      }
    } else {
      disabled =
        cartItemsFromLS.some((item: any) => {
          if (item.is_uom_available === false) return true;
          if (
            item.multiple_uoms?.some(
              (uom: any) =>
                uom.is_uom_available === false ||
                uom.is_available === false ||
                (uom.maximum_quantity > 0 && uom.cart_quantity > uom.maximum_quantity)
            )
          )
            return true;
          return false;
        }) ||
        cart?.items?.some((item: any) => {
          if (item.is_uom_available === false) return true;
          if (
            item.multiple_uoms?.some(
              (uom: any) =>
                uom.is_uom_available === false ||
                uom.is_available === false ||
                (uom.maximum_quantity > 0 && uom.cart_quantity > uom.maximum_quantity)
            )
          )
            return true;
          return false;
        });
    }

    setShouldDisable(disabled);
  }, [cart, isSubscription, subscriptionCart]);

  useEffect(() => {
    recalcDisableState();
  }, [cart, subscriptionCart, recalcDisableState, isSubscription]);

  // Listen to custom event triggered after removal
  useEffect(() => {
    const handleCartUpdate = () => {
      recalcDisableState();
    };
    window.addEventListener('cartItemsUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartItemsUpdated', handleCartUpdate);
  }, [recalcDisableState]);

  useEffect(() => {
    setIsOrderRestricted(!!orderRestrictionData);
  }, [orderRestrictionData]);

  const getButtonText = () => {
    if (!loginDetails?.user) return 'LOGIN';

    if (
      cart.cartTabType === TabTypeConstant.CART_MAIN ||
      cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR
    ) {
      if (showAddressModal) {
        const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
        if (hasSelectedDelivery) {
          if (placeOrderDetails.delivery_type === 'INSTANT') return 'PROCEED TO PAY';
          if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
            const hasSelectedTiming = placeOrderDetails.time_slot_id !== '';
            return hasSelectedTiming ? 'PROCEED TO PAY' : 'SELECT TIME SLOT';
          }
        }
        return 'SELECT DELIVERY TYPE';
      }
      return 'PROCEED';
    }

    return btnName;
  };

  const getDisabledState = () => {
    if (!loginDetails?.user) return false;
    if (isOrderRestricted) return true;
    if (shouldDisable) return true;

    if (
      showAddressModal &&
      (cart.cartTabType === TabTypeConstant.CART_MAIN || cart.cartTabType === TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR)
    ) {
      const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
      if (!hasSelectedDelivery) return true;

      if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
        const hasSelectedTiming = placeOrderDetails.time_slot_id !== '';
        return !hasSelectedTiming;
      }
      return false;
    }

    return isDisabled;
  };

  // Calculate total amount including instant delivery fee
  const getTotalAmount = () => {
    if (isSubscription) return Math.round(subscriptionCart.totalPrice);

    let total = parseFloat(cart.amountToPay) || 0;

    // Add instant delivery fee if instant delivery is selected
    if (placeOrderDetails.delivery_type === 'INSTANT') {
      const instantFee = placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_fee;
      if (instantFee && parseFloat(instantFee) > 0) {
        total += parseFloat(instantFee);
      }
    }

    return Math.round(total);
  };

  const finalIsDisabled = getDisabledState();

  const handleClick = () => {
    if (!finalIsDisabled && handler) {
      if (getButtonText() === 'PROCEED') {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'InitiateCheckout');
        }
      }
      handler();
    }
  };

  const getButtonStyling = () =>
    finalIsDisabled
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-black text-primary cursor-pointer hover:opacity-90 transition-opacity';

  const remainingAmount = cartMinimum > 0 ? (cartMinimum - parseFloat(cart.totalPrice)).toFixed(2) : 0;
  const showMinOrderBanner =
    !isSubscription && cart.items.length > 0 && cartMinimum > 0 && parseFloat(cart.totalPrice) < cartMinimum;

  const renderOriginalUI = () => (
    <div className="relative">
      {showMinOrderBanner && (
        <div className="fixed z-[131] mob:z-[10000] bottom-[6vw] mob:bottom-[21vw] right-[1.39vw] mob:right-[5vw] w-[calc(30vw-2.78vw)] mob:w-[calc(100vw-10vw)] mob:left-[5vw] animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#E7F5E9] border border-[#C3E6CB] rounded-[1vw] mob:rounded-[4vw] p-[0.8vw] mob:p-[3vw] shadow-lg mb-2">
            <p className="font-[SofiaPro] font-bold text-[#1B5E20] text-[.83vw] mob:text-[3.2vw] text-center">
              Add <span className="font-bold text-[#1B5E20]">₹{remainingAmount}</span> more to reach the minimum order!
            </p>
          </div>
        </div>
      )}

      <div
        style={{ transform: 'translateZ(0)' }}
        className={`fixed flex items-center justify-between h-[4vw] mob:h-[15vw] ${
          finalIsDisabled ? 'bg-gray-400' : 'bg-primary'
        } z-[130] mob:z-[9999] bottom-[1.67vw] mob:bottom-[5vw] right-[1.39vw] mob:right-[5vw] w-[calc(30vw-2.78vw)] mob:w-[calc(100vw-10vw)] mob:p-[2vw] p-[.6vw] rounded-full mob:left-[5vw] mob:shadow-xl transition-all duration-300`}
      >
        <div className="pl-[1vw] mob:pl-[2.1vw]">
          <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black-op-60 font-medium">
            {isSubscription ? (subscriptionCart.item ? 1 : 0) : cart.totalQuantity}{' '}
            {isSubscription ? (subscriptionCart.item ? 'Item' : 'Items') : cart.totalQuantity === 1 ? 'Item' : 'Items'}
          </p>
          <p className="font-[SofiaPro] font-semibold text-[1.1vw] mob:text-[4.1vw] text-black mob:pt-[.6vw]">
            ₹{getTotalAmount()}
          </p>
        </div>

        <button
          disabled={finalIsDisabled}
          onClick={handleClick}
          className={`text-[1vw] mob:text-[4.1vw] font-[SofiaPro] font-semibold ${getButtonStyling()} rounded-full px-[2vw] mob:px-[6vw] mob:h-[11vw] h-[2.7vw] transition-all duration-200`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );

  const renderFastCheckoutUI = () => {
    const defaultAddress = addressState.defaultAddress;
    const addressIcon = defaultAddress
      ? ADDRESS_ICON_MAP[defaultAddress.address_name] || ADDRESS_ICON_MAP['Other']
      : null;

    let paymentDisplayName = placeOrderDetails.payment_method || 'UPI';
    switch (paymentDisplayName) {
      case 'Pay with any UPI':
      case 'UPI / Online Payment':
        paymentDisplayName = 'UPI';
        break;
      case 'Pay with debit / Credit card':
        paymentDisplayName = 'Credit / Debit Card';
        break;
      case 'Pay with Net banking':
        paymentDisplayName = 'Netbanking';
        break;
      case 'Pay On delivery':
        paymentDisplayName = 'Cash on Delivery';
        break;
    }
    return (
      <div className="relative">
        {showMinOrderBanner && (
          <div className="fixed z-[131] mob:z-[10000] bottom-[10vw] mob:bottom-[28vw] right-[1.1vw] mob:right-[4.1vw] w-[calc(30vw-2.2vw)] mob:w-[calc(100vw-8.2vw)] animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-[#E7F5E9] border border-[#C3E6CB] rounded-[1vw] mob:rounded-[4vw] p-[0.8vw] mob:p-[3vw] shadow-lg mb-2">
              <p className="font-[SofiaPro] font-bold text-[#1B5E20] text-[.83vw] mob:text-[3.2vw] text-center">
                Add <span className="font-bold text-[#1B5E20]">₹{remainingAmount}</span> more to reach the minimum
                order!
              </p>
            </div>
          </div>
        )}

        <div
          style={{ transform: 'translateZ(0)' }}
          className="fixed flex flex-col justify-between bg-[#fac510] font-[SofiaPro] z-[130] mob:z-[9999] bottom-[1.67vw] mob:bottom-[5vw] right-[1.1vw] mob:right-[4.1vw] w-[calc(30vw-2.2vw)] mob:w-[calc(100vw-8.2vw)] p-[0.7vw] mob:p-[3vw] rounded-[1.1vw] mob:rounded-[4vw] shadow-xl transition-all duration-300 border border-black"
        >
          {/* Top Half: Address */}
          <div className="flex items-center justify-between pb-[1vw] mob:pb-[3vw] border-b border-black/10">
            <div className="flex items-center gap-[0.5vw] mob:gap-[2vw]">
              {addressIcon && (
                <div className="w-[1.5vw] h-[1.5vw] mob:w-[6vw] mob:h-[6vw] relative shrink-0">
                  <Image src={addressIcon} fill className="object-contain" alt="home-icon" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden max-w-[15vw] mob:max-w-[50vw]">
                <p className="font-[SofiaPro] text-[0.9vw] mob:text-[3.5vw] font-bold text-black truncate">
                  Delivering to {defaultAddress?.address_name || 'Home'}
                </p>
                <p className="font-[SofiaPro] text-[0.8vw] mob:text-[3vw] text-black/70 truncate">
                  {defaultAddress?.address || 'Set your delivery location'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch(actions.setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
              }}
              className="font-[SofiaPro] text-[0.9vw] mob:text-[3.5vw] font-medium text-[#1B5E20] underline hover:opacity-80 shrink-0"
            >
              Change
            </button>
          </div>

          {/* Bottom Half: Payment and Place Order */}
          <div className="flex items-center justify-between pt-[0.5vw] mob:pt-[3vw]">
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => dispatch(actions.setCartTabType(TabTypeConstant.PAYMENT_SELECTION))}
            >
              <p className="flex items-center pb-1 gap-[0.2vw] mob:gap-[0.5vw] font-[SofiaPro] text-[0.8vw] mob:text-[3vw] text-black font-medium">
                Paying With <ChevronDown className="w-[0.8vw] h-[0.8vw] mob:w-[3vw] mob:h-[3vw]" strokeWidth={3} />
              </p>
              <p className="font-[SofiaPro] text-[1vw] mob:text-[4vw] font-semibold text-black">{paymentDisplayName}</p>
            </div>

            <button
              disabled={finalIsDisabled}
              onClick={handleClick}
              className={`flex items-center text-[1vw] mob:text-[4vw] font-[SofiaPro] ${
                finalIsDisabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-black text-white hover:opacity-90'
              } rounded-[0.5vw] mob:rounded-[2vw] overflow-hidden transition-all duration-200`}
            >
              <div className="flex flex-col items-center justify-center pl-[0.8vw] pr-[0.5vw] mob:pl-[2vw] mob:pr-[1vw] py-[0.8vw] mob:py-[2.5vw]">
                <span className="font-bold leading-none">₹{getTotalAmount()}</span>
                <span className="text-[0.6vw] mob:text-[2.5vw] text-white/70 mt-[0.2vw] mob:mt-[0.5vw]">TOTAL</span>
              </div>
              <div className="flex flex-1 items-center justify-center gap-[0.3vw] mob:gap-[1vw] pl-[0.5vw] pr-[0.8vw] mob:pl-[1vw] mob:pr-[2vw] py-[0.8vw] mob:py-[2.5vw] font-medium leading-none">
                <span>Place Order</span>
                <ChevronRight
                  className="w-[1.1vw] h-[1.1vw] mob:w-[4vw] mob:h-[4vw] mt-[0.1vw] mob:mt-[0.4vw]"
                  strokeWidth={2.5}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!loginDetails.isLogin) {
    return renderOriginalUI();
  }

  if (!isSubscription && cart.cart_minimum === null) {
    return null;
  }

  return cart.show_timeslot_sheet === false ? renderFastCheckoutUI() : renderOriginalUI();
};

export default ActionCtaWithItems;

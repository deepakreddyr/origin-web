import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useCartStore } from '@/hooks/useCartStore';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { ADDRESS_ICON_MAP } from '@/utilities/maps';
import Image from 'next/image';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import usePaymentHook from '@/features/PaymentPage/hooks/usePaymentHook';
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
  const { isLoading: isOrderLoading } = usePaymentHook();

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

  const finalIsDisabled = getDisabledState() || isOrderLoading;

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
          <div className="fixed z-[131] mob:z-[10000] bottom-[12vw] mob:bottom-[42vw] right-[1.1vw] mob:right-[4.1vw] w-[calc(30vw-2.2vw)] mob:w-[calc(100vw-8.2vw)] animate-in slide-in-from-bottom-2 duration-300">
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
          className="fixed flex flex-col z-[130] mob:z-[9999] bottom-0 right-0 w-[30vw] mob:w-[100vw]"
        >
          {/* Top Half: Address */}
          <div className="flex items-center justify-between px-[1vw] mob:px-[3.5vw] py-[0.8vw] mob:py-[2.5vw] border-t border-[#00000080] bg-white">
            <div className="flex items-start gap-[0.8vw] mob:gap-[2.5vw]">
              {addressIcon && (
                <div className="w-[1.6vw] h-[1.6vw] mob:w-[6.5vw] mob:h-[6.5vw] relative shrink-0 mt-[0.2vw] mob:mt-[0.5vw]">
                  <Image src={addressIcon} fill className="object-contain" alt="home-icon" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden max-w-[18vw] mob:max-w-[55vw]">
                <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.2vw] font-bold text-[#1F2937] truncate leading-tight">
                  {defaultAddress?.address_name || 'Home'}
                </p>
                <p className="font-[SofiaPro] text-[0.8vw] mob:text-[3.2vw] text-[#6B7280] truncate mt-[0.1vw] mob:mt-[0.5vw]">
                  {defaultAddress?.address || 'Set your delivery location'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch(actions.setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
              }}
              className="font-[SofiaPro] text-[1vw] mob:text-[3.5vw] font-normal text-[#059669] underline hover:opacity-80 shrink-0 self-start mt-[1vw]"
            >
              Change
            </button>
          </div>

          {/* Red banner ETA */}
          {cart.instant_message && (
            <div className="w-full bg-[#FFF0FF] text-center border-t border-b border-black/5">
              <span className="text-[#98449A] font-[SofiaPro] font-medium text-[0.9vw] mob:text-[3.2vw]">
                {cart.instant_message}
              </span>
            </div>
          )}

          {/* Bottom Half: Payment and Place Order */}
          <div className="flex items-center justify-between px-[1vw] mob:px-[3.5vw] py-[1.2vw] mob:py-[4vw] bg-white">
            <div
              className="flex flex-col cursor-pointer gap-[0.3vw] mob:gap-[1vw]"
              onClick={() => dispatch(actions.setCartTabType(TabTypeConstant.PAYMENT_SELECTION))}
            >
              <p className="flex items-center gap-[0.2vw] mob:gap-[0.5vw] font-[SofiaPro] text-[1vw] mob:text-[3.8vw] text-[#4B5563] font-medium font-[SofiaPro]">
                Pay Using
                <svg
                  className="w-[1.2vw] h-[1.2vw] mob:w-[4.5vw] mob:h-[4.5vw] text-black rotate-90"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </p>
              <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4vw] font-bold text-[#1F2937] italic mt-[0.2vw] mob:mt-[0.5vw]">
                {paymentDisplayName}
              </p>
            </div>

            <button
              disabled={finalIsDisabled}
              className={`flex items-center justify-between bg-[#FDE047] border-[#FDE047] ${
                finalIsDisabled ? 'cursor-not-allowed opacity-80' : 'hover:opacity-90'
              } w-[192px] mob:w-[55vw] h-[45px] mob:h-[13vw] rounded-[10px] border transition-all duration-200 px-[10px] mob:px-[3vw]`}
            >
              <div className="flex flex-col items-start justify-center pl-[6px]">
                <span className="text-[11px] mob:text-[3.5vw] text-black font-[SofiaPro] font-medium leading-none">
                  Total
                </span>
                <span className="text-[14px] mob:text-[4vw] font-bold text-[#1F2937] leading-none mt-[3px]">
                  ₹{getTotalAmount().toLocaleString()}
                </span>
              </div>
              <div
                onClick={handleClick}
                className={`font-[SofiaPro] flex items-center justify-center gap-[6px] mob:gap-[1.5vw] ${
                  finalIsDisabled ? 'bg-[#737373]' : 'bg-black'
                } text-white rounded-[8px] w-[101px] mob:w-[28vw] h-[28px] mob:h-[8vw] font-semibold text-[12px] mob:text-[3.5vw]`}
              >
                <span>Place Order</span>
                <svg
                  className="w-[12px] h-[12px] mob:w-[3.5vw] mob:h-[3.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
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

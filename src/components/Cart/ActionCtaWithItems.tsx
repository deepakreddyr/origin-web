import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

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
}

const ActionCtaWithItems: React.FC<ActionCtaWithItemsProps> = ({
  btnName,
  handler,
  isDisabled,
  orderRestrictionData,
  showAddressModal = false,
}) => {
  const cart = useSelector((state: any) => state.cart);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);

  const [isOrderRestricted, setIsOrderRestricted] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);

  const recalcDisableState = useCallback(() => {
    let cartItemsFromLS: any[] = [];
    if (typeof window !== 'undefined') {
      const lsData = localStorage.getItem('cart_items');
      cartItemsFromLS = lsData ? JSON.parse(lsData) : [];
    }

    const disabled =
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

    setShouldDisable(disabled);
  }, [cart]);

  useEffect(() => {
    recalcDisableState();
  }, [cart, recalcDisableState]);

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

    if (cart.cartTabType === TabTypeConstant.CART_MAIN) {
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

    if (showAddressModal && cart.cartTabType === TabTypeConstant.CART_MAIN) {
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
    let total = parseFloat(cart.amountToPay) || 0;
    
    // Add instant delivery fee if instant delivery is selected
    if (placeOrderDetails.delivery_type === 'INSTANT') {
      const instantFee = placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_fee;
      if (instantFee && parseFloat(instantFee) > 0) {
        total += parseFloat(instantFee);
      }
    }
    
    return total.toFixed(2);
  };

  const finalIsDisabled = getDisabledState();

  const handleClick = () => {
    if (!finalIsDisabled && handler) handler();
  };

  const getButtonStyling = () =>
    finalIsDisabled
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-black text-primary cursor-pointer hover:opacity-90 transition-opacity';

  return (
    <div className="relative">
      <div
        className={`fixed flex items-center justify-between h-[4vw] mob:h-[15vw] ${
          finalIsDisabled ? 'bg-gray-400' : 'bg-primary'
        } z-[2] mob:z-[9999] bottom-[1.67vw] mob:bottom-[5vw] w-[calc(30vw-2vw)] mob:w-[calc(100vw-4vw)] mob:p-[2vw] p-[.6vw] rounded-full mob:left-[2vw] mob:shadow-xl transition-all duration-300`}
      >
        <div className="pl-[1vw] mob:pl-[2.1vw]">
          <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black-op-60 font-medium">
            {cart.totalQuantity} Items
          </p>
          <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] text-black mob:pt-[.6vw]">
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
};

export default ActionCtaWithItems;
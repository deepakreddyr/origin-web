import React, { useEffect, useState } from 'react';
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
  const [showPopup, setShowPopup] = useState(false);
  const [isOrderRestricted, setIsOrderRestricted] = useState(false);
  
  let cartItemsFromLS: any[] = [];
  if (typeof window !== 'undefined') {
    const lsData = localStorage.getItem('cart_items');
    cartItemsFromLS = lsData ? JSON.parse(lsData) : [];
  }

  // Disable if ANY UOM is unavailable OR cart_quantity > maximum_quantity
  const shouldDisable = cartItemsFromLS.some((item: any) =>
    item.multiple_uoms?.some(
      (uom: any) =>
        uom.is_available === false || uom.cart_quantity > uom.maximum_quantity
    )
  );

  useEffect(() => {
    if (orderRestrictionData) {
      setIsOrderRestricted(true);
      setShowPopup(true);
    } else {
      setIsOrderRestricted(false);
      setShowPopup(false);
    }
  }, [orderRestrictionData]);

  // Enhanced button text logic
  const getButtonText = () => {
    if (!loginDetails?.user) return 'LOGIN';
    
    if (cart.cartTabType === TabTypeConstant.CART_MAIN) {
      // Check if address modal is open using the prop
      if (showAddressModal) {
        const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
        
        if (hasSelectedDelivery) {
          if (placeOrderDetails.delivery_type === 'INSTANT') {
            return 'PROCEED TO PAY';
          } else if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
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

  // Enhanced disable logic
  const getDisabledState = () => {
    // If not logged in → always enabled for login
    if (!loginDetails?.user) return false;
    
    // If order is restricted → disable
    if (isOrderRestricted) return true;
    
    // If cart items have issues → disable
    if (shouldDisable) return true;
    
    // If address modal is open, check delivery selection
    if (showAddressModal && cart.cartTabType === TabTypeConstant.CART_MAIN) {
      const hasSelectedDelivery = placeOrderDetails.delivery_type !== '';
      
      if (!hasSelectedDelivery) return true;
      
      if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
        const hasSelectedTiming = placeOrderDetails.time_slot_id !== '';
        return !hasSelectedTiming;
      }
      
      // For INSTANT delivery, no additional selection needed
      return false;
    }
    
    // Use the original isDisabled prop for other cases
    return isDisabled;
  };

  const finalIsDisabled = getDisabledState();

  const handleClick = () => {
    if (!finalIsDisabled && handler) {
      handler();
    }
  };

  // Get button styling based on state
  const getButtonStyling = () => {
    if (finalIsDisabled) {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed';
    }
    
    // Always use the standard black styling - no green animation
    return 'bg-black text-primary cursor-pointer hover:opacity-90 transition-opacity';
  };

  return (
    <div className="relative">
      {/* Selection guidance tooltip */}
      {finalIsDisabled && cart.cartTabType === TabTypeConstant.CART_MAIN && loginDetails?.user && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-75">
          {placeOrderDetails.delivery_type === '' && 'Select delivery type first'}
          {placeOrderDetails.delivery_type === 'TIME_SLOT' && placeOrderDetails.time_slot_id === '' && 'Choose a time slot'}
        </div>
      )}

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
            ₹{cart.amountToPay}
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
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
}

const ActionCtaWithItems: React.FC<ActionCtaWithItemsProps> = ({
  btnName,
  handler,
  isDisabled,
  orderRestrictionData,
}) => {
  const cart = useSelector((state: any) => state.cart);
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
        uom.is_available === false || uom.cart_quantity >= uom.maximum_quantity
    )
  );

  // Force show popup for testing - remove this after testing
  useEffect(() => {
    // console.log('OrderRestrictionData received:', orderRestrictionData);
    
    // Temporary test - force show popup if any order restriction data exists
    if (orderRestrictionData) {
      // console.log('Forcing popup to show for testing');
      setIsOrderRestricted(true);
      setShowPopup(true);
    } else {
      setIsOrderRestricted(false);
      setShowPopup(false);
    }
  }, [orderRestrictionData]);

  const finalIsDisabled = isDisabled || shouldDisable || isOrderRestricted;

  // console.log('Button state:', {
  //   isDisabled,
  //   shouldDisable,
  //   isOrderRestricted,
  //   finalIsDisabled,
  //   showPopup,
  //   orderRestrictionData
  // });

  const handleClick = () => {
    // console.log('Button clicked, finalIsDisabled:', finalIsDisabled);
    if (!finalIsDisabled && handler) {
      handler();
    }
  };

  return (
    <div className="relative">
      {/* Popup positioned below bill section */}
      {/* {showPopup && (
        <div 
          className="absolute bottom-[12vw] mob:bottom-[35vw] left-[1vw] mob:left-[2vw] right-[1vw] mob:right-[2vw] text-red-800 shadow-lg p-[1.2vw] mob:p-[4vw] rounded-2xl border border-red-200"
          style={{ 
            backgroundColor: '#F2EEE4',
            zIndex: 10001
          }}
        >
          <div className="flex items-center justify-center mb-[0.8vw] mob:mb-[2vw]">
            <div className="w-[1.5vw] h-[1.5vw] mob:w-[5vw] mob:h-[5vw] bg-red-500 rounded-full flex items-center justify-center mr-[0.8vw] mob:mr-[2vw]">
              <span className="text-white text-[0.8vw] mob:text-[2.5vw] font-bold">!</span>
            </div>
            <h3 className="text-[1.1vw] mob:text-[4vw] font-bold text-red-700">
              {orderRestrictionData?.title || 'SEE YOU AT 05:00 AM'}
            </h3>
          </div>
          <p className="text-[0.9vw] mob:text-[3.2vw] text-center text-red-600 leading-relaxed">
            {orderRestrictionData?.description || 'You can add items in your cart until we reopen at 05:00 AM'}
          </p>
        </div>
      )} */}

      {/* Action Button */}
      <div
        className={`fixed flex items-center justify-between h-[4vw] mob:h-[15vw] ${
          finalIsDisabled ? 'bg-gray-400' : 'bg-primary'
        } z-[2] bottom-[1.67vw] mob:bottom-[5vw] w-[calc(30vw-2vw)] mob:w-[calc(96vw-4vw)] mob:p-[2vw] p-[.6vw] rounded-full `}
      >
        <div className="pl-[1vw] mob:pl-[2.1vw]">
          <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] text-black-op-60 font-medium ">
            {cart.totalQuantity} Items
          </p>
          <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] text-black mob:pt-[.6vw] ">
            ₹{cart.amountToPay}
          </p>
        </div>
        <button
          disabled={finalIsDisabled}
          onClick={handleClick}
          className={`text-[1vw] mob:text-[4.1vw] font-[SofiaPro] font-semibold ${
            finalIsDisabled 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-black text-primary cursor-pointer hover:opacity-90 transition-opacity'
          } rounded-full px-[2vw] mob:px-[6vw] mob:h-[11vw] h-[2.7vw]`}
        >
          {finalIsDisabled ? 'PROCEED' : btnName}
        </button>
      </div>
    </div>
  );
};

export default ActionCtaWithItems;
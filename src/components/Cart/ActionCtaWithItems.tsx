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
  const loginDetails = useSelector((state: any) => state.loginDetails); // Added to check login state
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

  // NEW: If not logged in → always enabled
  const finalIsDisabled = loginDetails?.user
    ? isDisabled || shouldDisable || isOrderRestricted
    : false;
  console.log(finalIsDisabled,"finalIsDisabled");
  console.log(isDisabled,"isDisabled");
  console.log(isOrderRestricted,"isOrderRestricted");
  const handleClick = () => {
    if (!finalIsDisabled && handler) {
      handler();
    }
  };

  return (
    <div className="relative">
      <div
        className={`fixed flex items-center justify-between h-[4vw] mob:h-[15vw] ${
          finalIsDisabled ? 'bg-gray-400' : 'bg-primary'
        } z-[2] mob:z-[9999] bottom-[1.67vw] mob:bottom-[5vw] w-[calc(30vw-2vw)] mob:w-[calc(100vw-4vw)] mob:p-[2vw] p-[.6vw] rounded-full mob:left-[2vw] mob:shadow-xl`}
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
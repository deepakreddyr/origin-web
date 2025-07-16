import React from 'react';
import { useSelector } from 'react-redux';

const ActionCtaWithItems = (props: any) => {
  const { btnName, handler, isDisabled } = props;
  const cart = useSelector((state: any) => state.cart);

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

  const finalIsDisabled = isDisabled || shouldDisable;

  return (
    <div
      className={`fixed flex items-center justify-between h-[4vw] mob:h-[15vw] ${
        finalIsDisabled ? 'bg-[#e0e0e0]' : 'bg-primary'
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
        onClick={() => handler()}
        className={`text-[1vw] mob:text-[4.1vw] font-[SofiaPro] font-semibold ${
          finalIsDisabled ? 'bg-[#eeeaeb] text-[#9f9f9f]' : 'bg-black text-primary'
        } rounded-full px-[2vw] mob:px-[6vw] mob:h-[11vw] h-[2.7vw]`}
      >
        {btnName}
      </button>
    </div>
  );
};

export default ActionCtaWithItems;

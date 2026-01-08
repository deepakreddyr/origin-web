import React, { FC } from "react";
import addButton from '/public/assets/svg/addButton.svg';
import subButton from '/public/assets/svg/subButton.svg';
import Image from "next/image";

interface BlackBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleAddItem: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleDecrease: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const BlackBtn: FC<BlackBtnProps> = (props) => {
  const {
    isItemPresent,
    quantity,
    maxQuantity,
    handleAddItem,
    handleIncrease,
    handleDecrease,
  } = props;

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleDecrease(e);
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Always call handleIncrease - it will handle max quantity logic
    handleIncrease(e);
  };

  const onAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddItem(e);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isItemPresent ? (
        <>
          <div className="flex items-center justify-between px-2 bg-white border-[2px] border-[#F3EEDF] rounded-full h-7 w-full">
            <button
              className="h-5 w-5 rounded-full bg-black text-white text-sm flex items-center justify-center"
              onClick={onDecrease}
            >
              <Image src={subButton} alt="" />
            </button>

            <p className="text-black font-semibold text-sm">
              {quantity}
            </p>

            <button
              className="h-5 w-5 rounded-full bg-black text-white text-sm flex items-center justify-center"
              onClick={onIncrease}
            >
              <Image src={addButton} alt="" />
            </button>
          </div>
        </>
      ) : (
        <button
          className="w-full h-7 bg-black text-white rounded-[0.75rem] font-semibold text-xs hover:bg-gray-800 transition-colors font-[SofiaPro] flex items-center justify-center"
          onClick={onAdd}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default BlackBtn;
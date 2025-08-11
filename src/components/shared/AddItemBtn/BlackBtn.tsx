import React from 'react';

interface BlackBtnProps {
  isItemPresent: boolean;
  quantity: number;
  handleAddItem: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleDecrease: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const BlackBtn = (props: BlackBtnProps) => {
  const {
    isItemPresent,
    quantity,
    handleAddItem,
    handleIncrease,
    handleDecrease,
    handleRemove,
  } = props;

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity <= 1) {
      handleRemove?.(e);
    } else {
      handleDecrease(e);
    }
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleIncrease(e);
  };

  const onAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddItem(e);
  };

  return (
    <div className="w-full">
      {isItemPresent ? (
        <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[7vw]">
          <button
            className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
            onClick={onDecrease}
          >
            –
          </button>
          <p className="text-black font-semibold text-[1vw] mob:text-[3.2vw]">{quantity}</p>
          <button
            className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
            onClick={onIncrease}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="w-full h-[2.2vw] mob:h-[7vw] bg-black text-white rounded-[0.5vw] mob:rounded-[2vw] font-semibold text-[1vw] mob:text-[3.2vw]"
          onClick={onAdd}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default BlackBtn;

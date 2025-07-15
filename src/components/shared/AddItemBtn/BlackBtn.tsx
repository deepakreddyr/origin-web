import React from 'react';

const BlackBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem } = props;

  return (
    <div className="w-full">
      {isItemPresent ? (
        <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[7vw]">
          <button
            className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
            onClick={handleDecrease}
          >
            –
          </button>
          <p className="text-black font-semibold text-[1vw] mob:text-[3.2vw]">{quantity}</p>
          <button
            className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="w-full h-[2.2vw] mob:h-[7vw] bg-black text-white rounded-[0.5vw] mob:rounded-[2vw] font-semibold text-[1vw] mob:text-[3.2vw]"
          onClick={handleAddItem}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default BlackBtn;

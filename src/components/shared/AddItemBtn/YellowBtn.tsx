import React from 'react';

const YellowBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem } = props;

  return (
    <div className="w-full">
      {isItemPresent ? (
        <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#EDE6D4] rounded-full h-[2.8vw] mob:h-[9vw]">
          <button
            className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full bg-[#FFD500] text-black text-[1.1vw] mob:text-[4vw] flex items-center justify-center"
            onClick={handleDecrease}
          >
            –
          </button>
          <p className="text-black font-semibold text-[1.1vw] mob:text-[3.6vw]">{quantity}</p>
          <button
            className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full bg-[#FFD500] text-black text-[1.1vw] mob:text-[4vw] flex items-center justify-center"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="w-full h-[2.8vw] mob:h-[10vw] bg-[#FFD500] text-black rounded-[0.5vw] mob:rounded-[2vw] font-semibold text-[1vw] mob:text-[3.6vw]"
          onClick={handleAddItem}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default YellowBtn;

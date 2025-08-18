import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface YellowBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleDecrease: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleAddItem: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const YellowBtn = (props: YellowBtnProps) => {
  const { 
    isItemPresent, 
    handleDecrease, 
    quantity, 
    maxQuantity,
    handleIncrease, 
    handleAddItem,
    handleRemove
  } = props;

  const [showMaxMessage, setShowMaxMessage] = useState(false);

  const isMax = quantity >= maxQuantity;

  // Show the message when quantity reaches max
  useEffect(() => {
    if (isMax) {
      setShowMaxMessage(true);
    }
  }, [isMax]);

  // Hide the message after 2 seconds
  useEffect(() => {
    if (showMaxMessage) {
      const timer = setTimeout(() => {
        setShowMaxMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMaxMessage]);

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
    
    if (isMax) {
      // Show the message when trying to exceed max quantity
      setShowMaxMessage(true);
      return;
    }
    
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
          <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.8vw] mob:h-[9vw] w-full">
            <button
              className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full bg-[#FFDD00] text-black text-[1.1vw] mob:text-[4vw] flex items-center justify-center"
              onClick={onDecrease}
            >
              –
            </button>
            <p className="text-black font-semibold text-[1.1vw] mob:text-[3.6vw]">{quantity}</p>
            <button
              className={`h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full flex items-center justify-center text-[1.1vw] mob:text-[4vw] ${
                isMax ? "bg-gray-400 cursor-not-allowed text-gray-600" : "bg-[#FFDD00] text-black"
              }`}
              onClick={onIncrease}
            >
              +
            </button>
          </div>

          {/* Animated max quantity message */}
          <AnimatePresence>
            {showMaxMessage && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 font-medium text-[0.8vw] mob:text-[2.8vw] mt-[0.5vw] mob:mt-[1vw] text-center"
              >
                Oops! Max quantity reached
              </motion.p>
            )}
          </AnimatePresence>
        </>
      ) : (
        <button
          className="w-full bg-[#FFDD00] text-black font-medium text-base md:text-lg py-3 md:py-3"
          onClick={onAdd}
        >
          Add to cart
        </button>
      )}
    </div>
  );
};

export default YellowBtn;
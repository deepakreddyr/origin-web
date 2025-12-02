import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

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

  const [showMaxMessage, setShowMaxMessage] = useState(false);

  const isMax = quantity >= maxQuantity;

  // ... (Effects remain the same)
  useEffect(() => {
    if (isMax) {
      setShowMaxMessage(true);
    }
  }, [isMax]);

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
    handleDecrease(e);
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMax) {
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
          <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[7vw] w-full">
            {/* Decrease Button - ADDED: flex items-center justify-center */}
            <button
              className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
              onClick={onDecrease}
            >
              &#8722;
            </button>

            <p className="text-black font-semibold text-[1vw] mob:text-[3.2vw]">
              {quantity}
            </p>

            {/* Increase Button - ADDED: flex items-center justify-center */}
            <button
              className={`h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full text-[1vw] mob:text-[3.5vw] flex items-center justify-center ${
                isMax ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
              }`}
              onClick={onIncrease}
              disabled={isMax}
            >
              +
            </button>
          </div>

          <AnimatePresence>
            {showMaxMessage && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 font-medium text-[0.8vw] mob:text-[2.8vw] mt-[0.5vw] mob:mt-[1vw] text-center"
              >
                {/* Oops! Max quantity reached */}
              </motion.p>
            )}
          </AnimatePresence>
        </>
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
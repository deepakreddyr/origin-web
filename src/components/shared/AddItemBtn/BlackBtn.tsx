import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CreamBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleAddItem: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleDecrease: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const CreamBtn = ({
  isItemPresent,
  quantity,
  maxQuantity,
  handleAddItem,
  handleIncrease,
  handleDecrease,
  handleRemove,
}: CreamBtnProps) => {
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMax = quantity >= maxQuantity;

  // Show the message when quantity reaches max
  useEffect(() => {
    if (isMax) setShowMaxMessage(true);
  }, [isMax]);

  // Hide message after 2s
  useEffect(() => {
    if (showMaxMessage) {
      const timer = setTimeout(() => setShowMaxMessage(false), 2000);
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
          {/* ✅ Stepper Yellow Design */}
          <div className="flex items-center justify-between bg-[#FFDD00] rounded-[0.5rem] h-[2.6vw] mob:h-[9vw] px-[1vw] mob:px-[4vw] w-full">
            <button
              className="text-black text-[1vw] mob:text-[4vw] font-medium flex items-center justify-center"
              onClick={onDecrease}
            >
              –
            </button>

            <p className="text-black font-bold text-[1vw] mob:text-[3.5vw]">
              {quantity}
            </p>

            <button
              className={`text-[1vw] mob:text-[4vw] font-medium flex items-center justify-center ${
                isMax
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black"
              }`}
              onClick={onIncrease}
            >
              +
            </button>
          </div>

          {/* ✅ Animated max message */}
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
        // ✅ Add to Cart Button with same animation
        <motion.button
          className="w-full relative flex items-center justify-center h-[2.6vw] mob:h-[9vw] rounded-[0.5rem] overflow-hidden mt-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onAdd}
          whileTap={{ scale: 0.98 }}
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-[#FFDD00]/40" />

          {/* Flowing darker tint on hover */}
          <motion.div
            className="absolute inset-0 bg-[#FFDD00]"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "0%" : "-100%" }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Button text */}
          <span className="relative z-10 text-black text-[1vw] mob:text-[3.5vw] font-bold">
            Add To Cart
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default CreamBtn;

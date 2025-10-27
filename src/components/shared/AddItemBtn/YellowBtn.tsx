import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface YellowBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleAddItem: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleDecrease: (e: any) => void;
  handleRemove?: (e: any) => void;
  borderRadius?: number;
}

const YellowBtn = (props: YellowBtnProps) => {
  const {
    isItemPresent,
    quantity,
    maxQuantity,
    handleAddItem,
    handleIncrease,
    handleDecrease,
    handleRemove,
    borderRadius = 0,
  } = props;

  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const isMax = quantity >= maxQuantity;

  useEffect(() => {
    if (isMax) setShowMaxMessage(true);
  }, [isMax]);

  useEffect(() => {
    if (showMaxMessage) {
      const timer = setTimeout(() => setShowMaxMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showMaxMessage]);

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) handleRemove?.(e);
    else handleDecrease(e);
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
      {/* Button container */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: "30px",
          borderRadius: `${borderRadius}px`,
          backgroundColor: "#FFD700",
        }}
      >
        <AnimatePresence mode="wait">
          {isItemPresent ? (
            <motion.div
              key="quantity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full px-3"
            >
              {/* – Button */}
              <button
                className="flex items-center justify-center ml-[2vw]"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  color: "black",
                }}
                onClick={onDecrease}
              >
                –
              </button>

              {/* Quantity */}
              <p className="text-black font-semibold text-base">{quantity}</p>

              {/* + Button */}
              <button
                className="flex items-center justify-center mr-[2vw] transition-all duration-200"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  color: isMax ? "rgba(0, 0, 0, 0.12)" : "black",
                  cursor: isMax ? "not-allowed" : "pointer",
                  opacity: 1,
                }}
                disabled={isMax}
                onClick={onIncrease}
              >
                +
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full font-semibold text-black"
              style={{
                borderRadius: `${borderRadius}px`,
                backgroundColor: "#FFD700",
              }}
              onClick={onAdd}
            >
              Add
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Max quantity message */}
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
    </div>
  );
};

export default YellowBtn;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlackAddCartBtmProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleDecrease: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleAddItem: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const BlackAddCartBtm: React.FC<BlackAddCartBtmProps> = (props) => {
  const { isItemPresent, handleDecrease, quantity, maxQuantity, handleIncrease, handleAddItem, handleRemove } = props;
  const [dir, setDir] = useState<1 | -1>(1);

  const isMax = quantity >= maxQuantity;

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(-1);
    if (quantity <= 1) {
      handleRemove?.(e);
    } else {
      handleDecrease(e);
    }
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMax) return;
    setDir(1);
    handleIncrease(e);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Single morphing pill — same layout-grow pattern as WhiteBtn */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={!isItemPresent ? handleAddItem : undefined}
        className={`flex items-center h-[2.8vw] mob:h-[9vw] rounded-full border-[2px] p-[.3vw] ${
          isItemPresent ? 'mob:px-[.5vw]' : 'px-[1.5vw] mob:px-[3vw]'
        } w-full justify-center ${
          isItemPresent ? 'border-[#F3EEDF] bg-white cursor-default' : 'border-transparent bg-black cursor-pointer'
        }`}
      >
        {/* Minus */}
        {isItemPresent && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.82 }}
            className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] flex-shrink-0 rounded-full bg-black text-white text-[1.3vw] mob:text-[5.5vw] font-semibold flex items-center justify-center mr-[.4vw] mob:mr-[2vw]"
            onClick={onDecrease}
          >
            <span className="mob:mb-[3px] mb-[2px]">–</span>
          </motion.button>
        )}

        {/* Centre */}
        <div className="flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {isItemPresent ? (
              <motion.p
                key={quantity}
                initial={{ opacity: 0, y: dir * 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="text-black font-semibold text-[1.1vw] mob:text-[3.6vw] select-none min-w-[0.8vw] text-center"
              >
                {quantity}
              </motion.p>
            ) : (
              <motion.span
                key="add-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="text-white font-medium text-base whitespace-nowrap mx-[0.8vw] mob:mx-[1.5vw]"
              >
                Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Plus */}
        <motion.button
          layout
          whileTap={!isMax ? { scale: 0.82 } : {}}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className={`flex-shrink-0 flex items-center justify-center rounded-full font-semibold ${
            isItemPresent
              ? isMax
                ? 'h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] bg-gray-400 text-gray-600 text-[1.3vw] mob:text-[5.5vw] ml-[.4vw] mob:ml-[2vw] cursor-not-allowed'
                : 'h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] bg-black text-white text-[1.3vw] mob:text-[5.5vw] ml-[.4vw] mob:ml-[2vw]'
              : 'h-[1.4vw] w-[1.4vw] mob:h-[5vw] mob:w-[5vw] bg-black text-white text-[1.3vw] mob:text-[5.5vw]'
          }`}
          onClick={isItemPresent ? onIncrease : handleAddItem}
        >
          <span className="mob:mb-[3px] mb-[2px]">+</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BlackAddCartBtm;

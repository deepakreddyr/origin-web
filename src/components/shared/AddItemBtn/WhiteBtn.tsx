import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhiteBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem, isMangoPage } = props;
  const [dir, setDir] = useState<1 | -1>(1);

  const onIncrease = (e: any) => {
    setDir(1);
    handleIncrease(e);
  };

  const onDecrease = (e: any) => {
    setDir(-1);
    handleDecrease(e);
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onClick={!isItemPresent ? handleAddItem : undefined}
      className={`flex items-center ${isMangoPage ? 'h-[2.3vw] mob:h-[8.5vw]' : 'h-[2.6vw] mob:h-[9.5vw]'} rounded-full border-[2px] p-[.3vw] ${
        isItemPresent ? 'mob:px-[.5vw]' : 'px-[0.7vw] mob:px-[1.5vw]'
      } w-full justify-center ${
        isItemPresent ? 'border-primary-200 bg-white cursor-default' : 'border-transparent bg-primary cursor-pointer'
      }`}
    >
      {/* Minus */}
      {isItemPresent && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          whileTap={{ scale: 0.82 }}
          className={`${
            isMangoPage
              ? 'h-[1.6vw] w-[1.6vw] mob:h-[6vw] mob:w-[6vw] text-[1.3vw] mob:text-[5vw]'
              : 'h-[1.8vw] w-[1.8vw] mob:h-[6.5vw] mob:w-[6.5vw] text-[1.4vw] mob:text-[5.5vw]'
          } flex-shrink-0 rounded-full bg-primary text-black font-semibold flex items-center justify-center mr-[.4vw] mob:mr-[2vw]`}
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
              className={`text-black font-semibold ${
                isMangoPage ? 'text-[0.9vw] mob:text-[3vw]' : 'text-[1vw] mob:text-[3.2vw]'
              } select-none min-w-[0.8vw] text-center`}
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
              className={`text-black font-bold ${
                isMangoPage
                  ? 'text-[0.9vw] mob:text-[2.8vw] mx-[0.3vw]'
                  : 'text-[1.1vw] mob:text-[3.2vw] mx-[0.4vw] mob:mx-[0.8vw]'
              } whitespace-nowrap`}
            >
              Add
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Plus */}
      <motion.button
        layout
        whileTap={{ scale: 0.82 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={`flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-black font-semibold ${
          isItemPresent
            ? `${isMangoPage ? 'h-[1.6vw] w-[1.6vw] mob:h-[6vw] mob:w-[6vw]' : 'h-[1.8vw] w-[1.8vw] mob:h-[6.5vw] mob:w-[6.5vw]'} ml-[.4vw] mob:ml-[2vw]`
            : `${isMangoPage ? 'h-[1.3vw] w-[1.3vw] mob:h-[5vw] mob:w-[5vw]' : 'h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw]'}`
        } ${isMangoPage ? 'text-[1.3vw] mob:text-[5vw]' : 'text-[1.4vw] mob:text-[5.5vw]'}`}
        onClick={isItemPresent ? onIncrease : handleAddItem}
      >
        <span className="mob:mb-[3px] mb-[2px]">+</span>
      </motion.button>
    </motion.div>
  );
};

export default WhiteBtn;

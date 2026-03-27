import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const YellowBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem } = props;
  const [dir, setDir] = useState<1 | -1>(1);

  const onDecrease = (e: any) => {
    setDir(-1);
    handleDecrease(e);
  };

  const onIncrease = (e: any) => {
    setDir(1);
    handleIncrease(e);
  };

  return (
    <div className="w-full">
      {/* Single morphing pill */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={!isItemPresent ? handleAddItem : undefined}
        className={`flex items-center h-[2.8vw] mob:h-[9vw] rounded-full border-[2px] p-[.3vw] mob:px-[.5vw] w-full justify-center ${
          isItemPresent
            ? 'border-[#EDE6D4] bg-white cursor-default'
            : 'border-transparent bg-[#FFD500] cursor-pointer px-[1vw] mob:px-[3vw]'
        }`}
      >
        {/* Minus */}
        {isItemPresent && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.82 }}
            className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] flex-shrink-0 rounded-full bg-[#FFD500] text-black text-[1.1vw] mob:text-[4vw] flex items-center justify-center mr-[.4vw] mob:mr-[2vw]"
            onClick={onDecrease}
          >
            –
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
              <motion.div
                key="add-label-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-[0.5vw] mob:gap-[2vw]"
              >
                <span className="text-black font-semibold text-[1vw] mob:text-[3.6vw] whitespace-nowrap">Add</span>
                <span className="text-black font-bold text-[1.10vw] mob:text-[4vw] mt-[0.1vw]">+</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plus — only show as separate button when isItemPresent */}
        {isItemPresent && (
          <motion.button
            layout
            whileTap={{ scale: 0.82 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#FFD500] text-black h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] text-[1.1vw] mob:text-[4vw] ml-[.4vw] mob:ml-[2vw]"
            onClick={onIncrease}
          >
            +
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default YellowBtn;

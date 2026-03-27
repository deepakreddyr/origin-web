import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhiteBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem } = props;
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
    // Single pill — always rendered. layout makes it grow/shrink smoothly.
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onClick={!isItemPresent ? handleAddItem : undefined}
      className={`flex items-center h-[2.5vw] mob:h-[8.5vw] rounded-full border-[2px] p-[.3vw] mob:px-[.7vw] justify-center ${
        isItemPresent
          ? 'border-primary-200 bg-white'
          : 'border-transparent bg-primary cursor-pointer px-[1vw] mob:px-[3vw]'
      }`}
    >
      {/* Minus — simply mounts/unmounts; layout on parent animates the pill width */}
      {isItemPresent && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          whileTap={{ scale: 0.82 }}
          className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.67vw] pb-[.3vw] flex-shrink-0 flex items-center justify-center bg-primary rounded-full border border-primary-200 mr-[.5vw] mob:mr-[3vw]"
          onClick={onDecrease}
        >
          –
        </motion.button>
      )}

      {/* Centre — "Add" label or ticking quantity number */}
      <div className="flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {isItemPresent ? (
            <motion.p
              key={quantity}
              initial={{ opacity: 0, y: dir * 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-[1.1vw] mob:text-[4.1vw] font-semibold text-black select-none min-w-[0.8vw] mob:min-w-[3vw] text-center"
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
              <span className="font-[SofiaPro] text-[.97vw] font-bold mob:text-[3.6vw] text-black whitespace-nowrap">
                Add
              </span>
              <span className="text-[1.1vw] mob:text-[4.1vw] font-bold text-black mt-[0.1vw]">+</span>
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
          className="flex-shrink-0 flex items-center justify-center rounded-full bg-primary h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.4vw] pb-[.3vw] ml-[.5vw] mob:ml-[3vw] border border-primary-200"
          onClick={onIncrease}
        >
          +
        </motion.button>
      )}
    </motion.div>
  );
};

export default WhiteBtn;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlackBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleAddItem: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleDecrease: (e: any) => void;
  handleRemove?: (e: any) => void;
}

const BlackBtn: React.FC<BlackBtnProps> = (props) => {
  const { isItemPresent, quantity, handleAddItem, handleIncrease, handleDecrease } = props;
  const [dir, setDir] = useState<1 | -1>(1);

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(-1);
    handleDecrease(e);
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(1);
    handleIncrease(e);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Single morphing pill */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={!isItemPresent ? handleAddItem : undefined}
        className={`flex items-center h-[2.2vw] mob:h-[7vw] rounded-full border-[2px] p-[.3vw] mob:px-[.5vw] w-full justify-center ${
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
            className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] flex-shrink-0 rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center mr-[.4vw] mob:mr-[2vw]"
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
                className="text-black font-semibold text-[1vw] mob:text-[3.2vw] select-none min-w-[0.8vw] text-center"
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
                className="text-white font-semibold text-[1vw] mob:text-[3.2vw] whitespace-nowrap mr-[.3vw]"
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
          className={`flex-shrink-0 flex items-center justify-center rounded-full ${
            isItemPresent
              ? 'h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] bg-black text-white text-[1vw] mob:text-[3.5vw] ml-[.4vw] mob:ml-[2vw]'
              : 'h-[1.2vw] w-[1.2vw] mob:h-[4vw] mob:w-[4vw] bg-black text-white text-[1vw] mob:text-[3.5vw]'
          }`}
          onClick={isItemPresent ? onIncrease : handleAddItem}
        >
          +
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BlackBtn;

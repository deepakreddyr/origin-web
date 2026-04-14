import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const YellowBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity, handleIncrease, handleAddItem, isMangoPage } = props;
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
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={!isItemPresent ? handleAddItem : undefined}
        className={`flex items-center ${isMangoPage ? 'h-[2.5vw] mob:h-[9vw]' : 'h-[2.9vw] mob:h-[10vw]'} rounded-full border-[2px] p-[.3vw] ${
          isItemPresent ? 'mob:px-[.5vw]' : 'px-[0.7vw] mob:px-[1.5vw]'
        } w-full justify-center ${
          isItemPresent ? 'border-[#EDE6D4] bg-white cursor-default' : 'border-transparent bg-[#FFD500] cursor-pointer'
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
                ? 'h-[1.7vw] w-[1.7vw] mob:h-[6.5vw] mob:w-[6.5vw]'
                : 'h-[1.9vw] w-[1.9vw] mob:h-[7.5vw] mob:w-[7.5vw]'
            } flex-shrink-0 rounded-full bg-[#FFD500] text-black font-semibold flex items-center justify-center mr-[.4vw] mob:mr-[2vw]`}
            onClick={onDecrease}
          >
            <RemoveIcon
              sx={{
                fontSize: isMangoPage ? '1.4vw' : '1.5vw',
                '@media (max-width: 600px)': {
                  fontSize: isMangoPage ? '5vw' : '5.5vw'
                }
              }}
            />
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
                  isMangoPage ? 'text-[0.9vw] mob:text-[3.2vw]' : 'text-[1vw] mob:text-[3.2vw]'
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
                    : 'text-[1.1vw] mob:text-[3.5vw] mx-[0.4vw] mob:mx-[0.8vw]'
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
          className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#FFD500] text-black font-semibold ${
            isItemPresent
              ? `${isMangoPage ? 'h-[1.7vw] w-[1.7vw] mob:h-[6.5vw] mob:w-[6.5vw]' : 'h-[1.9vw] w-[1.9vw] mob:h-[7.5vw] mob:w-[7.5vw]'} ml-[.4vw] mob:ml-[2vw]`
              : `${isMangoPage ? 'h-[1.4vw] w-[1.4vw] mob:h-[6vw] mob:w-[6vw]' : 'h-[1.7vw] w-[1.7vw] mob:h-[6.5vw] mob:w-[6.5vw]'}`
          }`}
          onClick={isItemPresent ? onIncrease : handleAddItem}
        >
          <AddIcon
            sx={{
              fontSize: isMangoPage ? '1.3vw' : '1.5vw',
              '@media (max-width: 600px)': {
                fontSize: isMangoPage ? '5vw' : '5.5vw'
              }
            }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default YellowBtn;

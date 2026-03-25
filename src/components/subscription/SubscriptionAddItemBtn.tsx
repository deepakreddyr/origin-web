import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSubscriptionItem,
  setIsSubscriptionActive,
  updateSubscriptionQuantity,
  clearSubscriptionCart
} from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

interface SubscriptionAddItemBtnProps {
  item?: any;
  maxQty: number;
  className?: string;
  buttonText?: string;
  textColor?: string;
}

const SubscriptionAddItemBtn: React.FC<SubscriptionAddItemBtnProps> = ({
  item,
  maxQty,
  className = '',
  buttonText = 'ORDER NOW',
  textColor = '#FFDD7E'
}) => {
  const dispatch = useDispatch();
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);
  const [dir, setDir] = useState<1 | -1>(1);

  const isItemPresent = !!subscriptionCart.item;
  const currentQuantity = subscriptionCart.item?.quantity || 0;

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const itemPrice = item?.price_inclusive_of_all_taxes ?? item?.multiple_uoms?.[0]?.price ?? 89;
    const cartItem = item
      ? {
          id: item.id,
          item_code: item.item_code,
          variant_id: item?.multiple_uoms?.[0]?.variant_id || '',
          uom_id: item?.multiple_uoms?.[0]?.uom_id || '',
          name: item.name,
          image: item.image,
          price: itemPrice,
          price_inclusive_of_all_taxes: itemPrice,
          quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
          minimum_quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
          max_qty: item?.multiple_uoms?.[0]?.maximum_quantity || item.max_qty || maxQty || 10,
          stepper_quantity: item?.multiple_uoms?.[0]?.stepper_quantity || 1,
          combo_items: item.combo_items ?? []
        }
      : {
          id: 1,
          variant_id: 1,
          uom_id: 1,
          item_code: 'SUBSCRIPTION_PLAN',
          name: 'Subscription Plan',
          image: '/assets/images/neworiginlogo.png',
          price: 89,
          quantity: 1,
          minimum_quantity: 1,
          max_qty: maxQty || 10,
          stepper_quantity: 1
        };

    dispatch(setSubscriptionItem(cartItem));
    dispatch(setIsSubscriptionActive(true));
    dispatch(setTabType(TabTypeConstant.CART));
    dispatch(setIsSidebarOpen(true));
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(1);
    const stepperQty = subscriptionCart.item?.stepper_quantity || 1;
    const nextQty = currentQuantity + stepperQty;
    const effectiveMaxQty = subscriptionCart.item?.max_qty || maxQty;

    if (nextQty <= effectiveMaxQty) {
      dispatch(updateSubscriptionQuantity(nextQty));
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(-1);
    const stepperQty = subscriptionCart.item?.stepper_quantity || 1;
    const minQty = subscriptionCart.item?.minimum_quantity || 1;
    const nextQty = currentQuantity - stepperQty;

    if (nextQty >= minQty) {
      dispatch(updateSubscriptionQuantity(nextQty));
    } else {
      dispatch(clearSubscriptionCart());
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={!isItemPresent ? handleAddItem : undefined}
        className={`flex items-center h-[2.5vw] mob:h-[10vw] rounded-full border-[2px] p-[.3vw] mob:px-[.5vw] w-max min-w-[10vw] mob:min-w-[30vw] justify-center transition-colors ${
          isItemPresent ? 'border-[#F3EEDF] bg-white cursor-default' : 'border-black bg-black cursor-pointer'
        }`}
      >
        {/* Minus */}
        {isItemPresent && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.82 }}
            className="h-[1.8vw] w-[1.8vw] mob:h-[8vw] mob:w-[8vw] flex-shrink-0 rounded-full bg-black text-white text-[1.2vw] mob:text-[5vw] flex items-center justify-center mr-[.8vw] mob:mr-[4vw]"
            onClick={handleDecrease}
          >
            –
          </motion.button>
        )}

        {/* Centre */}
        <div className="flex items-center justify-center overflow-hidden px-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {isItemPresent ? (
              <motion.p
                key={currentQuantity}
                initial={{ opacity: 0, y: dir * 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="text-black font-semibold text-[1.1vw] mob:text-[4.5vw] select-none min-w-[1.2vw] text-center"
              >
                {currentQuantity}
              </motion.p>
            ) : (
              <motion.span
                key="add-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="font-extrabold text-[0.85vw] mob:text-[3.5vw] tracking-wider whitespace-nowrap uppercase"
                style={{ color: textColor }}
              >
                {buttonText}
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
              ? 'h-[1.8vw] w-[1.8vw] mob:h-[8vw] mob:w-[8vw] bg-black text-white text-[1.2vw] mob:text-[5vw] ml-[.8vw] mob:ml-[4vw]'
              : 'hidden'
          }`}
          onClick={handleIncrease}
        >
          +
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SubscriptionAddItemBtn;

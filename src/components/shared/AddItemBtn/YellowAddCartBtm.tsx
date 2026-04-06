import React, { useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// Assuming this is your central button component that takes the new minimumQuantity prop
import AddItemBtn from './AddItemBtn';
import { useCartStore } from '@/hooks/useCartStore';
import { UOMPopup, MaxQuantityToast, Product, UOM } from '@/components/shared/UOMPopup';
// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';

interface YellowBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleDecrease: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleAddItem: (e: any) => void;
  handleRemove?: (e: any) => void;
  product?: Product;
  selectedRipenessType?: string | null;
  variantId?: number;
}
const YellowBtn = (props: YellowBtnProps) => {
  const { isItemPresent, handleDecrease, quantity, maxQuantity, handleIncrease, handleAddItem, handleRemove, product } =
    props;

  const { cart } = useCartStore();
  const cartItems = cart.items;
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  const isMax = quantity >= maxQuantity;

  const availableUOMs = product?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];
  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some((uom: any) => uom?.ripeness_types?.length > 0);
  const requiresSelection = hasMultipleUOMs || hasRipenessOptions;

  const getTotalCartQuantity = () => {
    if (!product) return 0;
    const normalizedProductId = product.id || (product as any).product_id;
    const cartProduct = cartItems.find((item: any) => {
      const itemProductId = item.id || item.product_id;
      return itemProductId === normalizedProductId;
    });
    if (!cartProduct) return 0;
    let total = 0;
    cartProduct.multiple_uoms?.forEach((uom: any) => {
      if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
        uom.cart_ripeness.forEach((r: any) => {
          total += Number(r.qty) || 0;
        });
      } else {
        total += Number(uom.cart_quantity) || 0;
      }
    });
    return total;
  };

  const totalCartQuantity = getTotalCartQuantity();
  const hasItemsInCart = totalCartQuantity > 0;
  const shouldShowStepper = (!requiresSelection && isItemPresent) || (requiresSelection && hasItemsInCart);
  const displayQty = requiresSelection ? totalCartQuantity : quantity;

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDir(-1);
    if (requiresSelection && product) {
      setIsPopupOpen(true);
      return;
    }
    if (quantity <= 1) {
      handleRemove?.(e);
    } else {
      handleDecrease(e);
    }
  };

  const onIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresSelection && product) {
      setIsPopupOpen(true);
      return;
    }
    if (isMax) {
      setToastMaxQuantity(maxQuantity);
      setShowMaxQuantityToast(true);
      return;
    }
    setDir(1);
    handleIncrease(e);
  };

  const onAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresSelection && product) {
      setIsPopupOpen(true);
    } else {
      handleAddItem(e);
    }
  };

  const handleSelectionMade = () => setIsPopupOpen(false);

  return (
    <>
      <MaxQuantityToast
        maxQuantity={toastMaxQuantity}
        isVisible={showMaxQuantityToast}
        onClose={() => setShowMaxQuantityToast(false)}
        itemName={product?.name}
      />

      <div className="w-full flex flex-col items-center">
        {/* Single morphing pill */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={!shouldShowStepper ? onAdd : undefined}
          className={`flex items-center h-[2.9vw] mob:h-[10vw] rounded-full border-[2px] p-[.3vw] ${
            shouldShowStepper ? 'mob:px-[.4vw]' : 'px-[1.2vw] mob:px-[2.5vw]'
          } w-full justify-center ${
            shouldShowStepper
              ? 'border-primary-200 bg-white cursor-default'
              : 'border-transparent bg-[#fac510] cursor-pointer'
          }`}
        >
          {/* Minus */}
          {shouldShowStepper && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.82 }}
              className="h-[1.8vw] w-[1.8vw] mob:h-[7vw] mob:w-[7vw] flex-shrink-0 rounded-full bg-primary text-black text-[1.4vw] mob:text-[5.5vw] font-semibold flex items-center justify-center border border-primary-200 mr-[.4vw] mob:mr-[2vw]"
              onClick={onDecrease}
            >
              <span className="mob:mb-[3px] mb-[2px]">–</span>
            </motion.button>
          )}

          {/* Centre */}
          <div className="flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {shouldShowStepper ? (
                <motion.p
                  key={displayQty}
                  initial={{ opacity: 0, y: dir * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: dir * -8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="text-[1.1vw] mob:text-[4.1vw] font-semibold text-black select-none text-center min-w-[1.2vw] mob:min-w-[5vw]"
                >
                  {displayQty}
                </motion.p>
              ) : (
                <motion.span
                  key="add-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="text-black font-bold text-base whitespace-nowrap mx-[0.6vw] mob:mx-[1.2vw]"
                >
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Plus / Dropdown Icon */}
          <motion.button
            layout
            whileTap={!isMax ? { scale: 0.82 } : {}}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className={`flex-shrink-0 flex items-center justify-center rounded-full bg-primary font-semibold ${
              shouldShowStepper
                ? isMax
                  ? 'h-[1.8vw] w-[1.8vw] mob:h-[7vw] mob:w-[7vw] bg-gray-300 text-gray-500 text-[1.4vw] mob:text-[5.5vw] border border-primary-200 ml-[.4vw] mob:ml-[2vw] cursor-not-allowed'
                  : 'h-[1.8vw] w-[1.8vw] mob:h-[7vw] mob:w-[7vw] text-[1.4vw] mob:text-[5.5vw] border border-primary-200 ml-[.4vw] mob:ml-[2vw]'
                : 'h-[1.5vw] w-[1.5vw] mob:h-[6.5vw] mob:w-[6.5vw] text-[1.2vw] mob:text-[4.5vw] bg-[#fac510]'
            }`}
            onClick={shouldShowStepper ? onIncrease : onAdd}
          >
            {shouldShowStepper ? (
              <span className="mob:mb-[3px] mb-[2px]">+</span>
            ) : requiresSelection ? (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: { xs: '4vw', md: '1.2vw' },
                  fontWeight: 'bold'
                }}
              />
            ) : (
              <span className="mob:mb-[3px] mb-[2px]">+</span>
            )}
          </motion.button>
        </motion.div>
      </div>

      {product && requiresSelection && (
        <UOMPopup
          product={product}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSelectionMade={handleSelectionMade}
        />
      )}
    </>
  );
};

export default YellowBtn;

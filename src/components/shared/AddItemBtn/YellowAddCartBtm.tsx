import React, { useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// Assuming this is your central button component that takes the new minimumQuantity prop
import AddItemBtn from './AddItemBtn';
// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';

// ==========================================================
// 1. Interface Definitions (Consolidated from both files)
// ==========================================================
interface UOM {
  conversion_text: string | null;
  is_available: boolean;
  is_default: boolean;
  is_visible: boolean;
  market_price: number;
  maximum_quantity: number;
  minimum_quantity: number; // The min quantity
  price: number;
  ripeness_types: string[];
  stepper_quantity: number; // The incremental quantity
  unit: string;
  uom_id: number;
  variant_id: number;
  formatted_price?: string;
  selected_ripeness_type?: string | null;
  cart_quantity?: number;
}

interface Product {
  id: number;
  item_code: string;
  name: string;
  image: string;
  multiple_images?: string[];
  multiple_uoms: UOM[];
  bg_color: string;
  is_available: boolean;
  is_greyed: boolean;
  is_orderable: boolean;
  navigation: {
    to: string;
  };
  tag_url: string | null;
}

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

// ==========================================================
// 2. MAX QUANTITY TOAST COMPONENT
// ==========================================================
const MaxQuantityToast: FC<{
  maxQuantity: number | null;
  isVisible: boolean;
  onClose: () => void;
  itemName?: string;
  isInsideModal?: boolean;
}> = ({ maxQuantity, isVisible, onClose, itemName = 'this item', isInsideModal = false }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || maxQuantity === null) return null;

  if (isInsideModal) {
    return (
      <div
        className={`absolute left-1/2 -top-14 transform -translate-x-1/2 w-[90%] transition-opacity duration-300 ease-in-out z-[9999] ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full relative">
          <div className="flex items-center justify-center w-full gap-2">
            <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem' }} />
            <p className="text-[0.70rem] font-semibold text-white text-center leading-tight">
              Maximum quantity of {maxQuantity} reached for {itemName}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-[60] left-1/2 bottom-4 transform -translate-x-1/2 w-[90%] max-w-sm transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full relative">
        <div className="flex items-center justify-center w-full gap-2">
          <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem' }} />
          <p className="text-[0.70rem] font-semibold text-white text-center leading-tight">
            Maximum quantity of {maxQuantity} reached for {itemName}.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// 3. UOM POPUP COMPONENT (FIX APPLIED HERE)
// ==========================================================
const UOMPopup: FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSelectionMade: (uom: UOM, ripeness: string | null) => void;
}> = ({ product, isOpen, onClose, onSelectionMade }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const cartItems = useSelector((state: any) => state.cart.items);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRipenessInfoOpen, setIsRipenessInfoOpen] = useState(false);

  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const getRipenessSvg = (ripeness: string) => {
    switch (ripeness.toLowerCase().replace(/ /g, '_')) {
      case 'raw':
        return rawSvg;
      case 'semi_ripe':
        return semiRipeSvg;
      case 'ripe':
        return ripeSvg;
      default:
        return null;
    }
  };

  const allVariants: UOM[] = [];
  product.multiple_uoms.forEach((uom) => {
    if (!uom.is_available) return;

    if (uom.ripeness_types && uom.ripeness_types.length > 0) {
      uom.ripeness_types.forEach((ripeness) => {
        allVariants.push({ ...uom, selected_ripeness_type: ripeness });
      });
    } else {
      allVariants.push({ ...uom, selected_ripeness_type: null });
    }
  });

  const variantsWithCartInfo = allVariants.map((variant) => {
    const cartProduct = cartItems.find((item: any) => item.id === product.id);

    let cart_quantity = 0;

    if (cartProduct) {
      const cartUOM = cartProduct.multiple_uoms?.find((uom: any) => uom.variant_id === variant.variant_id);

      if (cartUOM) {
        if (variant.selected_ripeness_type && cartUOM.cart_ripeness) {
          const ripenessObj = cartUOM.cart_ripeness.find(
            (r: any) => r.ripeness_type === variant.selected_ripeness_type
          );
          cart_quantity = ripenessObj ? Number(ripenessObj.qty) : 0;
        } else if (!variant.selected_ripeness_type) {
          cart_quantity = cartUOM.cart_quantity || 0;
        }
      }
    }

    return {
      ...variant,
      cart_quantity
    };
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsTransitioning(true), 10);
      setShowMaxQuantityToast(false);
      setToastMaxQuantity(null);
    } else {
      setIsTransitioning(false);
      setIsRipenessInfoOpen(false);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isTransitioning) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isTransitioning, onClose, isOpen]);

  const hasRipenessTypes = product.multiple_uoms.some((uom) => uom.ripeness_types && uom.ripeness_types.length > 0);

  if (!isOpen && !isTransitioning) return null;

  const subTotalQuantity = variantsWithCartInfo.reduce((acc, variant) => acc + (variant.cart_quantity || 0), 0);

  const subTotalPrice = variantsWithCartInfo.reduce(
    (acc, variant) => acc + variant.price * (variant.cart_quantity || 0),
    0
  );

  const cartVariants = variantsWithCartInfo.filter((v) => v.cart_quantity && v.cart_quantity > 0);

  const totalMarketPrice = cartVariants.reduce(
    (acc, variant) => acc + variant.market_price * (variant.cart_quantity || 0),
    0
  );

  const isSlashedSubtotalVisible =
    cartVariants.length > 0 && cartVariants.every((variant) => variant.market_price > variant.price);

  return (
    <div
      className={`fixed inset-0 z-[1001] transition-opacity duration-300 ${isTransitioning ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out flex flex-col max-h-[90vh]
            ${isTransitioning ? 'transform translate-y-0' : 'transform translate-y-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <MaxQuantityToast
          maxQuantity={toastMaxQuantity}
          isVisible={showMaxQuantityToast}
          onClose={() => setShowMaxQuantityToast(false)}
          itemName={product.name}
          isInsideModal={true}
        />

        <div className="flex-shrink-0 p-4 pb-3 border-b border-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-black hover:bg-gray-100 p-2 rounded-full transition-colors z-[60]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4 pr-10">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7EF] flex-shrink-0 flex items-center justify-center border border-gray-100 p-2">
              <Image
                src={product.image || sampleimg}
                alt={product.name}
                width={60}
                height={60}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-[SofiaPro] font-bold text-lg text-[#146321] leading-tight">{product.name}</p>
            </div>
          </div>
        </div>

        {hasRipenessTypes && (
          <div className="px-4 pt-2 pb-2 flex-shrink-0 relative z-[70]">
            <div className="flex justify-center">
              <button
                onClick={() => setIsRipenessInfoOpen(!isRipenessInfoOpen)}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 mb-1 rounded-full bg-[#F8F4E9]"
              >
                <Image
                  src={itemRipenessSvg}
                  alt="Ripeness Quotient"
                  width={38}
                  height={18}
                  className="object-contain"
                />
                <span className="text-[13px] font-bold text-[#0A8B5B] font-[SofiaPro]">
                  How does RQ (Ripeness Quotient) work?
                </span>
              </button>
            </div>

            <AnimatePresence>
              {isRipenessInfoOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden w-full"
                >
                  <div className="mt-2 bg-white rounded-2xl border border-[#F2EEE4] p-4 text-sm text-gray-700 space-y-3">
                    <p className="flex items-center gap-3 mb-1">
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Choose your level of ripeness:
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={ripeSvg} alt="" width={16} height={16} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Ripe: Consume immediately
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={semiRipeSvg} alt="" width={16} height={16} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Semi: Consume within 2 days
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={rawSvg} alt="" width={16} height={16} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Raw: Consume within 3-4 days (do not refrigerate)
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={infoicon2} alt="" width={20} height={20} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium text-start">
                        Your fruit arrives at the selected level or ripeness, fresh and ready for consumption when you
                        are.
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className={`flex-grow overflow-y-auto ${hasRipenessTypes ? 'p-4 pt-2 space-y-2' : 'p-4 space-y-2'}`}>
          {variantsWithCartInfo.map((variant) => {
            const isSelected = (variant.cart_quantity || 0) > 0;
            const ripenessLabel = variant.selected_ripeness_type
              ? variant.selected_ripeness_type.replace('_', ' ')
              : '';

            const hasDiscount = variant.market_price > variant.price;
            const discountPercent = hasDiscount
              ? Math.round(((variant.market_price - variant.price) / variant.market_price) * 100)
              : 0;

            const ripenessSvg = ripenessLabel ? getRipenessSvg(ripenessLabel) : null;

            return (
              <div
                key={`${variant.variant_id}-${ripenessLabel}`}
                className="flex items-center justify-between p-4 border-b border-solid border-[#EDE6D4] last:border-0 relative"
              >
                <div className="flex items-center gap-2 w-1/3 min-w-0 flex-shrink-0">
                  {ripenessSvg && (
                    <div className="flex-shrink-0">
                      <Image src={ripenessSvg} alt={ripenessLabel} width={20} height={20} />
                    </div>
                  )}
                  <p className="font-semibold text-gray-900 text-sm font-[SofiaPro] capitalize truncate">
                    {ripenessLabel || 'Standard'}
                  </p>
                </div>

                <div className="flex-1 text-center flex-shrink-0">
                  <p className="text-gray-600 text-sm font-[SofiaPro]">{variant.unit}</p>
                </div>

                <div className="flex flex-col items-center justify-center px-2 w-[85px] flex-shrink-0">
                  {/* {discountPercent > 0 && (
                    <div className="bg-[#146321] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tight mb-1">
                      Save {discountPercent}%
                    </div>
                  )} */}
                  <div className="flex items-center gap-1">
                    {hasDiscount && (
                      <span className="line-through text-[10px] text-gray-400 font-[SofiaPro]">
                        ₹{variant.market_price}
                      </span>
                    )}
                    <p className="font-bold text-sm text-[#146321] font-[SofiaPro]">₹{variant.price}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-1">
                  <AddItemBtn
                    product={product}
                    varientId={variant.variant_id}
                    varientPrice={variant.price}
                    stepperQuantity={variant.stepper_quantity}
                    minimumQuantity={variant.minimum_quantity}
                    buttonType="white"
                    selectedRipenessType={variant.selected_ripeness_type}
                    onCartUpdate={() => onSelectionMade(variant, variant.selected_ripeness_type || null)}
                    onMaxQuantityExceeded={handleMaxQuantityExceeded}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-shrink-0 p-3 bg-white">
          <div
            className={`
            flex justify-between items-center bg-black
            h-14 md:h-16
            p-4 rounded-full
          `}
          >
            <p className="font-normal font-[SofiaPro] text-sm text-white">
              {/* Sub total */}
              <span className="block text-xs font-normal mt-0.5 font-[SofiaPro]">
                {isSlashedSubtotalVisible && (
                  <span className="text-gray-400 line-through mr-1 text-xs font-normal">₹{totalMarketPrice}</span>
                )}
                <span className="text-base font-bold">₹{subTotalPrice}</span>
              </span>
            </p>
            <button
              onClick={onClose}
              disabled={subTotalQuantity === 0}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-colors shadow-md font-[SofiaPro] ${
                subTotalQuantity > 0
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// 4. YellowBtn Component (Steppers logic relies on the UOMPopup fix above)
// ==========================================================
const YellowBtn = (props: YellowBtnProps) => {
  const { isItemPresent, handleDecrease, quantity, maxQuantity, handleIncrease, handleAddItem, handleRemove, product } =
    props;

  const cartItems = useSelector((state: any) => state.cart.items);
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
    const cartProduct = cartItems.find((item: any) => item.id === product.id);
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
          className={`flex items-center h-[2.5vw] mob:h-[8.5vw] rounded-full border-[2px] p-[.3vw] mob:px-[.5vw] w-full justify-center ${
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
              className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] flex-shrink-0 rounded-full bg-primary text-black text-[1.67vw] mob:text-[5.1vw] flex items-center justify-center border border-primary-200 mr-[.4vw] mob:mr-[2vw]"
              onClick={onDecrease}
            >
              -
            </motion.button>
          )}

          {/* Centre */}
          <div className="flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {shouldShowStepper ? (
                <motion.p
                  key={displayQty}
                  initial={{ opacity: 0, y: dir * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: dir * -8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="text-[1.1vw] mob:text-[4.1vw] font-semibold text-black select-none text-center"
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
                  className="text-black font-bold text-base whitespace-nowrap mr-[.3vw]"
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
            className={`flex-shrink-0 flex items-center justify-center rounded-full bg-primary ${
              shouldShowStepper
                ? isMax
                  ? 'h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] bg-gray-300 text-gray-500 text-[1.4vw] mob:text-[5.1vw] border border-primary-200 ml-[.4vw] mob:ml-[2vw] cursor-not-allowed'
                  : 'h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] text-[1.4vw] mob:text-[5.1vw] border border-primary-200 ml-[.4vw] mob:ml-[2vw]'
                : 'h-[1.4vw] w-[1.4vw] mob:h-[5vw] mob:w-[5vw] text-[1.1vw] mob:text-[4vw] bg-[#fac510]'
            }`}
            onClick={shouldShowStepper ? onIncrease : onAdd}
          >
            {shouldShowStepper ? (
              '+'
            ) : requiresSelection ? (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: { xs: '4vw', md: '1.2vw' },
                  fontWeight: 'bold'
                }}
              />
            ) : (
              '+'
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

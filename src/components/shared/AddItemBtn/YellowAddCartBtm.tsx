import React, { useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import AddItemBtn from './AddItemBtn';
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';

interface UOM {
  conversion_text: string | null;
  is_available: boolean;
  is_default: boolean;
  is_visible: boolean;
  market_price: number;
  maximum_quantity: number;
  minimum_quantity: number;
  price: number;
  ripeness_types: string[];
  stepper_quantity: number;
  unit: string;
  uom_id: number;
  variant_id: number;
  formatted_price?: string;
  selected_ripeness_type?: string | null;
  cart_quantity?: number;
}

interface YellowBtnProps {
  isItemPresent: boolean;
  quantity: number;
  maxQuantity: number;
  handleDecrease: (e: any) => void;
  handleIncrease: (e: any) => void;
  handleAddItem: (e: any) => void;
  handleRemove?: (e: any) => void;
  product?: any;
  selectedRipenessType?: string | null;
  variantId?: number;
}

// UOM Popup Component
const UOMPopup: FC<{
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSelectionMade: (uom: UOM, ripeness: string | null) => void;
}> = ({ product, isOpen, onClose, onSelectionMade }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRipenessInfoOpen, setIsRipenessInfoOpen] = useState(false);

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
  product.multiple_uoms.forEach((uom: any) => {
    if (!uom.is_available) return;
    if (uom.ripeness_types?.length > 0) {
      uom.ripeness_types.forEach((ripeness: string) => {
        allVariants.push({ ...uom, selected_ripeness_type: ripeness });
      });
    } else {
      allVariants.push({ ...uom, selected_ripeness_type: null });
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsTransitioning(true), 10);
    } else {
      setIsTransitioning(false);
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

  const hasRipenessTypes = product.multiple_uoms.some(
    (uom: any) => uom?.ripeness_types?.length > 0
  );

  if (!isOpen && !isTransitioning) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isTransitioning
          ? 'bg-black bg-opacity-50'
          : 'bg-black bg-opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out flex flex-col max-h-[90vh] ${
          isTransitioning
            ? 'transform translate-y-0'
            : 'transform translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 pb-3 border-b border-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-[SofiaPro] font-bold text-lg text-gray-900 leading-tight">
                {product.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Ripeness Info Section */}
        {hasRipenessTypes && (
          <div className="p-4 pt-2 pb-2 flex-shrink-0">
            <button
              onClick={() =>
                setIsRipenessInfoOpen(!isRipenessInfoOpen)
              }
              className="flex items-center justify-center w-full gap-1 text-sm text-gray-700 font-semibold p-2 mb-1 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Image
                src={ripeSvg}
                alt="Ripe"
                width={14}
                height={14}
              />
              <Image
                src={semiRipeSvg}
                alt="Semi Ripe"
                width={14}
                height={14}
              />
              <Image
                src={rawSvg}
                alt="Raw"
                width={14}
                height={14}
              />
              <span className="text-xs font-bold text-green-700">
                What is ripeness options?
              </span>
              <svg
                className={`w-3 h-3 text-green-700 transition-transform duration-300 ${
                  isRipenessInfoOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isRipenessInfoOpen
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-2 rounded-lg text-xs text-gray-700 space-y-1 border border-gray-200">
                <p className="flex items-center gap-3">
                  <Image
                    src={infoicon1}
                    alt=""
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[1vw] mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Choose your preferred fruits and specify ripeness
                    level: Ripe, Semi Ripe, or Raw.
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Image
                    src={infoicon2}
                    alt=""
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[1vw] mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Your selected options will be delivered with your
                    order, ensuring the freshest produce just the way
                    you like it.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Variant List */}
        <div
          className={`flex-grow overflow-y-auto ${
            hasRipenessTypes
              ? 'p-4 pt-2 space-y-2'
              : 'p-4 space-y-2'
          }`}
        >
          {allVariants.map((variant) => {
            const ripenessLabel = variant.selected_ripeness_type
              ? variant.selected_ripeness_type.replace('_', ' ')
              : '';

            const hasDiscount =
              variant.market_price > variant.price;

            return (
              <div
                key={`${variant.variant_id}-${ripenessLabel}`}
                className="flex items-center justify-between p-2 rounded-lg border hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center flex-1 pr-2">
                  {getRipenessSvg(ripenessLabel) && (
                    <Image
                      src={getRipenessSvg(
                        ripenessLabel
                      )!}
                      alt={ripenessLabel}
                      width={20}
                      height={20}
                      className="mr-2 flex-shrink-0"
                    />
                  )}
                  {!getRipenessSvg(ripenessLabel) && (
                    <span className="text-lg mr-2"></span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 capitalize leading-none text-sm">
                      {ripenessLabel || product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {variant.unit}
                    </p>
                  </div>
                </div>

                {/* Price and Discount */}
                <div className="flex flex-col items-end mr-3 flex-shrink-0">
                  {hasDiscount && (
                    <span className="text-[0.6rem] font-medium text-green-500">
                      SAVE{' '}
                      {(
                        (1 - variant.price / variant.market_price) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {hasDiscount && (
                      <span className="line-through text-xs text-gray-400">
                        ₹{variant.market_price}
                      </span>
                    )}
                    <span className="font-bold text-base text-gray-900">
                      ₹{variant.price}
                    </span>
                  </div>
                </div>

                {/* Add Button */}
                <div className="w-[90px] flex-shrink-0">
                  <AddItemBtn
                    product={product}
                    varientId={variant.variant_id}
                    varientPrice={variant.price}
                    stepperQuantity={
                      variant.stepper_quantity
                    }
                    buttonType="black"
                    selectedRipenessType={
                      variant.selected_ripeness_type
                    }
                    onCartUpdate={() =>
                      onSelectionMade(
                        variant,
                        variant.selected_ripeness_type || null
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer/Confirm Button */}
        <div className="flex-shrink-0 p-3 bg-white">
          <button
            onClick={onClose}
            className="w-full px-8 py-3 bg-yellow-400 text-black rounded-full font-bold text-sm hover:bg-yellow-500 transition-colors"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

const YellowBtn = (props: YellowBtnProps) => {
  const {
    isItemPresent,
    handleDecrease,
    quantity,
    maxQuantity,
    handleIncrease,
    handleAddItem,
    handleRemove,
    product,
    selectedRipenessType,
    variantId,
  } = props;

  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isMax = quantity >= maxQuantity;

  useEffect(() => {
    if (isMax) {
      setShowMaxMessage(true);
    }
  }, [isMax]);

  useEffect(() => {
    if (showMaxMessage) {
      const timer = setTimeout(() => {
        setShowMaxMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMaxMessage]);

  // Check if product has multiple UOMs or ripeness options
  const availableUOMs =
    product?.multiple_uoms?.filter(
      (uom: any) => uom?.is_available
    ) || [];
  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some(
    (uom: any) => uom?.ripeness_types?.length > 0
  );
  const requiresSelection =
    hasMultipleUOMs || hasRipenessOptions;

  const onDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      handleRemove?.(e);
    } else {
      handleDecrease(e);
    }
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

    if (requiresSelection) {
      setIsPopupOpen(true);
    } else {
      handleAddItem(e);
    }
  };

  const handleSelectionMade = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        {isItemPresent && !requiresSelection ? (
          <>
            <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.8vw] mob:h-[9vw] w-full">
              <button
                className="h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full bg-[#FFDD00] text-black text-[1.1vw] mob:text-[4vw] flex items-center justify-center"
                onClick={onDecrease}
              >
                –
              </button>
              <p className="text-black font-semibold text-[1.1vw] mob:text-[3.6vw]">
                {quantity}
              </p>
              <button
                className={`h-[1.8vw] w-[1.8vw] mob:h-[5.5vw] mob:w-[5.5vw] rounded-full flex items-center justify-center text-[1.1vw] mob:text-[4vw] ${
                  isMax
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-[#FFDD00] text-black'
                }`}
                onClick={onIncrease}
              >
                +
              </button>
            </div>

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
          </>
        ) : (
          <button
            className="w-full bg-[#FFDD00] text-black font-medium text-base md:text-lg py-3 md:py-3"
            onClick={onAdd}
          >
            {requiresSelection ? 'More Options' : 'Add to cart'}
          </button>
        )}
      </div>

      {/* UOM Popup Modal */}
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
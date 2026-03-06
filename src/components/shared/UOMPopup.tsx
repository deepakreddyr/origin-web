import Image from 'next/image';
import { FC, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const NotifyToast: FC<{
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error';
}> = ({ message, isVisible, onClose, type }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-[100] left-1/2 bottom-10 transform -translate-x-1/2 w-[90%] max-w-sm transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-2xl h-12 px-6 w-full relative">
        <div className="flex items-center justify-center w-full gap-3">
          {type === 'error' && <InfoOutlinedIcon sx={{ color: '#fac510', fontSize: '1.2rem' }} />}
          <p className="text-[0.80rem] font-medium text-white text-center leading-tight font-[SofiaPro]">{message}</p>
        </div>
      </div>
    </div>
  );
};

// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';

export interface UOM {
  conversion_text: string | null;
  is_available: boolean;
  is_default: boolean;
  is_visible: boolean;
  market_price: number;
  maximum_quantity: number;
  minimum_quantity: number;
  price: number;
  ripeness_types?: string[];
  stepper_quantity: number;
  unit: string;
  uom_id: number;
  variant_id: number;
  formatted_price?: string;
  selected_ripeness_type?: string | null;
  cart_quantity?: number;
  basket?: {
    capacity: number;
    basket_items: any[];
  };
}

export interface Product {
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

export const MaxQuantityToast: FC<{
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

export const UOMPopup: FC<{
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
    const cartProduct = cartItems.find((item: any) => (item.id || item.product_id) === product.id);

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

  const cartVariants = variantsWithCartInfo.filter((v) => v.cart_quantity > 0);

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
                  <div className="mt-2 bg-white rounded-2xl border border-[#F2EEE4] p-4 text-sm text-gray-700 space-y-1">
                    <p className="flex items-center gap-3 mb-3">
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Choose your level of ripeness:
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={ripeSvg} alt="" width={12} height={12} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Ripe: Consume immediately
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={semiRipeSvg} alt="" width={12} height={12} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
                        Semi: Consume within 2 days
                      </span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Image src={rawSvg} alt="" width={12} height={12} className="flex-shrink-0 mt-1" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium mb-3">
                        Raw: Consume within 3-4 days (do not refrigerate)
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Image src={infoicon2} alt="" width={18} height={18} className="flex-shrink-0" />
                      <span className="text-sm mob:text-[3vw] font-[SofiaPro] font-medium">
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

            const hasDiscount = variant.market_price > 0 && variant.market_price > variant.price;
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
              Sub total
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

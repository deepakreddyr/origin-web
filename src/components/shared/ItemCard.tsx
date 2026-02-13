import Image from 'next/image';
import { Box, useMediaQuery } from '@mui/material';
import React, { useState, useEffect, useRef, FC } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import { useSelector } from 'react-redux';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import { protectedUrl } from '@/url';
import { useDispatch } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';

// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';

// Interface Definitions
interface UOM {
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

// ==========================================================
// MAX QUANTITY TOAST COMPONENT
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

// --------------------------------------------------------
// NOTIFY TOAST COMPONENT
// --------------------------------------------------------
const NotifyToast: FC<{
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

// --------------------------------------------------------
// UOM POPUP COMPONENT
// --------------------------------------------------------
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
          <div className="p-4 pt-2 pb-2 flex-shrink-0">
            <button
              onClick={() => setIsRipenessInfoOpen(!isRipenessInfoOpen)}
              className="flex items-center justify-center w-full gap-1 text-sm text-gray-700 font-semibold p-2 mb-1 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Image src={itemRipenessSvg} alt="Ripeness Quotient" width={50} height={50} />
              <span className="text-xs font-bold text-green-700 font-[SofiaPro]">
                How does RQ (Ripeness Quotient) work?
              </span>
              <svg
                className={`w-3 h-3 text-green-700 transition-transform duration-300 ${isRipenessInfoOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isRipenessInfoOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="p-2 rounded-lg text-sm text-gray-700 space-y-1 border border-gray-200">
                <p className="flex items-center gap-3 mb-3">
                  <span className="text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Choose your level of ripeness:
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Image src={ripeSvg} alt="" width={12} height={12} className="flex-shrink-0" />
                  <span className="text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Ripe: Consume immediately
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Image src={semiRipeSvg} alt="" width={12} height={12} className="flex-shrink-0" />
                  <span className="text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Semi: Consume within 2 days
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Image src={rawSvg} alt="" width={12} height={12} className="flex-shrink-0 mt-1" />
                  <span className="text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium mb-3">
                    Raw: Consume within 3-4 days (do not refrigerate)
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Image src={infoicon2} alt="" width={18} height={18} className="flex-shrink-0" />
                  <span className="text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium">
                    Your fruit arrives at the selected level or ripeness, fresh and ready for consumption when you are.
                  </span>
                </p>
              </div>
            </div>
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

// --------------------------------------------------------
// ITEM CARD COMPONENT
// --------------------------------------------------------
const ItemCard = ({ itemDetails }: { itemDetails: Product }) => {
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cart.items);

  const defaultUOM = itemDetails?.multiple_uoms?.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms?.[0];

  const initialRipeness = defaultUOM ? defaultUOM.ripeness_types?.[0] || null : null;

  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [selectedRipeness, setSelectedRipeness] = useState<string | null>(initialRipeness);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  // --- NOTIFY ME STATE ---
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');

  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);
  const isNotified = notifiedItems.includes(itemDetails.id);

  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const isMobile = useMediaQuery('(max-width:600px)');
  // -----------------------

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const handleNotifyMe = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['notifyMe'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const payload = {
      item_id: itemDetails.id
    };

    const successHandler = (data: any) => {
      setNotifyMsg(data?.message || 'Successfully subscribed to notifications');
      setNotifyType('success');
      setShowNotifyToast(true);
      dispatch(addNotifiedItem(itemDetails.id));
    };

    const failureHandler = (error: any) => {
      setNotifyMsg(error?.message || 'Not successful. Please try again later.');
      setNotifyType('error');
      setShowNotifyToast(true);
    };

    await sendDataToApi(apiUrl, payload, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  if (!defaultUOM) return null;

  // Check if this is a basket item
  const isBasketItem = defaultUOM.basket && typeof defaultUOM.basket.capacity === 'number';

  const availableUOMs = itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];

  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some((uom) => uom.ripeness_types && uom.ripeness_types.length > 0);
  const requiresSelection = hasMultipleUOMs || hasRipenessOptions;

  const handleSelectionMade = (uom: UOM, ripeness: string | null) => {
    setSelectedUOM(uom);
    setSelectedRipeness(ripeness);
  };

  const handleAddItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (requiresSelection) {
      e.preventDefault();
      setIsPopupOpen(true);
    }
  };

  const handleNavigation = () => {
    const slug = encodeURIComponent(itemDetails.name.replace(/ /g, '-').toLowerCase());
    router.push(`/${slug}/${itemDetails.id}`);
  };

  // Handle basket view button click
  const handleBasketViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleNavigation();
  };

  // Calculate total quantity across all UOMs/ripeness
  const currentCartProduct = cartItems.find((item: any) => item.id === itemDetails.id);

  let totalQuantityAcrossProduct = 0;

  if (currentCartProduct && currentCartProduct.multiple_uoms) {
    currentCartProduct.multiple_uoms.forEach((cartUOM: any) => {
      if (cartUOM.cart_ripeness && Array.isArray(cartUOM.cart_ripeness)) {
        cartUOM.cart_ripeness.forEach((r: any) => {
          totalQuantityAcrossProduct += Number(r.qty) || 0;
        });
      } else {
        totalQuantityAcrossProduct += Number(cartUOM.cart_quantity) || 0;
      }
    });
  }

  const totalOptionsCount = availableUOMs.reduce((acc, uom) => {
    return acc + (uom.ripeness_types?.length || 1);
  }, 0);

  return (
    <>
      <MaxQuantityToast
        maxQuantity={toastMaxQuantity}
        isVisible={showMaxQuantityToast}
        onClose={() => setShowMaxQuantityToast(false)}
        itemName={itemDetails.name}
      />

      <div className="w-full md:max-w-[16.67vw] text-start relative">
        <button onClick={handleNavigation} className="cursor-pointer w-full text-start group">
          {/* Image Container */}
          <div className="relative bg-primary-100 flex items-center justify-center w-[16.67vw] mob:w-[40vw] h-[14.5vw] mob:h-[38vw] rounded-[1.67vw] mob:rounded-[4.1vw] overflow-hidden">
            <div
              className={`relative w-[12.6vw] h-[12vw] mob:w-[24vw] mob:h-[22vw] transition-transform duration-500 group-hover:scale-105 ${!selectedUOM.is_available ? 'grayscale' : ''}`}
            >
              <Image
                src={itemDetails.image || sampleimg}
                alt={itemDetails.name ? itemDetails.name : 'product image'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {defaultUOM.conversion_text && (
              <div className="absolute top-2 right-2 text-[#146321] text-[0.7vw] mob:text-[2.5vw] font-bold px-2 py-0.5 rounded-full font-[SofiaPro]">
                {defaultUOM.conversion_text}
              </div>
            )}

            {hasRipenessOptions && (
              <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-lg">
                <Image src={itemRipenessSvg} alt="Multiple Ripeness Options" width={35} height={35} />
              </div>
            )}

            {!selectedUOM.is_available && (
              <div className="bg-black-op-50 absolute top-0 w-full px-[1.1vw] mob:px-[4.1vw] py-[.7vw] mob:py-[2vw] rounded-t-[1.1vw] mob:rounded-t-[4.1vw] flex justify-center">
                <p className="text-[.78vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-white">OUT OF STOCK</p>
              </div>
            )}
          </div>

          {/* Name Area */}
          <div className="h-[5.5vw] mob:h-[15vw] overflow-hidden">
            <p className="font-[SofiaPro] font-semibold text-[1.25vw] mob:text-[3.6vw] pt-[1.389vw] line-clamp-2">
              {itemDetails.name}
            </p>
          </div>

          {/* Price and Action Area */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[2.8vw] text-black-op-50">{selectedUOM.unit}</p>
              <div className="flex items-center gap-1 mob:pt-[01vw] pt-[.4vw]">
                {selectedUOM.market_price > selectedUOM.price && (
                  <p className="text-gray-400 line-through text-[0.8vw] mob:text-[2.2vw] font-[SofiaPro]">
                    ₹{selectedUOM.market_price}
                  </p>
                )}
                <p className="font-[SofiaPro] font-medium text-[1.25vw] mob:text-[3vw] text-black">
                  ₹{selectedUOM.price}
                </p>
              </div>
            </div>

            <div className="mb-1">
              {!selectedUOM.is_available ? (
                <button
                  type="button"
                  disabled={isNotified}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isNotified) handleNotifyMe();
                  }}
                  className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold h-[2.5vw] mob:h-[8.5vw] px-[1.5vw] mob:px-[4vw] rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                    isNotified ? 'cursor-default' : 'hover:bg-green-50'
                  }`}
                >
                  {!isNotified && <span className="text-[.97vw] mob:text-[3.2vw]">Notify</span>}
                  {isNotified ? (
                    <NotificationsActiveIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                  ) : (
                    <NotificationsIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                  )}
                </button>
              ) : isBasketItem ? (
                <button
                  type="button"
                  onClick={handleBasketViewClick}
                  className="bg-primary flex items-center justify-center h-[2.5vw] mob:h-[8.5vw] rounded-full px-[1.5vw] mob:px-[4.1vw] py-[.4vw] font-[SofiaPro] text-[.97vw] font-bold mob:text-[3.6vw] text-black hover:bg-yellow-400 transition-colors shadow-sm"
                >
                  VIEW
                </button>
              ) : requiresSelection ? (
                totalQuantityAcrossProduct > 0 ? (
                  <div className="flex h-[2.5vw]  mob:h-[8.5vw] items-center justify-center border-[2px] border-primary-200 rounded-full bg-white w-max p-[.3vw] mob:px-[.7vw]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPopupOpen(true);
                      }}
                      className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.1vw] flex items-center justify-center bg-primary rounded-full border border-primary-200"
                    >
                      <span className="mb-1">–</span>
                    </button>
                    <div className="w-[1.1vw] mx-[.5vw]  mob:mx-[3vw] flex items-center justify-center">
                      <p className="text-[1.1vw] mob:text-[4.1vw] font-semibold text-black">
                        {totalQuantityAcrossProduct}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPopupOpen(true);
                      }}
                      className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.1vw] flex items-center justify-center bg-primary rounded-full border border-primary-200"
                    >
                      <span className="mb-0.5">+</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddItemClick}
                    className="flex items-center justify-between bg-primary text-black font-[SofiaPro] font-bold h-[2.5vw] mob:h-[8.5vw] px-[1.1vw] mob:px-[3vw] rounded-full hover:bg-yellow-400 transition-colors whitespace-nowrap gap-2 border border-[#EDE6D4]"
                  >
                    <span className="text-[.97vw] mob:text-[2.8vw]">{totalOptionsCount} Options</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[1.2vw] h-[1.2vw] mob:w-[3.2vw] mob:h-[3.2vw]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="7 15 12 20 17 15" />
                      <polyline points="7 9 12 4 17 9" />
                    </svg>
                  </button>
                )
              ) : (
                <div className="w-[80px] mob:w-auto flex justify-end">
                  <AddItemBtn
                    product={itemDetails}
                    varientId={selectedUOM.variant_id}
                    varientPrice={selectedUOM.price}
                    stepperQuantity={selectedUOM.stepper_quantity}
                    minimumQuantity={selectedUOM.minimum_quantity}
                    buttonType="white"
                    selectedRipenessType={selectedRipeness}
                    onMaxQuantityExceeded={handleMaxQuantityExceeded}
                  />
                </div>
              )}
            </div>
          </div>
        </button>

        {requiresSelection && (
          <UOMPopup
            product={itemDetails}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSelectionMade={handleSelectionMade}
          />
        )}

        <NotifyToast
          isVisible={showNotifyToast}
          message={notifyMsg}
          type={notifyType}
          onClose={() => setShowNotifyToast(false)}
        />
      </div>
    </>
  );
};

export default ItemCard;

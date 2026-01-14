import Image from 'next/image';
import React, { useState, useEffect, useRef, FC } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import { useSelector } from 'react-redux';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg'
import infoicon2 from '/public/assets/svg/infoicon2.svg'
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
}> = ({ maxQuantity, isVisible, onClose, itemName = "this item", isInsideModal = false }) => {
    
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
                        <InfoOutlinedIcon sx={{color: 'yellow', fontSize: '1.2rem'}}/>
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
                    <InfoOutlinedIcon sx={{color: 'yellow', fontSize: '1.2rem'}}/>
                    <p className="text-[0.70rem] font-semibold text-white text-center leading-tight">
                        Maximum quantity of {maxQuantity} reached for {itemName}.
                    </p>
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
  }

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
      const cartUOM = cartProduct.multiple_uoms?.find(
        (uom: any) => uom.variant_id === variant.variant_id
      );
      
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
      cart_quantity,
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

  const hasRipenessTypes = product.multiple_uoms.some(uom => 
    uom.ripeness_types && uom.ripeness_types.length > 0
  );
  
  if (!isOpen && !isTransitioning) return null;

  const subTotalQuantity = variantsWithCartInfo.reduce(
    (acc, variant) => acc + (variant.cart_quantity || 0), 
    0
  );
  
  const subTotalPrice = variantsWithCartInfo.reduce(
    (acc, variant) => acc + (variant.price * (variant.cart_quantity || 0)),
    0
  );

  const cartVariants = variantsWithCartInfo.filter(v => v.cart_quantity > 0);
  
  const totalMarketPrice = cartVariants.reduce(
      (acc, variant) => acc + (variant.market_price * (variant.cart_quantity || 0)),
      0
  );
  
  const isSlashedSubtotalVisible = cartVariants.length > 0 && cartVariants.every(
      variant => variant.market_price > variant.price
  );

  return (
    <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isTransitioning ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0 pointer-events-none'}`}
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
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0" style={{ backgroundColor: '#FFF9E5' }}>
              <Image src={product.image || sampleimg} alt={product.name} width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-[SofiaPro] font-bold text-lg text-gray-900 leading-tight">
                {product.name}
              </h3>
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
                    <svg className={`w-3 h-3 text-green-700 transition-transform duration-300 ${isRipenessInfoOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isRipenessInfoOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-2 rounded-lg text-sm text-gray-700 space-y-1 border border-gray-200">
                        <p className="flex items-center gap-3 mb-3">
                            <span className='text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium'>
                                Choose your level of ripeness:
                            </span>
                        </p>
                        <p className="flex items-center gap-3">
                            <Image src={ripeSvg} alt='' width={12} height={12} className="flex-shrink-0" />
                            <span className='text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium'>
                                Ripe: Consume immediately
                            </span>
                        </p>
                        <p className="flex items-center gap-3">
                            <Image src={semiRipeSvg} alt='' width={12} height={12} className="flex-shrink-0" />
                            <span className='text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium'>
                                Semi: Consume within 2 days
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <Image src={rawSvg} alt='' width={12} height={12} className="flex-shrink-0 mt-1" />
                            <span className='text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium mb-3'>
                                Raw: Consume within 3-4 days (do not refrigerate)
                            </span>
                        </p>
                        <p className="flex items-center gap-3">
                            <Image src={infoicon2} alt='' width={18} height={18} className="flex-shrink-0" />
                            <span className='text-sm mob:text-[2.7vw] font-[SofiaPro] font-medium'>
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
                
            return (
              <div 
                key={`${variant.variant_id}-${ripenessLabel}`}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isSelected ? 'bg-yellow-50' : ' hover:border-gray-300'
                }`}
              >
                <div className="flex items-center flex-1 pr-2">
                    {getRipenessSvg(ripenessLabel) && (
                        <Image src={getRipenessSvg(ripenessLabel)!} alt={ripenessLabel} width={20} height={20} className="mr-2 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 capitalize leading-none text-base font-[SofiaPro]">
                            {ripenessLabel}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-[SofiaPro]">
                            {variant.unit}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end mr-3 flex-shrink-0">
                    <div className="flex items-center gap-1">
                        {hasDiscount && (
                            <span className="line-through text-xs text-gray-400 font-[SofiaPro]">
                                ₹{variant.market_price}
                            </span>
                        )}
                        <span className="font-bold text-lg text-gray-900 font-[SofiaPro]">
                            ₹{variant.price}
                        </span>
                    </div>
                </div>

                <div className="w-[90px] flex-shrink-0">
                  <AddItemBtn
                    product={product}
                    varientId={variant.variant_id}
                    varientPrice={variant.price}
                    stepperQuantity={variant.stepper_quantity}
                    minimumQuantity={variant.minimum_quantity} 
                    buttonType="black"
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
          <div className={`
            flex justify-between items-center bg-black
            h-14 md:h-16
            p-4 rounded-full
          `}>
            <p className="font-normal font-[SofiaPro] text-sm text-white">
                Sub total
                <span className='block text-xs font-normal mt-0.5 font-[SofiaPro]'>
                    {isSlashedSubtotalVisible && (
                        <span className="text-gray-400 line-through mr-1 text-xs font-normal">
                            ₹{totalMarketPrice}
                        </span> 
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
  
  const defaultUOM =
    itemDetails?.multiple_uoms?.find((uom: any) => uom?.is_default) ||
    itemDetails?.multiple_uoms?.[0];

  const initialRipeness = defaultUOM ? (defaultUOM.ripeness_types?.[0] || null) : null;

  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [selectedRipeness, setSelectedRipeness] = useState<string | null>(initialRipeness);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);
  
  const handleMaxQuantityExceeded = (maxQty: number) => {
      setToastMaxQuantity(maxQty);
      setShowMaxQuantityToast(true);
  };
  
  if (!defaultUOM) return null;

  // Check if this is a basket item
  const isBasketItem = defaultUOM.basket && 
                       typeof defaultUOM.basket.capacity === 'number';

  const availableUOMs =
    itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];
    
  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some(uom => 
    uom.ripeness_types && uom.ripeness_types.length > 0
  );
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
    if (selectedUOM.is_available) {
      const slug = encodeURIComponent(
        itemDetails.name.replace(/ /g, '-').toLowerCase()
      );
      router.push(`/${slug}/${itemDetails.id}`);
    }
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

  return (
    <>
      <MaxQuantityToast 
          maxQuantity={toastMaxQuantity}
          isVisible={showMaxQuantityToast}
          onClose={() => setShowMaxQuantityToast(false)}
          itemName={itemDetails.name}
      />
      
      <div className="rounded-[1rem] shadow-md overflow-hidden flex flex-col h-full relative">
        
        <button
          disabled={!selectedUOM.is_available}
          onClick={handleNavigation}
          className={`text-left w-full flex flex-col h-full ${!selectedUOM.is_available ? 'opacity-50' : ''}`}
        >
          <div className="w-full flex-shrink-0 relative">
            <div className="overflow-hidden bg-white flex justify-center items-center relative h-[110px] md:h-[170px]">
              <div className="relative w-[85%] h-[85%]">
                <Image
                  src={itemDetails.image || sampleimg}
                  alt={itemDetails.name || 'product image'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {hasRipenessOptions && (
                  <div className="absolute bottom-2 right-2 z-[5] p-1 bg-white rounded-full shadow-lg">
                      <Image 
                          src={itemRipenessSvg} 
                          alt="Multiple Ripeness Options" 
                          width={30}
                          height={30}
                      />
                  </div>
              )}

              {!selectedUOM.is_available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-[SofiaPro] text-sm font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="w-full flex-grow flex flex-col justify-between p-[1rem] rounded-b-[1rem]"
            style={{
              background: 'linear-gradient(180deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
              minHeight: '80px',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          >
            <div className="flex-shrink-0">
              <p className="font-[SofiaPro] font-semibold text-[0.8rem] leading-[1.2] line-clamp-2 text-black">
                {itemDetails.name}
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="flex justify-between items-center mb-[0.3rem]">
                <div className="flex items-center gap-[0.3rem]">
                  {selectedUOM.market_price > selectedUOM.price && selectedUOM.market_price > 0 ? (
                    <>
                      <p className="text-gray-400 line-through text-[0.65rem] font-[SofiaPro]">
                        ₹{selectedUOM.market_price}
                      </p>
                      <p className="text-black font-semibold text-[0.65rem] font-[SofiaPro]">
                        ₹{selectedUOM.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-black font-semibold text-[0.65rem] font-[SofiaPro]">
                      ₹{selectedUOM.price}
                    </p>
                  )}
                </div>

                <div className="relative">
                    <p className="text-right text-[#737373] text-[0.65rem] capitalize font-[SofiaPro]">
                      {selectedUOM.unit}
                    </p>
                </div>
              </div>

              <div className="rounded-[1rem] overflow-hidden">
                {/* Show "VIEW" button for basket items */}
                {isBasketItem ? (
                  <button
                    type="button"
                    onClick={handleBasketViewClick}
                    className="w-full h-7 bg-black text-white font-semibold text-xs rounded-[0.75rem] flex items-center justify-center hover:bg-gray-800 transition-colors font-[SofiaPro]"
                  >
                    VIEW
                  </button>
                ) : requiresSelection ? (
                  totalQuantityAcrossProduct > 0 ? (
                    <div className="flex items-center justify-between px-2 bg-white border-[2px] border-[#F3EEDF] rounded-full h-7">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsPopupOpen(true);
                        }}
                        className="h-5 w-5 rounded-full bg-black text-white text-sm flex items-center justify-center"
                      >
                        &#8722;
                      </button>

                      <p className="text-black font-semibold text-sm">
                        {totalQuantityAcrossProduct}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsPopupOpen(true);
                        }}
                        className="h-5 w-5 rounded-full bg-black text-white text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddItemClick}
                      className="w-full h-7 bg-black text-white font-semibold text-xs rounded-[0.75rem] flex items-center justify-center hover:bg-gray-800 transition-colors font-[SofiaPro]"
                    >
                      More Options
                    </button>
                  )
                ) : (
                  <AddItemBtn
                    product={itemDetails}
                    varientId={selectedUOM.variant_id}
                    varientPrice={selectedUOM.price}
                    stepperQuantity={selectedUOM.stepper_quantity}
                    minimumQuantity={selectedUOM.minimum_quantity} 
                    buttonType="black"
                    selectedRipenessType={selectedRipeness}
                    onMaxQuantityExceeded={handleMaxQuantityExceeded}
                  />
                )}
              </div>
            </div>
          </div>
        </button>
      </div>

      {requiresSelection && (
        <UOMPopup
          product={itemDetails}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSelectionMade={handleSelectionMade}
        />
      )}
    </>
  );
};

export default ItemCard;
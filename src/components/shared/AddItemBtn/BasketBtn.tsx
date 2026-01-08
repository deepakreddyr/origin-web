import React, { useState, useEffect, useRef, FC } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import MaxQuantityToast from '../MaxQuantityToast';

import addButton from '/public/assets/svg/addButton.svg';
import subButton from '/public/assets/svg/subButton.svg';

// ==========================================================
// INTERFACES
// ==========================================================
interface BasketItem {
  id: number;
  parent_id: number;
  child_id: number;
  name: string;
  image: string;
  price: string;
  uom: string;
  min_qty: number;
  max_qty: number;
  cart_qty: number;
  uom_conversion_in_grams: number;
  is_available: boolean;
}

interface UOM {
  variant_id: number;
  uom_id?: number;
  price: number;
  unit: string;
  cart_quantity: number;
  stepper_quantity: number;
  minimum_quantity: number;
  maximum_quantity: number;
  is_available: boolean;
  ripeness_types?: string[] | null;
  gift_text?: string | null;
  basket?: {
    capacity: number;
    basket_items: BasketItem[];
  };
}

interface Product {
  id: number;
  name: string;
  image: string;
  type?: string;
  multiple_uoms: UOM[];
  bg_color: string;
}

interface BasketBtnProps {
  product: Product;
  variantId: number;
  onMaxQuantityExceeded?: (max: number) => void;
  shouldOpenOnMount?: boolean;
  onPopupClose?: () => void;
}

// ==========================================================
// BASKET MODAL COMPONENT
// ==========================================================
const BasketPopup: FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  activeVariantId: number;
  onMaxQuantityExceeded?: (max: number) => void;
}> = ({ product, isOpen, onClose, activeVariantId, onMaxQuantityExceeded }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [giftText, setGiftText] = useState('');
  const [isGiftTextOpen, setIsGiftTextOpen] = useState(false);
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);
  const [toastItemName, setToastItemName] = useState<string>('');
  const [toastCustomMessage, setToastCustomMessage] = useState<string | undefined>(undefined);
  const cartItems = useSelector((state: any) => state.cart.items);
  const dispatch = useDispatch();

  // Find basket in cart
  const cartBasket = cartItems.find((item: any) =>
    item.id === product.id &&
    item.multiple_uoms?.some((u: any) => u.variant_id === activeVariantId)
  );

  const hasAddedToCart = !!cartBasket;

  // Get active UOM
  const activeUom = cartBasket
    ? cartBasket.multiple_uoms.find((u: any) => u.variant_id === activeVariantId)
    : product.multiple_uoms.find(u => u.variant_id === activeVariantId);

  const basketData = activeUom?.basket;

  // Merge cart basket items with original product basket items
  const originalBasketItems = product.multiple_uoms.find(u => u.variant_id === activeVariantId)?.basket?.basket_items || [];

  const basketItems = originalBasketItems.map((originalItem: BasketItem) => {
    const cartItem = basketData?.basket_items.find((ci: BasketItem) => ci.id === originalItem.id);
    return cartItem || { ...originalItem, cart_qty: 0 };
  });

  const parentQuantity = cartBasket ? activeUom?.cart_quantity || 0 : 0;

  const totalCapacityGrams = (basketData?.capacity || 0) * (parentQuantity || 1);
  const currentWeightGrams = basketItems.reduce((acc: number, item: BasketItem) =>
    acc + (item.cart_qty * item.uom_conversion_in_grams), 0) * (parentQuantity || 1);

  const isCapacityExceeded = currentWeightGrams > totalCapacityGrams;

  // Calculate total price properly
  const basketItemsTotal = basketItems.reduce((acc: number, item: BasketItem) =>
    acc + (item.cart_qty * Number(item.price)), 0) * (parentQuantity || 1);

  const parentTotal = (activeUom?.price || 0) * (parentQuantity || 1);
  const grandTotal = parentTotal + basketItemsTotal;

  // Initialize gift text from cart
  useEffect(() => {
    setGiftText(activeUom?.gift_text || '');
  }, [activeUom?.gift_text]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsTransitioning(true), 10);
    } else {
      setIsTransitioning(false);
      setTimeout(() => { document.body.style.overflow = 'unset'; }, 300);
    }
  }, [isOpen]);

  const ensureBasketInCart = () => {
    if (!hasAddedToCart) {
      dispatch({
        type: 'cart/addBasket',
        payload: {
          product,
          selectedUOM: product.multiple_uoms.find(u => u.variant_id === activeVariantId),
          variantId: activeVariantId
        }
      });
    }
  };

  const handleParentIncrease = () => {
    ensureBasketInCart();

    const currentQty = parentQuantity || 1;

    // Check if increasing would exceed max quantity
    if (currentQty + 1 > activeUom.maximum_quantity) {
      setToastMaxQuantity(activeUom.maximum_quantity);
      setToastItemName(product.name);
      setToastCustomMessage('Max quantity of baskets has been reached');
      setShowMaxQuantityToast(true);
      onMaxQuantityExceeded?.(activeUom.maximum_quantity);
      return;
    }

    dispatch({
      type: 'cart/increaseBasketQuantity',
      payload: {
        productId: product.id,
        variantId: activeVariantId
      }
    });
  };

  const handleParentDecrease = () => {
    if (!hasAddedToCart) return;

    if (parentQuantity <= 1) {
      dispatch({
        type: 'cart/removeBasket',
        payload: {
          productId: product.id,
          variantId: activeVariantId
        }
      });
      onClose();
      return;
    }
    dispatch({
      type: 'cart/decreaseBasketQuantity',
      payload: {
        productId: product.id,
        variantId: activeVariantId
      }
    });
  };

  const handleChildItemChange = (childItem: BasketItem, newQty: number) => {
    ensureBasketInCart();

    const minQty = childItem.min_qty;
    const maxQty = childItem.max_qty;

    // If user is trying to add (increase quantity)
    if (newQty > childItem.cart_qty) {
      // If adding from 0, jump to minimum quantity
      if (childItem.cart_qty === 0) {
        newQty = minQty;
      }

      // Check if new quantity exceeds max
      if (newQty > maxQty) {
        setToastMaxQuantity(maxQty);
        setToastItemName(childItem.name);
        setToastCustomMessage(undefined); // Use default message
        setShowMaxQuantityToast(true);
        onMaxQuantityExceeded?.(maxQty);
        return;
      }

      // Check capacity constraint
      const effectiveParentQty = parentQuantity || 1;

      const otherItemsWeight = basketItems
        .filter((item: BasketItem) => item.id !== childItem.id)
        .reduce((acc: number, item: BasketItem) => acc + (item.cart_qty * item.uom_conversion_in_grams), 0) * effectiveParentQty;

      const newTotalWeight = otherItemsWeight + (newQty * childItem.uom_conversion_in_grams * effectiveParentQty);

      if (newTotalWeight > totalCapacityGrams) {
        setToastCustomMessage('Max capacity of the basket has been reached');
        setToastMaxQuantity(null);
        setShowMaxQuantityToast(true);
        return;
      }
    }
    // If user is trying to decrease
    else if (newQty < childItem.cart_qty) {
      // If reducing below min_qty, go to 0
      if (newQty < minQty) {
        newQty = 0;
      }
    }

    // If quantity is 0, remove the item
    if (newQty === 0) {
      dispatch({
        type: 'cart/removeBasketItem',
        payload: {
          productId: product.id,
          variantId: activeVariantId,
          childItemId: childItem.id
        }
      });
      return;
    }

    dispatch({
      type: 'cart/updateBasketItem',
      payload: {
        productId: product.id,
        variantId: activeVariantId,
        childItem: childItem,
        newQuantity: newQty
      }
    });
  };

  const handleGiftTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setGiftText(text);
    }
  };

  const handleSubmitGiftText = () => {
    ensureBasketInCart();

    if (giftText.trim().length === 0) {
      setIsGiftTextOpen(false);
    }

    dispatch({
      type: 'cart/updateBasketGiftText',
      payload: {
        productId: product.id,
        variantId: activeVariantId,
        giftText: giftText
      }
    });
  };

  const handleClearGiftText = () => {
    setGiftText('');
    if (hasAddedToCart) {
      dispatch({
        type: 'cart/updateBasketGiftText',
        payload: {
          productId: product.id,
          variantId: activeVariantId,
          giftText: ''
        }
      });
    }
  };

  const toggleGiftText = () => {
    if (isGiftTextOpen) {
      handleSubmitGiftText();
    }
    setIsGiftTextOpen(!isGiftTextOpen);
  };

  const handleDone = () => {
    const hasAnyItems = basketItems.some((item: BasketItem) => item.cart_qty > 0);

    if (!hasAnyItems && !hasAddedToCart) {
      onClose();
      return;
    }

    if (hasAnyItems) {
      if (!hasAddedToCart) {
        ensureBasketInCart();
      }
      if (parentQuantity === 0) {
        dispatch({
          type: 'cart/increaseBasketQuantity',
          payload: {
            productId: product.id,
            variantId: activeVariantId
          }
        });
      }
    }

    onClose();
  };

  if (!isOpen && !isTransitioning) return null;

  const displayQuantity = hasAddedToCart ? parentQuantity : 1;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 flex items-end justify-center ${isTransitioning ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col h-[90vh] ${isTransitioning ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-6 py-4 pb-2 flex-shrink-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h2 className="text-lg font-bold font-[SofiaPro] text-black">Fill your basket</h2>
            </div>

            <MaxQuantityToast
              maxQuantity={toastMaxQuantity}
              isVisible={showMaxQuantityToast}
              onClose={() => setShowMaxQuantityToast(false)}
              itemName={toastItemName}
              isInsideModal={true}
              customMessage={toastCustomMessage}
            />
          </div>

          {/* Info Text & Capacity */}
          <div className="flex justify-between items-center text-xs font-[SofiaPro] border-b border-gray-200 pb-2 mb-2">
            <span className="text-gray-500">*All baskets will have the same items</span>
            <span className={`font-medium ${isCapacityExceeded ? 'text-red-500' : 'text-gray-500'}`}>
              {(currentWeightGrams / 1000).toFixed(2)}Kg out of {(totalCapacityGrams / 1000).toFixed(1)}Kg
            </span>
          </div>

          {/* Parent Basket Control - Using BlackBtn UI */}
          <div className="flex items-center justify-between py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-contain" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-sm font-[SofiaPro]">{product.name}</h3>
                <p className="text-[11px] text-gray-400 font-[SofiaPro]">{displayQuantity} pack</p>
              </div>
            </div>

            {/* Quantity Control - BlackBtn Style */}
            <div className="w-[100px] flex justify-end">
              {hasAddedToCart ? (
                <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[36px] w-full min-h-[36px]">
                  <button
                    className="h-[1.5vw] w-[1.5vw] mob:h-[24px] mob:w-[24px] min-h-[24px] min-w-[24px] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
                    onClick={handleParentDecrease}
                  >
                    <Image src={subButton} alt="" />
                  </button>

                  <p className="text-black font-semibold text-[1vw] mob:text-[14px]">
                    {displayQuantity}
                  </p>

                  <button
                    className="h-[1.5vw] w-[1.5vw] mob:h-[24px] mob:w-[24px] min-h-[24px] min-w-[24px] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
                    onClick={handleParentIncrease}
                  >
                    <Image src={addButton} alt="" />
                  </button>
                </div>
              ) : (
                <button
                  className="w-full h-[2.2vw] mob:h-[36px] min-h-[36px] bg-black text-white rounded-full font-semibold text-[1vw] mob:text-[14px]"
                  onClick={ensureBasketInCart}
                >
                  Add
                </button>
              )}
            </div>
          </div>

          {/* Gift Message Section */}
          <div className={`transition-all duration-300 ${isGiftTextOpen ? 'mb-4' : 'mb-2'}`}>
            <button
              onClick={toggleGiftText}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-2">
                <Image src="/assets/svg/gift_card.svg" alt="Gift Card" width={20} height={20} />
                <span className="text-sm text-gray-600 font-[SofiaPro] underline decoration-gray-400 underline-offset-2 group-hover:text-gray-900 transition-colors">
                  Say something special
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isGiftTextOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isGiftTextOpen && (
              <div className="mt-3 relative animate-fadeIn">
                <textarea
                  value={giftText}
                  onChange={handleGiftTextChange}
                  placeholder="Enter your message here..."
                  className="w-full h-24 px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[#FFDD00] font-[SofiaPro] shadow-sm text-left"
                  maxLength={100}
                  autoFocus
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[10px] text-gray-400 font-[SofiaPro]">{giftText.length}/100</span>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClearGiftText}
                      className="text-xs font-bold text-red-500 hover:text-red-600 font-[SofiaPro]"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        handleSubmitGiftText();
                        setIsGiftTextOpen(false);
                      }}
                      className="text-xs font-bold text-[#25874D] hover:text-[#1d6a3d] font-[SofiaPro]"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Basket Items List - Using BlackBtn UI */}
        <div className="flex-grow overflow-y-auto px-4 pb-24 space-y-3">
          {basketItems.map((item: BasketItem) => {
            const minQtyForItem = item.min_qty;

            return (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F7F0] hover:bg-white transition-colors">
                <div className="flex-1 text-left">
                  <p className="font-bold text-[13px] font-[SofiaPro] text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-500 font-[SofiaPro]">
                    {item.uom}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center w-[80px]">
                    {item.cart_qty > 0 ? (
                      <div className="flex items-center justify-between px-[0.6vw] mob:px-[8px] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[32px] w-full min-h-[32px]">
                        <button
                          className="h-[1.5vw] w-[1.5vw] mob:h-[20px] mob:w-[20px] min-h-[20px] min-w-[20px] rounded-full bg-black text-white flex items-center justify-center"
                          onClick={() => handleChildItemChange(item, item.cart_qty - 1)}
                        >
                          <Image src={subButton} alt="" />
                        </button>

                        <p className="text-black font-semibold text-[1vw] mob:text-[12px]">
                          {item.cart_qty}
                        </p>

                        <button
                          className="h-[1.5vw] w-[1.5vw] mob:h-[20px] mob:w-[20px] min-h-[20px] min-w-[20px] rounded-full bg-black text-white flex items-center justify-center"
                          onClick={() => handleChildItemChange(item, item.cart_qty + 1)}
                        >
                          <Image src={addButton} alt="" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full h-[2.2vw] mob:h-[32px] min-h-[32px] bg-black text-white rounded-full font-semibold text-[1vw] mob:text-[11px]"
                        onClick={() => handleChildItemChange(item, minQtyForItem)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <span className="text-[13px] font-medium min-w-[30px] text-right font-[SofiaPro] text-gray-600">
                    ₹{Math.floor(Number(item.price))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Bar */}
        <div className="absolute bottom-6 left-0 w-full px-4 flex justify-center z-10">
          <div className="bg-[#1A1A1A] text-white w-full rounded-full h-[60px] flex items-center justify-between px-6 shadow-2xl">
            <span className="font-bold text-lg font-[SofiaPro]">₹{Math.floor(grandTotal)}</span>
            <button
              onClick={handleDone}
              className="bg-[#FFDD00] text-black font-bold font-[SofiaPro] px-8 py-2.5 rounded-full uppercase text-sm tracking-wide hover:bg-[#FFE44D] transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// MAIN BasketBtn COMPONENT - Using BlackBtn UI
// ==========================================================
const BasketBtn = ({
  product,
  variantId,
  onMaxQuantityExceeded,
  shouldOpenOnMount = false,
  onPopupClose
}: BasketBtnProps) => {
  const dispatch = useDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const cartItems = useSelector((state: any) => state.cart.items);

  const isBasketType = product?.type === 'basket';

  const cartBasket = cartItems.find((item: any) =>
    item.id === product.id &&
    item.multiple_uoms?.some((u: any) => u.variant_id === variantId)
  );

  const quantity = cartBasket
    ? cartBasket.multiple_uoms.find((u: any) => u.variant_id === variantId)?.cart_quantity || 0
    : 0;

  const isItemPresent = quantity > 0;

  useEffect(() => {
    if (shouldOpenOnMount && isBasketType && product && !isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldOpenOnMount, isBasketType, product]);

  const handleMainAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    if (onPopupClose) {
      onPopupClose();
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        {isItemPresent ? (
          <div className="flex items-center justify-between px-[0.6vw] mob:px-[3vw] bg-white border-[2px] border-[#F3EEDF] rounded-full h-[2.2vw] mob:h-[7vw] w-full cursor-pointer" onClick={() => setIsPopupOpen(true)}>
            <button
              className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Decrease is handled by opening modal
                setIsPopupOpen(true);
              }}
            >
              <Image src={subButton} alt="" />
            </button>

            <p className="text-black font-semibold text-[1vw] mob:text-[3.2vw]">
              {quantity}
            </p>

            <button
              className="h-[1.5vw] w-[1.5vw] mob:h-[4.5vw] mob:w-[4.5vw] rounded-full bg-black text-white text-[1vw] mob:text-[3.5vw] flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Increase is handled by opening modal
                setIsPopupOpen(true);
              }}
            >
              <Image src={addButton} alt="" />
            </button>
          </div>
        ) : (
          <button
            className="w-full h-[3vw] mob:h-[10vw] bg-[#FFDD00] text-black font-black font-semibold text-[1vw] mob:text-[3.2vw]"
            onClick={handleMainAction}
          >
            View Basket Items
          </button>
        )}
      </div>

      {product && isBasketType && (
        <BasketPopup
          product={product}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          activeVariantId={variantId}
          onMaxQuantityExceeded={onMaxQuantityExceeded}
        />
      )}
    </>
  );
};

export default BasketBtn;
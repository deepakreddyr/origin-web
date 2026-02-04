import React, { useState } from 'react';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import Image from 'next/image';
import deleteIcon from '/public/assets/icons/deleteIcon.png';
import { removeItemFromCart, removeFreeItemFromCart } from '@/store/slice/CartSlice';
import { useDispatch } from 'react-redux';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// --- NEW IMPORTS for Ripeness Icons ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';

// Map ripeness key to SVG icon, display text, and color
const ripenessMap: {
  [key: string]: { text: string; image: any; color: string };
} = {
  raw: { text: 'Raw', image: rawSvg, color: '#878787' },
  semi_ripe: { text: 'Semi', image: semiRipeSvg, color: '#878787' },
  ripe: { text: 'Ripe', image: ripeSvg, color: '#878787' },
};

// Helper component to render the Ripeness Icon and Text
const RipenessIndicator = ({ ripenessType }: { ripenessType: string }) => {
  // Normalize ripenessType to match map keys (e.g., "semi_ripe")
  const ripenessKey = ripenessType.toLowerCase().replace(/\s/g, '_');
  const info = ripenessKey && ripenessMap[ripenessKey] ? ripenessMap[ripenessKey] : null;

  if (!info) return null;

  return (
    <div className="flex items-center whitespace-nowrap">
      {/* SVG Icon */}
      <div className="w-[.6vw] h-[.6vw] mob:w-[2.2vw] mob:h-[2.2vw] flex items-center justify-center mr-[.2vw]">
        <Image
          src={info.image}
          alt={`${info.text} ripeness`}
          width={10}
          height={10}
          className="object-contain"
        />
      </div>
      {/* Ripeness Text */}
      <span
        className={`font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium capitalize`}
        style={{ color: info.color }}
      >
        {info.text}
      </span>
    </div>
  );
};
// --- END NEW HELPERS ---

// ==========================================================
// MAX QUANTITY TOAST COMPONENT FOR REVIEW CART (KEPT FOR REFERENCE/IMPORT)
// This component should be moved to a shared file if used in other places, 
// but we keep it here for now and ensure it's rendered higher up.
// ==========================================================
const MaxQuantityToast: React.FC<{
  maxQuantity: number | null;
  isVisible: boolean;
  onClose: () => void;
}> = ({ maxQuantity, isVisible, onClose }) => {

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || maxQuantity === null) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full">
        <div className="flex items-center justify-center w-full gap-2">
          <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem' }} />
          <p className="text-[0.70rem] mob:text-[2.8vw] font-semibold text-white text-center leading-tight">
            Maximum quantity of {maxQuantity} reached for this item.
          </p>
        </div>
      </div>
    </div>
  );
};
// ==========================================================

// UPDATED ReviewItem PROPS: Added onShowMaxQuantityToast and isFreeItem
const ReviewItem = (props: {
  product: any;
  uom: any;
  ripenessType: string | null;
  onShowMaxQuantityToast: (maxQty: number) => void;
  isFreeItem?: boolean;
}) => {
  const { product, uom, ripenessType, onShowMaxQuantityToast, isFreeItem = false } = props;
  const dispatch = useDispatch();

  // --- REMOVED TOAST STATE ---
  // const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  // const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  // Updated handler to call the prop passed from the parent (Cart)
  const handleMaxQuantityExceeded = (maxQty: number) => {
    onShowMaxQuantityToast(maxQty);
  };
  // -----------------------

  const calculateItemTotalPrice = (price: any, quantity: any) => {
    return price * quantity;
  };

  // Get the quantity for this specific ripeness type (or total if no ripeness)
  let itemQuantity = 0;
  if (ripenessType && uom.cart_ripeness) {
    const ripenessObj = uom.cart_ripeness.find((r: any) => r.ripeness_type === ripenessType);
    itemQuantity = ripenessObj ? Number(ripenessObj.qty) : 0;
  } else {
    itemQuantity = uom.cart_quantity;
  }

  // Prepare payload for removeItemFromCart
  const removeItemPayload = {
    varientId: uom.variant_id,
    selectedRipenessType: ripenessType
  };

  const hasRipeness = !!ripenessType;

  return (
    // REMOVED MaxQuantityToast RENDER HERE
    <li
      style={{
        background:
          uom.cart_quantity > uom.maximum_quantity
            ? 'linear-gradient(89.43deg, rgba(208, 88, 63, 0.2) 0.49%, rgba(255, 255, 255, 0) 99.51%)'
            : ''
      }}
      className="review-cart-list mob:pl-[4.1vw] mob:py-[3vw] px-[1.1vw] py-[.6vw] w-full"
    >
      <div className="flex items-center gap-[.78vw] grow mob:gap-[3vw] justify-between">
        <div className="review-cart-info flex gap-3 items-center mob:w-[60vw] grow">
          <figure className="w-[4vw] h-[4vw] mob:w-[15vw] mob:h-[15vw] rounded-lg bg-[#F2EEE4] flex-shrink-0 m-0 p-1 overflow-hidden relative">
            <img
              src={product.image || '/public/assets/images/shop/sampleimg2.png'}
              alt="product image"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            {/* Free Badge */}
            {isFreeItem && (
              <div className="absolute bottom-0 left-0 bg-[#FFDD00] text-black text-[.5vw] mob:text-[2vw] font-semibold px-[.3vw] mob:px-[1.2vw] py-[.1vw] mob:py-[.4vw] rounded-tr-md">
                Free
              </div>
            )}
          </figure>
          <div className="review-cart-information flex flex-col">
            <p className="font-[sofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">
              {product?.name}
            </p>

            {/* --- UPDATED DISPLAY: Ripeness (Icon+Text) + Dot + Unit --- */}
            <div className="flex items-center text-black/60 text-[.83vw] mob:text-[3vw] font-[sofiaPro] capitalize">

              {/* Ripeness Icon and Text (Only renders if ripenessType is defined) */}
              {hasRipeness && <RipenessIndicator ripenessType={ripenessType} />}

              {/* Separator Dot (Only renders if ripenessType is defined) */}
              {hasRipeness && (
                <span className="font-extrabold text-[.83vw] mob:text-[3vw] mx-[.15vw]">
                  •
                </span>
              )}

              {/* Unit Display */}
              <span>
                {uom.unit}
              </span>
            </div>
            {/* --- END UPDATED DISPLAY --- */}

          </div>
        </div>

        {uom.is_available ? (
          isFreeItem ? (
            // Free item: show REMOVE button
            <button
              onClick={() => dispatch(removeFreeItemFromCart(product.item_code))}
              className="px-[1.5vw] mob:px-[5vw] py-[.5vw] mob:py-[2vw] rounded-full font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3vw] bg-white border border-[#231F20] text-[#231F20] hover:bg-gray-100 transition-all"
            >
              REMOVE
            </button>
          ) : (
            // Regular item: show quantity stepper and price
            <div className="flex gap-3 items-center">
              <div className="w-[5.6vw] mob:w-[21vw]">
                <AddItemBtn
                  product={product}
                  varientId={uom.variant_id}
                  varientPrice={uom.price}
                  stepperQuantity={uom.stepper_quantity}
                  buttonType="black"
                  selectedRipenessType={ripenessType}
                  onMaxQuantityExceeded={handleMaxQuantityExceeded}
                />
              </div>
              <div className="review-cart-counter flex flex-col items-center w-[2vw] mob:w-[12vw]">
                {uom.market_price !== null && uom.market_price !== undefined && uom.market_price !== 0 && uom.market_price > uom.price && (
                  <span className="font-[sofiaPro] text-[.78vw] mob:text-[2.8vw] line-through text-[#231F2099]">
                    ₹{calculateItemTotalPrice(uom.market_price, itemQuantity)}
                  </span>
                )}
                <span className="font-[sofiaPro] text-[.83vw] mob:text-[3.3vw]">
                  ₹{calculateItemTotalPrice(uom.price, itemQuantity)}
                </span>
              </div>
            </div>
          )
        ) : (
          <button
            onClick={() => {
              dispatch(removeItemFromCart(removeItemPayload));
            }}
            className="flex items-center"
          >
            <p className="font-[SofiaPro] font-semibold text-[.83vw] mob:text-[3.3vw] text-[#C70000] whitespace-nowrap">
              OUT OF STOCK
            </p>
            <div className="relative w-[2.5vw] h-[2.5vw] mob:w-[6vw] mob:h-[6vw]">
              <Image src={deleteIcon} alt="delete icon" />
            </div>
          </button>
        )}
      </div>

      {uom.maximum_quantity > 1 && uom.cart_quantity > uom.maximum_quantity && (
        <div>
          <p className="font-[SofiaPro] text-[0.83vw] mob:text-[3vw] mt-[.4vw] font-medium text-semibold text-danger">
            Maximum available <span className="font-semibold">{uom.maximum_quantity}</span>. Please change the Quantity.
          </p>
        </div>
      )}
    </li>
  );
};

export default ReviewItem;
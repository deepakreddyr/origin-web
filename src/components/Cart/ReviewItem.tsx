import React, { useState } from 'react';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import Image from 'next/image';
import deleteIcon from '/public/assets/icons/deleteIcon.png';
import { removeItemFromCart, updateBasketItem, removeBasketItem } from '@/store/slice/CartSlice';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

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
  const ripenessKey = ripenessType.toLowerCase().replace(/\s/g, '_');
  const info = ripenessKey && ripenessMap[ripenessKey] ? ripenessMap[ripenessKey] : null;

  if (!info) return null;

  return (
    <div className="flex items-center whitespace-nowrap">
      <div className="w-[.6vw] h-[.6vw] mob:w-[2.2vw] mob:h-[2.2vw] flex items-center justify-center mr-[.2vw]">
        <Image
          src={info.image}
          alt={`${info.text} ripeness`}
          width={10}
          height={10}
          className="object-contain"
        />
      </div>
      <span
        className={`font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium capitalize`}
        style={{ color: info.color }}
      >
        {info.text}
      </span>
    </div>
  );
};

const ReviewItem = (props: {
  product: any;
  uom: any;
  ripenessType: string | null;
  onShowMaxQuantityToast: (maxQty: number) => void;
}) => {
  const { product, uom, ripenessType, onShowMaxQuantityToast } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const loginDetails = useSelector((state: any) => state.loginDetails);

  // Single state for basket toggle
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const handleMaxQuantityExceeded = (maxQty: number) => {
    onShowMaxQuantityToast(maxQty);
  };

  const calculateItemTotalPrice = (price: any, quantity: any) => {
    return price * quantity;
  };

  let itemQuantity = 0;
  if (ripenessType && uom.cart_ripeness) {
    const ripenessObj = uom.cart_ripeness.find((r: any) => r.ripeness_type === ripenessType);
    itemQuantity = ripenessObj ? Number(ripenessObj.qty) : 0;
  } else {
    itemQuantity = uom.cart_quantity;
  }

  const removeItemPayload = {
    varientId: uom.variant_id,
    selectedRipenessType: ripenessType
  };

  const hasRipeness = !!ripenessType;
  const hasGiftText = uom.gift_text && uom.gift_text.trim() !== '';

  // Function to handle navigation to PDP with basket popup open
  const handleEditBasket = () => {
    if (loginDetails.isSidebarOpen) {
      dispatch(setIsSidebarOpen(false));
    }

    setTimeout(() => {
      router.push({
        pathname: `/big-basket/${product.id}`,
        query: { openBasket: 'true', variantId: uom.variant_id }
      });
    }, 100);
  };

  return (
    <li
      style={{
        background:
          uom.cart_quantity > uom.maximum_quantity
            ? 'linear-gradient(89.43deg, rgba(208, 88, 63, 0.2) 0.49%, rgba(255, 255, 255, 0) 99.51%)'
            : ''
      }}
      className="review-cart-list mob:pl-[4.1vw] mob:py-[3vw] px-[1.1vw] py-[.6vw] w-full"
    >
      <div className="flex flex-col w-full">
        {/* Main Item Row */}
        <div className="flex items-start gap-[.78vw] grow mob:gap-[3vw] justify-between">
          <div className="review-cart-info flex gap-3 items-start mob:w-[60vw] grow">
            <figure className="w-[4vw] h-[4vw] mob:w-[15vw] mob:h-[15vw] rounded-lg bg-[#F2EEE4] flex-shrink-0 m-0 p-1 overflow-hidden">
              <img
                src={product.image || '/public/assets/images/shop/sampleimg2.png'}
                alt="product image"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </figure>
            <div className="review-cart-information flex flex-col w-full">
              <h4 className="font-[sofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">
                {product?.name}
              </h4>

              <div className="flex flex-wrap items-center text-black/60 font-[sofiaPro] capitalize">
                {/* Wrap Ripeness and Unit together to ensure they stay together if possible */}
                <div className="flex items-center text-[.83vw] mob:text-[2.8vw]">
                  {hasRipeness && <RipenessIndicator ripenessType={ripenessType} />}
                  {hasRipeness && (
                    <span className="font-extrabold mx-[.15vw] mob:mx-[0.8vw]">
                      •
                    </span>
                  )}
                  <span className="whitespace-nowrap">{uom.unit}</span>
                </div>

                {/* View Items Toggle - Now strictly next to the unit */}
                {uom.basket && (
                  <button
                    onClick={() => setIsBasketOpen(!isBasketOpen)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <span className="font-extrabold text-[.83vw] mob:text-[2.8vw] px-1 mob:px-[1vw]">
                      •
                    </span>
                    <span className="font-[SofiaPro] text-[.83vw] mob:text-[2.8vw] font-semibold underline whitespace-nowrap">
                      {isBasketOpen ? 'Hide Items' : 'View Items'}
                    </span>
                    <svg
                      className={`w-[.8vw] h-[.8vw] mob:w-[2.5vw] mob:h-[2.5vw] ml-0.5 transition-transform ${isBasketOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Gift Card indicator - clicking opens basket items */}
              {hasGiftText && (
                <button
                  onClick={() => setIsBasketOpen(!isBasketOpen)}
                  className="mt-[.5vw] mob:mt-[2vw] flex items-center gap-[.4vw] mob:gap-[1.5vw] hover:opacity-80 transition-opacity w-fit"
                >
                  <div className="w-[1vw] h-[1vw] mob:w-[3.6vw] mob:h-[3.6vw] relative">
                    <Image src="/assets/svg/gift_card.svg" alt="Gift Card" fill className="object-contain" />
                  </div>
                  <span className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-[#25874D]">
                    Gift Card Added
                  </span>
                </button>
              )}
            </div>
          </div>

          {uom.is_available ? (
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
                    ₹{uom.basket
                      ? calculateItemTotalPrice(uom.market_price, itemQuantity) + (uom.basket.basket_items.reduce((acc: number, bi: any) => acc + (bi.cart_qty * Number(bi.price)), 0) * itemQuantity)
                      : calculateItemTotalPrice(uom.market_price, itemQuantity)}
                  </span>
                )}
                <span className="font-[sofiaPro] text-[.83vw] mob:text-[3.3vw]">
                  ₹{uom.basket
                    ? calculateItemTotalPrice(uom.price, itemQuantity) + (uom.basket.basket_items.reduce((acc: number, bi: any) => acc + (bi.cart_qty * Number(bi.price)), 0) * itemQuantity)
                    : calculateItemTotalPrice(uom.price, itemQuantity)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (uom.basket) {
                  dispatch({
                    type: 'cart/removeBasket',
                    payload: {
                      productId: product.id,
                      variantId: uom.variant_id
                    }
                  });
                } else {
                  dispatch(removeItemFromCart(removeItemPayload));
                }
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

        {/* Expanded Content Section - Below Main Item */}
        {/* Expanded Content Section - Below Main Item */}
        {isBasketOpen && uom.basket && (
          <div className="mt-[1vw] mob:mt-[3vw] w-full pl-[2vw] mob:pl-[5vw] relative">
            {/* Visual Connector Line */}
            <div className="absolute left-[0.5vw] mob:left-[1.5vw] top-0 bottom-0 w-[2px] bg-[#EBE3CC] rounded-full" />

            <div className="bg-[#FAF9F6] rounded-xl p-[1vw] mob:p-[3vw] border border-[#F2EEE4]">
              {/* Edit Basket Button - Top Right */}
              <div className="flex justify-between items-center mb-[1vw] mob:mb-[3vw]">
                <span className="font-[SofiaPro] text-[.75vw] mob:text-[2.8vw] font-bold text-gray-400 uppercase tracking-wider">
                  Basket Composition
                </span>
                <button
                  onClick={handleEditBasket}
                  className="bg-[#FFDD00] hover:bg-[#FFE44D] text-black font-bold text-[.83vw] mob:text-[2.8vw] px-[1.5vw] mob:px-[4vw] py-[.4vw] mob:py-[1vw] rounded-full font-[SofiaPro] transition-colors shadow-sm"
                >
                  Edit Basket
                </button>
              </div>

              {/* Gift Message Content */}
              {hasGiftText && (
                <div className="mb-[1vw] mob:mb-[3vw] bg-white rounded-[.6vw] mob:rounded-[2vw] p-[.8vw] mob:p-[3vw] border border-[#EBE3CC] border-dashed">
                  <p className="font-[SofiaPro] text-[.75vw] mob:text-[2.6vw] font-semibold text-black-op-80 mb-[.3vw] mob:mb-[1vw]">
                    Gift Card Message:
                  </p>
                  <p className="font-[SofiaPro] text-[.83vw] mob:text-[2.8vw] font-medium text-black-op-80 whitespace-pre-wrap break-all italic">
                    "{uom.gift_text}"
                  </p>
                </div>
              )}

              {/* Basket Items Content */}
              <div className="flex flex-col gap-[.8vw] mob:gap-[3vw]">
                {uom.basket.basket_items.filter((item: any) => item.cart_qty > 0).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-[.78vw] mob:gap-[3vw] pb-[.5vw] border-b border-gray-100 last:border-0 last:pb-0">
                    <figure className="w-[3.5vw] h-[3.5vw] mob:w-[12vw] mob:h-[12vw] rounded-lg bg-white flex-shrink-0 m-0 p-1 overflow-hidden border border-gray-100">
                      <img
                        src={item.image || '/public/assets/images/shop/sampleimg2.png'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </figure>
                    <div className="flex-1 flex justify-between items-center">
                      <div className="flex flex-col">
                        <h4 className="font-[sofiaPro] text-[.85vw] mob:text-[3.2vw] font-medium text-gray-800">
                          {item.name}
                        </h4>
                        <span className="font-[sofiaPro] text-[.75vw] mob:text-[2.6vw] text-gray-500 capitalize">
                          {item.uom} x {item.cart_qty}
                        </span>
                      </div>
                      <div className="flex items-center gap-[1vw] mob:gap-[3vw]">
                        <span className="font-[sofiaPro] text-[.85vw] mob:text-[3.2vw] font-semibold text-gray-700">
                          ₹{Math.floor(Number(item.price)) * item.cart_qty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
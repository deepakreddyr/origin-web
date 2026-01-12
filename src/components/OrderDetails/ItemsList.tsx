import Image from 'next/image';
import React, { useState } from 'react';

// Imported SVGs to be used for ripeness display
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import giftCardSvg from '/public/assets/svg/gift_card.svg';

// Map ripeness key to SVG icon, display text, and color
const ripenessMap: {
  [key: string]: { text: string; image: any; color: string };
} = {
  raw: { text: 'RAW', image: rawSvg, color: '#878787' },
  semi_ripe: { text: 'SEMI', image: semiRipeSvg, color: '#878787' },
  ripe: { text: 'RIPE', image: ripeSvg, color: '#878787' },
};

// Helper component to render the Ripeness Icon and Text
const RipenessIndicator = ({ uom }: { uom: any }) => {
  const ripenessKey = uom.ripeness;
  const info = ripenessKey && ripenessMap[ripenessKey] ? ripenessMap[ripenessKey] : null;

  if (!info) return null;

  return (
    <div className="flex items-center">
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
      <p className={`font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium capitalize`} style={{ color: info.color }}>
        {info.text}
      </p>
    </div>
  );
};

// Helper component to render the separator dot
const SeparatorDot = () => (
  <span className="font-[SofiaPro] font-extrabold text-[.83vw] mob:text-[3vw] text-black-op-60 mx-[.15vw]">
    •
  </span>
);

// Gift Message Dropdown Component
const GiftMessageDropdown = ({ giftText }: { giftText: string }) => {
  return (
    <div className="bg-[#F9F7F0] rounded-[.6vw] mob:rounded-[2vw] p-[.8vw] mob:p-[3vw] mt-[.5vw] mob:mt-[2vw] border border-[#EBE3CC]">
      <div className="flex items-start gap-[.5vw] mob:gap-[2vw]">
        <div className="w-[1vw] h-[1vw] mob:w-[4vw] mob:h-[4vw] relative mt-[.2vw]">
          <Image src={giftCardSvg} alt="Gift" fill className="object-contain" />
        </div>
        <div>
          <p className="font-[SofiaPro] text-[.75vw] mob:text-[2.8vw] font-semibold text-black-op-80 mb-[.2vw]">
            Gift Message:
          </p>
          <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-80 whitespace-pre-wrap break-all">
            {giftText}
          </p>
        </div>
      </div>
    </div>
  );
};

// Basket Child Items Component
const BasketChildItems = ({ basketItems }: { basketItems: any[] }) => {
  return (
    <div className="mt-[2vw] mob:mt-[6.5vw] flex flex-col gap-[.6vw] mob:gap-[2.5vw]">
      {basketItems.map((childItem: any) => (
        <div key={childItem.id} className="flex items-center gap-[.7vw] mob:gap-[2.5vw]">
          {/* Child Item Image */}
          <div className="bg-[#F2EEE4] w-[2.5vw] mob:w-[10vw] h-[2.5vw] mob:h-[10vw] rounded-[.6vw] mob:rounded-[2vw] flex items-center justify-center flex-shrink-0">
            <div className="w-[2vw] mob:w-[7vw] h-[2vw] mob:h-[7vw] relative">
              <Image src={childItem.image} alt={childItem.name} fill className="object-contain" />
            </div>
          </div>

          {/* Child Item Details */}
          <div className="flex-1">
            <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-80">
              {childItem.name}
            </p>
            <p className="font-[SofiaPro] text-[.75vw] mob:text-[2.8vw] font-medium text-black-op-60">
              {childItem.uom} x {childItem.cart_qty}
            </p>
          </div>

          {/* Child Item Price */}
          <div className="text-right">
            <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-80">
              ₹{childItem.item_sub_total}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ItemsList = (props: any) => {
  const { orderDetailsData } = props;
  const { order_code, items } = orderDetailsData;

  // State for expanded baskets and gift message toggles
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: { basket: boolean; gift: boolean } }>({});

  // Calculate total number of line items (all UOMs across all products)
  const totalLineItems = items.reduce((total: number, item: any) => {
    return total + (item.ordered_uoms?.length || 0);
  }, 0);

  const toggleBasketExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: { ...prev[key], basket: !prev[key]?.basket }
    }));
  };

  const toggleGiftExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: { ...prev[key], gift: !prev[key]?.gift }
    }));
  };

  return (
    <div
      className={`border w-full h-max border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] `}
    >
      <div className="flex items-end justify-between border-b border-b-[#F2EEE4] pb-[.97vw] mob:pb-[3.6vw] mob:mb-[4.1vw] mb-[1.1vw] ">
        <div className="">
          <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5vw] font-semibold text-black-op-80 ">Order Details</p>
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium text-black-op-60 pt-[.4vw] ">
            Order ID {order_code}
          </p>
        </div>
        <div className="">
          <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-medium text-black-op-60 ">
            {totalLineItems} {totalLineItems === 1 ? 'Item' : 'Items'}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[1.25vw] mob:gap-[5.1vw] ">
        {items.map((item: any) =>
          // Map through each ordered_uom for this product
          item.ordered_uoms?.map((uom: any, uomIndex: number) => {
            const isUnavailable = uom.shortage_qty >= 1;
            const hasRipeness = !!uom.ripeness;
            const isBasket = uom.basket_items && uom.basket_items.length > 0;
            const hasGiftText = uom.gift_text && uom.gift_text.trim() !== '';
            const itemKey = `${item.id}-${uom.variant_id}-${uom.ripeness || 'none'}`;
            const isGiftExpanded = expandedItems[itemKey]?.gift;
            const isBasketExpanded = expandedItems[itemKey]?.basket;

            return (
              <div key={itemKey}>
                <div
                  className={`flex gap-[.9vw] mob:gap-[2vw] relative items-start`}
                >
                  <div
                    className={`bg-[#F2EEE4] w-[4vw] mob:w-[15vw] mob:h-[14vw] h-[4vw] rounded-[.83vw] mob:rounded-[2vw] ${isUnavailable ? 'opacity-40' : ''} flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="w-[3vw] mob:w-[10.5vw] mob:h-[9vw] h-[2.7vw] relative rounded-[.83vw] ">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                  </div>
                  <div
                    className={`flex justify-between w-full ${isUnavailable ? 'opacity-40' : ''} `}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-black ">
                            {item.name}
                          </p>
                          {/* COMBINED LINE: Ripeness (Icon+Text) + Dot + UOM/Quantity OR View items button for baskets */}
                          <div className="flex items-center pt-[.4vw] mob:pt-[1vw] gap-[.5vw] mob:gap-[2vw]">

                            {/* Ripeness Icon and Text (Renders only if ripeness exists) */}
                            {hasRipeness && <RipenessIndicator uom={uom} />}

                            {/* Separator Dot (Renders only if ripeness exists) */}
                            {hasRipeness && <SeparatorDot />}

                            {/* UOM and Quantity OR View Items Button */}
                            {isBasket ? (
                              <button
                                onClick={() => toggleBasketExpand(itemKey)}
                                className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-60 capitalize flex items-center gap-[.3vw] mob:gap-[1vw] hover:text-black transition-colors"
                              >
                                {uom.unit} x {uom.cart_quantity}
                                <span className="flex items-center gap-[.2vw] mob:gap-[.5vw]">
                                  <SeparatorDot />
                                  View items
                                  <span className={`transition-transform duration-200 ${isBasketExpanded ? 'rotate-180' : ''}`}>
                                    ▼
                                  </span>
                                </span>
                              </button>
                            ) : (
                              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-60 capitalize">
                                {uom.unit} x {uom.cart_quantity}
                              </p>
                            )}
                          </div>

                          {/* Gift Card Added Indicator Dropdown Toggle */}
                          {hasGiftText && (
                            <button
                              onClick={() => toggleGiftExpand(itemKey)}
                              className="mt-[.5vw] mob:mt-[2vw] flex items-center gap-[.4vw] mob:gap-[1.5vw] hover:opacity-80 transition-opacity"
                            >
                              <div className="w-[1vw] h-[1vw] mob:w-[3.6vw] mob:h-[3.6vw] relative">
                                <Image src={giftCardSvg} alt="Gift Card" fill className="object-contain" />
                              </div>
                              <span className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-[#25874D]">
                                Gift Card Added
                              </span>
                              <span className={`text-[.6vw] mob:text-[2.5vw] transition-transform duration-200 ${isGiftExpanded ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Price Column */}
                        <div className="text-right">
                          {(() => {
                            const marketPrice = Number(uom.market_price_sub_total) || 0;
                            const subTotal = Number(uom.subtotal) || 0;
                            return marketPrice > 0 && marketPrice > subTotal ? (
                              <p className="font-[SofiaPro] text-[.82vw] mob:text-[2.8vw] font-medium line-through text-black-op-60 ">
                                ₹{marketPrice}
                              </p>
                            ) : null;
                          })()}
                          {isBasket && (
                            <p className="font-[SofiaPro] text-[.75vw] mob:text-[2.8vw] font-medium text-black-op-60 ">
                              Basket: ₹{uom.price}
                            </p>
                          )}
                          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium ">
                            ₹{uom.subtotal}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Content Section - Aligned with text */}
                      <div className="w-full">
                        {/* Gift Message - Show FIRST */}
                        {hasGiftText && isGiftExpanded && (
                          <GiftMessageDropdown giftText={uom.gift_text} />
                        )}

                        {/* Basket Child Items - Show SECOND */}
                        {isBasket && isBasketExpanded && (
                          <BasketChildItems basketItems={uom.basket_items} />
                        )}
                      </div>

                    </div>
                  </div>
                  {isUnavailable && (
                    <p className="font-[SofiaPro] font-semibold text-[#C70000] text-[.83vw] mob:text-[3vw] absolute right-[5vw] ">
                      UNAVAILABLE
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemsList;
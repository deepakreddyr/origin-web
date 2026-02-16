import Image from 'next/image';
import React from 'react';

// Imported SVGs to be used for ripeness display
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';

// Map ripeness key to SVG icon, display text, and color
const ripenessMap: {
  [key: string]: { text: string; image: any; color: string };
} = {
  raw: { text: 'RAW', image: rawSvg, color: '#878787' },
  semi_ripe: { text: 'SEMI', image: semiRipeSvg, color: '#878787' },
  ripe: { text: 'RIPE', image: ripeSvg, color: '#878787' }
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
        <Image src={info.image} alt={`${info.text} ripeness`} width={10} height={10} className="object-contain" />
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
  <span className="font-[SofiaPro] font-extrabold text-[.83vw] mob:text-[3vw] text-black-op-60 mx-[.15vw]">•</span>
);

const ItemsList = (props: any) => {
  const { orderDetailsData } = props;
  const { order_code, items } = orderDetailsData;

  // Calculate total number of line items (all UOMs across all products)
  const totalLineItems = items.reduce((total: number, item: any) => {
    return total + (item.ordered_uoms?.length || 0);
  }, 0);

  return (
    <div
      className={`border w-full h-max border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] `}
    >
      <div className="flex items-end justify-between border-b border-b-[#F2EEE4] pb-[.97vw] mob:pb-[3.6vw] mob:mb-[4.1vw] mb-[1.1vw] ">
        <div className="">
          <p className="font-[Recoleta] text-[1.25vw] mob:text-[5vw] font-bold text-black-op-80 ">Order Details</p>
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

            // Check for ripeness existence
            const hasRipeness = !!uom.ripeness;

            return (
              <div
                key={`${item.id}-${uom.variant_id}-${uom.ripeness || 'none'}`}
                className={`flex gap-[.9vw] mob:gap-[2vw] relative items-center`}
              >
                <div
                  className={`bg-[#F2EEE4] w-[4vw] mob:w-[15vw] mob:h-[14vw] h-[4vw] rounded-[.83vw] mob:rounded-[2vw] ${isUnavailable ? 'opacity-40' : ''} flex items-center justify-center`}
                >
                  <div className="w-[3vw] mob:w-[10.5vw] mob:h-[9vw] h-[2.7vw] relative rounded-[.83vw] ">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                </div>
                <div className={`flex justify-between w-full items-center ${isUnavailable ? 'opacity-40' : ''} `}>
                  <div>
                    <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-black ">
                      {item.name}
                    </p>
                    {/* COMBINED LINE: Ripeness (Icon+Text) + Dot + UOM/Quantity */}
                    <div className="flex items-center pt-[.4vw] mob:pt-[1vw]">
                      {/* Ripeness Icon and Text (Renders only if ripeness exists) */}
                      {hasRipeness && <RipenessIndicator uom={uom} />}

                      {/* Separator Dot (Renders only if ripeness exists) */}
                      {hasRipeness && <SeparatorDot />}

                      {/* UOM and Quantity */}
                      <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-60 capitalize">
                        {uom.unit} x {uom.cart_quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Check if this is a free item (price is 0, null, or 1) */}
                    {uom.price === 0 || uom.price === null || uom.price < 0 ? (
                      <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-[#25874D]">
                        Free Item
                      </p>
                    ) : (
                      <>
                        {uom.market_price_sub_total && uom.market_price_sub_total > uom.subtotal && (
                          <p className="font-[SofiaPro] text-[.82vw] mob:text-[2.8vw] font-medium line-through text-black-op-60 ">
                            ₹{uom.market_price_sub_total}
                          </p>
                        )}
                        <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium ">₹{uom.subtotal}</p>
                      </>
                    )}
                  </div>
                </div>
                {isUnavailable && (
                  <p className="font-[SofiaPro] font-semibold text-[#C70000] text-[.83vw] mob:text-[3vw] absolute right-[5vw] ">
                    UNAVAILABLE
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemsList;

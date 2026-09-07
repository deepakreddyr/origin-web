import Image from 'next/image';
import React, { useState } from 'react';

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

const UomItem = ({ item, uom, refundedQty = 0 }: { item: any; uom: any; refundedQty?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cartQuantity = Number(uom.cart_quantity) || 1;
  const shortageQty = Number(uom.shortage_qty) || 0;

  const effectiveRefundedQty = Math.max(refundedQty, shortageQty);

  const isFullyUnavailable = effectiveRefundedQty >= cartQuantity;
  const isPartiallyUnavailable = effectiveRefundedQty > 0 && effectiveRefundedQty < cartQuantity;

  return (
    <div className={`flex flex-col relative`}>
      <div className={`flex gap-[.9vw] mob:gap-[2vw] items-center`}>
        <div
          className={`bg-[#F2EEE4] w-[4vw] mob:w-[15vw] mob:h-[14vw] h-[4vw] rounded-[.83vw] mob:rounded-[2vw] ${isFullyUnavailable ? 'opacity-50' : ''} flex items-center justify-center flex-shrink-0`}
        >
          <div className="w-[3vw] mob:w-[10.5vw] mob:h-[9vw] h-[2.7vw] relative rounded-[.83vw] ">
            <Image src={item.image} alt={item.name} fill className="object-contain" />
          </div>
        </div>
        <div className={`flex justify-between w-full items-center ${isFullyUnavailable ? 'opacity-50' : ''} `}>
          <div className="flex-1 min-w-0 pr-[1vw] mob:pr-[2vw]">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-black truncate">
              {item.name}
            </p>
            {/* COMBINED LINE: Ripeness (Icon+Text) + Dot + UOM/Quantity */}
            <div className="flex items-center pt-[.4vw] mob:pt-[1vw] flex-wrap gap-y-1">
              {/* Ripeness Icon and Text (Renders only if ripeness exists) */}
              {!!uom.ripeness && <RipenessIndicator uom={uom} />}

              {/* Separator Dot (Renders only if ripeness exists) */}
              {!!uom.ripeness && <SeparatorDot />}

              {/* UOM and Quantity */}
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] font-medium text-black-op-60 capitalize flex items-center gap-[4px] flex-wrap">
                {uom.unit} x {uom.cart_quantity}
                {isFullyUnavailable && (
                  <span className="bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] text-[0.7vw] mob:text-[2.5vw] font-semibold px-[0.4vw] mob:px-[1.5vw] py-[0.15vw] mob:py-[0.5vw] rounded inline-flex items-center">
                    Not Available
                  </span>
                )}
                {isPartiallyUnavailable && (
                  <span className="bg-[#FEF9C3] text-[#B45309] border border-[#FDE68A] text-[0.7vw] mob:text-[2.5vw] font-semibold px-[0.4vw] mob:px-[1.5vw] py-[0.15vw] mob:py-[0.5vw] rounded inline-flex items-center">
                    Partially not available
                  </span>
                )}
              </p>
            </div>

            {/* Clickable Toggle for Combo Items */}
            {uom.combo_items && uom.combo_items.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-[0.4vw] mob:gap-[1.5vw] mt-[0.6vw] mob:mt-[2vw] group transition-colors"
                aria-expanded={isExpanded}
              >
                <p className="font-[SofiaPro] text-[0.75vw] mob:text-[2.8vw] font-bold text-black-op-40 group-hover:text-black uppercase tracking-wider">
                  {isExpanded ? 'Hide Items' : 'View Items'}
                </p>
                <div
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-black-op-40 group-hover:text-black`}
                >
                  <svg
                    className="w-[0.8vw] h-[0.8vw] mob:w-[3vw] mob:h-[3vw]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>
            )}
          </div>
          {!isFullyUnavailable && (
            <div className="text-right shrink-0">
              {/* Check if this is a free item (price is 0, null, or 1) */}
              {uom.price === 0 || uom.price === null || uom.price < 0 ? (
                <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-[#25874D]">Free Item</p>
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
          )}
        </div>
      </div>

      {/* Dropdown Section for Combo Items */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1000px] opacity-100 mt-[0.8vw] mob:mt-[3vw]' : 'max-h-0 opacity-0'
        }`}
      >
        {uom.combo_items && uom.combo_items.length > 0 && (
          <div className="flex flex-col gap-[.6vw] mob:gap-[2.5vw] border-l-2 border-[#F2EEE4] ml-[2vw] mob:ml-[7.5vw] pl-[1vw] mob:pl-[3.5vw] mb-[0.5vw]">
            <p className="font-[SofiaPro] text-[.7vw] mob:text-[2.6vw] font-semibold text-black-op-40 uppercase tracking-wide">
              Bundle Includes:
            </p>
            <div className="flex flex-col gap-[.5vw] mob:gap-[2vw]">
              {uom.combo_items.map((combo: any, idx: number) => (
                <div key={idx} className="flex items-center gap-[.5vw] mob:gap-[2vw]">
                  <div className="w-[1.8vw] h-[1.8vw] mob:w-[7vw] mob:h-[7vw] relative rounded-[.4vw] mob:rounded-[1vw] overflow-hidden bg-[#F2EEE4] flex-shrink-0">
                    <Image src={combo.image} alt={combo.item_name} fill className="object-contain p-[0.2vw]" />
                  </div>
                  <p className="font-[SofiaPro] text-[.8vw] mob:text-[3vw] font-medium text-black-op-70 leading-tight">
                    {combo.item_name} ({combo.uom}) x {combo.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemsList = (props: any) => {
  const { orderDetailsData } = props;
  const { order_code, items } = orderDetailsData;
  const [showAllItems, setShowAllItems] = useState(false);
  const INITIAL_VISIBLE = 2;

  const refundedQtyMap = React.useMemo(() => {
    const refunds = orderDetailsData.refunds ? [orderDetailsData.refunds] : [];
    const multipleRefunds = orderDetailsData.multiple_refunds || [];
    const allRefunds = [...refunds, ...multipleRefunds];
    const qtyMap = new Map<string, number>();

    allRefunds.forEach((r: any) => {
      if (r?.refund_reason === 'Item(s) not available' && Array.isArray(r.refund_items)) {
        r.refund_items.forEach((ri: any) => {
          let parsedQty = 1;
          if (ri.base_qty !== undefined && ri.base_qty !== null && !isNaN(Number(ri.base_qty))) {
            parsedQty = Number(ri.base_qty);
          } else if (ri.qty !== undefined && ri.qty !== null && !isNaN(parseFloat(ri.qty))) {
            parsedQty = parseFloat(ri.qty);
          }
          const currentQty = qtyMap.get(`${ri.item_code}`) || 0;
          qtyMap.set(`${ri.item_code}`, currentQty + parsedQty);
        });
      }
    });
    return qtyMap;
  }, [orderDetailsData]);

  // Flatten the items array so we can slice correctly
  const flattenedUoms = React.useMemo(() => {
    const flat: { item: any; uom: any }[] = [];
    items.forEach((item: any) => {
      item.ordered_uoms?.forEach((uom: any) => {
        flat.push({ item, uom });
      });
    });
    return flat;
  }, [items]);

  const visibleUoms = showAllItems ? flattenedUoms : flattenedUoms.slice(0, INITIAL_VISIBLE);
  const hiddenCount = flattenedUoms.length - INITIAL_VISIBLE;

  // Calculate total number of line items (all UOMs across all products)
  const totalLineItems = flattenedUoms.length;

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
        {visibleUoms.map(({ item, uom }: any) => {
          const refundedQty = refundedQtyMap.get(`${item.item_code}`) || 0;
          return (
            <UomItem
              key={`${item.id}-${uom.variant_id}-${uom.ripeness || 'none'}`}
              item={item}
              uom={uom}
              refundedQty={refundedQty}
            />
          );
        })}
      </div>
      {hiddenCount > 0 && !showAllItems && (
        <button
          onClick={() => setShowAllItems(true)}
          className="mt-[2vw] mob:mt-[4vw] font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-[#25874D] flex items-center justify-center w-full"
        >
          View More (+{hiddenCount} items)
        </button>
      )}
    </div>
  );
};

export default ItemsList;

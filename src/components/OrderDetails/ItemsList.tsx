import Image from 'next/image';
import React from 'react';

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
        {items.map((item: any) => (
          // Map through each ordered_uom for this product
          item.ordered_uoms?.map((uom: any, uomIndex: number) => {
            const isUnavailable = uom.shortage_qty >= 1;
            
            // FIXED: Use 'ripeness' from API response (not 'selected_ripeness_type')
            const ripenessText = uom.ripeness 
              ? ` (${uom.ripeness.replace('_', ' ')})` 
              : '';
            
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
                <div
                  className={`flex justify-between w-full items-center ${isUnavailable ? 'opacity-40' : ''} `}
                >
                  <div>
                    <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-black ">
                      {item.name}
                    </p>
                    <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] pt-[.4vw] mob:pt-[1vw] font-medium text-black-op-60 capitalize">
                      {uom.unit}{ripenessText} x {uom.cart_quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    {uom.market_price_sub_total && uom.market_price_sub_total > uom.subtotal && (
                      <p className="font-[SofiaPro] text-[.82vw] mob:text-[2.8vw] font-medium line-through text-black-op-60 ">
                        ₹{uom.market_price_sub_total}
                      </p>
                    )}
                    <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium ">
                      ₹{uom.subtotal}
                    </p>
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
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
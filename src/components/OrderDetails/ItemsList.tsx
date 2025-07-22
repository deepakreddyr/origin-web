import Image from 'next/image';
import React from 'react';

const ItemsList = (props: any) => {
  const { orderDetailsData } = props;
  const { order_id, items } = orderDetailsData;

  return (
    <div
      className={`border w-full h-max border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] `}
    >
      <div className="flex items-end justify-between border-b border-b-[#F2EEE4] pb-[.97vw] mob:pb-[3.6vw] mob:mb-[4.1vw] mb-[1.1vw] ">
        <div className="">
          <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5vw] font-semibold text-black-op-80 ">Order Details</p>
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium text-black-op-60 pt-[.4vw] ">
            Order ID {order_id}
          </p>
        </div>
        <div className="">
          <p className="font-[SofiaPro] text-[1.1vw] mob:text-[4.1vw] font-medium text-black-op-60 ">
            {' '}
            {items.length} Items
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[1.25vw] mob:gap-[5.1vw] ">
        {items.map((item: any) => (
          <div key={item.id} className={`flex gap-[.9vw] mob:gap-[2vw] relative items-center`}>
            <div
              className={`bg-[#F2EEE4] w-[4vw] mob:w-[15vw] mob:h-[14vw] h-[4vw]  rounded-[.83vw] mob:rounded-[2vw] ${item.ordered_uoms[0].shortage_qty >= 1 ? 'opacity-40' : ''} flex items-center justify-center`}
            >
              <div className="w-[3vw] mob:w-[10.5vw] mob:h-[9vw]  h-[2.7vw] relative rounded-[.83vw] ">
                <Image src={item.image} alt="" fill />
              </div>
            </div>
            <div
              className={`flex justify-between w-full items-center ${item.ordered_uoms[0].shortage_qty >= 1 ? 'opacity-40' : ''} `}
            >
              <div>
                <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold text-black ">{item.name}</p>
                <p className="font-[SofiaPro] text-[.83vw] mob:text-[3vw] pt-[.4vw] mob:pt-[1vw] font-medium text-black-op-60">
                  {item.ordered_uoms[0].unit} x{item.ordered_uoms[0].cart_quantity}{' '}
                </p>
              </div>
              <div>
                <p className="font-[SofiaPro] text-[.82vw] mob:text-[2.8vw] font-medium line-through text-black-op-60 ">
                  ₹{item.ordered_uoms[0].market_price_sub_total}
                </p>
                <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-medium  ">
                  ₹{item.ordered_uoms[0].subtotal}
                </p>
              </div>
            </div>
            {item.ordered_uoms[0].shortage_qty >= 1 && (
              <p className="font-[SofiaPro] font-semibold text-[#C70000] text-[.83vw] mob:text-[3vw] absolute right-[5vw]  ">
                UNAVAILABLE
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;

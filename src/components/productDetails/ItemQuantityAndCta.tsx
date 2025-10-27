import React from 'react';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';

const ItemQuantityAndCta = (props: any) => {
  const { productDetails } = props;
  const defaultUOM: any = productDetails?.item?.multiple_uoms.find((uom: any) =>
    uom?.is_default === true ? uom : productDetails?.item?.multiple_uoms[0]
  );
  if (!defaultUOM) return;
  return (
    <div className="w-[25.2vw] mob:w-[92vw] my-[1.1vw] flex items-center justify-between  rounded-[.83vw] mob:p-[4.1vw] mob:rounded-[4.1vw] p-[1.1vw] mob:rounded-t-[0vw]  mob:mt-[-5.1vw] ">
      {/* <div className="">
        <p className="font-slab font-medium  text-[.97vw] mob:text-[4.1vw]">{defaultUOM.unit}</p>
        <div className="pt-[.4vw] mob:pt-[1vw]">
          <span className="font-slab pr-[0.2vw] font-medium text-[.97vw] mob:text-[3.6vw] ">
            {defaultUOM.price}
          </span>
          {defaultUOM.market_price > defaultUOM.price && (
            <span className="font-slab font-regular text-[.8vw] mob:text-[3vw] text-black-op-60 line-through pl-[.3vw] pt-[.3vw]">
              {defaultUOM.market_price}
            </span>
          )}
        </div>
      </div> */}
      <div className=''>
        <AddItemBtn
          product={productDetails?.item}
          varientId={defaultUOM.variant_id}
          varientPrice={defaultUOM.price}
          stepperQuantity={defaultUOM.stepper_quantity}
          buttonType={'yellowaddtocart'}
        />
      </div>
    </div>
  );
};

export default ItemQuantityAndCta;

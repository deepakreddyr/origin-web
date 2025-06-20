import Image from 'next/image';
import React from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg.png';

const ItemCard = (props: any) => {
  const { itemDetails } = props;
  const router = useRouter();

  const defaultUOM = itemDetails?.multiple_uoms.find((uom: any) =>
    uom?.is_default === true ? uom : itemDetails.multiple_uoms[0]
  );

  if (!defaultUOM) return null;

  return (
    <div className="rounded-[1.5vw] bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.05),0_10px_12px_-6px_rgba(0,0,0,0.2)] mob:shadow-md p-[1.5vw] mob:p-[4vw]">
      <button
        disabled={!defaultUOM.is_available}
        onClick={() =>
          router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`)
        }
        className={`cursor-pointer w-full text-start ${!defaultUOM.is_available ? 'opacity-50' : 'opacity-100'}`}
      >
        {/* Product Image */}
        <div className="relative bg-white w-full aspect-[1/1] rounded-[1vw] flex items-center justify-center overflow-hidden">
          <div className="relative w-[100%] h-[100%]">
            <Image
              src= {sampleimg}
              // src={itemDetails.image}
              alt={itemDetails.name || 'cart image'}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Name */}
        <div className="pt-[1vw]">
          <p className="font-[SofiaPro] font-semibold text-[1vw] mob:text-[3.2vw]">{itemDetails.name}</p>
        </div>

        {/* Price & Quantity in same row */}
        <div className="flex justify-between items-center mt-[0.3vw]">
          <p className="text-black font-bold text-[0.95vw] mob:text-[3vw]">{defaultUOM.formatted_price}</p>
          <p className="text-gray-500 text-[0.85vw] mob:text-[2.5vw]">{defaultUOM.unit}</p>
        </div>

        {/* Add Button */}
        <div className="mt-[1vw]">
          <AddItemBtn
            product={itemDetails}
            varientId={defaultUOM.variant_id}
            varientPrice={defaultUOM.price}
            stepperQuantity={defaultUOM.stepper_quantity}
            buttonType="yellow"
          />
        </div>
      </button>
    </div>
  );
};

export default ItemCard;

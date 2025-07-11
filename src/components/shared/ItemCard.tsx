import Image from 'next/image';
import React from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg.png';

const ItemCard = ({ itemDetails }: any) => {
  const router = useRouter();

  const defaultUOM =
    itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms[0];

  if (!defaultUOM) return null;

  return (
    <div className="bg-white rounded-[1.5rem] shadow-[0px_8px_24px_rgba(0,0,0,0.12),0px_2px_8px_rgba(0,0,0,0.08)] p-[1.2rem] flex flex-col h-full">
      <button
        disabled={!defaultUOM.is_available}
        onClick={() =>
          router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`)
        }
        className={`text-left w-full flex flex-col h-full ${!defaultUOM.is_available ? 'opacity-50' : ''}`}
      >
        {/* Image */}
        <div className="w-full mb-[0.4rem] flex-shrink-0">
          <div
            className="rounded-[1rem] overflow-hidden bg-white flex justify-center items-center relative h-[110px] md:h-[170px]"
          >
            <Image
              src={sampleimg}
              alt={itemDetails.name || 'product image'}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
              style={{ 
                objectFit: 'cover',
                borderRadius: '1rem'
              }}
            />
          </div>
        </div>

        {/* Name & Details */}
        <div className="flex-grow flex flex-col justify-between min-h-0">
          <p className="font-[SofiaPro] font-semibold text-[0.9rem] leading-[1.2] line-clamp-2 mb-[0.2rem]">
            {itemDetails.name}
          </p>

          <div className="flex-shrink-0 flex justify-between items-end">
            <div>
              <p className="text-black font-bold text-[0.95rem]">{defaultUOM.formatted_price}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[0.85rem] leading-tight">{defaultUOM.unit}</p>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="mt-[0.4rem] flex-shrink-0">
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
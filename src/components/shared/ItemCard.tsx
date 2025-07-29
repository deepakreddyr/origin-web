import Image from 'next/image';
import React from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';

const ItemCard = ({ itemDetails }: any) => {
  const router = useRouter();

  const defaultUOM =
    itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms[0];

  if (!defaultUOM) return null;

  return (
    <div className="bg-white rounded-[1.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full">
      <button
        disabled={!defaultUOM.is_available}
        onClick={() =>
          router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`)
        }
        className={`text-left w-full flex flex-col h-full ${!defaultUOM.is_available ? 'opacity-50' : ''}`}
      >
        {/* Image */}
        <div className="w-full flex-shrink-0 relative">
          <div className="overflow-hidden bg-white flex justify-center items-center relative h-[110px] md:h-[170px]">
            <div className="relative w-[85%] h-[85%]">
              <Image
                src={itemDetails.image || sampleimg}
                alt={itemDetails.name || 'product image'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Content Section with Gradient Background */}
        <div
          className="w-full flex-grow flex flex-col justify-between p-[1.2rem]"
          style={{
            background: 'linear-gradient(180deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
            minHeight: '90px',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
          }}
        >
          {/* Top section - Name */}
          <div className="flex-shrink-0">
            <p className="font-[SofiaPro] font-semibold text-[0.85rem] leading-[1.2] line-clamp-2 text-black">
              {itemDetails.name}
            </p>
          </div>

          {/* Bottom section - Price, Unit, and Button */}
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-[0.4rem]">
              <div className="flex items-center gap-[0.3rem]">
                {defaultUOM.market_price > defaultUOM.price && defaultUOM.market_price > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-[0.7rem]">
                      ₹{defaultUOM.market_price}
                    </p>
                    <p className="text-black font-semibold text-[0.7rem]">
                      {defaultUOM.formatted_price}
                    </p>
                  </>
                ) : (
                  <p className="text-black font-semibold text-[0.7rem]">
                    {defaultUOM.formatted_price}
                  </p>
                )}
              </div>
              <p className="text-right text-[#737373] text-[0.7rem]">{defaultUOM.unit}</p>
            </div>

            <div className="rounded-[1.5rem] overflow-hidden">
              <AddItemBtn
                product={itemDetails}
                varientId={defaultUOM.variant_id}
                varientPrice={defaultUOM.price}
                stepperQuantity={defaultUOM.stepper_quantity}
                buttonType="black"
              />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ItemCard;

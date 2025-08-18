import Image from 'next/image';
import React, { useState } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';

const ItemCard = ({ itemDetails }: any) => {
  const router = useRouter();
  
  const defaultUOM = itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms[0];
  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log(itemDetails,"ITEM DETAILS");
  if (!defaultUOM) return null;

  const hasMultipleUOMs = itemDetails?.multiple_uoms?.length > 1;
  const availableUOMs = itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];

  const handleUOMChange = (uom: any) => {
    setSelectedUOM(uom);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-md overflow-hidden flex flex-col h-full">
      <button
        disabled={!selectedUOM.is_available}
        onClick={() =>
          router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`)
        }
        className={`text-left w-full flex flex-col h-full ${!selectedUOM.is_available ? 'opacity-50' : ''}`}
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
                {selectedUOM.market_price > selectedUOM.price && selectedUOM.market_price > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-[0.7rem]">
                      ₹{selectedUOM.market_price}
                    </p>
                    <p className="text-black font-semibold text-[0.7rem]">
                      {selectedUOM.formatted_price}
                    </p>
                  </>
                ) : (
                  <p className="text-black font-semibold text-[0.7rem]">
                    {selectedUOM.formatted_price}
                  </p>
                )}
              </div>
              
              {/* UOM Display with Dropdown */}
              <div className="relative">
                {hasMultipleUOMs && availableUOMs.length > 1 ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="flex items-center gap-[0.2rem] text-[#737373] text-[0.7rem] hover:text-black transition-colors"
                    >
                      <span>{selectedUOM.unit}</span>
                      <svg
                        className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
                        {availableUOMs.map((uom: any, index: number) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUOMChange(uom);
                            }}
                            className={`w-full px-3 py-2 text-left text-[0.7rem] hover:bg-gray-50 transition-colors ${
                              selectedUOM.variant_id === uom.variant_id 
                                ? 'text-black font-semibold bg-gray-50' 
                                : 'text-[#737373]'
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === availableUOMs.length - 1 ? 'rounded-b-lg' : ''}`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{uom.unit}</span>
                              <span className="text-black font-semibold ml-2">
                                {uom.formatted_price}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-right text-[#737373] text-[0.7rem]">{selectedUOM.unit}</p>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] overflow-hidden">
              <AddItemBtn
                product={itemDetails}
                varientId={selectedUOM.variant_id}
                varientPrice={selectedUOM.price}
                stepperQuantity={selectedUOM.stepper_quantity}
                buttonType="black"
              />
            </div>
          </div>
        </div>
      </button>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ItemCard;
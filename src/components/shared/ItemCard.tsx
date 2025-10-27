import Image from 'next/image';
import React, { useState } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleIMAGE.jpg';

const ItemCard = ({ itemDetails }: any) => {
  const router = useRouter();
  
  const defaultUOM = itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms[0];
  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  if (!defaultUOM) return null;

  const hasMultipleUOMs = itemDetails?.multiple_uoms?.length > 1;
  const availableUOMs = itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];

  const handleUOMChange = (uom: any) => {
    setSelectedUOM(uom);
    setIsDropdownOpen(false);
  };

  return (
    <div className="rounded-xl shadow-md overflow-hidden flex flex-col h-full relative">
      {/* Background Image - Full Card */}
      <div className="absolute inset-0">
        <Image
          src={sampleimg}
          alt={itemDetails.name || 'product image'}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <button
        disabled={!selectedUOM.is_available}
        onClick={() =>
          router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`)
        }
        className={`relative text-left w-full flex flex-col h-full ${!selectedUOM.is_available ? 'opacity-50' : ''}`}
      >
        {/* UOM Display - Top Right */}
        <div className="absolute top-3 right-3 z-20">
          <div
            className="backdrop-blur-md rounded-lg p-[6px] flex items-center justify-center"
            style={{
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          >
          {hasMultipleUOMs && availableUOMs.length > 1 ? (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-[0.2rem] text-white text-[0.75rem] font-semibold hover:text-white/80 transition-colors bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm"
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
            <div className="text-white text-[0.75rem] font-semibold">
              {selectedUOM.unit}
            </div>
          )}
        </div>
        </div>
        {/* Image - Takes most of the space */}
        <div className="w-full flex-grow relative min-h-[150px]">
          {/* This space is for the background image to show through */}
        </div>

        {/* Bottom Content Section with Glassmorphism */}
        <div 
          className="relative w-full px-[1rem] pb-[1rem] pt-[0.8rem]"
          style={{
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        >
          {/* Name and Price Row */}
          <div className="flex justify-between items-start mb-[0.7rem]">
            <p className="font-slab font-semibold text-[0.85rem] leading-[1.3] text-white flex-1 pr-2 line-clamp-2">
              {itemDetails.name}
            </p>
            <div className="flex items-center gap-[0.3rem] flex-shrink-0">
              {selectedUOM.market_price > selectedUOM.price && selectedUOM.market_price > 0 ? (
                <>
                  <p className="text-white line-through text-[0.7rem]">
                    ₹{selectedUOM.market_price}
                  </p>
                  <p className="text-white font-bold text-[0.9rem]">
                    {selectedUOM.formatted_price}
                  </p>
                </>
              ) : (
                <p className="text-black font-bold text-[0.9rem]">
                  {selectedUOM.formatted_price}
                </p>
              )}
            </div>
          </div>

          {/* Add Button - Rectangular with rounded corners */}
          <div className="rounded-[6px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <AddItemBtn
              product={itemDetails}
              varientId={selectedUOM.variant_id}
              varientPrice={selectedUOM.price}
              stepperQuantity={selectedUOM.stepper_quantity}
              buttonType="yellow"
            />
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
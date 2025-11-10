import Image from 'next/image';
import React, { useState } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';

const ItemCard = ({ itemDetails,bottomBg }: any) => {
  const router = useRouter();
  
  const defaultUOM =
    itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) ||
    itemDetails?.multiple_uoms[0];
  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log(itemDetails,"items");
  if (!defaultUOM) return null;

  const hasMultipleUOMs = itemDetails?.multiple_uoms?.length > 1;
  const availableUOMs =
    itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];

  const handleUOMChange = (uom: any) => {
    setSelectedUOM(uom);
    setIsDropdownOpen(false);
  };

  const handleNavigation = () => {
    const slug = encodeURIComponent(
      itemDetails.item_name.replace(/ /g, '-').toLowerCase()
    );
    router.push(`/${slug}/${itemDetails.id}`);
  };

  return (
    <div className="rounded-[0.5rem] overflow-hidden flex flex-col h-full drop-shadow-md">
      <button
        disabled={!selectedUOM.is_available}
        onClick={handleNavigation}
        className={`flex flex-col h-full text-left ${
          !selectedUOM.is_available ? 'opacity-50' : ''
        }`}
      >
        {/* IMAGE SECTION - 70% of height */}
        <div className="relative flex-shrink-0 h-[65%] bg-white">
          <Image
            src={"https://lh3.googleusercontent.com/aida-public/AB6AXuDgFMpkMuZGL6jJdY5mUbXStzT2vWlVHGofMJbbOPJfqwBUj0PLLXqRMSvCs8QjoVMbrXPoBIktxh4UYdcZUm13kNSMUF1QqrpGtMbRT1NF0MNhiHOJoZhe_CY4ckQTDmz7dw7QP1P3SPzBZ8Se7PcnksvDx7K_P5u8m8ijP219lVszomRuAGdCcGWpNw5GP9bcBoHZK7-RFeepUS9rd4yT0urMZgZie7rqNpVoSaF1u-C-tQkcnVno-mA7x7q7E8qUSnShwv-K0F0"}
            alt={itemDetails.name || 'product image'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          />
        </div>

        {/* WHITE CONTENT SECTION - 30% of height */}
        <div className={`flex-grow p-[1rem] ${bottomBg}  flex flex-col justify-between h-[35%]`}>
          {/* PRODUCT NAME */}
          <p className="font-[SofiaPro] font-medium text-[0.95rem] leading-[1.2] line-clamp-2 text-black">
            {itemDetails.name}
          </p>

          {/* PRICE + UOM + BUTTON */}
          <div className="mt-[0.5rem]">
            <div className="flex justify-between items-center mb-[0.4rem]">
              {/* Price */}
              <div className="flex items-center gap-[0.3rem]">
                {selectedUOM.market_price > selectedUOM.price &&
                selectedUOM.market_price > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-[0.75rem]">
                      ₹{selectedUOM.market_price}
                    </p>
                    <p className="text-black font-medium text-[0.75rem]">
                      {selectedUOM.formatted_price}
                    </p>
                  </>
                ) : (
                  <p className="text-black font-medium text-[0.75rem]">
                    {selectedUOM.formatted_price}
                  </p>
                )}
              </div>

              {/* UOM Selector */}
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
                        className={`w-3 h-3 transition-transform ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown */}
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
                                ? 'text-black font-medium bg-gray-50'
                                : 'text-[#737373]'
                            } ${
                              index === 0 ? 'rounded-t-lg' : ''
                            } ${
                              index === availableUOMs.length - 1
                                ? 'rounded-b-lg'
                                : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{uom.unit}</span>
                              <span className="text-black font-medium ml-2">
                                {uom.formatted_price}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-right text-[#737373] text-[0.7rem]">
                    {selectedUOM.unit}
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <AddItemBtn
              product={itemDetails}
              varientId={selectedUOM.variant_id}
              varientPrice={selectedUOM.price}
              stepperQuantity={selectedUOM.stepper_quantity}
              buttonType="cream"
            />
          </div>
        </div>
      </button>

      {/* Overlay to close dropdown */}
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

import Image from "next/image";
import React, { useState } from "react";
import AddItemBtn from "./AddItemBtn/AddItemBtn";
import { useRouter } from "next/router";

const CatItemCard = ({ itemDetails }: any) => {
  const router = useRouter();

  const defaultUOM =
    itemDetails?.multiple_uoms.find((uom: any) => uom?.is_default) ||
    itemDetails?.multiple_uoms[0];
  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      itemDetails.item_name.replace(/ /g, "-").toLowerCase()
    );
    router.push(`/${slug}/${itemDetails.id}`);
  };

  return (
    <div className="overflow-hidden flex flex-col h-full min-h-[260px] sm:min-h-[300px]">
      <button
        disabled={!selectedUOM.is_available}
        onClick={handleNavigation}
        className={`flex flex-col h-full text-left ${
          !selectedUOM.is_available ? "opacity-50" : ""
        }`}
      >
        {/* IMAGE SECTION */}
        <div className="relative w-full h-[60vw] sm:h-[20vw] md:h-[20vw] mob:h-[40vw] bg-white rounded-[10px] overflow-hidden">
          <Image
            src={"https://lh3.googleusercontent.com/aida-public/AB6AXuDgFMpkMuZGL6jJdY5mUbXStzT2vWlVHGofMJbbOPJfqwBUj0PLLXqRMSvCs8QjoVMbrXPoBIktxh4UYdcZUm13kNSMUF1QqrpGtMbRT1NF0MNhiHOJoZhe_CY4ckQTDmz7dw7QP1P3SPzBZ8Se7PcnksvDx7K_P5u8m8ijP219lVszomRuAGdCcGWpNw5GP9bcBoHZK7-RFeepUS9rd4yT0urMZgZie7rqNpVoSaF1u-C-tQkcnVno-mA7x7q7E8qUSnShwv-K0F0"}
            alt={itemDetails.name || "Product image"}
            fill
            className="object-cover"
          />
        </div>

        {/* CONTENT SECTION */}
        <div className="pt-2 pb-3 flex flex-col justify-between flex-grow gap-2">
          {/* Product name */}
          <p className="text-[0.85rem] sm:text-[0.9rem] font-semibold text-gray-900 leading-tight line-clamp-2">
            {itemDetails.name}
          </p>

          {/* Price & UOM Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[0.3rem]">
              {selectedUOM.market_price > selectedUOM.price ? (
                <>
                  <p className="text-gray-400 line-through text-[0.75rem]">
                    ₹{selectedUOM.market_price}
                  </p>
                  <p className="text-black font-medium text-[0.8rem]">
                    {selectedUOM.formatted_price}
                  </p>
                </>
              ) : (
                <p className="text-black font-medium text-[0.8rem]">
                  {selectedUOM.formatted_price}
                </p>
              )}
            </div>

            {hasMultipleUOMs && availableUOMs.length > 1 ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="text-[0.8rem] text-gray-500 hover:text-black"
                >
                  {selectedUOM.unit}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10">
                    {availableUOMs.map((uom: any, i: number) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUOMChange(uom);
                        }}
                        className={`block w-full px-3 py-2 text-left text-[0.75rem] sm:text-[0.8rem] hover:bg-gray-50 whitespace-nowrap ${
                          selectedUOM.variant_id === uom.variant_id
                            ? "font-semibold text-black"
                            : "text-gray-600"
                        }`}
                      >
                        {uom.unit} – {uom.formatted_price}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[0.75rem] sm:text-[0.8rem] text-gray-500">
                {selectedUOM.unit}
              </p>
            )}
          </div>

          {/* ADD TO CART BUTTON */}
          <div className="mt-1">
            <AddItemBtn
              product={itemDetails}
              varientId={selectedUOM.variant_id}
              varientPrice={selectedUOM.price}
              stepperQuantity={selectedUOM.stepper_quantity}
              buttonType="black"
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

export default CatItemCard;

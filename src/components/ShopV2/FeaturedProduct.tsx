'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';

interface UomType {
  variant_id: number;
  name: string | null;
  uom_id: number;
  unit: string;
  minimum_quantity: number;
  maximum_quantity: number;
  stepper_quantity: number;
  is_visible: boolean;
  is_available: boolean;
  is_default: boolean;
  price: number;
  platform_id: number;
  formatted_price: string;
  cart_quantity: number;
  conversion_text: string;
  is_not_discounted: boolean;
  ripeness_types: any;
  cart_ripeness: any;
  market_price: number;
}

interface FeaturedItemType {
  item: {
    id: number;
    item_code: string;
    name: string;
    image: string;
    multiple_images: string[];
    bg_color: string;
    navigation: {
      to: string;
    };
    is_greyed: boolean;
    is_available: boolean;
    is_orderable: boolean;
    tag_url: string | null;
    multiple_uoms: UomType[];
  };
  info: {
    info: Array<{
      type: string;
      title: string;
      details: Array<{
        description?: string;
        title?: string;
      }>;
      sub_title?: string;
    }>;
  };
  upsell_items: any[];
}

interface FeaturedProductProps {
  featuredItem?: FeaturedItemType;
}

const FeaturedProduct = ({ featuredItem }: FeaturedProductProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!featuredItem || !featuredItem.item) {
    return null;
  }
  const { item, info } = featuredItem;
  const defaultUom =
    item.multiple_uoms?.find((uom: UomType) => uom.is_default) ||
    item.multiple_uoms?.[0];

  const aboutProduct = info.info.find((section) => section.type === 'normal');
  const description = aboutProduct?.details?.[0]?.description || '';

  const nutritionInfo = info.info.find(
    (section) => section.type === 'nutrition'
  );

  const productForAddBtn = {
    id: item.id,
    item_code: item.item_code,
    item_name: item.name,
    name: item.name,
    logo: item.image,
    image: item.image,
    website_image: item.image,
    availability: item.is_available,
    extra_descriptions: [],
    tag_url: item.tag_url,
    tag_text: null,
    is_collaborate_item: false,
    title: '',
    description: '',
    provider_id: null,
    multiple_uoms: item.multiple_uoms,
    uom: item.multiple_uoms,
  };

  return (
    <div className="w-full pt-8 pb-8 mob:pt-6 mob:pb-6 px-4 mob:px-4 flex justify-center items-center">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-start justify-center overflow-hidden p-4 mob:p-0 gap-8 mob:gap-6">
        {/* Image Section */}
        <div className="flex justify-center items-center w-full md:w-[600px]">
          <div className="rounded-3xl mob:rounded-2xl overflow-hidden w-full h-[300px] md:h-[420px] mob:h-[250px] flex items-center justify-center p-8">
            <Image
              src={
                item.image ||
                item.multiple_images?.[0] ||
                '/assets/images/shop/testing_img.png'
              }
              alt={item.name}
              width={600}
              height={480}
              className="object-contain w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/assets/images/shop/testing_img.png';
              }}
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full md:w-[480px] shadow-md flex flex-col justify-between bg-[#FFFCF1] rounded-3xl mob:rounded-2xl shadow-xs overflow-hidden p-6 md:p-8 mob:p-5">
          {/* Top Content */}
          <div className="flex flex-col gap-3 mob:gap-2">
            <h1 className="text-2xl md:text-[36px] mob:text-xl font-Stinger font-bold text-black leading-tight">
              {item.name}
            </h1>

            {defaultUom && (
              <>
                <div className="flex items-baseline gap-2 mt-2">
                  {defaultUom.market_price &&
                    defaultUom.market_price > defaultUom.price && (
                      <p className="text-base md:text-lg text-gray-400 line-through">
                        ₹{defaultUom.market_price}
                      </p>
                    )}
                  <p className="text-lg md:text-2xl mob:text-lg font-bold text-gray-800">
                    {defaultUom.formatted_price || `₹${defaultUom.price}`}
                  </p>
                </div>

                <p className="text-sm md:text-base mob:text-sm text-gray-500 font-medium">
                  {defaultUom.unit}
                </p>
              </>
            )}

            {/* Description */}
            {description && (
              <div className="mt-3 mob:mt-2 overflow-y-auto pr-2 custom-scroll">
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Nutrition Info */}
            {nutritionInfo &&
              nutritionInfo.details &&
              nutritionInfo.details.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-4 mt-4">
                  {nutritionInfo.details.slice(0, 2).map((nutrient, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-semibold text-gray-800">
                        {nutrient.title}
                      </span>
                      <span className="text-gray-600 ml-1">
                        {nutrient.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Button */}
          <div className="mt-6 mob:mt-4 w-full">
            {defaultUom && item.is_available ? (
              <AddItemBtn
                product={productForAddBtn}
                varientId={defaultUom.variant_id}
                varientPrice={
                  defaultUom.formatted_price || `₹${defaultUom.price}`
                }
                stepperQuantity={defaultUom.stepper_quantity || 1}
                buttonType="blackaddtocart"
              />
            ) : (
              <button
                disabled
                className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
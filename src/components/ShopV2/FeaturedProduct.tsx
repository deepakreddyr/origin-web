'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';

const itemDetails = {
  "id": 358,
  "item_code": "OG00037",
  "item_name": "Enoki Mushroom",
  "name": "Enoki Mushroom",
  "logo": "https://cdn.madrasmandi.in/item-images/6p7AMxWWVE0GiZD1DV5VafM4pSkNY5JwBKkOzkOt.webp",
  "image": "https://cdn.madrasmandi.in/item-images/6p7AMxWWVE0GiZD1DV5VafM4pSkNY5JwBKkOzkOt.webp",
  "website_image": "https://cdn.madrasmandi.in//item-images/RPQa8EClcNvO4xJcOWGpqrkU08Riac9A9JcYH9Km.webp",
  "availability": true,
  "extra_descriptions": [],
  "tag_url": null,
  "tag_text": null,
  "is_collaborate_item": false,
  "title": "",
  "description": "",
  "provider_id": null,
  "multiple_uoms": [
    {
      "variant_id": 1445,
      "name": null,
      "uom_id": 9,
      "unit": "100g",
      "minimum_quantity": 99,
      "maximum_quantity": 99,
      "stepper_quantity": 1,
      "is_visible": true,
      "is_available": true,
      "is_default": true,
      "price": 195,
      "platform_id": 4,
      "formatted_price": "₹195",
      "cart_quantity": 0,
      "conversion_text": "",
      "is_not_discounted": false,
      "ripeness_types": null,
      "cart_ripeness": null,
      "market_price": 273
    }
  ],
  "uom": [
    {
      "variant_id": 1445,
      "name": null,
      "uom_id": 9,
      "unit": "100g",
      "minimum_quantity": 99,
      "maximum_quantity": 99,
      "stepper_quantity": 1,
      "is_visible": true,
      "is_available": true,
      "is_default": true,
      "price": 195,
      "platform_id": 4,
      "formatted_price": "₹195",
      "cart_quantity": 0,
      "conversion_text": "",
      "is_not_discounted": false,
      "ripeness_types": null,
      "cart_ripeness": null,
      "market_price": 273
    }
  ]
};


const FeaturedProduct = () => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const description = "At a real Chinese hot pot, you lower the enoki slowly, like a ritual. They soak in the spice, and you bite into a soft snap laced with fire.";

  return (
    <div className="w-full pt-16 pb-16 px-4 flex justify-center items-center">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-center justify-center bg-[white] rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8 gap-8 md:gap-12">

        {/* Image Section */}
        <div className="flex justify-center items-center md:pl-4">
          <div className="rounded-3xl overflow-hidden">
            <Image
              src="/assets/images/shop/EnokiMushrooms.webp"
              alt="Enoki Mushroom"
              width={480}
              height={480}
              className="object-cover w-[300px] h-[300px] md:w-[450px] md:h-[420px]"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center flex-1 text-center md:text-left gap-4 max-w-[400px]">
          <h3 className="text-2xl md:text-[36px] font-bold text-black leading-tight">
            Enoki Mushroom
          </h3>

          <p className="text-base md:text-lg text-gray-600">
            Rs.195 <span className="text-sm md:text-base text-gray-400">100g</span>
          </p>

          {/* Description */}
          <div>
            {/* Mobile */}
            <div className="block md:hidden">
              <p className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ${
                isDescriptionExpanded ? '' : 'line-clamp-2'
              }`}>
                {description}
              </p>
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-black text-sm font-medium mt-1 hover:underline"
              >
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {/* Desktop */}
            <p className="hidden md:block text-gray-700 text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="max-w-full">
            <AddItemBtn
              product={itemDetails}
              varientId={1445}
              varientPrice={"₹195"}
              stepperQuantity={1}
              buttonType="yellowaddtocart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

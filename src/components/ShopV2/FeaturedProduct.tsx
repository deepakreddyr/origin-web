'use client';

import React from 'react';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';

const itemDetails={
"id": 358,
"item_code": "OG00037",
"item_name": "Enoki Mushroom",
"name": "Enoki Mushroom",
"logo": "https://cdn.madrasmandi.in/item-images/6p7AMxWWVE0GiZD1DV5VafM4pSkNY5JwBKkOzkOt.webp",
"image": "https://cdn.madrasmandi.in/item-images/6p7AMxWWVE0GiZD1DV5VafM4pSkNY5JwBKkOzkOt.webp",
"website_image": "https://cdn.madrasmandi.in//item-images/RPQa8EClcNvO4xJcOWGpqrkU08Riac9A9JcYH9Km.webp",
"availability": true,
"extra_descriptions": [
],
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
}

const FeaturedProduct = () => {
  return (
    <div className="w-full pt-16 px-[30px] flex justify-center items-center">
      <div className="w-full max-w-[calc(100%-60px)] md:max-w-[1100px] flex flex-col md:flex-row items-center justify-center bg-[#F8F6F0] rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4 md:p-6 gap-8 md:gap-16">
        {/* Image Section */}
        <div className="w-full md:w-auto flex justify-center items-center pl-0 md:pl-8">
          <Image
            src="/assets/images/shop/EnokiMushrooms.webp"
            alt="Enoki Mushroom"
            width={350}
            height={350}
            className="rounded-3xl object-cover w-[220px] h-[220px] md:w-[350px] md:h-[350px]"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center flex-1 text-center md:text-left gap-3 md:gap-5 pl-4 md:pl-8">
          <div>
            <h3 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-3">Enoki Mushroom</h3>
            <p className="text-base md:text-xl text-gray-600 mb-3 md:mb-5">
              Rs.195 <span className="text-sm md:text-lg text-gray-400">100g</span>
            </p>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-4 md:mb-6">
              At a real Chinese hot pot, you lower the enoki slowly, like a ritual. They soak in the spice, and you bite into a soft snap laced with fire.
            </p>
            {/* Add Button */}
              <div className="mt-[0.4rem] flex-shrink-0 pt-7  overflow-hidden">
                <AddItemBtn
                  product={itemDetails}
                  varientId={1445}
                  varientPrice={"₹195"}
                  stepperQuantity={1}
                  buttonType="yellow"
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

'use client';

import React from 'react';
import Image from 'next/image';
// import AddItemBtn from './AddItemBtn/AddItemBtn';

const FeaturedProduct = () => {
  return (
    <div className="w-full pt-16 px-[30px] flex justify-center items-center">
      <div className="w-full max-w-[calc(100%-60px)] md:max-w-[1100px] flex flex-col md:flex-row items-center justify-center bg-[#F8F6F0] rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4 md:p-6 gap-8 md:gap-16">
        {/* Image Section */}
        <div className="w-full md:w-auto flex justify-center items-center pl-0 md:pl-8">
          <Image
            src="/assets/images/shop/exotic-basil.png"
            alt="Italian Basil"
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
              A sun-drenched day in Naples, hiding in your salad. Whiff it once—suddenly your pasta speaks fluent poetry.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto md:mx-0">
            <button className="bg-[#F4D03F] hover:bg-[#F1C40F] text-black font-semibold px-5 py-3 rounded-full w-full text-sm md:text-base">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

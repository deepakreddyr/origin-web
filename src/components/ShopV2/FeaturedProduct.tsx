'use client';

import React from 'react';
import Image from 'next/image';

const FeaturedProduct = () => {
  return (
    <div className="w-full pt-16 px-4 md:px-10 flex justify-center items-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center justify-center bg-[#F8F6F0] rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 md:p-8 gap-10 md:gap-20">
        {/* Image Section */}
        <div className="w-full md:w-auto flex justify-center items-center pl-0 md:pl-10">
          <Image
            src="/assets/images/shop/exotic-basil.png"
            alt="Italian Basil"
            width={400}
            height={400}
            className="rounded-3xl object-cover w-[250px] h-[250px] md:w-[400px] md:h-[400px]"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center flex-1 text-center md:text-left gap-4 md:gap-6">
          <div>
            <h3 className="text-3xl md:text-5xl font-bold text-black mb-3 md:mb-4">Italian basil</h3>
            <p className="text-lg md:text-2xl text-gray-600 mb-4 md:mb-8">
              Rs.24 <span className="text-base md:text-xl text-gray-400">100g</span>
            </p>
            <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-6 md:mb-8">
              A sun-drenched day in Naples, hiding in your salad. Whiff it once—suddenly your pasta speaks fluent poetry.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto md:mx-0">
            <button className="bg-[#F4D03F] hover:bg-[#F1C40F] text-black font-semibold px-6 py-4 rounded-full w-full text-base md:text-lg">
              Add to cart
            </button>
            <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-4 rounded-full w-full text-base md:text-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

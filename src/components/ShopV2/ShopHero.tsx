'use client';

import React from 'react';
import Image from 'next/image';
import desktopHero from '/public/assets/images/shop/heroBannerShop.png';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ShopHero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        autoPlay
        infiniteLoop
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        interval={4000}
        swipeable
        emulateTouch
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <li
            key={index}
            onClick={onClickHandler}
            className={`inline-block w-2 h-2 mx-1 rounded-full cursor-pointer ${
              isSelected ? 'bg-green-600' : 'bg-gray-300'
            }`}
            aria-label={`${label} ${index + 1}`}
            role="button"
          />
        )}
      >{[
        <div className="relative w-full">
          <Image
            src={desktopHero}
            alt="Shop Hero Banner"
            layout="responsive"
            width={1440}
            height={609}
            className="object-cover w-full"
            priority
          />

          {/* Adjusted text position */}
          <div className="absolute inset-0 z-10 flex items-center justify-end">
            <div className="text-white text-right max-w-md mr-[16vw] mt-[-3vh]">
              <h1 className="font-[Stinger] text-[3.5vw] leading-tight font-bold">
                Exotics <br /> Have <br /> Landed
              </h1>
              <button className="mt-6 bg-[#FFD600] text-black font-semibold py-2 px-6 rounded-lg hover:bg-[#ffcd00] transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>]}
      </Carousel>
    </div>
  );
};

export default ShopHero;

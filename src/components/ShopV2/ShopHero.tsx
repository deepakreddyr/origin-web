'use client';

import React from 'react';
import Image from 'next/image';
import desktopHero from '/public/assets/images/shop/heroBannerShop.png';
import { Carousel } from 'react-responsive-carousel';
import { useMediaQuery } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ShopHero = () => {
  const isMobile = useMediaQuery('(max-width:768px)');

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
      >
        {[<div className="relative w-full aspect-[2.4/1] mob:aspect-[1/1]">
          <Image
            src={desktopHero}
            alt="Shop Hero Banner"
            fill
            className="object-cover"
            priority
          />

          {/* Text and Button */}
          <div
            className={`
              absolute inset-0 z-10 flex items-start pt-[200px]
              ${isMobile ? 'justify-center px-[5vw]' : 'justify-end pr-[18vw]'}
            `}
          >
            <div
              className={`
                ${isMobile ? 'text-center max-w-[80vw]' : 'text-right max-w-[28vw]'}
              `}
            >
              <h1 className={`text-white font-bold leading-tight ${isMobile ? 'text-[6vw]' : 'text-[2.8vw]'}`}>
                Exotics <br /> Have <br /> Landed
              </h1>
              <button
                className={`
                  mt-[2vw] mob:mt-[4vw] bg-[#FFD600] text-black font-semibold py-2 px-6 rounded-lg
                  hover:bg-[#ffcd00] transition
                  ${isMobile ? 'text-[4vw]' : 'text-[1vw]'}
                `}
              >
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

'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import { useMediaQuery } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import banner1 from '/public/assets/images/shop/heroBannerShop1.png';
import banner2 from '/public/assets/images/shop/heroBannerShop2.png';
import banner3 from '/public/assets/images/shop/heroBannerShop3.png';

const bannerData = [
  {
    image: banner1,
    title: 'Exotics\nHave\nLanded',
    button: 'Shop Now',
  },
  {
    image: banner2,
    title: 'Tiny.\nTasty.\nToo good.',
    button: 'Shop Now',
  },
  {
    image: banner3,
    title: 'Fruit\nGot\nFancy',
    button: 'Shop Now',
  },
];

const ShopHero = () => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingTop: isMobile ? '60px' : '0px' }}>
      <Carousel
        autoPlay
        interval={5000}
        infiniteLoop
        showArrows={false}
        showThumbs={false}
        showStatus={false}
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
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className={`relative w-full ${
              isMobile ? 'h-[calc(65vw+50px)] pt-[50px]' : 'aspect-[2.4/1]'
            }`}
          >
            {/* Image Wrapper */}
            <div className="absolute inset-0 z-0">
              <Image
                src={banner.image}
                alt={`Shop Hero Banner ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Text and Button */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-end"
              style={{ paddingRight: isMobile ? '6vw' : '250px' }}
            >
              <div
                className={`text-right ${
                  isMobile ? 'max-w-[60vw]' : 'max-w-[28vw]'
                }`}
              >
                <h1
                  className={`
                    font-bold leading-tight text-black whitespace-pre-line
                    ${isMobile ? 'text-[4.2vw]' : 'text-[2.8vw]'}
                  `}
                >
                  {banner.title}
                </h1>
                <button
                  className={`
                    mt-[4vw] bg-[#FFD600] text-black font-semibold py-2 px-6 rounded-lg
                    hover:bg-[#ffcd00] transition
                    ${isMobile ? 'text-[3.5vw]' : 'text-[1vw]'}
                  `}
                >
                  {banner.button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ShopHero;
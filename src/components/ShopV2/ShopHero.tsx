'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import { useMediaQuery } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useRouter } from 'next/router';

import banner1 from '/public/assets/images/shop/heroBannerShop.png';
// import banner2 from '/public/assets/images/shop/heroBannerShop2.png';
import banner3 from '/public/assets/images/shop/heroBannerShop3.png';

const bannerData = [
  {
    image: banner1,
    title: 'Exotics\nHave\nLanded',
    button: 'Shop Now',
    href: '/shop/global-veggies/8/european/48',
  },
  // {
  //   image: banner2,
  //   title: 'Tiny.\nTasty.\nToo good.',
  //   button: 'Shop Now',
  //   href: '/shop/hydro-micro-greens/9/hydroponics/49',
  // },
  {
    image: banner3,
    title: 'Fruit\nGot\nFancy',
    button: 'Shop Now',
    href: '/shop/world-fruits/3/berries/40',
  },
];

const ShopHero = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const router = useRouter();

  return (
    <div className="relative w-full overflow-hidden pt-[60px]">
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
              isMobile ? 'pt-[50px]' : 'aspect-[2.4/1]'
            }`}
          >
            <div className="w-full relative">
              <Image
                src={banner.image}
                alt={`Shop Hero Banner ${index + 1}`}
                layout="responsive"
                width={1920}
                height={800}
                className="object-cover"
                priority
                quality={100}
              />
            </div>

            <div
              className="absolute inset-0 z-10 flex items-center justify-end"
              style={{ 
                paddingRight: isMobile ? '50px' : isTablet ? '120px' : '200px' 
              }}
            >
              <div
                className={`text-left ${
                  isMobile ? 'max-w-[60vw] pt-[8vw]' : isTablet ? 'max-w-[35vw]' : 'max-w-[28vw]'
                }`}
              >
                <h1
                  className={`
                    font-[SofiaPro] font-bold text-white whitespace-pre-line
                    ${isMobile 
                      ? 'text-[4.5vw] leading-[1.0]' 
                      : isTablet 
                        ? 'text-[4.5vw] leading-[0.9]' 
                        : 'text-[6vw] leading-[1.1]'
                    }
                  `}
                >
                  {banner.title}
                </h1>
                <button
                  onClick={() => router.push(banner.href)}
                  className={`
                    bg-[#FFD600] text-black font-[SofiaPro] font-semibold rounded-lg
                    hover:bg-[#ffcd00] transition
                    ${isMobile 
                      ? 'text-[2vw] mt-[3vw] py-1 px-4' 
                      : isTablet 
                        ? 'text-[1.2vw] mt-[1.8vw] py-2 px-6' 
                        : 'text-[1vw] mt-[1.5vw] py-2 px-6'
                    }
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
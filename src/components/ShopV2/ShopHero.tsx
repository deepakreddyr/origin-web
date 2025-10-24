'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import { useMediaQuery } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useRouter } from 'next/router';
import banner1 from '/public/assets/images/shop/heroBannerShop.png';
import banner2 from '/public/assets/images/shop/heroBannerShop1.png';
import banner3 from '/public/assets/images/shop/heroBannerShop2.png';
import banner4 from '/public/assets/images/shop/heroBannerShop3.png';
import landingimg from '/public/assets/images/shop/homepagebg.png';
import downchevron from '/public/assets/svg/homedownchevron.svg';
import PopularProduce from '@/components/ShopV2/PopularProduce';

const bannerData = [
  {
    image: banner1,
    title: 'Exotics\nHave\nLanded',
    button: 'Shop Now',
    href: '/shop/explore-all/2/exotic-fruits/5',
  },
  {
    image: banner4,
    title: 'Tiny.\nTasty.\nToo good.',
    button: 'Shop Now',
    href: '/shop/hydro-micro-greens/9/hydroponics/49',
  },
  {
    image: banner2,
    title: 'Sweet\nBright\nJuicy',
    button: 'Shop Now',
    href: '/shop/world-fruits/3/berries/40',
  },
  {
    image: banner3,
    title: 'Global\nSeasonal\nRare',
    button: 'Shop Now',
    href: '/shop/global-veggies/8/european/48',
  }
];

const ShopHero = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const router = useRouter();

  return (
    <div className="relative w-full overflow-hidden mob:pt-[20px]">
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
            className={`inline-block w-3 h-3 mx-1 rounded-full cursor-pointer ${
              isSelected ? 'bg-[#24874C]' : 'bg-[#729D63]'
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
          </div>
        ))}
      </Carousel>
    </div>
  );
};
export default ShopHero;

export const ShopHeroSingle = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const router = useRouter();
  
  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="relative w-full overflow-hidden mob:pt-[20px]">
      {/* Hero Banner Section */}
      <div
        className={`relative w-full ${
          isMobile ? 'pt-[50px]' : 'aspect-[2.4/1]'
        }`}
      >
        <div className="w-full relative">
          <Image
            src={landingimg}
            alt="Shop Hero Single Banner"
            layout="responsive"
            className="object-cover"
            priority
            quality={100}
          />
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0">
          <h1 className="text-center text-white font-[SofiaPro] px-4 mt-[23vw]">
            <div className="text-[3.5vw] mob:text-[8vw] font-normal tracking-wide">
              EXPLORE
            </div>
            <div className="text-[5.5vw] mob:text-[12vw] font-bold tracking-tight mt-[-0.5vw] mob:mt-[-2vw]">
              THE CULT OF FRESH
            </div>
          </h1>
          <button
            onClick={handleScrollDown}
            className="mt-[2vw] ml-[47vw] mob:mt-[6vw] w-[6vw] h-[6vw] mob:w-[12vw] mob:h-[12vw] bg-[black] rounded-full flex items-center justify-center"
            aria-label="Scroll down"
          >
            <Image 
            src={downchevron}
            width={300}
            height={300}
            alt="Shop Hero Single Banner"
            layout="responsive"/>

          </button>
        </div>
      </div>
    </div>
  );
};
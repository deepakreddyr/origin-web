import React, { useEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import OriginCarousel from '../OriginCarousel';

// Import your banners
import FreshlyArrivedBanner from '/public/assets/images/shop/FreshlyArrivedBanner.png';
import FruitsBanner from '/public/assets/images/shop/FruitsBanner.png';
import HydroponicsBanner from '/public/assets/images/shop/HydroponicsBanner.png';
import GourmetBanner from '/public/assets/images/shop/GourmetBanner.png';

import vege from '/public/assets/images/shop/VeggiesBanner.png';
// Map normalized keywords -> banner images
const bannerMap: Record<string, any> = {
  'freshly-arrived': FreshlyArrivedBanner,
  fruits: FruitsBanner,
  hydroponics: HydroponicsBanner,
  gourmet: GourmetBanner,
  veggies: vege
};

// Normalizer function to handle: raw spaces, encoded spaces, mixed case
const normalize = (value?: string): string => {
  if (!value) return '';

  return decodeURIComponent(value) // converts "%20" → " "
    .trim() // remove extra spaces
    .toLowerCase() // case-insensitive
    .replace(/\s+/g, '-'); // convert spaces → hyphens
};

const ShopHero = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();

  // Example: "/shop/Freshly Arrived/2/New Items/11"
  const path = router.asPath;

  // Section = 3rd part of URL (index 2)
  const rawSection = path.split('/')[2];

  // Normalize it
  const section = normalize(rawSection);

  // Pick image OR default banner
  const selectedBanner = bannerMap[section] || FruitsBanner;

  return (
    <div className="relative w-full overflow-hidden mob:pt-[20vw] cursor-pointer" onClick={() => router.push('/shop')}>
      <div className={`relative w-full ${isMobile ? 'pt-[50px]' : 'aspect-[2.4/1]'}`}>
        <Image
          src={selectedBanner}
          alt="Shop Section Banner"
          layout="responsive"
          width={1920}
          height={800}
          className="object-cover"
          priority
          quality={100}
        />
      </div>
    </div>
  );
};

export default ShopHero;

export const ShopHeroSingle = ({ bannerData }: { bannerData?: any }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();
  const safeBannerData =
    bannerData && bannerData.length > 0
      ? bannerData
      : [
          {
            website_image: 'https://cdn.originfresh.in/website-images/homepagebanner1.png',
            website_mobile_view_image: 'https://cdn.originfresh.in/website-images/homepagebannermob1.png',
            navigation: { to: '/shop' }
          }
        ];

  const slides = safeBannerData.map((item: any, index: number) => {
    const desktopImage = item?.website_desktop_view_image || item?.website_image;
    const mobileImage = item?.website_mobile_view_image;
    const bannerSrc = isMobile
      ? mobileImage || 'https://cdn.originfresh.in/website-images/homepagebannermob1.png'
      : desktopImage || 'https://cdn.originfresh.in/website-images/homepagebanner1.png';
    const navigationTo = item?.navigation?.to || '/shop';
    const handleNavigation = () => {
      router.push(navigationTo);
    };

    return (
      <div
        key={index}
        className={`relative w-full h-[40vw] mob:h-[100vw] bg-[#f7f1dc] cursor-pointer`}
        onClick={handleNavigation}
      >
        <Image src={bannerSrc} alt={`Hero Banner ${index}`} fill priority quality={100} className="object-cover" />
      </div>
    );
  });

  return (
    <div className="w-full relative overflow-hidden hero-banner-carousel">
      <style>{`
        .hero-banner-carousel .swiper-pagination {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 100px;
          width: fit-content !important;
          left: 50% !important;
          transform: translateX(-50%);
          bottom: 60px !important;
          display: flex !important;
          align-items: center;
          gap: 8px;
          z-index: 10;
        }
        .hero-banner-carousel .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #fff !important;
          opacity: 0.5;
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .hero-banner-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.1);
          background: #fff !important;
        }
        @media (max-width: 768px) {
          .hero-banner-carousel .swiper-pagination {
            bottom: 40px !important;
            padding: 4px 10px;
            gap: 6px;
          }
          .hero-banner-carousel .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
      <OriginCarousel
        className="w-full"
        slides={slides}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 }
        }}
        pagination={safeBannerData.length > 1 ? { clickable: true } : false}
        navigation={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        loop={true}
        slideClassName="w-full"
      />
    </div>
  );
};

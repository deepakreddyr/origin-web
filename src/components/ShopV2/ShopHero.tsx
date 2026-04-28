import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useMediaQuery, Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import OriginCarousel from '../OriginCarousel';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

// Import your banners
import FreshlyArrivedBanner from '/public/assets/images/shop/FreshlyArrivedBanner.png';
import FruitsBanner from '/public/assets/images/shop/FruitsBanner.png';
import HydroponicsBanner from '/public/assets/images/shop/HydroponicsBanner.png';
import GourmetBanner from '/public/assets/images/shop/GourmetBanner.png';

import vege from '/public/assets/images/shop/VeggiesBanner.png';

import homepagebanner1 from '/public/assets/images/shop/homepagebanner1.webp';
import homepagebannermob1 from '/public/assets/images/shop/homepagebannermob1.webp';
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
    <div
      className="relative w-full overflow-hidden mob:pt-[20vw] cursor-pointer"
      onClick={() => {
        router.push('/shop');
      }}
    >
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

export const ShopHeroSingle = ({ bannerData, videoSrc }: { bannerData?: any; videoSrc?: string }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, [videoSrc]);

  if (videoSrc) {
    return (
      <div className="w-full relative overflow-hidden h-[50vw] mob:h-[100vw] bg-[#f7f1dc]">
        {/* Shimmer / Skeleton */}
        {!isVideoLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 5,
              backgroundColor: 'rgba(0,0,0,0.05)'
            }}
          />
        )}

        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onCanPlay={() => setIsVideoLoaded(true)}
        />

        {/* Hero Overlay Content
        {isVideoLoaded && (
          <div
            className={`absolute inset-0 flex flex-col items-center ${isMobile ? 'justify-end pb-[12vw]' : 'justify-center'} text-center p-4 z-10 transition-all duration-700 ease-out`}
            style={{
              opacity: isVideoLoaded ? 1 : 0,
              transform: isVideoLoaded ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 md:gap-8 max-w-[90vw] md:max-w-4xl">
              <h1
                style={{
                  fontFamily: 'Recoleta',
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1.1
                }}
                className="text-[10vw] md:text-[6vw] lg:text-[5.5vw]"
              >
                The Cult Of Fresh
              </h1>

              <p
                style={{
                  fontFamily: 'SofiaPro',
                  fontWeight: 500,
                  color: 'white'
                }}
                className="text-[4.5vw] md:text-[2vw] lg:text-[1.8vw] opacity-90 max-w-[80vw] md:max-w-2xl"
              >
                Plating up <span style={{ fontWeight: 700 }}>150+</span>
                <br className="md:hidden" /> authentic exotic produce
              </p>

              <button
                className="pointer-events-auto"
                onClick={() => {
                  router.push('/shop');
                }}
                style={{
                  backgroundColor: '#fac510',
                  color: '#000',
                  padding: isMobile ? '12px 28px' : '16px 38px',
                  borderRadius: 50,
                  fontSize: isMobile ? 16 : 22,
                  fontWeight: 700,
                  fontFamily: 'SofiaPro',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: isMobile ? 12 : 24,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Shop Now
              </button>
            </div>
          </div>
        )} */}
      </div>
    );
  }

  const safeBannerData =
    bannerData && bannerData.length > 0
      ? bannerData
      : [
          {
            website_image: homepagebanner1,
            website_mobile_view_image: homepagebannermob1,
            navigation: { to: '/shop' }
          }
        ];

  const slides = safeBannerData.map((item: any, index: number) => {
    const desktopImage = item?.website_desktop_view_image || item?.website_image;
    const mobileImage = item?.website_mobile_view_image;
    const bannerSrc = isMobile ? mobileImage || homepagebannermob1 : desktopImage || homepagebanner1;
    const navigationTo = item?.navigation?.to || '/shop';
    const handleNavigation = () => {
      trackEvent(AnalyticsEvents.BANNER_CLICKS, {
        banner_url: navigationTo,
        banner_index: index
      });
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

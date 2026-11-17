import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import VideoBanner from './VideoBanner';
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerImage {
  mobile: string;
  desktop: string;
  alt?: string;
}

interface ImageBannerCarouselProps {
  mobileVideoSrc: string;
  desktopVideoSrc: string;
  images: BannerImage[];
  autoplayDelay?: number;
}

// Hero carousel: the video is the first slide, followed by the image banners.
// The video plays to the end before advancing; image slides autoplay on a timer.
const ImageBannerCarousel: React.FC<ImageBannerCarouselProps> = ({
  mobileVideoSrc,
  desktopVideoSrc,
  images,
  autoplayDelay = 4000
}) => {
  const isMobile = useMediaQuery(768);
  const swiperRef = useRef<SwiperType | null>(null);
  // Same heights as VideoBanner
  const heightClass = isMobile ? 'h-[75vh] object-fill' : 'h-[85vh] object-cover';

  const handleSlideChange = (swiper: SwiperType) => {
    if (swiper.realIndex === 0) {
      swiper.autoplay?.stop();
      const video = swiper.slides[0]?.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    } else {
      swiper.autoplay?.start();
    }
  };

  // Swipe is handled here rather than by Swiper's built-in touch handling
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 50;

  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) swiperRef.current?.slideNext();
    else swiperRef.current?.slidePrev();
  };

  return (
    <div
      className="relative w-full overflow-hidden m-0 p-0"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        rewind
        allowTouchMove={false}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.autoplay?.stop();
        }}
        onSlideChange={handleSlideChange}
        className="w-full"
        style={{ touchAction: 'pan-y', ['--swiper-pagination-color' as string]: '#fff' }}
      >
        <SwiperSlide>
          <VideoBanner
            mobileVideoSrc={mobileVideoSrc}
            desktopVideoSrc={desktopVideoSrc}
            loop={false}
            onEnded={() => swiperRef.current?.slideNext()}
          />
        </SwiperSlide>
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <picture>
              <source media="(max-width: 767px)" srcSet={image.mobile} />
              <img
                src={image.desktop}
                alt={image.alt || `Banner ${index + 1}`}
                className={`w-full block m-0 p-0 select-none ${heightClass}`}
                loading="lazy"
                draggable={false}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageBannerCarousel;

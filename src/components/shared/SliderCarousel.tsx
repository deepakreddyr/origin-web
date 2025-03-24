import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard, FreeMode, Autoplay } from 'swiper/modules';
import { Box } from '@mui/material';
import { useId } from 'react';
import classNames from 'classnames';

interface OriginCarouselProps {
  slides: React.ReactNode[];
  slideClassName?: string;
}

const SliderCarousel: React.FC<SwiperProps & OriginCarouselProps> = ({
  slideBlankClass,
  slideClass,
  slideActiveClass,
  slides,
  rewind,
  slidesPerView,
  spaceBetween,
  direction = 'horizontal',
  cssMode,
  navigation,
  pagination,
  keyboard,
  mousewheel,
  className,
  slideClassName,
  freeMode = true,
  onProgress,
  onUpdate,
  autoplay,
  speed,
  loop,
  breakpoints,
  onSlideChange,
  grabCursor,
  wrapperClass,
  slidesOffsetAfter,
  slidesOffsetBefore
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const prevEl = `.arrowLeft-${id}`;
  const nextEl = `.arrowRight-${id}`;

  const breakpointsDefault = {
    320: {
      slidesPerView: 2
      // spaceBetween: 20,
    },
    640: {
      slidesPerView: 3
      // spaceBetween: 20,
    },
    768: {
      slidesPerView: 4
    },
    1024: {
      slidesPerView: 4.15,
      spaceBetween: 0
    }
  };

  return (
    <Box className="flex flex-col">
      <Box className="flex w-full ">
        <Swiper
          rewind={rewind}
          slideClass={slideClass}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          cssMode={cssMode}
          autoplay={autoplay}
          speed={speed}
          direction={direction}
          navigation={
            !navigation
              ? {
                  nextEl,
                  prevEl
                }
              : navigation
          }
          pagination={pagination}
          keyboard={keyboard}
          freeMode={freeMode}
          mousewheel={mousewheel}
          loop={loop}
          wrapperClass={wrapperClass}
          modules={[Navigation, Pagination, Mousewheel, Keyboard, FreeMode, Autoplay]}
          grabCursor={grabCursor}
          className={className}
          slidesOffsetAfter={slidesOffsetAfter}
          slidesOffsetBefore={slidesOffsetBefore}
          onSlideChange={onSlideChange}
          onProgress={onProgress}
          onUpdate={onUpdate}
          breakpoints={breakpoints ? breakpoints : breakpointsDefault}
          touchEventsTarget="container"
        >
          {slides?.map((slide, index) => (
            <SwiperSlide
              className={classNames(
                // slideClassName,
                'z-[2]  pointer-events-auto'
              )}
              key={index}
            >
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default SliderCarousel;

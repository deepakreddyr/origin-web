import { Box, Typography } from "@mui/material";
import OriginCarousel from "@/components/OriginCarousel";
import CarouselButtons from "@/components/CarouselButtons";
import style from "./PopularItemsSlider.module.scss";
import RoundContainer from "@/components/RoundContainer";
import CA from "classnames";
import {
  FreeModeOptions,
  NavigationOptions,
  SwiperOptions,
} from "swiper/types";
type PopularItemsSliderProps = {
  title?: string;
  slides: any;
  classes?: {
    root?: string;
    rootInner?: string;
    productCarousel?: string;
  };
  primaryActions?: any;
  secondaryActions?: any;
  slidesPerView?: number;
  spaceBetween?: number;
  slidesOffsetBefore?: number;
  slidesOffsetAfter?: number;
  navigation?: NavigationOptions | boolean;
  freeMode?: FreeModeOptions;
  breakpoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
};

const PopularItemsSlider = ({
  title,
  primaryActions,
  secondaryActions,
  slides,
  slidesOffsetBefore = 24,
  slidesOffsetAfter = 24,
  slidesPerView = 3.9,
  spaceBetween = 53,
  freeMode = { enabled: false },
  breakpoints = {
    320: {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2.4,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 3.8,
    },
  },
  classes = {},
  navigation,
}: PopularItemsSliderProps) => {
  return (
    <RoundContainer className={classes.root}>
      <Box
        className={CA(
          "flex flex-wrap md:flex-row justify-between px-5 md:px-11 gap-y-5",
          classes.rootInner,
          style.rootInner
        )}
      >
        <Typography variant="h5" className="font-bold text-[32px]">
          {title}
        </Typography>
        {primaryActions && primaryActions}
      </Box>
      <Box className="block">
        <OriginCarousel
          className={CA("poProducts-slider", classes.productCarousel)}
          slides={slides}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          freeMode={freeMode}
          speed={800}
          mousewheel={{ forceToAxis: true }}
          slidesOffsetBefore={slidesOffsetBefore}
          slidesOffsetAfter={slidesOffsetAfter}
          navigation={{
            nextEl: ".poProductsRight",
            prevEl: ".poProductsLeft",
          }}
          breakpoints={breakpoints}
        />
      </Box>
      {secondaryActions && (
        <Box
          className={CA(
            secondaryActions
              ? "justify-center md:justify-between"
              : "justify-center md:justify-end",
            "flex md:flex-row flex-wrap gap-5 mx-11 mt-8"
          )}
        >
          {secondaryActions}
          {navigation && (
            <CarouselButtons
              leftButtonClass="poProductsRight"
              rightButtonClass="poProductsLeft"
            />
          )}
        </Box>
      )}
    </RoundContainer>
  );
};

export default PopularItemsSlider;

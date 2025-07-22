import { Box, Typography } from "@mui/material";
import { ProductCard } from "../../Cards";
import OriginCarousel from "../../OriginCarousel";
import { Product } from "../../../utilities/types";
import OriginButton from "../../OriginButton";
import FilterButtons from "../../FilterButtons";
import CA from "classnames";
import CarouselButtons from "../../CarouselButtons";
import style from "./PopularProducts.module.scss";
import RoundContainer from "../../RoundContainer";
type PopularProductsProps = {
  productsList: Product[];
  classes?: {
    root?: string;
    rootInner?: string;
    productCarousel?: string;
  };
};

const PopularProducts = ({
  productsList,
  classes = {},
}: PopularProductsProps) => {
  const breakpoints = {
    320: {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3.2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3.2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 25,
    },
    1280: {
      slidesPerView: 3.8,
    },
  };
  return (
    <RoundContainer className={classes.root}>
      <Box
        className={CA(
          "flex flex-wrap md:flex-row justify-between px-5 md:px-11 gap-y-5",
          classes.rootInner,
          style.rootInner
        )}
      >
        <Typography variant="h5" className="font-[SofiaPro] font-bold text-[32px]">
          Popular Produce
        </Typography>
        <FilterButtons
          classes={{
            root: "w-full whitespace-nowrap md:w-auto mt-0",
          }}
          buttons={["Get it today", "Get it tomorrow"]}
          condition={["get-sameday"]} //TODO: add conditional events
        />
      </Box>
      <Box className="block">
        <OriginCarousel
          className={CA("poProducts-slider", classes.productCarousel)}
          slides={productsList.map((product) => (
            <ProductCard
              className="flex-[0_0_250px] md:flex-auto pt-7 md:pt-8 pb-5"
              key={product.sku}
              product={product}
            />
          ))}
          mousewheel={{
            forceToAxis: true,
          }}
          slidesPerView={3.8}
          spaceBetween={53}
          freeMode={{ enabled: false }}
          speed={800}
          navigation={{
            nextEl: ".poProductsRight",
            prevEl: ".poProductsLeft",
          }}
          breakpoints={breakpoints}
        />
      </Box>
      <Box className="flex md:flex-row flex-wrap justify-center md:justify-between gap-5 mx-11 my-8">
        <OriginButton
          variant="outlined"
          buttonText="Shop all products"
          classes={{ iconButton: "py-2 px-4 md:py-4 md:px-7" }}
        />
        <CarouselButtons
          leftButtonClass="poProductsRight"
          rightButtonClass="poProductsLeft"
        />
      </Box>
    </RoundContainer>
  );
};

export default PopularProducts;

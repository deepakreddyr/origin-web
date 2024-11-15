import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import CarouselButtons from "../CarouselButtons";
import OriginCarousel from "../OriginCarousel";
import Dropdown from "../OriginDropDown/OriginDropDown";
import HTMLReactParser from "html-react-parser/lib/index";
import Weight from "../Weight/Weight";
import Price from "../Price/Price";
import ProductOptions from "../ProductOptions";
import { OriginChevronDown } from "../../Icons/OriginIcons";
import { Products } from "../../utilities/types";
import Radio from "../Radio";
import RadioGroup from "@mui/material/RadioGroup";

interface ProductsFilterSliderProps {
  productsList: Products;
}

const ProductsFilterSlider = ({ productsList }: ProductsFilterSliderProps) => {
  const deliverList = [
    "🛒   Get it Today by 7pm",
    "🛒   Get it Tomorrow by 7am",
  ];

  const productSlideBreakpoints = {
    320: {
      slidesPerView: 1,
    },
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box className="flex justify-between items-center gap-4 md:mt-12 mb-0 md:mb-7">
      <Container className="relative">
        <CarouselButtons
          rightButtonClass="poProductRight"
          classes={{
            button:
              "last-of-type:hidden absolute -left-14 top-1/2 -translate-y-1/2",
          }}
        />
        <OriginCarousel
          slidesPerView={1}
          navigation={{
            prevEl: ".poProductRight",
            nextEl: ".poProductLeft",
          }}
          grabCursor={false}
          breakpoints={productSlideBreakpoints}
          mousewheel={{
            forceToAxis: true,
          }}
          freeMode={false}
          slides={productsList.map((product) => (
            <Box
              key={product.name}
              className="relative gap-9 sm:gap-4 md:gap-9 grid grid-cols-1 sm:grid-cols-2 snap-center"
            >
              <Box className="sm:top-0 sm:sticky bg-primary-100 rounded-[20px] md:rounded-[32px] w-full sm:w-full md:w-full lg:w-[500px] aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={248}
                  height={192}
                  className="rounded-[20px] md:rounded-[32px] w-full h-full aspect-square object-cover"
                />
              </Box>
              <Box className="md:relative sm:w-full">
                <Box>
                  <Box className="flex md:flex-row sm:flex-col sm:items-start gap-1.5">
                    <Typography variant="body1" className="text-sm md:text-lg">
                      Products in spotlight from our
                    </Typography>
                    <Dropdown
                      btnVariant="textOnly"
                      options={[1, 2, 3, 4]}
                      label="Exotic Greens"
                      classes={{
                        iconButton: "gap-2",
                        buttonText: "text-sm md:text-lg underline",
                        iconOne: "w-3.5",
                      }}
                      onSelect={() => {}}
                      IconOne={OriginChevronDown}
                    />
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    className="mt-4 md:mt-[30px] mb-3 md:mb-6 text-secondary"
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="sm:max-h-[140px] text-sm sm:overflow-y-auto noscrollbar"
                  >
                    {HTMLReactParser(
                      product.description || product.shortDescription
                    )}
                  </Typography>
                </Box>
                <Box className="border-primary-200 my-6 md:mt-[34px] md:mb-[42px] px-4 py-3.5 border rounded-[13px]">
                  <RadioGroup aria-labelledby="delivery-types" name="delivery">
                    {deliverList.map((deliver, dIdx) => (
                      <Box key={deliver}>
                        <Radio
                          label={deliver}
                          formControlLabelProps={{
                            className: "flex gap-6 w-full",
                            classes: { label: "text-sm md:text-base" },
                          }}
                          id={deliver}
                          name={"deliver"}
                          value={`delivery-${dIdx}`}
                        />
                        {dIdx < deliverList.length - 1 && (
                          <hr className="bg-primary-200 my-4" />
                        )}
                      </Box>
                    ))}
                  </RadioGroup>
                </Box>
                <Box className="flex justify-between items-center gap-5 pb-3 w-full">
                  <Box className="flex justify-end items-end gap-4 w-full">
                    <Weight
                      className="font-medium text-base text-black-op-50 md:text-[22px] leading-normal"
                      weight={product.weight}
                    />
                    <Price
                      classes={{
                        firstPrice: "hidden",
                        secondPrice: "text-base md:text-[22px] leading-normal",
                      }}
                      price={product.price}
                    />
                  </Box>
                  <ProductOptions
                    key={product.stockStatus}
                    stockStatus={product.stockStatus}
                    label={null}
                    product={product}
                    classes={{
                      dropdownBtn:
                        "w-min lg:w-auto px-6  text-nowrap md:px-8 md:py-4",
                      cartBtn: "lg:w-auto",
                    }}
                    firstOption={{
                      productName: product.name,
                      image: product.image,
                      configurableOptions: product.configurableOptions,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        />
        <CarouselButtons
          leftButtonClass="poProductLeft"
          classes={{
            button:
              "first-of-type:hidden absolute -right-14 top-1/2 -translate-y-1/2",
          }}
        />
      </Container>
    </Box>
  );
};

export default ProductsFilterSlider;

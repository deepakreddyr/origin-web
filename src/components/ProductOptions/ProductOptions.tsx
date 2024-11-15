import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box, MenuList, Typography } from "@mui/material";
import Weight from "../Weight/Weight";
import {
  OriginChevronDown2,
  OriginPlus,
  OriginRipeIcon,
  OriginSemiRipeIcon,
  OriginUDArrows,
} from "../../Icons/OriginIcons";
import Price from "../Price/Price";
import Image from "next/image";
import OriginButton from "../OriginButton";
import { Close } from "@mui/icons-material";
import AddToCartButton from "../AddToCardButton/AddToCartButton";
import CA from "classnames";

type OriginSelectProps = {
  stockStatus?: "OUT_OF_STOCK" | "IN_STOCK";
  product: any;
  firstOption: {
    productName: string;
    image: string;
    configurableOptions: Array<Object> | null;
  };
  label?: string | null;
  classes?: {
    dropdownBtn?: string;
    dropdownBtnText?: string;
    dropdownBtnIconOne?: string;
    dropdownBtnIconTwo?: string;
    outOfStockBtn?: string;
    outOfStockBtnText?: string;
    cartBtn?: string;
  };
};

export default function ProductOptions(props: OriginSelectProps) {
  const { product, firstOption, stockStatus, classes } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
      if (optionsLength === undefined) {
        alert("addtocart");
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const Option = ({ value, className }: { value: any; className: string }) => {
    return (
      <Box className={CA(className, "relative")}>
        {value.ripeStatus && (
          <Box className="flex">
            {value.ripeStatus === "ripe" ? (
              <span className="flex items-center gap-[6px] md:gap-2.5">
                <OriginRipeIcon className="w-3 md:w-4 h-3 md:h-4" />
                <Typography
                  className="font-normal text-xs md:text-sm leading-[22px]"
                  variant="body1"
                >
                  Ripe
                </Typography>
              </span>
            ) : (
              <span className="flex items-center gap-[6px] md:gap-2.5">
                <OriginSemiRipeIcon className="w-3 md:w-4 h-3 md:h-4" />
                <Typography
                  className="font-normal text-xs md:text-sm leading-[22px]"
                  variant="body1"
                >
                  Semi-Ripe
                </Typography>
              </span>
            )}
          </Box>
        )}
        <Weight
          weight={value.weight}
          className="md:py-7 pt-4 pb-5 text-xs md:text-sm"
        />
        <Box className="relative flex flex-col md:py-7 pt-7 pb-5">
          {value.offer ? (
            <Typography
              variant="body1"
              className="top-0 left-0 absolute bg-secondary px-2 rounded-b-md w-max text-medium text-white text-xs leading-5"
            >
              {value.offer}
            </Typography>
          ) : null}
          <Price
            classes={{
              root: CA("text-xs md:text-sm"),
            }}
            price={value.price}
          />
        </Box>
        <Box className="md:min-w-[124px] ms-auto">
          <AddToCartButton
            btnClassName={CA(
              "ms-auto border-primary-200 px-4 py-2 md:px-4 md:py-2 text-xs md:text-sm",
              classes?.cartBtn
            )}
            classes={{
              buttonText: "text-xs md:text-base font-normal",
              outOfStockBtnTextClass: CA(
                "text-xs md:text-sm",
                classes?.outOfStockBtnText
              ),
              outOfStockClass: "ms-auto",
            }}
            variant="outlined"
            product={value}
          />
        </Box>
      </Box>
    );
  };

  const optionsLength = firstOption?.configurableOptions?.length;
  const getButtonText = () => {
    if (stockStatus !== "IN_STOCK" || optionsLength === 0) {
      return "Out of Stock";
    } else {
      if (optionsLength === undefined) {
        return "Add";
      }
      return optionsLength && optionsLength > 1
        ? `${optionsLength} Options`
        : `${optionsLength} Option`;
    }
  };
  const buttonText = getButtonText();

  if (stockStatus !== "IN_STOCK" || optionsLength === 0) {
    return (
      <AddToCartButton
        product={product}
        classes={{
          outOfStockBtnTextClass: CA(
            "text-xs md:text-lg w-max",
            classes?.outOfStockBtnText
          ),
          outOfStockClass: CA(
            "md:px-8 md:py-[15px] px-6 py-3",
            classes?.outOfStockBtn
          ),
        }}
      />
    );
  }

  const MenuListWrapper = ({ firstOption, product }: OriginSelectProps) => {
    return (
      <MenuList className="p-0">
        <HeaderOption data={firstOption} />
        {product.configurableOptions.map((value: any, index: number) => (
          <Option
            className={CA(
              "items-center gap-1 md:gap-5 border-y-primary-200 grid last-of-type:pb-0 border-t last-of-type:border-b-0",
              value.ripeStatus
                ? "grid-cols-[90px_5ch_1fr_minmax(auto,124px)] md:grid-cols-[repeat(4,auto)]"
                : "grid-cols-[minmax(5ch,90px)_1fr_minmax(auto,124px)] md:grid-cols-3"
            )}
            key={index}
            value={value}
          />
        ))}
      </MenuList>
    );
  };

  return (
    <>
      <OriginButton
        variant="textOnly"
        buttonText={buttonText}
        handleClick={handleClick}
        classes={{
          iconButton: CA(
            "w-full h-min bg-primary border-2 md:gap-x-2.5 border-transparent border-solid  rounded-full hover:shadow-origin hover:shadow-black hover:border-black active:shadow-none transition-all active:translate-y-[5px] duration-200 ease-in-out px-6 py-2 gap-x-[6px] md:px-8 py-1 md:py-[14px]",
            classes?.dropdownBtn
          ),
          iconOne: CA(
            "w-2.5 md:w-[18px] h-4 md:h-[18px]",
            classes?.dropdownBtnIconOne
          ),
          iconTwo: CA("w-3.5 h-3.5", classes?.dropdownBtnIconTwo),
          buttonText: CA(
            "text-xs md:text-lg normal-case",
            classes?.dropdownBtnText
          ),
        }}
        condition={optionsLength ? optionsLength >= 1 : false}
        IconOne={isMobile ? OriginChevronDown2 : OriginUDArrows}
      />
      {optionsLength && optionsLength >= 1 && (
        <>
          {isMobile ? (
            <SwipeableDrawer
              anchor="bottom"
              open={drawerOpen}
              onClose={handleClose}
              onOpen={() => setDrawerOpen(true)}
              disableSwipeToOpen={false}
              swipeAreaWidth={20}
              classes={{
                paper: "px-5 md:px7 pt-5 pb-7 md:py-5 rounded-t-[20px] mt-7",
              }}
            >
              <OriginButton
                buttonText="close"
                variant="iconOnly"
                classes={{
                  buttonText: "sr-only",
                  iconButton: "ms-auto z-10 p-1 absolute right-5 top-5",
                }}
                IconOne={Close}
                handleClick={handleClose}
              />
              <MenuListWrapper firstOption={firstOption} product={product} />
            </SwipeableDrawer>
          ) : (
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              classes={{
                root: "-mt-6",
                paper: "px-7 py-5 rounded-[20px] mt-7",
              }}
              disableScrollLock={true}
            >
              <MenuListWrapper firstOption={firstOption} product={product} />
            </Popover>
          )}
        </>
      )}
    </>
  );
}

export const HeaderOption = ({
  data,
  className,
}: {
  data: { image: string; productName: string };
  className?: string;
}) => {
  return (
    <Box className={CA(className, "flex items-center gap-4 mb-6")}>
      <Image
        src={data.image}
        alt={data.productName}
        className="mb- rounded-[4px] w-16 h-16"
        width={200}
        height={200}
      />
      <Typography
        variant="body1"
        className="font-medium text-secondary text-sm capitalize"
      >
        {data.productName}
      </Typography>
    </Box>
  );
};

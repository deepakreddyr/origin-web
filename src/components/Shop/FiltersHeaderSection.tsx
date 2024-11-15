import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dropdown from "../OriginDropDown/OriginDropDown";
import SearchBar from "../Header/SearchBar";
import OriginButton from "../OriginButton";
import classNames from "classnames";
import { OriginChevronDown2 } from "../../Icons/OriginIcons";

const Filters = ({
  categories,
  sortOptions,
}: {
  sortOptions?: Array<string>;
  categories: { title: string }[];
}) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const handleButtonClick = (item: string) => {
    setActiveButton(item);
  };

  return (
    <Container className="flex flex-wrap md:flex-nowrap lg:border-primary-200 px-0 lg:p-3 lg:border lg:rounded-full">
      {!isMobile && (
        <Box className="flex gap-2.5 w-auto md:w-full md:max-w-lg md:grow">
          <Dropdown
            onSelect={() => {}}
            label="All Categories"
            options={categories.map((i) => i.title)}
            classes={{
              iconButton: "lg:px-8 lg:py-4",
              buttonText: "text-base text-nowrap",
              iconOne: "w-[18px] h-[18px]",
              menuPaper: "p-5 md:p-0 mt-7",
              menuList: "p-4 md:p-8",
            }}
          />

          <SearchBar
            classes={{
              inputBase: "py-4",
            }}
          />
        </Box>
      )}
      <Box className="flex lg:flex-wrap gap-2 lg:gap-16 lg:before:[content:''] pb-[30px] lg:pb-0 lg:overflow-[unset] overflow-x-auto noscrollbar">
        {isMobile && (
          <>
            <Dropdown
              btnVariant="outlined"
              onSelect={() => {}}
              label="All Categories"
              options={categories.map((i) => i.title)}
              IconOne={OriginChevronDown2}
              classes={{
                iconButton: "px-4 py-2 lg:px-8 lg:py-4 border-primary-200",
                buttonText: "text-sm lg:text-base text-nowrap text-black-op-60",
                iconOne: "w-2.5 h-2 fill-black-op-60",
                menuPaper:
                  "p-0 lg:p-0 mt-4 border-primary-200 border-2 mt-2 rounded-[20px]",
              }}
            />
            {sortOptions && (
              <Dropdown
                btnVariant="outlined"
                onSelect={() => {}}
                label="Sort by"
                options={sortOptions}
                IconOne={OriginChevronDown2}
                classes={{
                  buttonText:
                    "text-sm lg:text-base text-nowrap text-black-op-60",
                  iconButton: "px-4 py-2 lg:px-8 lg:py-4 border-primary-200",
                  iconOne: "w-2.5 h-2 fill-black-op-60",
                  menuPaper:
                    "p-0 lg:p-0 mt-4 border-primary-200 border-2 mt-2 rounded-[20px]",
                }}
              />
            )}
          </>
        )}
        {["Buy Again", "Recommended", "Combos"].map((item) => (
          <OriginButton
            key={item}
            variant={isMobile ? "outlined" : "textOnly"}
            classes={{
              iconButton: classNames(
                "rounded-full",
                activeButton === item
                  ? "text-secondary"
                  : "lg:text-black text-black-op-60",
                isMobile && "border-primary-200 px-4 py-2"
              ),
              buttonText: "lg:text-base text-sm text-black-op-60",
            }}
            handleClick={() => handleButtonClick(item)}
          >
            <Typography
              variant="body1"
              className={classNames(
                "lg:px-3 lg:py-1 text-sm lg:text-lg text-nowrap",
                {
                  active: activeButton === item,
                }
              )}
            >
              {item}
            </Typography>
          </OriginButton>
        ))}
      </Box>
    </Container>
  );
};

export default Filters;

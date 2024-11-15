import React from "react";
import { Box, InputBase } from "@mui/material";
import { OriginSearch } from "../../../Icons/OriginIcons";
import classNames from "classnames";
type Props = {
  classes?: {
    root?: string;
    inputBase?: string;
  };
  className?: string;
};
const SearchBar = ({ className, classes }: Props) => (
  <Box
    className={classNames(
      "relative w-full max-w-full md:max-w-sm",
      classes?.root,
      className
    )}
  >
    <InputBase
      placeholder="Search products"
      classes={{
        input:
          "bg-primary-100 placeholder:text-black placeholder:opacity-[1!important]",
      }}
      className={classNames(
        "bg-primary-100 py-[9px] px-5 md:py-3 rounded-full w-full font-medium text-black text-sm leading-[22px] pe-14",
        classes?.inputBase
      )}
      inputProps={{ "aria-label": "search products" }}
    />
    <div className="right-0 absolute inset-y-0 flex items-center pe-5">
      <OriginSearch className="w-4 h-4 text-black" />
    </div>
  </Box>
);

export default SearchBar;

import { Box } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import searchIcon from "../../../../assets/svg/search.svg";
import PaymentSidebarLayout from "../../../../components/PaymentLayout/PaymentSidebarLayout";
import ProductsMenu from "./components/ProductsMenu";
import {
  isSearchedProductEnableAtom,
  searchedProductAtom,
} from "./context/atoms";
import { getSearchQuery } from "./services/getSearchQuery";
import styles from "./styles.module.css";

const SearchProduct = () => {
  const [isOpen, setIsOpen] = useAtom(isSearchedProductEnableAtom);
  const [, setSearchProduct] = useAtom(searchedProductAtom);
  const [value, setValue] = React.useState("");

  const getSearch: any = async () => {
    if (value.length > 0) {
      await getSearchQuery(setSearchProduct, { queryString: value });
    }
  };

  React.useEffect(() => {
    const getData = setTimeout(() => {
      getSearch();
    }, 500);

    return () => clearTimeout(getData);
  }, [value]);

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  const renderInput = () => {
    return (
      <Box
        className={styles["search-box"]}
        sx={{
          marginTop: "1rem",
          position: "relative",
          maxWidth: 580,
          width: "100%",
          input: {
            borderRadius: "8px",
            backgroundColor: "#F9F0DA",
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.04)",
            height: 46,
            border: 0,
            width: "100%",
            paddingLeft: "48px",
            fontSize: 14,
            fontWeight: "500",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          },
        }}
      >
        <Box
          component="figure"
          className={styles["search-box-title"]}
          sx={{
            position: "absolute",
            left: "12px",
            transform: "translateY(-50%)",
            top: "50%",
            margin: 0,
            display: "block",
            width: "20px",
            height: "20px",
          }}
        >
          <Image src={searchIcon} alt="search" />
        </Box>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="Search products"
        />
      </Box>
    );
  };
  return (
    <PaymentSidebarLayout
      isOpen={isOpen}
      title="Search Order"
      onClose={() => {
        setIsOpen(false);
      }}
    >
      {renderInput()}
      <ProductsMenu />
    </PaymentSidebarLayout>
  );
};

export default SearchProduct;

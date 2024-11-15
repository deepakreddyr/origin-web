import { Box, Container, Grid } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

import { searchedProductAtom } from "../../context/atoms";
import Product from "../Product";

const ProductsMenu = () => {
  const [product] = useAtom(searchedProductAtom);

  return (
    <Box
      component="section"
      className="product-list-section"
      sx={{
        paddingTop: "1rem",
        paddingBottom: "1rem",
        overflow: "auto",
      }}
    >
      <Container maxWidth="xl" className="product-list-container">
        <Grid container spacing={2}>
          {product.data &&
            product.data.map((item: any) => (
              <Product product={item} key={item.id} />
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsMenu;

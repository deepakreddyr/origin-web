import { Box, Container, Grid } from '@mui/material';
import React from 'react';

import type { SearchedItem } from '../../types/SearchedProduct';
import Product from '../Product';
import { ProductCard } from '@/components/Cards';

interface Props {
  products: SearchedItem[];
}

const ProductsMenu = (props: Props) => {
  const { products } = props;

  return (
    <Box
      component="section"
      className="product-list-section"
      sx={{
        paddingTop: 3,
        paddingBottom: 3
      }}
    >
      <Container maxWidth="xl" className="product-list-container">
        <Grid container spacing={2} xs={12} lg={16}>
          {products.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsMenu;

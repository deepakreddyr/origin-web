import { Box, Container, Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import ProductsMenu from './components/ProductsMenu';
import { querySearchedProductAtom, searchedProductAtom, searchStringAtom } from './context/atoms';
// import UomModel from './components/UomModel';
import styles from './style.module.css';
import NoData from './components/NoData';

const SearchResults = () => {
  const [searchedProducts] = useAtom(searchedProductAtom);
  const [querySearchedProduct] = useAtom(querySearchedProductAtom);
  const [searchString] = useAtom(searchStringAtom);

  if (!searchString && searchedProducts.products)
    return (
      <Box
        className={styles['main-container']}
        sx={{
          width: '100vw',
          display: 'flex',
          minHeight: 'calc(100vh - 100px)'
        }}
      >
        <Container>
          <Grid
            sx={{
              margin: '1rem'
            }}
          >
            {searchedProducts.products?.trending_items && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SofiaPro',
                    fontWeight: 600,
                    fontSize: ' 20px',
                    color: '#231f20cc'
                  }}
                >
                  Trending Items
                </Typography>
                <Grid>
                  <ProductsMenu products={searchedProducts.products?.trending_items} />
                </Grid>
              </Box>
            )}
            {searchedProducts.products?.go_to_items && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SofiaPro',
                    fontWeight: 600,
                    fontSize: ' 20px',
                    color: '#231f20cc'
                  }}
                >
                  Go To Items
                </Typography>
                <Grid>
                  <ProductsMenu products={searchedProducts.products?.go_to_items} />
                </Grid>
              </Box>
            )}
          </Grid>
        </Container>
      </Box>
    );

  return (
    <Box
      className={styles['main-container']}
      sx={{
        width: '100vw',
        display: 'flex',
        minHeight: 'calc(100vh - 100px)'
      }}
    >
      <Container>
        <Grid
          sx={{
            margin: '1rem'
          }}
        >
          {!(
            querySearchedProduct.products &&
            Array.isArray(querySearchedProduct.products) &&
            querySearchedProduct.products.length > 0
          ) || !searchString ? (
            <NoData />
          ) : (
            <>
              <Box>
                <Grid>
                  <ProductsMenu products={querySearchedProduct.products} />
                </Grid>
              </Box>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchResults;

import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dropdown from "../OriginDropDown/OriginDropDown";
import { Categories, Products } from "../../utilities/types";
import { ProductCard } from "../Cards";
import FiltersHeaderSection from "./FiltersHeaderSection";
interface ProductListProps {
  productsList: Products;
  categories: Categories;
}

const ProductList = ({ productsList, categories }: ProductListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const sortOptions = [
    "Popular",
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
  ];
  return (
    <Container>
      {!isMobile && <FiltersHeaderSection categories={categories} />}
      <Container className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-4 mt-0 lg:mt-12 md:mb-8 px-0 lg:py-2.5">
        <Typography variant="h5">All products</Typography>
        {isMobile ? (
          <FiltersHeaderSection
            sortOptions={sortOptions}
            categories={categories}
          />
        ) : (
          <Dropdown
            btnVariant="outlined"
            onSelect={() => {}}
            label="Sort by"
            options={[
              "Popular",
              "Relevance",
              "Price: Low to High",
              "Price: High to Low",
            ]}
            classes={{
              iconButton: "justify-start text-nowrap px-6 py-2",
              iconOne: "w-3 h-3",
            }}
          />
        )}
      </Container>
      <Grid
        container
        rowSpacing={{ xs: 3, md: 5, lg: 9 }}
        columnSpacing={{ xs: 2, md: 4, lg: 6 }}
      >
        {Array.from({ length: 3 }, () => productsList)
          .flat()
          .map((product) => (
            <Grid key={product.sku} item xs={6} sm={6} md={4} lg={3}>
              <ProductCard className="flex flex-col h-full" product={product} />
            </Grid>
          ))}
      </Grid>

      <Box className="h-16 lg:h-[140px]" />
    </Container>
  );
};

export default ProductList;

import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import CategorySection from "@/components/Shop/CategorySection";
import ProductsFilterSlider from "@/components/Shop/ProductsFilterSlider";
import FiltersHeaderSection from "@/components/Shop/FiltersHeaderSection";
import ProductList from "@/components/Shop/ProductList";
import {
  Categories,
  FooterDataType,
  MainMenuType,
  Products,
} from "@/utilities/types";
import { Box, Typography } from "@mui/material";

interface HomeProps {
  categories: Categories;
  products: Products;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ShopPage = ({
  categories,
  products: productsList,
  mainMenuItems,
  footerData,
}: HomeProps) => {
  return (
    <Layout mainMenuItems={mainMenuItems} footerData={footerData}>
      <CategorySection categories={categories} />
      {/*
      <Box className="h-16 lg:h-[113px]" />
      <ProductsFilterSlider productsList={productsList} />
      <Box className="h-10 lg:h-[102px]" />
      <ProductList categories={categories} productsList={productsList} /> */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/originApi`
    );
    const originApiData = await response.json();
    const {
      uspCardsData,
      categories,
      products,
      testimonials,
      mainMenuItems,
      footerData,
    } = originApiData;
    return {
      props: {
        uspCardsData,
        categories,
        products,
        testimonials,
        mainMenuItems,
        footerData,
      },
    };
  } catch (error) {
    console.error("Error fetching USP card data:", error);
    return {
      props: {
        uspCardsData: [],
        categories: [],
        products: [],
        testimonials: [],
        mainMenuItems: [],
        footerData: {},
      },
    };
  }
};

export default ShopPage;

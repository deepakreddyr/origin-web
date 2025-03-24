import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { Categories, FooterDataType, MainMenuType, Products } from '@/utilities/types';
import React from 'react';
import SearchItemsWrapper from '@/components/searchItems/SearchItemsWrapper';
interface layoutProp {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}
const searchPage = (props: layoutProp) => {
  const { mainMenuItems, footerData } = props;

  return (
    <Layout isHeaderSticky={false} mainMenuItems={mainMenuItems} footerData={footerData}>
      <div className="min-h-screen flex flex-col items-center ">
        <SearchItemsWrapper />
      </div>
    </Layout>
  );
};

export default searchPage;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();

    const { mainMenuItems, footerData } = originApiData;
    return {
      props: {
        mainMenuItems,
        footerData
      }
    };
  } catch (error) {
    console.error('Error fetching USP card data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';
import ProductDetailsWrapper from '@/components/productDetails/ProductDetailsWrapper';

interface MangoProductDetailPageProps {
  slug: string;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const MangoProductDetailPage = ({ mainMenuItems, footerData }: MangoProductDetailPageProps) => {
  return (
    <Layout
      isHeader={false}
      mainMenuItems={mainMenuItems}
      footerData={footerData}
      isHeaderSticky={true}
      useTopPadding={false}
    >
      <MangoHeader />
      <main className="min-h-screen bg-white md:pt-[80px]">
        <ProductDetailsWrapper />
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData } = originApiData;
    return { props: { slug, mainMenuItems: mainMenuItems || [], footerData: footerData || {} } };
  } catch (error) {
    console.error('Error fetching mango product detail data:', error);
    return { props: { slug, mainMenuItems: [], footerData: {} } };
  }
};

export default MangoProductDetailPage;

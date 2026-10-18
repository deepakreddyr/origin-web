import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import SubscriptionProductDetails from '@/components/subscription/pdp/SubscriptionProductDetails';
import { MOCK_SUBSCRIPTION_ITEM } from '@/components/subscription/pdp/mockSubscriptionData';
import SubscriptionBoxHeader from '@/components/subscription/SubscriptionBoxHeader';

interface SubscriptionPDPPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const SubscriptionPDPPage = ({ mainMenuItems, footerData }: SubscriptionPDPPageProps) => {
  return (
    <Layout
      isHeader={false}
      mainMenuItems={mainMenuItems}
      footerData={footerData}
      isHeaderSticky={true}
      useTopPadding={false}
    >
      <CustomHead
        title="Curated Mixed Basket | Subscription Box | Origin Fresh"
        description="A curated weekly harmony of staple cooking greens, root crops, aromatics, and orchard snacks fresh from certified regenerative farms."
      />
      <SubscriptionBoxHeader isHeaderSticky={true} />
      <main className="bg-white pt-[65px] md:pt-[72px]">
        <SubscriptionProductDetails initialData={MOCK_SUBSCRIPTION_ITEM} />
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData } = originApiData;

    return {
      props: {
        mainMenuItems: mainMenuItems || [],
        footerData: footerData || {}
      }
    };
  } catch (error) {
    console.error('Error fetching layout data for subscription PDP:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default SubscriptionPDPPage;

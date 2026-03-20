import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CustomHead from '@/components/shared/CustomHead';
import SubscriptionHero from '@/components/subscription/SubscriptionHero';
import SubscriptionSplit from '@/components/subscription/SubscriptionSplit';
import SubscriptionChallenge from '@/components/subscription/SubscriptionChallenge';
import SubscriptionHowItWorks from '@/components/subscription/SubscriptionHowItWorks';
import SubscriptionTestimonials from '@/components/subscription/SubscriptionTestimonials';
import SubscriptionCta from '@/components/subscription/SubscriptionCta';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';

interface SubscriptionPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const SubscriptionPage = ({ mainMenuItems, footerData }: SubscriptionPageProps) => {
  const [subscriptionItem, setSubscriptionItem] = useState<any>(null);
  const [comboItems, setComboItems] = useState<any[]>([]);
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const userToken = localStorage.getItem('user_token');
    const isLoggedIn = !!userToken;

    const url = isLoggedIn ? protectedUrl.getSubscriptionItems : unprotectedUrl.getSubscriptionItems;

    getDataFromApi(
      url,
      (data: any) => {
        setSubscriptionItem(data?.data?.item || null);
        setComboItems(data?.data?.combo_items || []);
      },
      (error: any) => {
        console.error('Failed to fetch subscription items:', error);
      },
      {}
    );
  }, []);

  return (
    <Layout isHeader={false} isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title="Subscription Challenge | Origin Fresh"
        description="Join the fruit revolution. 7 days, 7 fruits, zero junk. Accept the challenge today!"
      />

      <main className="bg-[#FAF7F0] min-h-screen pt-[64px] md:pt-[72px]">
        <SubscriptionHeader item={subscriptionItem} />
        <SubscriptionHero />
        <SubscriptionSplit />
        <SubscriptionChallenge item={subscriptionItem} comboItems={comboItems} />
        <SubscriptionHowItWorks />
        <SubscriptionTestimonials />
        <SubscriptionCta item={subscriptionItem} />
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
    console.error('Error fetching layout data for subscription page:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default SubscriptionPage;

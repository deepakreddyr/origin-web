import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CustomHead from '@/components/shared/CustomHead';
import SubscriptionBoxHeader from '@/components/subscription/SubscriptionBoxHeader';
import SubscriptionBoxHero from '@/components/subscription/SubscriptionBoxHero';
import SubscriptionFeatures from '@/components/subscription/SubscriptionFeatures';
import SubscriptionPlansSection from '@/components/subscription/SubscriptionPlansSection';
import SubscriptionEthicalAlliance from '@/components/subscription/SubscriptionEthicalAlliance';
import SubscriptionGrowerSpotlight from '@/components/subscription/SubscriptionGrowerSpotlight';
import SubscriptionFeedbackSection from '@/components/subscription/SubscriptionFeedbackSection';
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
  return (
    <Layout isHeader={false} isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title="Subscription Challenge | Origin Fresh"
        description="Join the fruit revolution. 7 days, 7 fruits, zero junk. Accept the challenge today!"
      />
      <main className="bg-[#FBF9F4]">
        <SubscriptionBoxHeader />
        <SubscriptionBoxHero />
        <SubscriptionFeatures />
        <SubscriptionPlansSection />
        <SubscriptionEthicalAlliance />
        <SubscriptionGrowerSpotlight />
        <SubscriptionFeedbackSection />
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
